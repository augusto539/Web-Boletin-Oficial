"""
transformaciones.py — funciones compartidas del job diario.

Este archivo es intencionalmente autocontenido y separado del flujo de
extracción/migración manual ya construido (`extraer_sociedades.py`,
`post_procesar_excel.py`, `migrar_a_postgres.py` en la raíz del repo, usados
para backfills/rebuilds bajo demanda): esos archivos originales no se tocan.
El job diario corre en cambio contra las copias autocontenidas de
`job diario/dependencias_externas/` (incluida `normalizacion.py`, importado
más abajo) — esas copias sí se modifican libremente para optimizar el caso de
uso diario (1 boletín/día), sin arriesgar el camino manual ya validado.

Dos grupos de funciones:

  1. Funciones puras de parseo/formato — copiadas literal de
     `migrar_a_postgres.py` (norm_key, split_multi, clean_cuit, parse_fecha,
     parse_pct, parse_money, truncar, parece_empresa, TIPO_SOCIEDAD_ALIAS,
     Lookup, conectar). Si el bulk cambia esta lógica en el futuro, replicar acá
     a mano — es una duplicación deliberada, no un descuido.

  2. Funciones NUEVAS de resolución de identidad contra Postgres EN VIVO
     (resolver_sociedad, resolver_persona, resolver_socio_juridico, depto_id,
     localidad_id, domicilio_id). Seguyen la MISMA regla de precedencia que usa
     `migrar_a_postgres.py` (CUIT → documento → nombre-incompleto-con-upgrade →
     nombre para personas; CUIT → nombre para socios jurídicos) pero resuelven
     con SELECT/UPDATE contra la base real en vez de diccionarios en memoria
     sobre un Excel completo — porque acá NO se puede asumir que las tablas
     están vacías (a diferencia del bulk, que arranca con TRUNCATE).
"""

import os
import re
import unicodedata
from datetime import datetime
from decimal import Decimal, InvalidOperation

import pandas as pd
import psycopg2

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent / "dependencias_externas"))
from normalizacion import normalizar_nombre  # noqa: E402  (copia autocontenida, solo se importa)


# ── 1. Funciones puras — copiadas de migrar_a_postgres.py ───────────────────

TIPO_SOCIEDAD_ALIAS = {
    "S.A.S.":               "Sociedad por Acciones Simplificada",
    "S.A.":                 "Sociedad Anonima",
    "S.A.U.":               "Sociedad Anonima",
    "S.R.L.":               "Sociedad de Responsabilidad Limitada",
    "Asociacion Civil":     "Asociacion Civil",
    "Asociación Civil":     "Asociacion Civil",
    "Union Transitoria":    "Union Transitoria",
    "Unión Transitoria":    "Union Transitoria",
    "Fundacion":            "Fundacion",
    "Fundación":            "Fundacion",
    "Fideicomiso":          "Fideicomiso",
    "Cooperativa":          "Cooperativa",
    "Sucursal Extranjera":  "Sucursal Extranjera",
    "Sociedad Civil":       "Sociedad Civil",
    "Otro":                 "Otro",
}


def norm_key(s) -> str:
    """Clave para matching de lookups: sin acentos, minúsculas, espacios colapsados."""
    if s is None:
        return ""
    s = unicodedata.normalize("NFD", str(s))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", s).strip().lower()


def es_vacio(v) -> bool:
    return v is None or (isinstance(v, float) and pd.isna(v)) or str(v).strip() in ("", "nan", "None")


def texto(v):
    """Devuelve el texto limpio o None."""
    if es_vacio(v):
        return None
    return str(v).strip()


def split_multi(v, n=None):
    """
    Parte un valor multi-socio por ';'. Devuelve lista de strings (o None por
    elemento vacío). Si se pasa n, rellena/recorta a longitud n (alineación
    posicional con "Nombres de los socios").
    """
    if es_vacio(v):
        partes = []
    else:
        partes = [p.strip() for p in str(v).split(";")]
        partes = [p if p not in ("", "nan", "None") else None for p in partes]
    if n is not None:
        if len(partes) < n:
            partes = partes + [None] * (n - len(partes))
        elif len(partes) > n:
            partes = partes[:n]
    return partes


def clean_cuit(v):
    """Devuelve el CUIT solo si son 11 dígitos (respeta el CHECK del esquema), si no None."""
    if es_vacio(v):
        return None
    s = str(v).strip()
    if s.endswith(".0"):
        s = s[:-2]
    s = re.sub(r"\D", "", s)
    return s if re.fullmatch(r"\d{11}", s) else None


def clean_doc(v):
    """Documento (DNI u otro): solo dígitos, hasta 30 chars. None si vacío."""
    if es_vacio(v):
        return None
    s = str(v).strip()
    if s.endswith(".0"):
        s = s[:-2]
    s = re.sub(r"\D", "", s)
    return s[:30] if s else None


def parse_fecha(v):
    """DD/MM/YYYY (o datetime/Timestamp de Excel) -> date, o None."""
    if es_vacio(v):
        return None
    if isinstance(v, datetime):
        return v.date()
    if isinstance(v, pd.Timestamp):
        return v.date()
    if hasattr(v, "year") and hasattr(v, "month") and hasattr(v, "day"):
        try:
            return datetime(v.year, v.month, v.day).date()
        except (ValueError, TypeError):
            pass
    s = str(v).strip()
    for fmt in ("%d/%m/%Y", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d-%m-%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def parse_pct(v):
    """'33,33%' -> Decimal('33.3333'). None si vacío/ inválido."""
    if es_vacio(v):
        return None
    s = str(v).strip().replace("%", "").replace(",", ".").strip()
    try:
        d = Decimal(s)
    except (InvalidOperation, ValueError):
        return None
    return d if 0 <= d <= Decimal("999.9999") else None


def parse_money(v):
    """Capital -> Decimal, o None. Tolera separadores de miles y '$'."""
    if es_vacio(v):
        return None
    if isinstance(v, (int, float)):
        try:
            return Decimal(str(v))
        except InvalidOperation:
            return None
    s = re.sub(r"[^\d,.-]", "", str(v))
    if s.count(",") and s.count("."):        # 1.234.567,89 -> 1234567.89
        s = s.replace(".", "").replace(",", ".")
    elif s.count(","):                        # 1234,56 -> 1234.56
        s = s.replace(",", ".")
    try:
        return Decimal(s)
    except (InvalidOperation, ValueError):
        return None


def truncar(s, n):
    """Recorta un texto a n caracteres (para columnas varchar acotadas)."""
    if s is None:
        return None
    s = str(s)
    return s[:n] if len(s) > n else s


# Detección de nombres de sociedad colados en la columna de personas físicas
# (mis-extracción del LLM: a veces una empresa aparece listada como "socio" en
# vez de como "socio jurídico"). Se evalúa sobre el nombre ya normalizado.
_RE_EMPRESA = re.compile(
    r"(?:^|\s)(SOCIEDAD|COOPERATIVA|FUNDACION|ASOCIACION|FIDEICOMISO|MUNICIPALIDAD|CONSORCIO|SAPEM)(?:\s|$)"
    r"|\s(SA|SAS|SAU|SRL|SCA|SCS|SC|UTE|SASU)$"
)


def parece_empresa(nombre) -> bool:
    """True si el nombre parece una razón social (no una persona física)."""
    if es_vacio(nombre):
        return False
    return bool(_RE_EMPRESA.search(normalizar_nombre(nombre)))


def conectar():
    url = os.environ.get("DATABASE_URL")
    if url:
        return psycopg2.connect(url)
    return psycopg2.connect(
        host=os.environ.get("PGHOST", "localhost"),
        port=os.environ.get("PGPORT", "5432"),
        dbname=os.environ.get("PGDATABASE", "boletin_sociedades"),
        user=os.environ.get("PGUSER", "boletin_admin"),
        password=os.environ.get("PGPASSWORD", "boletin_dev_password"),
    )


class Lookup:
    """
    Cache get-or-create para una tabla catálogo (id + nombre). Precarga las filas
    existentes (respeta seeds) y matchea sin acentos/mayúsculas; inserta las nuevas.
    Ya es correcta para uso incremental tal cual (no asume tablas vacías: hace
    SELECT antes de insertar).
    """
    def __init__(self, cur, tabla):
        self.cur = cur
        self.tabla = tabla
        self.cache = {}
        cur.execute(f"SELECT id, nombre FROM {tabla}")
        for _id, nombre in cur.fetchall():
            self.cache[norm_key(nombre)] = _id

    def get(self, nombre):
        if es_vacio(nombre):
            return None
        k = norm_key(nombre)
        if k in self.cache:
            return self.cache[k]
        self.cur.execute(
            f"INSERT INTO {self.tabla} (nombre) VALUES (%s) RETURNING id",
            (truncar(str(nombre).strip(), 80),),
        )
        _id = self.cur.fetchone()[0]
        self.cache[k] = _id
        return _id


def tipo_soc_id(lookup_tipo_sociedad: Lookup, valor):
    """Mapea el string crudo del Excel ('S.A.S.', 'S.R.L.', ...) al id de tipos_sociedad."""
    if es_vacio(valor):
        return None
    canon = TIPO_SOCIEDAD_ALIAS.get(str(valor).strip(), "Otro")
    return lookup_tipo_sociedad.get(canon)


# ── 2. Resolución de identidad contra Postgres EN VIVO (nuevo) ───────────────

def get_or_create_provincia_mendoza(cur) -> int:
    cur.execute("SELECT id FROM provincias WHERE nombre = 'Mendoza'")
    row = cur.fetchone()
    if row:
        return row[0]
    cur.execute("INSERT INTO provincias (nombre) VALUES ('Mendoza') RETURNING id")
    return cur.fetchone()[0]


def depto_id(cur, provincia_id: int, nombre, cache: dict):
    """Get-or-create de un departamento, respetando UNIQUE(provincia_id, nombre)."""
    if es_vacio(nombre):
        return None
    k = norm_key(nombre)
    if k in cache:
        return cache[k]
    # No hay forma de matchear "sin acentos/mayúsculas" en SQL puro sin una
    # función propia — se trae todo (son ~18 departamentos) y se compara en
    # Python con norm_key, igual que hace el Lookup de arriba.
    cur.execute("SELECT id, nombre FROM departamentos WHERE provincia_id = %s", (provincia_id,))
    for _id, nom in cur.fetchall():
        cache[norm_key(nom)] = _id
    if k in cache:
        return cache[k]
    cur.execute(
        "INSERT INTO departamentos (nombre, provincia_id) VALUES (%s, %s) RETURNING id",
        (truncar(str(nombre).strip(), 120), provincia_id),
    )
    _id = cur.fetchone()[0]
    cache[k] = _id
    return _id


def localidad_id(cur, provincia_id: int, dep_nombre, loc_nombre, dep_cache: dict, loc_cache: dict):
    """Get-or-create de una localidad, respetando UNIQUE(departamento_id, nombre).

    Si no hay `loc_nombre` (la mayoría de los casos: el LLM extrae un
    "Departamento" vía regex pero rara vez una "Localidad" separada), usa el
    propio nombre del departamento como localidad genérica en vez de
    descartar todo — antes, con `loc_nombre` vacío, esta función devolvía
    None aunque el departamento sí se hubiera detectado bien (mismo bug que
    tenía `migrar_a_postgres.py`, arreglado ahí el 2026-07-17)."""
    did = depto_id(cur, provincia_id, dep_nombre, dep_cache)
    if did is None:
        return None
    nombre_loc = loc_nombre if not es_vacio(loc_nombre) else dep_nombre
    k = (did, norm_key(nombre_loc))
    if k in loc_cache:
        return loc_cache[k]
    cur.execute("SELECT id, nombre FROM localidades WHERE departamento_id = %s", (did,))
    for _id, nom in cur.fetchall():
        loc_cache[(did, norm_key(nom))] = _id
    if k in loc_cache:
        return loc_cache[k]
    cur.execute(
        "INSERT INTO localidades (nombre, departamento_id) VALUES (%s, %s) RETURNING id",
        (truncar(str(nombre_loc).strip(), 120), did),
    )
    _id = cur.fetchone()[0]
    loc_cache[k] = _id
    return _id


def domicilio_id(cur, provincia_id: int, completo, calle, dep, loc, dep_cache: dict, loc_cache: dict):
    """
    Crea un domicilio nuevo (sin dedup contra domicilios existentes: la tabla no
    tiene un UNIQUE natural sobre su texto, y el volumen diario es tan chico que
    no vale la pena la complejidad de un dedup aproximado — es una simplificación
    deliberada, documentada, no un descuido).
    """
    comp = texto(completo)
    calle_t = texto(calle)
    # loc por sí sola (sin dep) no alcanza para resolver depto_id — ver
    # localidad_id() de arriba, que ahora exige dep_nombre.
    loc_id = localidad_id(cur, provincia_id, dep, loc, dep_cache, loc_cache) if dep else None
    if comp is None and calle_t is None and loc_id is None:
        return None
    cur.execute(
        "INSERT INTO domicilios (domicilio_completo, calle, localidad_id) VALUES (%s, %s, %s) RETURNING id",
        (comp, truncar(calle_t, 150), loc_id),
    )
    return cur.fetchone()[0]


def resolver_sociedad(cur, cuit, nombre_normalizado, cache: dict):
    """
    Busca una sociedad existente por CUIT o por nombre_normalizado. Devuelve el
    id o None (el caller decide crear). `cache` es un dict scoped a la
    transacción del boletín en curso (evita re-consultar si la misma sociedad
    aparece dos veces en el mismo boletín).
    """
    cuit_v = clean_cuit(cuit)
    if cuit_v and cuit_v in cache:
        return cache[cuit_v]
    if nombre_normalizado and nombre_normalizado in cache:
        return cache[nombre_normalizado]
    if cuit_v:
        cur.execute("SELECT id FROM sociedades WHERE cuit = %s", (cuit_v,))
        row = cur.fetchone()
        if row:
            cache[cuit_v] = row[0]
            if nombre_normalizado:
                cache[nombre_normalizado] = row[0]
            return row[0]
    if nombre_normalizado:
        cur.execute("SELECT id FROM sociedades WHERE nombre_normalizado = %s", (nombre_normalizado,))
        row = cur.fetchone()
        if row:
            cache[nombre_normalizado] = row[0]
            if cuit_v:
                cache[cuit_v] = row[0]
            return row[0]
    return None


def resolver_persona(cur, nombre, doc, cuit, cache: dict):
    """
    Cascada de identidad de persona física, igual a la de `migrar_a_postgres.py`
    (CUIT -> documento -> nombre-incompleto-con-upgrade -> nombre), pero contra
    Postgres en vivo: si encuentra una persona existente que ahora se puede
    completar (por ejemplo, tenía nombre pero no documento, y esta fila trae
    documento), hace UPDATE de los campos vacíos en vez de crear un duplicado.

    Devuelve el id de la persona (existente o recién creada), o None si la fila
    no trae ningún dato utilizable (ni nombre, ni doc, ni cuit).
    """
    nombre_t = texto(nombre)
    cuit_v = clean_cuit(cuit)
    doc_v = clean_doc(doc)
    if nombre_t is None and doc_v is None and cuit_v is None:
        return None
    nkey = normalizar_nombre(nombre_t) if nombre_t else None

    def _upgrade(pid):
        """Completa campos vacíos de la persona ya existente (mismo criterio que el bulk)."""
        campos, valores = [], []
        if cuit_v:
            campos.append("cuit = COALESCE(cuit, %s)"); valores.append(cuit_v)
        if doc_v:
            campos.append("documento = COALESCE(documento, %s)"); valores.append(doc_v)
            campos.append("tipo_documento = COALESCE(tipo_documento, 'DNI')")
        if campos:
            valores.append(pid)
            cur.execute(f"UPDATE personas_fisicas SET {', '.join(campos)} WHERE id = %s", valores)
        return pid

    # 1. Clave fuerte: CUIT o documento ya vistos (cache local, luego Postgres).
    if cuit_v:
        if cuit_v in cache:
            return _upgrade(cache[cuit_v])
        cur.execute("SELECT id FROM personas_fisicas WHERE cuit = %s", (cuit_v,))
        row = cur.fetchone()
        if row:
            cache[cuit_v] = row[0]
            return _upgrade(row[0])
    if doc_v:
        if ("doc", doc_v) in cache:
            return _upgrade(cache[("doc", doc_v)])
        cur.execute("SELECT id FROM personas_fisicas WHERE documento = %s", (doc_v,))
        row = cur.fetchone()
        if row:
            cache[("doc", doc_v)] = row[0]
            return _upgrade(row[0])

    # 2. Aparición CON doc/cuit que completa una persona INCOMPLETA del mismo
    #    nombre (sin documento ni cuit todavía).
    if (doc_v or cuit_v) and nkey:
        cur.execute(
            "SELECT id FROM personas_fisicas WHERE nombre_normalizado = %s "
            "AND documento IS NULL AND cuit IS NULL LIMIT 1",
            (nkey,),
        )
        row = cur.fetchone()
        if row:
            return _upgrade(row[0])

    # 3. Aparición SIN doc/cuit -> reusar cualquier persona de ese nombre.
    if not doc_v and not cuit_v and nkey:
        if ("nom", nkey) in cache:
            return cache[("nom", nkey)]
        cur.execute("SELECT id FROM personas_fisicas WHERE nombre_normalizado = %s LIMIT 1", (nkey,))
        row = cur.fetchone()
        if row:
            cache[("nom", nkey)] = row[0]
            return row[0]

    # 4. Crear persona nueva.
    cur.execute(
        "INSERT INTO personas_fisicas "
        "(nombre, nombre_normalizado, tipo_documento, documento, cuit) "
        "VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (
            truncar(nombre_t or "(sin nombre)", 255),
            truncar(nkey or (nombre_t or "(sin nombre)").upper(), 255),
            "DNI" if doc_v else None,
            doc_v,
            cuit_v,
        ),
    )
    pid = cur.fetchone()[0]
    if cuit_v:
        cache[cuit_v] = pid
    if doc_v:
        cache[("doc", doc_v)] = pid
    if nkey:
        cache.setdefault(("nom", nkey), pid)
    return pid


def resolver_socio_juridico(cur, nombre, cuit_raw, cache: dict):
    """
    Resuelve un socio jurídico a la sociedad real (mismo criterio que el bulk:
    CUIT primero, nombre después). Devuelve (miembro_sid, cuit_fallback,
    nombre_fallback) — si no matchea ninguna sociedad existente, se conserva
    CUIT+nombre en el vínculo como fallback (no se pierde la arista).
    """
    jcuit = clean_cuit(cuit_raw)
    jnkey = normalizar_nombre(nombre) if not es_vacio(nombre) else None
    sid = resolver_sociedad(cur, jcuit, jnkey, cache)
    if sid is not None:
        return sid, None, None
    return None, jcuit, texto(nombre)
