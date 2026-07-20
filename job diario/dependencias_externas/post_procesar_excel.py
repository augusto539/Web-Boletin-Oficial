"""
post_procesar_excel.py
Enriquecimiento del Excel de sociedades:
  0. Columna "Nombre normalizado"     → nombre estandarizado para búsquedas
     Cruce con Registro Nacional      → CUIT empresa, CLAE códigos/orden/estados
     de Sociedades (por nombre)         (todas las actividades, separadas por
                                         coma)  (sin API)
     Cruce con Padrón de Contribu-    → Estado Ganancias, Estado IVA, Empleador
     yentes AFIP (por CUIT exacto)      (sin API)
  1. Columna "Resumen objeto social" → categoría del negocio (Claude API, por
     lotes) — PAUSADO, ver EJECUTAR_CATEGORIZACION más abajo
  2. Columna "Departamento"          → departamento de Mendoza (regex, sin API)

Uso:
    python post_procesar_excel.py

Requisito previo para los cruces con ARCA (ver ARCA/actualizar_padrones.py):
    python ARCA/actualizar_padrones.py
    genera ARCA/Padrones procesados/CLAEsMendoza.csv y Padrón sociedades.csv
"""

import json
import logging
import os
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path

import anthropic
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
from normalizacion import normalizar_nombre

# ── Logging ───────────────────────────────────────────────────────────────────

LOGS_DIR = Path(__file__).parent / "Logs"
LOGS_DIR.mkdir(exist_ok=True)
_LOG_FILE = LOGS_DIR / f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}_post.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(_LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)

EXCEL_PATH   = Path(__file__).parent / "Resultados" / "Sociedades Mendoza 2017 - 2026.xlsx"
# BOLETIN_ARCA_DIR permite que el job diario (que solo importa las funciones
# de esta copia, nunca main()/EXCEL_PATH) cruce contra los padrones ARCA
# reales del repo en vez de una carpeta vacía al lado de esta copia.
_ARCA_DIR = Path(os.getenv("BOLETIN_ARCA_DIR", str(Path(__file__).parent / "ARCA" / "Padrones procesados")))
REGISTRO_PATH = _ARCA_DIR / "CLAEsMendoza.csv"
PADRON_PATH  = _ARCA_DIR / "Padrón sociedades.csv"

EJECUTAR_CATEGORIZACION = False  # Pausado: primero cerrar los cruces con ARCA. Poner True para retomarlo.

BATCH_SIZE              = 20
PAUSA_API               = 0.3
MAX_WORKERS_CAT         = 8    # Lotes enviados a Claude en paralelo
MAX_REINTENTOS_CAT      = 2    # Reintentos por lote fallido antes de asignar "Otros Servicios"
CHECKPOINT_CADA_N_LOTES = 5    # Guardar Excel cada N lotes (~100 filas): protege ante cortes

# ── Contadores de uso de API ──────────────────────────────────────────────────

_stats = {
    "llamadas":           0,
    "tokens_input":       0,
    "tokens_output":      0,
    "tokens_cache_write": 0,
    "tokens_cache_read":  0,
    "lotes_fallidos":     0,
    "reintentos":         0,
    "filas_salteadas":    0,   # ya categorizadas o duplicadas
}
_stats_lock = threading.Lock()

def _fmt_tiempo(segundos: float) -> str:
    m, s = divmod(int(segundos), 60)
    return f"{m}m {s:02d}s" if m else f"{s}s"

def _costo_estimado() -> float:
    """Precios Haiku: input $1/M, output $5/M, cache_write $0.25/M, cache_read $0.10/M."""
    s = _stats
    return (
        (s["tokens_input"]       / 1_000_000) * 1.00
        + (s["tokens_cache_write"] / 1_000_000) * 0.25
        + (s["tokens_cache_read"]  / 1_000_000) * 0.10
        + (s["tokens_output"]      / 1_000_000) * 5.00
    )

# ── Departamentos de Mendoza ───────────────────────────────────────────────────

# Ordenados de más específico a menos para evitar falsos positivos.
# Cada entrada: (patrón regex, nombre oficial del departamento)
_PATRONES_DEPTO = [
    # Alias frecuentes para Capital
    (r"ciudad\s+de\s+mendoza|ciudad\s+capital|mendoza\s+capital", "Capital"),
    # Departamentos con nombre compuesto (primero para no partir el match)
    (r"general\s+alvear",      "General Alvear"),
    (r"godoy\s+cruz",          "Godoy Cruz"),
    (r"guaymall[eé]?n",        "Guaymallén"),   # tolera el typo "Guaymalen" (sin la 2a ele)
    (r"las\s+heras",           "Las Heras"),
    (r"luj[aá]n\s+de\s+cuyo", "Luján de Cuyo"),
    (r"san\s+carlos",          "San Carlos"),
    (r"san\s+rafael",          "San Rafael"),
    (r"santa\s+rosa",          "Santa Rosa"),
    (r"malarg[uü][eé]",        "Malargüe"),
    (r"tunuy[aá]n",            "Tunuyán"),
    (r"tupungato",             "Tupungato"),
    # Ciudades internas que identifican su departamento sin ambigüedad
    (r"palmira",               "San Martín"),   # ciudad del dpto. San Martín
    # Departamentos de una palabra (menos específicos, van al final)
    (r"lavalle",               "Lavalle"),
    (r"maip[uú]",              "Maipú"),
    (r"jun[ií]n",              "Junín"),
    (r"la\s+paz",              "La Paz"),
    (r"rivadavia",             "Rivadavia"),
    (r"san\s+mart[ií]n",       "San Martín"),
    # "Luján" solo (sin "de Cuyo") — único departamento con ese nombre en Mendoza,
    # va después del patrón compuesto de arriba y de San Martín para no competir
    # con nada más específico.
    (r"\bluj[aá]n\b",          "Luján de Cuyo"),
    (r"\bcapital\b",           "Capital"),
    # Última red: "Ciudad" sola como segmento (ej. "..., Ciudad, Mendoza") suele
    # significar Ciudad de Mendoza = Capital. El lookahead negativo evita
    # confundirla con "Ciudad Autónoma de Buenos Aires" (CABA), que no es Mendoza.
    (r"\bciudad\b(?!\s+aut[oó]noma)", "Capital"),
]

# Localidades/distritos que identifican de forma NO ambigua a un solo
# departamento (a diferencia de "Ciudad", "Mendoza" o nombres que se repiten
# en más de un departamento como "Villa Nueva" en Guaymallén Y en La Paz, o
# "Medrano" en Junín Y en Rivadavia — esos quedan afuera a propósito: preferible
# no resolver que resolver mal). Se usa como segunda pasada, solo si
# _PATRONES_DEPTO no encontró nada — son nombres de pueblo/distrito que un
# domicilio menciona SIN repetir el nombre del departamento al lado.
# Fuente: Anexo:Distritos de la provincia de Mendoza (Wikipedia), curado a mano
# contra los casos reales del dataset.
_PATRONES_LOCALIDAD = [
    # Luján de Cuyo
    (r"chacras\s+de\s+coria|vistalba|perdriel|carrodilla|cacheuta|agrelo|potrerillos|ugarteche|las\s+compuertas|el\s+carrizal\b", "Luján de Cuyo"),
    # Maipú
    (r"fray\s+luis\s+beltr[aá]n|general\s+guti[eé]rrez|\bgutierrez\b|\bguti[eé]rrez\b|coquimbito|cruz\s+de\s+piedra|lunlunta|luzuriaga|rodeo\s+del\s+medio|\brussell\b|colonia\s+bombal", "Maipú"),
    # Guaymallén (Villa Nueva es su cabecera — la ambigüedad con La Paz se
    # resuelve a favor de Guaymallén, mucho más poblado y frecuente en la data)
    (r"\bdorrego\b|villa\s+nueva|colonia\s+segovia|rodeo\s+de\s+la\s+cruz|puente\s+de\s+hierro|kil[oó]metro\s+8\b|kil[oó]metro\s+11\b|el\s+bermejo\b", "Guaymallén"),
    # Lavalle
    (r"villa\s+tulumaya|\btulumaya\b|costa\s+de\s+araujo|\bjocol[ií]\b", "Lavalle"),
    # San Carlos
    (r"eugenio\s+bustos|la\s+consulta|\bchilecito\b|\bpareditas\b", "San Carlos"),
    # Las Heras
    (r"el\s+algarrobal|\buspallata\b|panquehua|el\s+challao|el\s+plumerillo|las\s+cuevas|puente\s+del\s+inca|los\s+penitentes", "Las Heras"),
    # San Martín
    (r"\bchapanay\b|montecaseros", "San Martín"),
    # San Rafael
    (r"rama\s+ca[ií]da|cuadro\s+nacional|monte\s+com[aá]n|villa\s+atuel|real\s+del\s+padre|las\s+malvinas|el\s+nihuil|el\s+sosneado", "San Rafael"),
    # Tunuyán
    (r"vista\s+flores|campo\s+de\s+los\s+andes|colonia\s+las\s+rosas", "Tunuyán"),
    # Tupungato
    (r"gualtallary|villa\s+bast[ií]as|\banchoris\b", "Tupungato"),
    # General Alvear
    (r"\bbowen\b|san\s+pedro\s+del\s+atuel", "General Alvear"),
]


def detectar_departamento(domicilio: str) -> str:
    """
    Detecta el departamento de Mendoza a partir del domicilio.

    Estrategia:
    1. Partir la dirección por comas y buscar en los segmentos que NO son
       la calle/número (evita falsos positivos tipo "Av. San Martín").
    2. Si no hay match, buscar en el texto completo para casos sin comas.
    3. Si tampoco hay match de departamento, probar contra el diccionario de
       localidades/distritos sin ambigüedad (_PATRONES_LOCALIDAD) — mismo
       orden sin-calle → texto completo.
    """
    if pd.isna(domicilio) or not str(domicilio).strip():
        return ""

    texto = str(domicilio).strip()

    # Segmentos posteriores a la calle (donde aparece ciudad/departamento)
    partes = [p.strip() for p in texto.split(",")]
    sin_calle = " ".join(partes[1:]) if len(partes) > 1 else ""

    for patrones in (_PATRONES_DEPTO, _PATRONES_LOCALIDAD):
        for patron, depto in patrones:
            if sin_calle and re.search(patron, sin_calle, re.IGNORECASE):
                return depto
        # Segunda pasada: texto completo (para direcciones sin coma)
        for patron, depto in patrones:
            if re.search(patron, texto, re.IGNORECASE):
                return depto

    return ""


# ── Categorización con Claude ─────────────────────────────────────────────────

CATEGORIAS = [
    "Agro / Ganadería / Forestal",
    "Vitivinicultura / Bodegas",
    "Alimentos y Bebidas / Gastronomía",
    "Comercio / Retail",
    "Construcción / Obras Civiles",
    "Inmobiliaria / Desarrollos Inmobiliarios",
    "Educación / Cultura",
    "Energía / Minería / Petróleo",
    "Finanzas / Inversiones / Holdings",
    "Industria / Manufactura",
    "Salud / Medicina / Farmacia",
    "Seguridad / Vigilancia",
    "Servicios Profesionales",
    "Tecnología / Software / IT",
    "Transporte / Logística",
    "Turismo / Hotelería",
    "Otros Servicios",
]

SYSTEM_CAT = (
    "Sos un clasificador de empresas argentinas. "
    "Dado el nombre, tipo societario, objeto social y profesiones de los socios de cada empresa, "
    "elegí la categoría que mejor la describe.\n\n"
    "Categorías disponibles:\n"
    + "\n".join(f"- {c}" for c in CATEGORIAS)
    + "\n\n"
    "## REGLA PRINCIPAL — Objetos sociales boilerplate\n"
    "Muchas SAS argentinas usan estatutos genéricos que listan TODAS las actividades posibles. "
    "Reconocés un boilerplate cuando el objeto empieza con alguna de estas frases:\n"
    '  • "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización"\n'
    '  • "Actividades agropecuarias, avícolas, ganaderas, pesqueras, tamberas y vitivinícolas; comunicaciones"\n'
    '  • "Dedicarse a actividades agropecuarias"\n'
    "Cuando el objeto es un boilerplate, IGNORALO COMPLETAMENTE y clasificá basándote "
    "SOLO en el nombre de la empresa y las profesiones de los socios.\n\n"
    "## Reglas de clasificación por nombre\n"
    "El nombre de la empresa es la señal más confiable. Ejemplos de cómo interpretarlo:\n"
    "- Nombre contiene 'Viajes', 'Travel', 'Turismo', 'Hotel', 'Lodge' → Turismo / Hotelería\n"
    "- Nombre contiene 'Avícola', 'Ganadería', 'Agro', 'Campo', 'Finca', 'Tambo' → Agro / Ganadería / Forestal\n"
    "- Nombre contiene 'Salud', 'Médica', 'Médico', 'Odontología', 'Clínica', 'Farmacia', 'Medical', 'Pharma' → Salud / Medicina / Farmacia\n"
    "- Nombre contiene 'Construcción', 'Obras', 'Viales', 'Ingeniería' (obras) → Construcción / Obras Civiles\n"
    "- Nombre contiene 'Urbanístico', 'Inmobiliaria', 'Desarrollos', 'Loteo', 'Properties' → Inmobiliaria / Desarrollos Inmobiliarios\n"
    "- Nombre contiene 'Tech', 'Software', 'Digital', 'Sistemas', 'Data', 'IT', 'Informática' → Tecnología / Software / IT\n"
    "- Nombre contiene 'Seguridad', 'Security', 'Vigilancia' → Seguridad / Vigilancia\n"
    "- Nombre contiene 'Bodega', 'Vinos', 'Wine', 'Viña', 'Winery', 'Vitivin' → Vitivinicultura / Bodegas\n"
    "- Nombre contiene 'Logística', 'Transporte', 'Flete', 'Cargas', 'Frenos', 'Neumático' → Transporte / Logística\n"
    "- Nombre contiene 'Holding', 'Inversiones', 'Capital', 'Gestión', 'Grupo' (sin otra pista) → Finanzas / Inversiones / Holdings\n"
    "- Nombre contiene 'Electricidad', 'Eléctrica', 'Gas', 'Energía', 'Minería', 'Uranium', 'Petróleo' → Energía / Minería / Petróleo\n"
    "- Nombre contiene 'Moda', 'Ropa', 'Calzado', 'Indumentaria', 'Motos', 'Accesorios' → Comercio / Retail\n"
    "- Nombre contiene 'Chacinados', 'Frigorífico', 'Alimentos', 'Foods', 'Gastronomía', 'Restaurant' → Alimentos y Bebidas / Gastronomía\n"
    "- Nombre contiene 'Seguridad Privada', 'Seguridad', 'Security', 'Vigilancia', 'Custodia' → Seguridad / Vigilancia\n"
    "- Nombre contiene 'Laboratorio', 'Lab ', 'Análisis Clínicos', 'Diagnóstico' → Salud / Medicina / Farmacia\n"
    "- Nombre contiene 'Cuidados', 'Enfermería', 'Geriátrico', 'Domiciliario' → Salud / Medicina / Farmacia\n"
    "- Nombre contiene 'Limpieza', 'Cleaning', 'Lavadero', 'Higiene' → Otros Servicios\n\n"
    "## Reglas de clasificación por profesiones\n"
    "Cuando el nombre no da señal suficiente, las profesiones de los socios son la segunda pista:\n"
    "- médico / médica / odontólogo / farmacéutico / kinesiólogo / enfermero / bioquímico / biólogo / nutricionista / personal de salud / cuidador → Salud / Medicina / Farmacia\n"
    "- enólogo / sommelier → Vitivinicultura / Bodegas\n"
    "- ingeniero civil / arquitecto (sin contexto tech) → Construcción / Obras Civiles\n"
    "- ingeniero en sistemas / programador / desarrollador → Tecnología / Software / IT\n"
    "- abogado / contador / psicólogo / licenciado en administración → Servicios Profesionales\n"
    "- veterinario / agrónomo / productor agropecuario → Agro / Ganadería / Forestal\n"
    "- cocinero / chef / gastronómico → Alimentos y Bebidas / Gastronomía\n"
    "- militar / policía / seguridad (cuando el objeto o nombre refieren a vigilancia) → Seguridad / Vigilancia\n\n"
    "## Reglas por palabras clave en el objeto social (cuando no es boilerplate)\n"
    "- Objeto menciona 'fideicomiso' como actividad principal → Finanzas / Inversiones / Holdings\n"
    "- Objeto menciona 'transporte' o nombre de empresa de transporte pública → Transporte / Logística\n"
    "- Objeto menciona 'análisis clínicos', 'diagnóstico', 'laboratorio', 'atención médica' → Salud / Medicina / Farmacia\n"
    "- Objeto menciona 'cuidados domiciliarios', 'asistencia domiciliaria', 'gerontología' → Salud / Medicina / Farmacia\n\n"
    "## Otras reglas\n"
    "- Elegí SOLO de la lista, copiando el texto exacto.\n"
    "- Preferí la categoría más específica; usá 'Otros Servicios' SOLO cuando no haya ninguna pista "
    "ni en el nombre ni en las profesiones.\n"
    "- Devolvé ÚNICAMENTE un array JSON con las categorías en el mismo orden que las empresas. "
    "Sin texto extra, sin bloques de código."
)


def _mask_necesita_categorizacion(df: pd.DataFrame) -> pd.Series:
    """
    Devuelve máscara booleana de filas que SÍ deben enviarse a Claude:
      - "Resumen objeto social" vacío o igual a "Otros Servicios"  (mejora #1)
      - Y NO son duplicados  (mejora #6)
    """
    col = "Resumen objeto social"
    sin_cat = (
        df[col].isna()
        | df[col].isin(["", "Otros Servicios"])
    ) if col in df.columns else pd.Series(True, index=df.index)

    es_dup = (df["Duplicado"] == "Sí") if "Duplicado" in df.columns else pd.Series(False, index=df.index)

    return sin_cat & ~es_dup


def _copiar_categoria_a_duplicados(df: pd.DataFrame) -> int:
    """
    Para cada fila duplicada, copia la categoría de la fila original
    (misma clave nombre_norm + tipo_acto).
    Devuelve cuántas filas actualizó.
    """
    if "Duplicado" not in df.columns:
        return 0

    col = "Resumen objeto social"
    if col not in df.columns:
        return 0

    nombre_norm = (
        df["Nombre de la sociedad"]
        .str.lower()
        .str.replace(r"[.,\-]", "", regex=True)
        .str.replace(r"\s+", " ", regex=True)
        .str.strip()
    )
    tipo_norm = df.get("Tipo de acto", pd.Series("", index=df.index)).str.lower().str.strip()
    clave = nombre_norm + "§" + tipo_norm

    # Construir lookup: clave → categoría desde las filas originales con categoría válida
    lookup = {}
    for idx in df[df["Duplicado"] == "No"].index:
        cat = df.at[idx, col]
        if cat and cat not in ("", "Otros Servicios"):
            lookup[clave[idx]] = cat

    # Aplicar a duplicados que aún no tienen categoría buena
    copiados = 0
    for idx in df[df["Duplicado"] == "Sí"].index:
        k = clave[idx]
        cat_actual = df.at[idx, col] if col in df.columns else ""
        if k in lookup and cat_actual in ("", "Otros Servicios", None):
            df.at[idx, col] = lookup[k]
            copiados += 1

    return copiados


def _llamar_api(client, filas: list) -> tuple[list | None, dict]:
    """Hace una llamada a Claude y devuelve (resultado_parseado | None, usage_dict)."""
    payload = json.dumps(filas, ensure_ascii=False)
    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=400,
        system=[{"type": "text", "text": SYSTEM_CAT, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": f"Clasificá estas empresas:\n{payload}"}],
    )
    u = response.usage
    usage = {
        "input":       u.input_tokens,
        "output":      u.output_tokens,
        "cache_write": getattr(u, "cache_creation_input_tokens", 0) or 0,
        "cache_read":  getattr(u, "cache_read_input_tokens", 0)     or 0,
    }
    texto = response.content[0].text.strip()
    texto = re.sub(r"^```[a-z]*\s*", "", texto)
    texto = re.sub(r"\s*```$", "", texto)
    match = re.search(r"\[.*\]", texto, re.DOTALL)
    if match:
        try:
            resultado = json.loads(match.group())
            if isinstance(resultado, list):
                if len(resultado) < len(filas):
                    resultado += ["Otros Servicios"] * (len(filas) - len(resultado))
                return resultado[:len(filas)], usage
        except json.JSONDecodeError:
            pass
    return None, usage


def categorizar_batch(client, filas: list, lote_num: int) -> list:
    """Envía un lote a Claude con retry, registra tokens (thread-safe) y devuelve categorías."""
    for intento in range(1, MAX_REINTENTOS_CAT + 1):
        t0 = time.time()
        try:
            resultado, usage = _llamar_api(client, filas)
            elapsed = time.time() - t0

            cache_tag = ""
            if usage["cache_read"]:
                cache_tag = " [cache HIT]"
            elif usage["cache_write"]:
                cache_tag = " [cache WRITE]"
            tag_intento = f" [reintento {intento}]" if intento > 1 else ""

            with _stats_lock:
                _stats["llamadas"]           += 1
                _stats["tokens_input"]       += usage["input"]
                _stats["tokens_output"]      += usage["output"]
                _stats["tokens_cache_write"] += usage["cache_write"]
                _stats["tokens_cache_read"]  += usage["cache_read"]

            if resultado is not None:
                logging.info(
                    f"  Lote {lote_num}: {elapsed:.1f}s | "
                    f"in={usage['input']} out={usage['output']}{cache_tag}{tag_intento}"
                )
                return resultado

            # Respuesta no parseable — reintentar si quedan intentos
            logging.warning(f"  Lote {lote_num}: respuesta no parseable (intento {intento}/{MAX_REINTENTOS_CAT})")
            if intento < MAX_REINTENTOS_CAT:
                with _stats_lock:
                    _stats["reintentos"] += 1
                time.sleep(5 * intento)

        except anthropic.PermissionDeniedError as e:
            # Créditos agotados u otro error de permisos — no tiene sentido reintentar
            logging.error(f"\n{'!'*60}")
            logging.error(f"  Lote {lote_num}: SIN CRÉDITOS API (o error de permisos)")
            logging.error(f"  Error: {e}")
            logging.error(f"  ► Recargá créditos en console.anthropic.com y volvé a correr.")
            logging.error(f"  ► Las filas con 'Otros Servicios' se re-procesarán automáticamente.")
            logging.error(f"{'!'*60}\n")
            with _stats_lock:
                _stats["lotes_fallidos"] += 1
            return ["Otros Servicios"] * len(filas)

        except Exception as e:
            elapsed = time.time() - t0
            logging.warning(f"  Lote {lote_num}: error en API (intento {intento}/{MAX_REINTENTOS_CAT}): {e}")
            if intento < MAX_REINTENTOS_CAT:
                with _stats_lock:
                    _stats["reintentos"] += 1
                time.sleep(5 * intento)

    with _stats_lock:
        _stats["lotes_fallidos"] += 1
    logging.warning(f"  Lote {lote_num}: agotados {MAX_REINTENTOS_CAT} intentos → 'Otros Servicios' para {len(filas)} empresas")
    return ["Otros Servicios"] * len(filas)


# ── Cruce 1: Registro Nacional de Sociedades (por nombre) ────────────────────

def _cargar_registro_nacional() -> dict | None:
    """
    Carga 'CLAEsMendoza.csv' (Registro Nacional de Sociedades, filtrado a
    Mendoza) y arma un lookup:
        denominacion_norm (str) → lista de sociedades distintas con ese nombre:
            [{"cuit": ..., "actividades": [{"codigo", "orden", "estado"}, ...]}, ...]

    Incluye todas las actividades (activas "AC" y de baja "BD") — se conserva
    el historial completo, no solo la vigente. El Registro trae nombres
    completos (sin truncar) — a diferencia del padrón de AFIP, acá alcanza con
    matching exacto, sin heurística de prefijo.
    Retorna None si el archivo no existe.
    """
    if not REGISTRO_PATH.exists():
        logging.warning(
            f"Registro Nacional de Sociedades no encontrado: {REGISTRO_PATH.name}. "
            "Ejecutá 'python ARCA/actualizar_padrones.py' para generarlo. "
            "Se omite este cruce."
        )
        return None

    logging.info(f"Cargando Registro Nacional de Sociedades: {REGISTRO_PATH.name} ...")
    df_r = pd.read_csv(REGISTRO_PATH, dtype={"cuit": str})

    lookup: dict[str, list[dict]] = {}
    for norm, grupo in df_r.groupby("denominacion_norm", sort=False):
        por_cuit: dict[str, list[dict]] = {}
        for _, fila in grupo.sort_values("actividad_orden").iterrows():
            por_cuit.setdefault(fila["cuit"], []).append({
                "codigo": fila["actividad_codigo"],
                "orden":  fila["actividad_orden"],
                "estado": fila["actividad_estado"],
            })
        lookup[norm] = [{"cuit": cuit, "actividades": acts} for cuit, acts in por_cuit.items()]

    logging.info(f"  {df_r['cuit'].nunique():,} sociedades cargadas en memoria.")
    return lookup


def _cruzar_registro_nacional(df: pd.DataFrame, nombres_norm: pd.Series, lookup: dict) -> pd.DataFrame:
    """
    Para cada fila del Excel, busca coincidencia exacta de nombre normalizado
    contra el Registro Nacional. Si hay match, resuelve el CUIT y vuelca todas
    sus actividades CLAE en 3 columnas paralelas separadas por coma (mismo
    orden en las tres). El CUIT resuelto acá es el que después se usa para
    cruzar por CUIT exacto contra el padrón de AFIP.

    Columnas agregadas (después de "Nombre normalizado"):
        CUIT empresa | Match Registro Nacional |
        CLAE códigos | CLAE orden | CLAE estados
    """
    cuits, match_col, clae_cod, clae_orden, clae_estado = [], [], [], [], []

    for norm in nombres_norm:
        matches = lookup.get(norm)
        if not matches:
            cuits.append(""); match_col.append("sin match")
            clae_cod.append(""); clae_orden.append(""); clae_estado.append("")
            continue

        entrada = matches[0]
        acts = entrada["actividades"]
        cuits.append(entrada["cuit"])
        match_col.append("exacto" if len(matches) == 1 else "exacto múltiple")
        clae_cod.append(",".join(str(a["codigo"]) for a in acts))
        clae_orden.append(",".join(str(a["orden"]) for a in acts))
        clae_estado.append(",".join(str(a["estado"]) for a in acts))

    insertar_o_actualizar(df, "CUIT empresa",            cuits,       despues_de="Nombre normalizado")
    insertar_o_actualizar(df, "Match Registro Nacional", match_col,   despues_de="CUIT empresa")
    insertar_o_actualizar(df, "CLAE códigos",            clae_cod,    despues_de="Match Registro Nacional")
    insertar_o_actualizar(df, "CLAE orden",              clae_orden,  despues_de="CLAE códigos")
    insertar_o_actualizar(df, "CLAE estados",             clae_estado, despues_de="CLAE orden")

    n_exacto  = sum(1 for m in match_col if m == "exacto")
    n_multi   = sum(1 for m in match_col if m == "exacto múltiple")
    n_sin     = sum(1 for m in match_col if m == "sin match")
    logging.info(
        f"  Cruce Registro Nacional: {n_exacto} exactos | {n_multi} exactos múltiples | {n_sin} sin match"
    )
    return df


# ── Cruce 2: Padrón de Contribuyentes AFIP (por CUIT exacto) ─────────────────

def _cargar_padron_cuits() -> dict | None:
    """
    Carga 'Padrón sociedades.csv' (condición tributaria AFIP) y devuelve un
    lookup exacto por CUIT: { cuit (str) → fila (dict) }.
    Retorna None si el archivo no existe.
    """
    if not PADRON_PATH.exists():
        logging.warning(
            f"Padrón de Contribuyentes no encontrado: {PADRON_PATH.name}. "
            "Ejecutá 'python ARCA/actualizar_padrones.py' para generarlo. "
            "Se omite este cruce."
        )
        return None

    logging.info(f"Cargando Padrón de Contribuyentes: {PADRON_PATH.name} ...")
    df_p = pd.read_csv(PADRON_PATH, dtype=str).fillna("")
    lookup = df_p.set_index("cuit").to_dict("index")
    logging.info(f"  {len(df_p):,} personas jurídicas cargadas en memoria.")
    return lookup


def _cruzar_padron_cuits(df: pd.DataFrame, cuits: pd.Series, lookup: dict) -> pd.DataFrame:
    """
    Cruza por CUIT EXACTO contra el padrón de condición tributaria (Ganancias/
    IVA/Empleador). El CUIT ya se resolvió en `_cruzar_registro_nacional` — acá
    no se vuelve a matchear por nombre, así que no hace falta la heurística de
    prefijo de 30 caracteres que usaba el cruce viejo.

    Columnas agregadas (después de "CLAE estados"):
        Estado Ganancias | Estado IVA | Empleador | Match Padrón Contribuyentes
    """
    ganancias_col, iva_col, empleador_col, match_col = [], [], [], []

    for cuit in cuits:
        fila = lookup.get(cuit) if cuit else None
        if fila is not None:
            ganancias_col.append(fila.get("ganancias", ""))
            iva_col.append(fila.get("iva", ""))
            empleador_col.append(fila.get("empleador", ""))
            match_col.append("encontrado")
        else:
            ganancias_col.append(""); iva_col.append(""); empleador_col.append("")
            match_col.append("sin CUIT" if not cuit else "sin match")

    insertar_o_actualizar(df, "Estado Ganancias", ganancias_col, despues_de="CLAE estados")
    insertar_o_actualizar(df, "Estado IVA",       iva_col,       despues_de="Estado Ganancias")
    insertar_o_actualizar(df, "Empleador",        empleador_col, despues_de="Estado IVA")
    insertar_o_actualizar(df, "Match Padrón Contribuyentes", match_col, despues_de="Empleador")

    n_ok  = sum(1 for m in match_col if m == "encontrado")
    n_sin_cuit = sum(1 for m in match_col if m == "sin CUIT")
    n_sin = sum(1 for m in match_col if m == "sin match")
    logging.info(
        f"  Cruce Padrón Contribuyentes: {n_ok} encontrados | "
        f"{n_sin_cuit} sin CUIT para buscar | {n_sin} con CUIT pero sin match"
    )
    return df


# ── Helpers de inserción de columna ──────────────────────────────────────────

def insertar_o_actualizar(df: pd.DataFrame, nombre_col: str, valores, despues_de: str):
    """Inserta la columna después de `despues_de`, o la actualiza si ya existe."""
    if nombre_col in df.columns:
        df[nombre_col] = valores
    else:
        pos = df.columns.get_loc(despues_de) + 1
        df.insert(pos, nombre_col, valores)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    t0_total = time.time()
    logging.info(f"Leyendo: {EXCEL_PATH}")
    df = pd.read_excel(EXCEL_PATH)
    logging.info(f"  {len(df)} filas cargadas.")
    total = len(df)

    # ── 0. Nombre normalizado + cruces con ARCA (sin API) ────────────────────
    nombres_norm = df["Nombre de la sociedad"].apply(normalizar_nombre)
    insertar_o_actualizar(df, "Nombre normalizado", nombres_norm, despues_de="Nombre de la sociedad")

    lookup_registro = _cargar_registro_nacional()
    if lookup_registro is not None:
        df = _cruzar_registro_nacional(df, nombres_norm, lookup_registro)

        lookup_padron = _cargar_padron_cuits()
        if lookup_padron is not None:
            df = _cruzar_padron_cuits(df, df["CUIT empresa"], lookup_padron)
    else:
        logging.warning("Se omiten ambos cruces con ARCA (el de CUIT exacto depende del CUIT resuelto por nombre).")

    # ── 1. Resumen objeto social (Claude) ─────────────────────────────────────
    if not EJECUTAR_CATEGORIZACION:
        logging.info("Categorización por Claude PAUSADA (EJECUTAR_CATEGORIZACION=False) — se omite este paso.")
    else:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise EnvironmentError(
                "Variable ANTHROPIC_API_KEY no encontrada.\n"
                "Ejecutá: set ANTHROPIC_API_KEY=tu_clave"
            )
        client = anthropic.Anthropic(api_key=api_key)

        # Asegurar que la columna existe antes de calcular la máscara
        if "Resumen objeto social" not in df.columns:
            pos = df.columns.get_loc("Objeto social") + 1
            df.insert(pos, "Resumen objeto social", "")

        mask_necesita = _mask_necesita_categorizacion(df)
        indices_a_cat = df.index[mask_necesita].tolist()
        n_salteadas   = total - len(indices_a_cat)
        with _stats_lock:
            _stats["filas_salteadas"] = n_salteadas

        logging.info(
            f"Filas a categorizar: {len(indices_a_cat)} "
            f"(salteadas={n_salteadas} ya categorizadas o duplicadas)"
        )

        if indices_a_cat:
            # Armar lotes preservando los índices originales del DataFrame
            lotes: list[tuple[int, list[int], list[dict]]] = []  # (lote_num, [idx], [filas])
            for lote_num, inicio in enumerate(range(0, len(indices_a_cat), BATCH_SIZE), start=1):
                bloque_idx = indices_a_cat[inicio : inicio + BATCH_SIZE]
                filas = [
                    {
                        "nombre":      str(df.at[idx, "Nombre de la sociedad"] or ""),
                        "tipo":        str(df.at[idx, "Tipo de sociedad"]      if "Tipo de sociedad"      in df.columns else ""),
                        "objeto":      str(df.at[idx, "Objeto social"]         if "Objeto social"         in df.columns else "")[:300],
                        "profesiones": str(df.at[idx, "Profesiones de los socios"] if "Profesiones de los socios" in df.columns else ""),
                    }
                    for idx in bloque_idx
                ]
                lotes.append((lote_num, bloque_idx, filas))

            n_lotes = len(lotes)
            logging.info(f"Procesando {n_lotes} lotes de hasta {BATCH_SIZE} en paralelo (workers={MAX_WORKERS_CAT})...")
            logging.info(f"Checkpoint activado: se guarda el Excel cada {CHECKPOINT_CADA_N_LOTES} lotes (~{CHECKPOINT_CADA_N_LOTES * BATCH_SIZE} filas).")

            lotes_completados = 0

            with ThreadPoolExecutor(max_workers=MAX_WORKERS_CAT) as executor:
                futuros = {
                    executor.submit(categorizar_batch, client, filas, lote_num): (lote_num, bloque_idx)
                    for lote_num, bloque_idx, filas in lotes
                }
                for futuro in as_completed(futuros):
                    lote_num, bloque_idx = futuros[futuro]
                    cats = futuro.result()

                    # Aplicar al DataFrame inmediatamente (no esperar al final)
                    for idx, cat in zip(bloque_idx, cats):
                        df.at[idx, "Resumen objeto social"] = cat

                    lotes_completados += 1

                    # ── Checkpoint: guardar Excel cada N lotes ────────────────────
                    if lotes_completados % CHECKPOINT_CADA_N_LOTES == 0:
                        df.to_excel(EXCEL_PATH, index=False)
                        logging.info(
                            f"  [checkpoint] Excel guardado — "
                            f"{lotes_completados}/{n_lotes} lotes "
                            f"({lotes_completados * BATCH_SIZE}/{len(indices_a_cat)} filas aprox)."
                        )

                    time.sleep(PAUSA_API)

            # Propagar categorías a filas duplicadas (mejora #6)
            copiados = _copiar_categoria_a_duplicados(df)
            if copiados:
                logging.info(f"  Categoría copiada a {copiados} filas duplicadas.")

        logging.info("Categorización completa.")

    # ── 2. Departamento (regex, sin API) ──────────────────────────────────────
    logging.info("Detectando departamentos...")
    departamentos = df["Domicilio de la sociedad"].apply(detectar_departamento)
    insertar_o_actualizar(df, "Departamento", departamentos, despues_de="Domicilio de la sociedad")
    sin_depto = (departamentos == "").sum()
    logging.info(f"  Detectados: {total - sin_depto}/{total}  |  Sin determinar: {sin_depto}")

    # ── Guardar ───────────────────────────────────────────────────────────────
    df.to_excel(EXCEL_PATH, index=False)
    logging.info(f"Excel guardado: {EXCEL_PATH}")

    # ── Resumen final ─────────────────────────────────────────────────────────
    tiempo_total = time.time() - t0_total
    s = _stats
    logging.info(
        f"Uso API: {s['llamadas']} llamadas | "
        f"tokens in={s['tokens_input']:,} out={s['tokens_output']:,} | "
        f"cache write={s['tokens_cache_write']:,} read={s['tokens_cache_read']:,} | "
        f"lotes fallidos={s['lotes_fallidos']} | reintentos={s['reintentos']} | "
        f"filas salteadas={s['filas_salteadas']} | "
        f"costo estimado=${_costo_estimado():.4f} USD"
    )
    logging.info(f"Tiempo total: {_fmt_tiempo(tiempo_total)}")

    # Resumen cruce Registro Nacional
    if "Match Registro Nacional" in df.columns:
        logging.info("\nResultados cruce Registro Nacional de Sociedades:")
        for tipo, n in df["Match Registro Nacional"].value_counts().items():
            logging.info(f"  {n:>4}  ({n/total*100:4.1f}%)  {tipo}")

    # Resumen cruce Padrón de Contribuyentes
    if "Match Padrón Contribuyentes" in df.columns:
        logging.info("\nResultados cruce Padrón de Contribuyentes (AFIP):")
        for tipo, n in df["Match Padrón Contribuyentes"].value_counts().items():
            logging.info(f"  {n:>4}  ({n/total*100:4.1f}%)  {tipo}")

    # Resumen categorías
    if EJECUTAR_CATEGORIZACION and "Resumen objeto social" in df.columns:
        logging.info("\nDistribución por categoría:")
        for cat, n in df["Resumen objeto social"].value_counts().items():
            logging.info(f"  {n:>4}  ({n/total*100:4.1f}%)  {cat}")

    # Resumen departamentos
    logging.info("\nDistribución por departamento:")
    for dep, n in df["Departamento"].value_counts().items():
        if dep != "":
            logging.info(f"  {n:>4}  ({n/total*100:4.1f}%)  {dep}")
    if sin_depto:
        logging.info(f"     {sin_depto}  Sin determinar")


if __name__ == "__main__":
    main()
