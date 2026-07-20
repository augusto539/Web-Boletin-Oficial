"""
limpiar_padron.py
Lee el CSV crudo del Registro Nacional de Sociedades (buscado en ARCA/Descargas/)
y genera 'CLAEsMendoza.csv': filtrado a sociedades con domicilio en Mendoza,
con actividad CLAE y nombre normalizado para matching por nombre.

Reemplaza a 'Limpiar padron.ipynb' (misma limpieza, pero ejecutable sin Jupyter
y con la normalización de nombres agregada, que antes faltaba).

Uso:
    python limpiar_padron.py
    (normalmente se corre desde ARCA/actualizar_padrones.py, que además
    descomprime el .zip descargado y borra el .csv una vez procesado)

Fuente: https://www.argentina.gob.ar/justicia/registro-nacional-sociedades
        (descargar el .zip y descomprimirlo en ARCA/Descargas/)

Resultado:
    CLAEsMendoza.csv — una fila por sociedad x actividad (conserva altas y bajas)
    Columnas: cuit | razon_social | denominacion_norm | fecha_hora_contrato_social |
              actividad_codigo | actividad_descripcion | actividad_orden | actividad_estado
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
SALIDA        = Path(os.getenv("BOLETIN_ARCA_DIR", str(Path(__file__).parent / "Padrones procesados"))) / "CLAEsMendoza.csv"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)


def _buscar_csv_origen() -> Path | None:
    """
    Busca el CSV del Registro Nacional en ARCA/Descargas/ (recursivo, por si el
    zip lo trae dentro de una subcarpeta). El nombre trae la fecha.
    """
    candidatos = sorted(DESCARGAS_DIR.rglob("registro-nacional-sociedades*.csv"))
    return candidatos[-1] if candidatos else None


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> Path | None:
    """Devuelve el .csv de origen que consumió, o None si no encontró ninguno."""
    origen = _buscar_csv_origen()
    if origen is None:
        logging.error(f"No se encontró ningún CSV del Registro Nacional en {DESCARGAS_DIR}")
        logging.error(
            "Descargalo desde "
            "https://www.argentina.gob.ar/justicia/registro-nacional-sociedades "
            "y descomprimí el .zip en esa carpeta."
        )
        return None

    logging.info(f"Leyendo: {origen.name} ...")
    df = pd.read_csv(origen, dtype={"cuit": str})
    logging.info(f"  {len(df):,} filas leídas.")

    df = df.drop(columns=[
        "tipo_societario", "fecha_hora_actualizacion",
        "dom_fiscal_localidad", "dom_fiscal_calle", "dom_fiscal_numero",
        "dom_fiscal_piso", "dom_fiscal_departamento", "dom_fiscal_cp",
        "dom_fiscal_estado_domicilio",
        "dom_legal_localidad", "dom_legal_calle", "dom_legal_numero",
        "dom_legal_piso", "dom_legal_departamento", "dom_legal_cp",
        "dom_legal_estado_domicilio",
        "numero_inscripcion", "actividad_vigencia",
    ])
    df = df[df["cuit"].notna() & df["actividad_codigo"].notna()]
    df = df[(df["dom_fiscal_provincia"] == "MENDOZA") | (df["dom_legal_provincia"] == "MENDOZA")]
    df = df.drop(columns=["dom_fiscal_provincia", "dom_legal_provincia"])
    df = df[df["actividad_codigo"] != 0]

    df.insert(
        df.columns.get_loc("razon_social") + 1,
        "denominacion_norm",
        df["razon_social"].apply(normalizar_nombre),
    )

    SALIDA.parent.mkdir(exist_ok=True)
    df.to_csv(SALIDA, index=False, encoding="utf-8")
    logging.info(
        f"Guardado: {SALIDA.name}  ({len(df):,} filas, {df['cuit'].nunique():,} CUITs)"
    )
    return origen


if __name__ == "__main__":
    main()
