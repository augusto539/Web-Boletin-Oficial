"""
actualizar_padrones_arca.py — descarga los dos padrones ARCA/AFIP que usa el
enriquecimiento (`post_procesar_excel.py`, vía `run_diario.py`) y los deja
listos y limpios en `ARCA/Padrones procesados/` (el ARCA/ real del repo, no
una copia).

Importa `actualizar_padrones` (y transitivamente `preparar_padron`/
`limpiar_padron`) desde la copia autocontenida en
`job diario/dependencias_externas/`, no desde `ARCA/` — así el job diario
corre siempre contra las copias, sin depender de que el repo real no se haya
movido. Esas tres copias resuelven sus carpetas de trabajo (Descargas/,
Padrones procesados/) vía las variables de entorno `BOLETIN_ARCA_DESCARGAS_DIR`
/ `BOLETIN_ARCA_DIR` seteadas más abajo (antes del import, porque esos
módulos leen el entorno una sola vez al cargarse) — así escriben en el ARCA/
real del repo y no en una carpeta vacía al lado de las copias.

Antes, la descarga de los dos .zip era manual (ver los docstrings de esos
scripts); esto agrega solo el paso de descarga.

Fuentes:
  - Padrón de Contribuyentes (AFIP): URL estática, siempre vigente (no cambia
    de año a año) — se encontró inspeccionando el HTML de
    https://www.afip.gob.ar/genericos/cInscripcion/archivoCompleto.asp
  - Registro Nacional de Sociedades: portal CKAN (datos.jus.gob.ar), con un
    recurso .zip nuevo por año. El id de recurso cambia cada año, así que se
    resuelve dinámicamente vía la API pública de CKAN (`package_show`) en vez
    de hardcodear una URL que se rompería en enero del año que viene.

Uso:
    python "job diario/actualizar_padrones_arca.py"
"""

import json
import logging
import os
import sys
from datetime import date
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parent.parent
DEP_DIR = Path(__file__).resolve().parent / "dependencias_externas"

DESCARGAS_DIR = REPO_ROOT / "ARCA" / "Descargas"
PADRONES_DIR = REPO_ROOT / "ARCA" / "Padrones procesados"

# Deben setearse ANTES del import de abajo: actualizar_padrones.py (y
# preparar_padron.py/limpiar_padron.py, que importa) leen estas variables de
# entorno una sola vez, al nivel de módulo.
os.environ["BOLETIN_ARCA_DESCARGAS_DIR"] = str(DESCARGAS_DIR)
os.environ["BOLETIN_ARCA_DIR"] = str(PADRONES_DIR)

sys.path.insert(0, str(DEP_DIR))
import actualizar_padrones  # noqa: E402  (copia autocontenida, solo se importa)

log = logging.getLogger("actualizar_padrones_arca")

URL_AFIP = "https://www.afip.gob.ar/genericos/cInscripcion/archivos/apellidoNombreDenominacion.zip"

CKAN_PACKAGE_ID = "ee83de85-4305-4c53-9a9f-fd3d15e42c36"  # Registro Nacional de Sociedades
CKAN_API = f"https://datos.jus.gob.ar/api/3/action/package_show?id={CKAN_PACKAGE_ID}"

_HEADERS = {"User-Agent": "Mozilla/5.0 (job diario - Boletin Oficial Mendoza)"}


def _descargar(url: str, destino: Path, timeout: int = 180) -> None:
    log.info(f"Descargando {url} -> {destino.name}")
    with requests.get(url, headers=_HEADERS, stream=True, timeout=timeout) as r:
        r.raise_for_status()
        with open(destino, "wb") as f:
            for chunk in r.iter_content(chunk_size=1 << 20):
                if chunk:
                    f.write(chunk)


def _resolver_url_registro_nacional_actual() -> str:
    """
    Busca en el catálogo CKAN el recurso .zip del Registro Nacional de
    Sociedades del año en curso (excluye las variantes de "asociaciones sin
    fines de lucro", que es otro padrón distinto, y las de "semestre", que
    son parciales). Si el año todavía no se publicó (recién empezó el año),
    cae al año anterior.
    """
    resp = requests.get(CKAN_API, headers=_HEADERS, timeout=30)
    resp.raise_for_status()
    recursos = resp.json()["result"]["resources"]

    anio_actual = date.today().year
    for anio in (anio_actual, anio_actual - 1):
        for r in recursos:
            nombre = (r.get("name") or "").lower()
            if (
                r.get("format", "").upper() == "ZIP"
                and str(anio) in nombre
                and "asociaciones sin fines de lucro" not in nombre
                and "semestre" not in nombre
            ):
                return r["url"]
    raise RuntimeError(
        f"No se encontró el recurso .zip del Registro Nacional de Sociedades "
        f"para {anio_actual} ni {anio_actual - 1} en el catálogo CKAN "
        f"({CKAN_API}) — revisar a mano si cambió la estructura del catálogo."
    )


def actualizar() -> None:
    """Descarga los dos padrones y corre el pipeline de limpieza existente."""
    DESCARGAS_DIR.mkdir(parents=True, exist_ok=True)

    _descargar(URL_AFIP, DESCARGAS_DIR / "apellidoNombreDenominacion.zip")

    url_registro = _resolver_url_registro_nacional_actual()
    nombre_archivo = url_registro.rsplit("/", 1)[-1]
    _descargar(url_registro, DESCARGAS_DIR / nombre_archivo)

    log.info("Descarga completa. Descomprimiendo y limpiando (ARCA/actualizar_padrones.py)...")
    actualizar_padrones.main()  # descomprime, corre preparar/limpiar_padron, borra los crudos


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    actualizar()
