"""
run_diario.py — orquestador del job diario.

Secuencia: descarga lo nuevo -> determina qué boletines faltan cargar (contra
Postgres, no contra un archivo local) -> extrae solo esos -> actualiza los
padrones ARCA (descarga + limpieza) -> enriquece -> carga incremental ->
limpieza de archivos que ya no hacen falta.

Todos los pasos corren contra las copias autocontenidas de
`job diario/dependencias_externas/` (DEP_DIR más abajo), no contra los
scripts originales en la raíz del repo / `ARCA/` — esos originales siguen
sirviendo al flujo manual de backfill/rebuild y no se tocan. Las copias sí se
modifican libremente para optimizar el caso de uso diario (ver p.ej. la
paralelización de llamadas a Claude dentro de un mismo PDF en la copia de
`extraer_sociedades.py`), y leen/escriben en las carpetas REALES del repo
(`PDFs/boletines/`, `ARCA/Descargas/`, `ARCA/Padrones procesados/`) vía
variables de entorno (`BOLETIN_DOWNLOAD_DIR`, `BOLETIN_ARCA_DESCARGAS_DIR`,
`BOLETIN_ARCA_DIR`, etc.) en vez de rutas relativas a su propia carpeta:

  - `Descargar boletines.py` y `extraer_sociedades.py` (copias) se invocan
    como subprocesos, con variables de entorno propias.
  - `post_procesar_excel.py` (copia) se IMPORTA (no se ejecuta su `main()`,
    así que su ruta de Excel fija nunca entra en juego) y se llaman directo
    sus funciones de enriquecimiento.
  - `actualizar_padrones.py` (copia, y `preparar_padron.py`/
    `limpiar_padron.py`, que este importa) se invoca vía
    `actualizar_padrones_arca.py` (en esta carpeta, no una copia), que agrega
    el paso de descarga que antes era manual.

Los archivos intermedios (extracción y enriquecimiento) son **CSV**, no Excel
— extraer_sociedades.py solo puede escribir Excel, así que ese paso genera un
.xlsx transitorio que se convierte a .csv y se borra al toque.

Al terminar una corrida exitosa se borran: los PDF de los boletines ya
cargados (de `PDFs/boletines/`), los padrones ARCA ya usados (se regeneran
frescos la próxima vez que haga falta) y toda la carpeta de staging del día.

Uso (pensado para systemd timer, ver deploy/):
    python "job diario/run_diario.py"

Variables de entorno necesarias: las mismas de siempre (ANTHROPIC_API_KEY,
DATABASE_URL o PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD) más, opcionales,
RESEND_API_KEY / ALERTA_EMAIL_TO / ALERTA_EMAIL_FROM para la alerta de fallo.
"""

import json
import logging
import os
import re
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
JOB_DIR = Path(__file__).resolve().parent
DEP_DIR = JOB_DIR / "dependencias_externas"
sys.path.insert(0, str(JOB_DIR))
sys.path.insert(0, str(DEP_DIR))

from transformaciones import conectar
import cargar_incremental
import actualizar_padrones_arca

HEARTBEAT_FILE = JOB_DIR / "heartbeat.json"


def _log_setup() -> Path:
    logs_dir = JOB_DIR / "logs"
    logs_dir.mkdir(exist_ok=True)
    log_file = logs_dir / f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.log"
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[logging.FileHandler(log_file, encoding="utf-8"), logging.StreamHandler()],
    )
    return log_file


log = logging.getLogger("run_diario")


def _correr_descarga():
    log.info("Corriendo 'Descargar boletines.py' (modo diario, autodescubre lo nuevo)...")
    env = os.environ.copy()
    # La copia autocontenida vive en dependencias_externas/ — sin este
    # override descargaría a una carpeta PDFs/boletines/ nueva y vacía al
    # lado de la copia, en vez del PDFs/boletines/ real del repo.
    env["BOLETIN_DOWNLOAD_DIR"] = str(REPO_ROOT / "PDFs" / "boletines")
    resultado = subprocess.run(
        [sys.executable, str(DEP_DIR / "Descargar boletines.py")],
        cwd=REPO_ROOT, env=env, capture_output=True, text=True,
    )
    if resultado.stdout:
        log.info(resultado.stdout[-3000:])
    if resultado.returncode != 0:
        log.error(resultado.stderr[-3000:] if resultado.stderr else "(sin stderr)")
        raise RuntimeError(f"'Descargar boletines.py' salió con código {resultado.returncode}")


def _determinar_pendientes() -> dict:
    """{nombre_archivo: id_boletin} para los PDFs descargados que todavía no
    están en Postgres (boletines.id_pdf) — la fuente de verdad de qué ya se
    cargó, no un archivo de checkpoint local."""
    mapping_path = REPO_ROOT / "PDFs" / "boletines" / "ids_boletines.json"
    mapping = json.loads(mapping_path.read_text(encoding="utf-8")) if mapping_path.exists() else {}

    conn = conectar()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id_pdf FROM boletines WHERE id_pdf IS NOT NULL")
        ya_cargados = {row[0] for row in cur.fetchall()}
    finally:
        conn.close()

    return {nombre: idb for nombre, idb in mapping.items() if str(idb) not in ya_cargados}


def _armar_carpeta_pendientes(pendientes: dict, staging_dir: Path) -> Path:
    carpeta = staging_dir / "pendientes"
    carpeta.mkdir(parents=True, exist_ok=True)
    boletines_dir = REPO_ROOT / "PDFs" / "boletines"
    for nombre in pendientes:
        origen = boletines_dir / nombre
        destino = carpeta / nombre
        if origen.exists() and not destino.exists():
            destino.symlink_to(origen)
    return carpeta


def _correr_extraccion(carpeta_pendientes: Path, staging_dir: Path) -> Path | None:
    # extraer_sociedades.py solo sabe escribir Excel (no se modifica el
    # archivo) — se le da un nombre "_tmp" porque se convierte a CSV y se
    # borra apenas termina, para no dejar un intermedio pesado en disco.
    output_file_xlsx = staging_dir / "extraido_tmp.xlsx"
    checkpoint_file = staging_dir / "checkpoint.json"
    log.info(f"Corriendo 'extraer_sociedades.py' sobre {carpeta_pendientes} ...")
    env = os.environ.copy()
    env["BOLETIN_INPUT_DIR"] = str(carpeta_pendientes)
    env["BOLETIN_OUTPUT_FILE"] = str(output_file_xlsx)
    env["BOLETIN_CHECKPOINT"] = str(checkpoint_file)
    resultado = subprocess.run(
        [sys.executable, str(DEP_DIR / "extraer_sociedades.py")],
        cwd=REPO_ROOT, env=env, capture_output=True, text=True,
    )
    if resultado.stdout:
        log.info(resultado.stdout[-3000:])
    if resultado.returncode != 0:
        log.error(resultado.stderr[-3000:] if resultado.stderr else "(sin stderr)")
        raise RuntimeError(f"'extraer_sociedades.py' salió con código {resultado.returncode}")
    if not output_file_xlsx.exists():
        # Caso legítimo, no un error: el/los PDF(s) de hoy no tenían sección
        # "CONTRATOS SOCIALES" (ningún acto societario publicado ese día).
        log.info("No se extrajo ninguna sociedad hoy (sin sección Contratos Sociales).")
        return None

    output_csv = staging_dir / "extraido.csv"
    pd.read_excel(output_file_xlsx).to_csv(output_csv, index=False)
    output_file_xlsx.unlink()
    return output_csv


def _enriquecer(extraido_path: Path, staging_dir: Path) -> Path:
    import post_procesar_excel as pp  # import de solo-lectura; no se ejecuta pp.main()

    log.info(f"Enriqueciendo {extraido_path.name} (cruces ARCA), sin tocar el Excel maestro...")
    df = pd.read_csv(extraido_path)

    nombres_norm = df["Nombre de la sociedad"].apply(pp.normalizar_nombre)
    pp.insertar_o_actualizar(df, "Nombre normalizado", nombres_norm, despues_de="Nombre de la sociedad")

    lookup_registro = pp._cargar_registro_nacional()
    if lookup_registro is not None:
        df = pp._cruzar_registro_nacional(df, nombres_norm, lookup_registro)
        lookup_padron = pp._cargar_padron_cuits()
        if lookup_padron is not None:
            df = pp._cruzar_padron_cuits(df, df["CUIT empresa"], lookup_padron)
    else:
        log.warning("Se omiten los cruces con ARCA (no se encontró el padrón CLAEsMendoza.csv).")

    departamentos = df["Domicilio de la sociedad"].apply(pp.detectar_departamento)
    pp.insertar_o_actualizar(df, "Departamento", departamentos, despues_de="Domicilio de la sociedad")

    enriquecido_path = staging_dir / "enriquecido.csv"
    df.to_csv(enriquecido_path, index=False)
    log.info(f"Enriquecido guardado: {enriquecido_path}")
    return enriquecido_path


def _fecha_desde_nombre(nombre_archivo: str):
    m = re.search(r"(\d{8})", nombre_archivo)
    if not m:
        return None
    s = m.group(1)
    try:
        return date(int(s[:4]), int(s[4:6]), int(s[6:8]))
    except ValueError:
        return None


def _registrar_pendientes_sin_datos(pendientes: dict):
    """
    Para los boletines que no terminaron generando ninguna fila (0 sociedades
    extraídas), igual hay que dejar constancia en `boletines` — si no, el
    orquestador los reintentaría todos los días para siempre (la idempotencia
    depende exclusivamente de que id_pdf exista en esta tabla).
    """
    conn = conectar()
    try:
        cur = conn.cursor()
        registrados = 0
        for nombre, idb in pendientes.items():
            idp = str(idb)
            cur.execute("SELECT 1 FROM boletines WHERE id_pdf = %s", (idp,))
            if cur.fetchone():
                continue
            fecha = _fecha_desde_nombre(nombre)
            if fecha is None:
                log.warning(f"No se pudo determinar la fecha de '{nombre}' — se deja pendiente, no se registra.")
                continue
            cur.execute("INSERT INTO boletines (fecha, id_pdf) VALUES (%s, %s)", (fecha, idp))
            registrados += 1
            log.info(f"Boletín {idp} ({nombre}) registrado sin sociedades (sin Contratos Sociales).")
        conn.commit()
        return registrados
    finally:
        conn.close()


def _limpiar_archivos_procesados(pendientes: dict):
    """
    Borra de PDFs/boletines/ los PDFs de los boletines que quedaron
    confirmados en Postgres (cargados con datos o registrados vacíos) — ya
    no hacen falta, boletines.id_pdf es la fuente de verdad de qué se
    procesó. Se verifica contra Postgres (no se asume) antes de borrar nada.
    """
    if not pendientes:
        return
    conn = conectar()
    try:
        cur = conn.cursor()
        ids = [str(idb) for idb in pendientes.values()]
        cur.execute("SELECT id_pdf FROM boletines WHERE id_pdf = ANY(%s)", (ids,))
        confirmados = {row[0] for row in cur.fetchall()}
    finally:
        conn.close()

    boletines_dir = REPO_ROOT / "PDFs" / "boletines"
    borrados = 0
    for nombre, idb in pendientes.items():
        if str(idb) in confirmados:
            pdf_path = boletines_dir / nombre
            if pdf_path.exists():
                pdf_path.unlink()
                borrados += 1
    if borrados:
        log.info(f"{borrados} PDF(s) de boletines ya cargados, borrados de PDFs/boletines/.")


def _limpiar_padrones_arca():
    """Borra los CSV de padrones ARCA ya usados — se regeneran frescos
    (descarga + limpieza) en la próxima corrida que tenga boletines nuevos."""
    padrones_dir = REPO_ROOT / "ARCA" / "Padrones procesados"
    for nombre in ("Padrón sociedades.csv", "CLAEsMendoza.csv"):
        p = padrones_dir / nombre
        if p.exists():
            p.unlink()
            log.info(f"Borrado padrón ARCA ya usado: {nombre}")


def _limpiar_staging(staging_dir: Path):
    import shutil
    if staging_dir.exists():
        shutil.rmtree(staging_dir)
        log.info(f"Carpeta de staging del día borrada: {staging_dir}")


def _actualizar_heartbeat(ok: bool, detalle):
    HEARTBEAT_FILE.write_text(
        json.dumps(
            {"ultima_corrida": datetime.now().isoformat(), "ok": ok, "detalle": str(detalle)},
            ensure_ascii=False, indent=2,
        ),
        encoding="utf-8",
    )


def _enviar_alerta_fallo(mensaje: str):
    api_key = os.environ.get("RESEND_API_KEY")
    to_addr = os.environ.get("ALERTA_EMAIL_TO")
    from_addr = os.environ.get("ALERTA_EMAIL_FROM", "Job Diario <onboarding@resend.dev>")
    if not api_key or not to_addr:
        log.warning("RESEND_API_KEY / ALERTA_EMAIL_TO no configurados — no se envía alerta por mail.")
        return
    try:
        import requests
        resp = requests.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "from": from_addr,
                "to": [to_addr],
                "subject": "[Boletín Oficial] Falló el job diario",
                "text": mensaje,
            },
            timeout=15,
        )
        if resp.status_code >= 300:
            log.error(f"Resend devolvió {resp.status_code}: {resp.text}")
        else:
            log.info("Alerta de fallo enviada por mail.")
    except Exception:
        log.exception("No se pudo enviar la alerta por mail (Resend).")


def main():
    log_file = _log_setup()
    hoy = date.today().isoformat()
    staging_dir = JOB_DIR / "staging" / hoy
    staging_dir.mkdir(parents=True, exist_ok=True)

    try:
        _correr_descarga()
        pendientes = _determinar_pendientes()
        if not pendientes:
            log.info("No hay boletines nuevos pendientes de cargar. Nada para hacer hoy.")
            _actualizar_heartbeat(ok=True, detalle="sin novedades")
            _limpiar_staging(staging_dir)
            return

        log.info(f"{len(pendientes)} boletín(es) pendiente(s): {sorted(pendientes.keys())}")
        carpeta_pendientes = _armar_carpeta_pendientes(pendientes, staging_dir)
        extraido = _correr_extraccion(carpeta_pendientes, staging_dir)

        resumen = {"procesados": 0, "salteados": 0}
        if extraido is not None:
            log.info("Actualizando padrones ARCA (descarga + limpieza) antes de enriquecer...")
            actualizar_padrones_arca.actualizar()
            enriquecido = _enriquecer(extraido, staging_dir)
            resumen = cargar_incremental.cargar(enriquecido)
            log.info(f"Carga completa: {resumen}")

        registrados_vacios = _registrar_pendientes_sin_datos(pendientes)
        if registrados_vacios:
            log.info(f"{registrados_vacios} boletín(es) registrados sin sociedades.")

        _actualizar_heartbeat(ok=True, detalle={**resumen, "sin_sociedades": registrados_vacios})

        # Limpieza post-éxito: libera espacio (PDFs ya cargados, padrones ARCA
        # ya usados, y toda la carpeta de staging del día).
        _limpiar_archivos_procesados(pendientes)
        if extraido is not None:
            _limpiar_padrones_arca()
        _limpiar_staging(staging_dir)
    except Exception as e:
        log.exception("El job diario falló.")
        _actualizar_heartbeat(ok=False, detalle=str(e))
        _enviar_alerta_fallo(f"Job diario falló: {e}\n\nVer log completo en: {log_file}")
        sys.exit(1)


if __name__ == "__main__":
    main()
