"""
preparar_padron.py
Lee el padrón de Contribuyentes de AFIP/ARCA (.tmp, buscado en ARCA/Descargas/)
y genera 'Padrón sociedades.csv' con solo las personas jurídicas (CUIT que
empieza con 30, 33 o 34).

Uso:
    python preparar_padron.py
    (normalmente se corre desde ARCA/actualizar_padrones.py, que además
    descomprime el .zip descargado y borra el .tmp una vez procesado)

Fuente: https://www.afip.gob.ar/genericos/cInscripcion/archivoCompleto.asp
        (descargar el .zip y descomprimirlo en ARCA/Descargas/)

Resultado:
    Padrón sociedades.csv  (~15 MB, ~536 k filas)
    Columnas: cuit | denominacion | denominacion_norm | ganancias | iva | empleador
"""

import logging
import os
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
from normalizacion import normalizar_nombre

# BOLETIN_ARCA_DESCARGAS_DIR / BOLETIN_ARCA_DIR permiten que el job diario
# (que corre esta copia desde job diario/dependencias_externas/) lea y
# escriba en el ARCA/ real del repo en vez de una carpeta vacía al lado de
# esta copia.
DESCARGAS_DIR = Path(os.getenv("BOLETIN_ARCA_DESCARGAS_DIR", str(Path(__file__).resolve().parent / "Descargas")))
PADRON_SALIDA = Path(os.getenv("BOLETIN_ARCA_DIR", str(Path(__file__).parent / "Padrones procesados"))) / "Padrón sociedades.csv"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

# ── Tablas de decodificación ──────────────────────────────────────────────────

_GANANCIAS = {
    "AC": "Activo",
    "NI": "No Inscripto",
    "EX": "Exento",
    "NC": "No Corresponde",
}
_IVA = {
    "AC": "Resp. Inscripto",
    "NI": "No Inscripto",
    "EX": "Exento",
    "NA": "No Alcanzado",
    "XN": "Exento No Alc.",
    "AN": "Activo No Alc.",
}


def _buscar_padron_origen() -> Path | None:
    """
    Busca el .tmp del padrón de AFIP en ARCA/Descargas/ (recursivo: el zip de
    AFIP trae el .tmp adentro de una subcarpeta, ej. utlfile/padr/...).
    El nombre trae la fecha de generación (ej. SELE-SAL-CONSTA.p20out1.20260523.tmp),
    por eso se busca por extensión en vez de por nombre fijo.
    """
    candidatos = sorted(DESCARGAS_DIR.rglob("*.tmp"))
    return candidatos[-1] if candidatos else None


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> Path | None:
    """Devuelve el .tmp de origen que consumió, o None si no encontró ninguno."""
    origen = _buscar_padron_origen()
    if origen is None:
        logging.error(f"No se encontró ningún .tmp en {DESCARGAS_DIR}")
        logging.error(
            "Descargá el padrón desde "
            "https://www.afip.gob.ar/genericos/cInscripcion/archivoCompleto.asp "
            "y descomprimí el .zip en esa carpeta."
        )
        return None

    logging.info(f"Leyendo: {origen.name}  ({origen.stat().st_size / 1024**2:.0f} MB)")

    registros = []
    leidas = 0

    with open(origen, encoding="latin-1", errors="replace") as f:
        for linea in f:
            leidas += 1
            linea = linea.rstrip("\n\r")
            if len(linea) < 11:
                continue
            # Solo personas jurídicas (prefijo 30, 33, 34)
            if linea[:2] not in ("30", "33", "34"):
                continue

            cuit         = linea[0:11]
            denominacion = linea[11:41].strip()
            ganancias    = linea[41:43].strip() if len(linea) > 42 else ""
            iva          = linea[43:45].strip() if len(linea) > 44 else ""
            empleador    = linea[48:49].strip() if len(linea) > 48 else ""

            registros.append({
                "cuit":             cuit,
                "denominacion":     denominacion,
                "denominacion_norm": normalizar_nombre(denominacion),
                "ganancias":        _GANANCIAS.get(ganancias, ganancias),
                "iva":              _IVA.get(iva, iva),
                "empleador":        "Sí" if empleador == "S" else "No",
            })

            if leidas % 1_000_000 == 0:
                logging.info(f"  {leidas:,} líneas leídas...")

    logging.info(f"Lectura completa: {leidas:,} líneas totales")
    logging.info(f"Personas jurídicas extraídas: {len(registros):,}")

    df = pd.DataFrame(registros)
    PADRON_SALIDA.parent.mkdir(exist_ok=True)
    df.to_csv(PADRON_SALIDA, index=False, encoding="utf-8")

    size_mb = PADRON_SALIDA.stat().st_size / 1024**2
    logging.info(f"Guardado: {PADRON_SALIDA.name}  ({size_mb:.1f} MB, {len(df):,} filas)")
    return origen


if __name__ == "__main__":
    main()
