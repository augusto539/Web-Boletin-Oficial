"""
actualizar_padrones.py
Orquesta la actualización completa de los padrones ARCA a partir de los .zip
descargados a mano en ARCA/Descargas/:

  1. Descomprime los .zip que haya en Descargas/ (deja el .tmp / .csv sueltos).
  2. Corre preparar_padron.py -> ARCA/Padron/Padrón sociedades.csv
  3. Corre limpiar_padron.py  -> ARCA/Pandas/CLAEsMendoza.xlsx
  4. Borra de Descargas/ los archivos crudos que se acaban de consumir (zip
     original ya se borró al descomprimir; tmp/csv se borran si el paso
     correspondiente terminó bien).

Uso:
    1. Descargar a mano los dos padrones y dejar los .zip en ARCA/Descargas/:
       - Padrón de Contribuyentes (AFIP): https://www.afip.gob.ar/genericos/cInscripcion/archivoCompleto.asp
       - Registro Nacional de Sociedades: https://www.argentina.gob.ar/justicia/registro-nacional-sociedades
    2. python ARCA/actualizar_padrones.py
"""

import logging
import os
import sys
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import preparar_padron
import limpiar_padron

# BOLETIN_ARCA_DESCARGAS_DIR permite que el job diario (que corre esta copia
# desde job diario/dependencias_externas/) descomprima/limpie en el
# ARCA/Descargas/ real del repo en vez de una carpeta vacía al lado de esta
# copia. Debe coincidir con el mismo env var que usan preparar_padron.py y
# limpiar_padron.py (importados arriba).
DESCARGAS_DIR = Path(os.getenv("BOLETIN_ARCA_DESCARGAS_DIR", str(Path(__file__).resolve().parent / "Descargas")))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)


def _descomprimir_todo() -> None:
    zips = sorted(DESCARGAS_DIR.glob("*.zip"))
    if not zips:
        logging.info("No hay .zip para descomprimir en Descargas/.")
        return
    for z in zips:
        logging.info(f"Descomprimiendo: {z.name}")
        with zipfile.ZipFile(z) as zf:
            zf.extractall(DESCARGAS_DIR)
        z.unlink()


def _borrar_subcarpetas_vacias() -> None:
    """Los zips a veces anidan el .tmp/.csv en subcarpetas (ej. utlfile/padr/
    del zip de AFIP) — una vez consumido el archivo, no queda nada útil ahí."""
    for carpeta in sorted(DESCARGAS_DIR.rglob("*"), reverse=True):
        if carpeta.is_dir() and not any(carpeta.iterdir()):
            carpeta.rmdir()


def main() -> None:
    DESCARGAS_DIR.mkdir(exist_ok=True)
    _descomprimir_todo()

    logging.info("── Padrón de Contribuyentes (AFIP) ──")
    origen_afip = preparar_padron.main()
    if origen_afip:
        origen_afip.unlink()
        logging.info(f"Borrado archivo crudo: {origen_afip.name}")

    logging.info("── Registro Nacional de Sociedades ──")
    origen_registro = limpiar_padron.main()
    if origen_registro:
        origen_registro.unlink()
        logging.info(f"Borrado archivo crudo: {origen_registro.name}")

    _borrar_subcarpetas_vacias()
    logging.info("Listo.")


if __name__ == "__main__":
    main()
