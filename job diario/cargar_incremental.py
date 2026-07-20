"""
cargar_incremental.py — carga un CSV CHICO (las filas nuevas de un día) contra
la base de datos EN VIVO, sin TRUNCATE y sin regenerar IDs.

A diferencia de `migrar_a_postgres.py` (que construye todo en memoria en una sola
pasada y arranca con TRUNCATE — correcto para rebuilds completos bajo demanda,
pero inviable para producción diaria con permalinks), este script resuelve
identidad con SELECT/UPDATE contra Postgres real, y solo AGREGA filas.

Unidad atómica de idempotencia: el BOLETÍN (`boletines.id_pdf`, UNIQUE). Se
procesan los boletines pendientes uno por uno, en orden cronológico ascendente,
cada uno en su propia transacción:
  - si el id_pdf ya existe en `boletines`, se saltea entero (ya se cargó antes).
  - si no existe, se crea el boletín + sus sociedades/personas/actos/vínculos en
    una sola transacción; si algo falla a mitad de camino, ROLLBACK completo —
    la próxima corrida reintenta ese boletín desde cero.

Fidelidad con el bulk (deliberada, ver plan): un acto que no es "Constitucion" de
una sociedad ya existente NO pobla `actos.capital_anterior/capital_nuevo` ni
`vinculos.acto_baja_id/fecha_salida` — `migrar_a_postgres.py` tampoco lo hace
para ninguna fila histórica. `sociedades.capital_inicial` nunca se toca desde un
acto no-Constitución.

Uso:
    python "job diario/cargar_incremental.py" <csv_enriquecido.csv>

Conexión: mismas variables que `migrar_a_postgres.py` (DATABASE_URL o
PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD).
"""

import logging
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
from transformaciones import (
    conectar, Lookup, tipo_soc_id, get_or_create_provincia_mendoza,
    domicilio_id, resolver_sociedad, resolver_persona, resolver_socio_juridico,
    norm_key, es_vacio, texto, truncar, split_multi, clean_cuit,
    parse_fecha, parse_pct, parse_money, parece_empresa,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("cargar_incremental")

NOMENCLADOR_CSV = Path(__file__).resolve().parent.parent / "ARCA" / "Nomenclador CLAE.csv"

# Advisory lock: mismo número arbitrario en todo el job diario, para que dos
# corridas del timer nunca se solapen sobre el mismo boletín.
LOCK_KEY = 727_001


def _cargar_desc_clae() -> dict:
    if not NOMENCLADOR_CSV.exists():
        return {}
    nom = pd.read_csv(NOMENCLADOR_CSV, dtype=str)
    act = nom[nom["tipo"] == "actividad"]
    return dict(zip(act["codigo"], act["descripcion"]))


def _agrupar_por_boletin(df: pd.DataFrame) -> list[tuple[str, list]]:
    """
    Agrupa filas por 'ID del boletín' (id_pdf). Si una fila no trae ID (raro,
    boletín viejo sin ese dato), se agrupa por fecha de publicación como
    fallback (igual criterio que `migrar_a_postgres.py:boletin_id`).
    Devuelve una lista de (clave_agrupacion, filas) ordenada por fecha ascendente.
    """
    grupos: dict = {}
    for _, r in df.iterrows():
        idp = texto(r.get("ID del boletín"))
        if idp and idp.endswith(".0"):
            idp = idp[:-2]
        fecha = parse_fecha(r.get("Fecha publicación en boletín"))
        clave = idp or f"__sin_id__{fecha}"
        grupos.setdefault(clave, {"fecha": fecha, "idp": idp, "filas": []})
        grupos[clave]["filas"].append(r)

    items = list(grupos.values())
    items.sort(key=lambda g: (g["fecha"] is None, g["fecha"]))
    return items


def _construir_sociedad_nueva(filas_de_la_sociedad: list) -> dict:
    """
    Agrega los campos de una sociedad NUEVA a partir de las filas de HOY que le
    corresponden (normalmente 1, pero puede haber más de un acto el mismo día).
    Mismo criterio de precedencia que `migrar_a_postgres.py`: preferir capital/
    fecha de la fila de Constitución; el resto, primer valor no vacío.
    """
    d = {
        "nombre": None, "cuit_ext": None, "cuit_reg": None, "tipo": None,
        "empleador": None, "objeto": None, "capital": None, "fecha_const": None,
        "gan": None, "iva": None, "match": None, "dom": None, "dom_elec": None,
        "_dep": None, "_loc": None, "_calle": None,
        "clae_codigos": None, "clae_orden": None, "clae_estados": None,
    }

    def first(campo, val):
        if d[campo] is None and not es_vacio(val):
            d[campo] = val

    for r in filas_de_la_sociedad:
        first("nombre", r.get("Nombre de la sociedad"))
        first("cuit_ext", r.get("CUIT de la sociedad"))
        first("cuit_reg", r.get("CUIT empresa"))
        first("tipo", r.get("Tipo de sociedad"))
        first("empleador", r.get("Empleador"))
        first("objeto", r.get("Objeto social"))
        first("gan", r.get("Estado Ganancias"))
        first("iva", r.get("Estado IVA"))
        first("match", r.get("Match Registro Nacional"))
        first("dom", r.get("Domicilio de la sociedad"))
        first("dom_elec", r.get("Domicilio electrónico de la sociedad"))
        first("_dep", r.get("Departamento"))
        first("_loc", r.get("Localidad de la sociedad"))
        first("_calle", r.get("Calle y número de la sociedad"))
        first("clae_codigos", r.get("CLAE códigos"))
        first("clae_orden", r.get("CLAE orden"))
        first("clae_estados", r.get("CLAE estados"))

        es_constitucion = norm_key(r.get("Tipo de acto")) == "constitucion"
        if es_constitucion:
            if not es_vacio(r.get("Capital inicial")):
                d["capital"] = r.get("Capital inicial")
            if not es_vacio(r.get("Fecha del acto")):
                d["fecha_const"] = r.get("Fecha del acto")
        else:
            first("capital", r.get("Capital inicial"))

    return d


def _crear_sociedad(cur, d: dict, nkey: str, lookups, provincia_id, caches) -> int:
    """
    `nkey` es el nombre normalizado YA resuelto por el caller (la misma clave
    que se usó para decidir que esta sociedad no existía — ver
    `resolver_sociedad`). Se usa tal cual para `nombre_normalizado`, en vez de
    recalcularlo de nuevo con `normalizar_nombre(d["nombre"])`: recomputar por
    separado podría divergir del valor que ya trae la fila (columna "Nombre
    normalizado" del Excel enriquecido) si algún día cambia la función de
    normalización, dejando la clave de dedup desincronizada con el dato
    insertado. Una sola fuente de verdad para el nombre normalizado.
    """
    cuit = clean_cuit(d["cuit_ext"]) or clean_cuit(d["cuit_reg"])
    dom_id = domicilio_id(
        cur, provincia_id, d["dom"], d.get("_calle"), d.get("_dep"), d.get("_loc"),
        caches["dep"], caches["loc"],
    )
    empleador = None
    if not es_vacio(d["empleador"]):
        empleador = norm_key(d["empleador"]) in ("si", "sí", "true", "1")

    cur.execute(
        "INSERT INTO sociedades "
        "(nombre, nombre_normalizado, cuit, tipo_sociedad_id, empleador, "
        " fecha_constitucion, capital_inicial, objeto_social, domicilio_id, "
        " domicilio_electronico, estado_ganancias_id, estado_iva_id, tipo_match_arca_id) "
        "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
        (
            truncar(texto(d["nombre"]) or "(sin nombre)", 255),
            truncar(nkey, 255),
            cuit,
            tipo_soc_id(lookups["tipo_soc"], d["tipo"]),
            empleador,
            parse_fecha(d["fecha_const"]),
            parse_money(d["capital"]),
            texto(d["objeto"]),
            dom_id,
            truncar(texto(d["dom_elec"]), 255),
            lookups["ganancias"].get(d["gan"]),
            lookups["iva"].get(d["iva"]),
            lookups["match"].get(d["match"]),
        ),
    )
    sid = cur.fetchone()[0]

    # Actividades CLAE (comas, no ';'), igual criterio que el bulk. ON CONFLICT
    # DO NOTHING: si la sociedad ya tenía estas actividades cargadas (no debería
    # pasar para una sociedad recién creada, pero es barato ser robusto), no
    # falla por el UNIQUE(sociedad_id, clae_codigo).
    if d["clae_codigos"]:
        split_coma = lambda v, n=None: split_multi(str(v).replace(",", ";") if not es_vacio(v) else v, n)
        codigos = split_coma(d["clae_codigos"])
        ordenes = split_coma(d["clae_orden"], len(codigos))
        estados = split_coma(d["clae_estados"], len(codigos))
        vistos = set()
        for cod, orde, est in zip(codigos, ordenes, estados):
            if es_vacio(cod):
                continue
            cod = str(cod).strip()
            if cod.endswith(".0"):
                cod = cod[:-2]
            if cod in vistos:
                continue
            vistos.add(cod)
            grupo = cod.zfill(6)[:3]
            grupo = grupo if grupo in lookups["grupos_validos"] else None
            desc = lookups["desc_clae"].get(cod.zfill(6)) or lookups["desc_clae"].get(cod) or "(sin descripción)"
            cur.execute(
                "INSERT INTO actividades_clae (codigo, descripcion) VALUES (%s, %s) "
                "ON CONFLICT (codigo) DO NOTHING",
                (cod, truncar(desc, 255)),
            )
            orden_i = None
            if not es_vacio(orde):
                try:
                    orden_i = int(float(orde))
                except ValueError:
                    orden_i = None
            est_v = est if est in ("AC", "BD") else None
            cur.execute(
                "INSERT INTO sociedad_actividades (sociedad_id, clae_codigo, clae_grupo, orden, estado) "
                "VALUES (%s,%s,%s,%s,%s) ON CONFLICT (sociedad_id, clae_codigo) DO NOTHING",
                (sid, cod, grupo, orden_i, est_v),
            )

    return sid


def _vinculo_existe(cur, sociedad_id, rol_id, persona_id=None, soc_miembro=None,
                     nombre_jur=None, cuit_jur=None) -> bool:
    """
    Dedup de aristas ya existentes en la base (equivalente al `vinculos_vistos`
    en memoria del bulk, pero contra Postgres — acá SÍ puede haber vínculos de
    días anteriores, así que hace falta consultar).
    """
    if persona_id is not None:
        cur.execute(
            "SELECT 1 FROM vinculos WHERE sociedad_id=%s AND rol_id=%s AND persona_id=%s",
            (sociedad_id, rol_id, persona_id),
        )
    elif soc_miembro is not None:
        cur.execute(
            "SELECT 1 FROM vinculos WHERE sociedad_id=%s AND rol_id=%s AND sociedad_miembro_id=%s",
            (sociedad_id, rol_id, soc_miembro),
        )
    elif nombre_jur is not None:
        cur.execute(
            "SELECT 1 FROM vinculos WHERE sociedad_id=%s AND rol_id=%s "
            "AND nombre_juridico_fallback=%s AND cuit_juridico_fallback IS NOT DISTINCT FROM %s",
            (sociedad_id, rol_id, truncar(nombre_jur, 255), cuit_jur),
        )
    else:
        return True  # nada que insertar
    return cur.fetchone() is not None


def _crear_vinculo(cur, sociedad_id, rol_id, fecha, acto_id, persona_id=None,
                    soc_miembro=None, cuit_jur=None, nombre_jur=None, porcentaje=None):
    if rol_id is None:
        return
    if soc_miembro is not None and soc_miembro == sociedad_id:
        return  # no autoreferencia (mismo CHECK que el schema)
    if _vinculo_existe(cur, sociedad_id, rol_id, persona_id, soc_miembro, nombre_jur, cuit_jur):
        return
    cur.execute(
        "INSERT INTO vinculos "
        "(sociedad_id, rol_id, persona_id, sociedad_miembro_id, cuit_juridico_fallback, "
        " nombre_juridico_fallback, porcentaje, fecha_entrada, acto_alta_id) "
        "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (sociedad_id, rol_id, persona_id, soc_miembro, cuit_jur,
         truncar(nombre_jur, 255), porcentaje, fecha, acto_id),
    )


def procesar_boletin(cur, idp, fecha, filas, lookups, provincia_id, caches):
    """Procesa TODAS las filas de un boletín. El caller abre/cierra la transacción."""
    cur.execute(
        "INSERT INTO boletines (fecha, id_pdf) VALUES (%s, %s) RETURNING id",
        (fecha, truncar(idp, 40) if idp else None),
    )
    bid = cur.fetchone()[0]

    # Primer paso: agrupar las filas de este boletín por sociedad, para crear
    # cada sociedad UNA sola vez aunque tenga más de un acto hoy.
    por_nombre: dict = {}
    orden_nombres: list = []
    for r in filas:
        nkey = texto(r.get("Nombre normalizado")) or norm_key(r.get("Nombre de la sociedad")) or "(sin nombre)"
        if nkey not in por_nombre:
            por_nombre[nkey] = []
            orden_nombres.append(nkey)
        por_nombre[nkey].append(r)

    sid_por_nombre = {}
    sociedad_cache = caches["sociedad"]   # cache scoped a TODO el run (varios boletines)
    for nkey in orden_nombres:
        filas_soc = por_nombre[nkey]
        primera = filas_soc[0]
        cuit_candidato = clean_cuit(primera.get("CUIT de la sociedad")) or clean_cuit(primera.get("CUIT empresa"))
        sid = resolver_sociedad(cur, cuit_candidato, nkey, sociedad_cache)
        if sid is None:
            d = _construir_sociedad_nueva(filas_soc)
            sid = _crear_sociedad(cur, d, nkey, lookups, provincia_id, caches)
            sociedad_cache[nkey] = sid
            cuit_nueva = clean_cuit(d["cuit_ext"]) or clean_cuit(d["cuit_reg"])
            if cuit_nueva:
                sociedad_cache[cuit_nueva] = sid
        sid_por_nombre[nkey] = sid

    persona_cache = caches["persona"]     # cache scoped a TODO el run

    # Segundo paso: un acto + sus vínculos por cada fila (fidelidad con el bulk:
    # cada fila del Excel es un acto, sin excepción, sin filtrar duplicados).
    for r in filas:
        nkey = texto(r.get("Nombre normalizado")) or norm_key(r.get("Nombre de la sociedad")) or "(sin nombre)"
        sid = sid_por_nombre[nkey]

        fecha_acto = parse_fecha(r.get("Fecha del acto"))
        fecha_pub = parse_fecha(r.get("Fecha publicación en boletín"))

        escribano_id = None
        if not es_vacio(r.get("Escribano interviniente")):
            escribano_id = resolver_persona(cur, r.get("Escribano interviniente"), None, None, persona_cache)

        cur.execute(
            "INSERT INTO actos "
            "(sociedad_id, tipo_acto_id, fecha_acto, fecha_publicacion, boletin_id, "
            " descripcion, escribano_id, registro_notarial) "
            "VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (
                sid,
                lookups["tipo_acto"].get(r.get("Tipo de acto")) or lookups["tipo_acto"].get("Otro"),
                fecha_acto, fecha_pub, bid,
                texto(r.get("Descripción del acto")),
                escribano_id,
                truncar(texto(r.get("Registro notarial")), 120),
            ),
        )
        aid = cur.fetchone()[0]

        # Socios personas físicas -> personas + vínculos.
        nombres = split_multi(r.get("Nombres de los socios"))
        n = len(nombres)
        if n:
            dnis = split_multi(r.get("DNI de los socios"), n)
            cuits = split_multi(r.get("CUIT/CUIL de los socios"), n)
            profs = split_multi(r.get("Profesiones de los socios"), n)
            cargos = split_multi(r.get("Cargos de los socios"), n)
            pcts = split_multi(r.get("Porcentaje de los socios"), n)
            for i in range(n):
                if es_vacio(nombres[i]) and es_vacio(dnis[i]) and es_vacio(cuits[i]):
                    continue
                if parece_empresa(nombres[i]):
                    miembro_sid, cuit_fb, nom_fb = resolver_socio_juridico(cur, nombres[i], cuits[i], sociedad_cache)
                    pct = parse_pct(pcts[i])
                    _crear_vinculo(cur, sid, lookups["rol"].get("Socio"), fecha_acto, aid,
                                   soc_miembro=miembro_sid, cuit_jur=cuit_fb if miembro_sid is None else None,
                                   nombre_jur=nom_fb if miembro_sid is None else None, porcentaje=pct)
                    continue
                pid = resolver_persona(cur, nombres[i], dnis[i], cuits[i], persona_cache)
                if pid is None:
                    continue
                pct = parse_pct(pcts[i])
                roles_txt = [c.strip() for c in str(cargos[i]).split("/") if c.strip()] if not es_vacio(cargos[i]) else []
                if not roles_txt:
                    roles_txt = ["Socio"]
                primero = True
                for rt in roles_txt:
                    rol_id = lookups["rol"].get(rt)
                    _crear_vinculo(cur, sid, rol_id, fecha_acto, aid, persona_id=pid,
                                   porcentaje=pct if primero else None)
                    primero = False

        # Socios jurídicos -> vínculos (sociedad miembro o fallback texto/CUIT).
        jnoms = split_multi(r.get("Nombres de los socios jurídicos"))
        if jnoms:
            jm = len(jnoms)
            jcuits = split_multi(r.get("CUIT de los socios jurídicos"), jm)
            jpcts = split_multi(r.get("Porcentaje de los socios jurídicos"), jm)
            rol_socio = lookups["rol"].get("Socio")
            for i in range(jm):
                if es_vacio(jnoms[i]):
                    continue
                miembro_sid, cuit_fb, nom_fb = resolver_socio_juridico(cur, jnoms[i], jcuits[i], sociedad_cache)
                pct = parse_pct(jpcts[i])
                _crear_vinculo(cur, sid, rol_socio, fecha_acto, aid,
                               soc_miembro=miembro_sid, cuit_jur=cuit_fb if miembro_sid is None else None,
                               nombre_jur=nom_fb if miembro_sid is None else None, porcentaje=pct)

        # Apoderados -> personas + vínculos.
        anoms = split_multi(r.get("Nombres de los apoderados"))
        if anoms:
            am = len(anoms)
            adnis = split_multi(r.get("DNI de los apoderados"), am)
            rol_apo = lookups["rol"].get("Apoderado")
            for i in range(am):
                if es_vacio(anoms[i]):
                    continue
                pid = resolver_persona(cur, anoms[i], adnis[i], None, persona_cache)
                if pid is not None:
                    _crear_vinculo(cur, sid, rol_apo, fecha_acto, aid, persona_id=pid)

    return bid


def cargar(csv_path: Path, conn=None) -> dict:
    """
    Punto de entrada reusable (además del CLI de abajo): recibe la ruta del
    CSV chico ya enriquecido, y opcionalmente una conexión ya abierta (para
    tests, que quieren controlar el commit/rollback desde afuera). Devuelve un
    resumen {procesados, salteados}.
    """
    df = pd.read_csv(csv_path)
    log.info(f"Leyendo {csv_path.name}: {len(df)} filas.")

    conn_propia = conn is None
    if conn is None:
        conn = conectar()
    conn.autocommit = False
    cur = conn.cursor()

    cur.execute("SELECT pg_try_advisory_lock(%s)", (LOCK_KEY,))
    if not cur.fetchone()[0]:
        raise RuntimeError(
            "No se pudo tomar el advisory lock — ¿hay otra corrida del job diario en curso?"
        )

    try:
        lookups = {
            "tipo_soc": Lookup(cur, "tipos_sociedad"),
            "tipo_acto": Lookup(cur, "tipos_acto"),
            "rol": Lookup(cur, "roles"),
            "ganancias": Lookup(cur, "estados_ganancias"),
            "iva": Lookup(cur, "estados_iva"),
            "match": Lookup(cur, "tipos_match_arca"),
            "desc_clae": _cargar_desc_clae(),
        }
        cur.execute("SELECT codigo FROM grupos_clae")
        lookups["grupos_validos"] = {r[0] for r in cur.fetchall()}
        provincia_id = get_or_create_provincia_mendoza(cur)
        conn.commit()  # los Lookups pueden haber insertado catálogo nuevo; confirmarlo ya

        caches = {"dep": {}, "loc": {}, "sociedad": {}, "persona": {}}

        grupos = _agrupar_por_boletin(df)
        procesados, salteados = 0, 0
        for g in grupos:
            idp = g["idp"]
            if idp:
                cur.execute("SELECT 1 FROM boletines WHERE id_pdf = %s", (idp,))
                if cur.fetchone():
                    log.info(f"Boletín {idp} ya cargado, se saltea.")
                    salteados += 1
                    continue
            try:
                bid = procesar_boletin(cur, idp, g["fecha"], g["filas"], lookups, provincia_id, caches)
                conn.commit()
                log.info(f"Boletín {idp or g['fecha']} cargado (boletin_id={bid}, {len(g['filas'])} filas).")
                procesados += 1
            except Exception:
                conn.rollback()
                log.exception(f"Boletín {idp or g['fecha']} falló — rollback, se reintenta la próxima corrida.")
                raise

        return {"procesados": procesados, "salteados": salteados}
    finally:
        cur.execute("SELECT pg_advisory_unlock(%s)", (LOCK_KEY,))
        conn.commit()
        if conn_propia:
            conn.close()


def main():
    if len(sys.argv) != 2:
        print("Uso: python cargar_incremental.py <csv_enriquecido.csv>")
        sys.exit(1)
    csv_path = Path(sys.argv[1])
    if not csv_path.exists():
        log.error(f"No existe: {csv_path}")
        sys.exit(1)
    resumen = cargar(csv_path)
    log.info(f"Listo. Procesados={resumen['procesados']} Salteados={resumen['salteados']}")


if __name__ == "__main__":
    main()
