import argparse
import json
import os
import re
import time
import logging
import threading
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests

# Configuración de logging
_LOGS_DIR = Path(__file__).parent / "Logs"
_LOGS_DIR.mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(_LOGS_DIR / "descargas.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)

# VARIABLES
PRIMER_BOLETIN = 30288   # Semilla para el backfill si todavía no se bajó nada
URL_BASE = "https://boe.mendoza.gov.ar/default/public/publico/verpdf/"
# BOLETIN_DOWNLOAD_DIR permite que el job diario (que corre esta copia desde
# job diario/dependencias_externas/) siga descargando al PDFs/boletines/ real
# del repo en vez de crear uno nuevo vacío al lado de esta copia.
DOWNLOAD_DIR = os.getenv(
    "BOLETIN_DOWNLOAD_DIR",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "PDFs", "boletines"),
)
MAPPING_FILE = Path(DOWNLOAD_DIR) / "ids_boletines.json"   # nombre_archivo -> id interno del boletín

WORKERS        = 6      # Descargas en paralelo (subí/bajá según ancho de banda y el server)
TIMEOUT        = 30     # Segundos máximos por request
REINTENTOS     = 3      # Reintentos ante error de conexión
HEADERS        = {"User-Agent": "Mozilla/5.0 (descarga boletines)"}
FALLOS_PARA_CORTAR_DESCUBRIMIENTO = 5   # IDs seguidos sin PDF para asumir "no hay más ediciones"
MIN_PDF_BYTES  = 50 * 1024   # Un boletín real pesa >400 KB; menos que esto = descarga rota/truncada

os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Una sesión HTTP por hilo (requests.Session no es 100% thread-safe para compartir)
_local = threading.local()


def _session() -> requests.Session:
    if not hasattr(_local, "s"):
        _local.s = requests.Session()
        _local.s.headers.update(HEADERS)
    return _local.s


def _nombre_desde_headers(resp, boletin_id: int) -> str:
    """Extrae boletin_YYYYMMDD.pdf del header Content-Disposition; fallback por ID."""
    cd = resp.headers.get("Content-Disposition", "")
    m = re.search(r'filename\s*=\s*"?([^"\;]+)"?', cd)
    if m:
        return os.path.basename(m.group(1).strip())
    return f"boletin_id_{boletin_id}.pdf"


def descargar_uno(boletin_id: int) -> tuple[str, int, str]:
    """
    Descarga un boletín por ID.
    Devuelve (estado, id, nombre) con estado in {ok, existe, noexiste, error}.
    """
    url = URL_BASE + str(boletin_id)
    for intento in range(1, REINTENTOS + 1):
        try:
            with _session().get(url, timeout=TIMEOUT, stream=True) as r:
                # Sin PDF: ID inexistente o página de error (status != 200 o content-type ≠ pdf)
                if r.status_code != 200 or "application/pdf" not in r.headers.get("Content-Type", ""):
                    return ("noexiste", boletin_id, "")

                nombre = _nombre_desde_headers(r, boletin_id)
                destino = Path(DOWNLOAD_DIR) / nombre

                # Idempotente: si ya está, no re-descargamos el cuerpo
                if destino.exists():
                    return ("existe", boletin_id, nombre)

                tmp = destino.with_suffix(destino.suffix + ".part")
                escritos = 0
                with open(tmp, "wb") as f:
                    for chunk in r.iter_content(chunk_size=65536):
                        if chunk:
                            escritos += f.write(chunk)

                # El server no manda Content-Length y a veces devuelve un PDF
                # truncado (p. ej. 103 bytes: header válido pero sin cuerpo) que
                # pasa el chequeo de content-type pero después hace crashear a
                # pdfplumber. Si bajó mucho menos que un boletín real, descartamos
                # el .part y NO lo promovemos: así el próximo run lo reintenta en
                # vez de dar el archivo roto por bueno y perder ese boletín.
                if escritos < MIN_PDF_BYTES:
                    tmp.unlink(missing_ok=True)
                    logging.warning(
                        f"  ✗ Boletín {boletin_id} ({nombre}): descarga truncada de "
                        f"{escritos} bytes (< {MIN_PDF_BYTES}); descartada, se reintentará."
                    )
                    return ("truncado", boletin_id, nombre)

                tmp.replace(destino)   # rename atómico al terminar
                return ("ok", boletin_id, nombre)

        except (requests.ConnectionError, requests.Timeout) as e:
            if intento < REINTENTOS:
                time.sleep(2 * intento)
            else:
                logging.error(f"  ✗ Boletín {boletin_id}: error de conexión tras {REINTENTOS} intentos: {e}")
                return ("error", boletin_id, "")
        except Exception as e:
            logging.error(f"  ✗ Boletín {boletin_id}: error no recuperable: {e}")
            return ("error", boletin_id, "")
    return ("error", boletin_id, "")


def _cargar_mapping() -> dict:
    if MAPPING_FILE.exists():
        try:
            return json.loads(MAPPING_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def _guardar_mapping(mapping: dict) -> None:
    MAPPING_FILE.write_text(json.dumps(mapping, ensure_ascii=False, indent=2), encoding="utf-8")


def existe_boletin(boletin_id: int) -> bool:
    """HEAD liviano (sin bajar el cuerpo): True si ese ID tiene un PDF publicado."""
    url = URL_BASE + str(boletin_id)
    for intento in range(1, REINTENTOS + 1):
        try:
            r = _session().head(url, timeout=TIMEOUT, allow_redirects=True)
            return r.status_code == 200 and "application/pdf" in r.headers.get("Content-Type", "")
        except (requests.ConnectionError, requests.Timeout):
            if intento < REINTENTOS:
                time.sleep(2 * intento)
    # Tras agotar reintentos por error de conexión, no asumimos "no existe":
    # lo tratamos como corte defensivo para no marcar el final del boletín por una falla de red.
    logging.warning(f"  ✗ No se pudo verificar el ID {boletin_id} (error de conexión); se corta el sondeo acá.")
    return False


def descubrir_ultimo_id(desde_id: int) -> int:
    """
    Sondea IDs consecutivos desde desde_id+1 hasta encontrar
    FALLOS_PARA_CORTAR_DESCUBRIMIENTO seguidos sin PDF (asume que ahí termina
    lo publicado). Devuelve el último ID confirmado con PDF (o desde_id si no
    apareció ninguna edición nueva).
    """
    logging.info(f"Buscando la última edición publicada a partir del ID {desde_id + 1}...")
    ultimo_valido = desde_id
    fallos_seguidos = 0
    candidato = desde_id + 1

    while fallos_seguidos < FALLOS_PARA_CORTAR_DESCUBRIMIENTO:
        if existe_boletin(candidato):
            logging.info(f"  ✓ {candidato} existe")
            ultimo_valido = candidato
            fallos_seguidos = 0
        else:
            fallos_seguidos += 1
        candidato += 1

    logging.info(f"Última edición encontrada: ID {ultimo_valido}.")
    return ultimo_valido


def descargar_boletines(primer_id: int, ultimo_id: int) -> None:
    ids = list(range(primer_id, ultimo_id + 1))
    total = len(ids)
    cont = {"ok": 0, "existe": 0, "noexiste": 0, "error": 0, "truncado": 0}
    errores = []
    mapping = _cargar_mapping()

    logging.info(f"Descargando {total} boletines ({primer_id}–{ultimo_id}) con {WORKERS} workers...")
    t0 = time.time()

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futuros = {executor.submit(descargar_uno, bid): bid for bid in ids}
        completados = 0
        for fut in as_completed(futuros):
            completados += 1
            estado, bid, nombre = fut.result()
            cont[estado] += 1
            if estado == "ok":
                logging.info(f"  [{completados}/{total}] ✓ {bid} → {nombre}")
                mapping[nombre] = bid
            elif estado == "existe":
                logging.info(f"  [{completados}/{total}] = {bid} ya existía ({nombre})")
                mapping[nombre] = bid
            elif estado == "noexiste":
                logging.info(f"  [{completados}/{total}] · {bid} sin PDF (omitido)")
            else:
                errores.append(bid)

    _guardar_mapping(mapping)

    dt = time.time() - t0
    logging.info(
        f"\nProceso terminado en {dt:.0f}s. "
        f"Nuevos={cont['ok']} | YaExistían={cont['existe']} | "
        f"SinPDF={cont['noexiste']} | Truncados={cont['truncado']} | Errores={cont['error']}"
    )
    logging.info(f"Mapeo nombre→id guardado en {MAPPING_FILE.name} ({len(mapping)} entradas).")
    if errores:
        logging.warning(f"IDs con error: {sorted(errores)}")


def _parsear_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Descarga boletines del BO de Mendoza. Por defecto, descubre "
                     "automáticamente la última edición publicada (modo diario)."
    )
    parser.add_argument("--desde", type=int, help="ID inicial (backfill manual)")
    parser.add_argument("--hasta", type=int, help="ID final (backfill manual, sin descubrimiento)")
    return parser.parse_args()


if __name__ == "__main__":
    args = _parsear_args()

    if args.desde is not None and args.hasta is not None:
        # Backfill manual: rango explícito, sin descubrimiento.
        descargar_boletines(args.desde, args.hasta)
    else:
        # Modo diario (default): parte del último ID ya conocido y descubre
        # automáticamente la última edición publicada.
        mapping = _cargar_mapping()
        punto_partida = max(mapping.values()) if mapping else PRIMER_BOLETIN - 1
        ultimo_id = descubrir_ultimo_id(punto_partida)

        if ultimo_id <= punto_partida:
            logging.info("No hay ediciones nuevas para descargar.")
        else:
            descargar_boletines(punto_partida + 1, ultimo_id)
