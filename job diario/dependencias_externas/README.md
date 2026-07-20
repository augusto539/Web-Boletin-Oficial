# Dependencias externas — copias autocontenidas EN USO por el job diario

Estos 7 archivos **son los que corren en producción** — `run_diario.py`,
`transformaciones.py` y `actualizar_padrones_arca.py` (en `job diario/`, no
acá) importan/invocan estas copias, no los originales de la raíz del repo /
`ARCA/`:

| Copia acá | Original (repo, solo backfill/rebuild manual) | Cómo se usa |
|---|---|---|
| `Descargar boletines.py` | `/Descargar boletines.py` (raíz) | Subproceso, con `BOLETIN_DOWNLOAD_DIR` apuntando al `PDFs/boletines/` real |
| `extraer_sociedades.py` | `/extraer_sociedades.py` (raíz) | Subproceso, con `BOLETIN_INPUT_DIR`/`BOLETIN_OUTPUT_FILE`/`BOLETIN_CHECKPOINT` |
| `post_procesar_excel.py` | `/post_procesar_excel.py` (raíz) | Import (solo funciones sueltas, nunca `main()`), con `BOLETIN_ARCA_DIR` apuntando al `ARCA/Padrones procesados/` real |
| `normalizacion.py` | `/normalizacion.py` (raíz) | Import (`normalizar_nombre`) — usado por esta misma carpeta y por `job diario/transformaciones.py` |
| `actualizar_padrones.py` | `/ARCA/actualizar_padrones.py` | Import (`main()`), con `BOLETIN_ARCA_DESCARGAS_DIR` apuntando al `ARCA/Descargas/` real |
| `preparar_padron.py` | `/ARCA/preparar_padron.py` | Import, vía `actualizar_padrones.py` |
| `limpiar_padron.py` | `/ARCA/limpiar_padron.py` | Import, vía `actualizar_padrones.py` |

## Por qué estas copias existen y se modifican

Empezaron (2026-07-16) como una foto de solo lectura, para que el paquete
`job diario/` fuera autocontenido al pasarlo a otro chat/repo. Desde
2026-07-17 son la dependencia real en tiempo de ejecución, y se modifican
libremente para el caso de uso diario — sin tocar los originales, que siguen
sirviendo al flujo manual de backfill/rebuild (`migrar_a_postgres.py`, corridas
completas sobre miles de PDFs).

**Cambios de rutas** (necesarios porque, corriendo desde acá, `Path(__file__).parent`
ya no apunta a la raíz del repo): las 5 constantes de carpeta que antes eran
fijas ahora son `os.getenv(VARIABLE, valor_default_relativo_a_esta_copia)` —
`BOLETIN_DOWNLOAD_DIR`, `BOLETIN_ARCA_DESCARGAS_DIR`, `BOLETIN_ARCA_DIR` (más
las ya existentes de antes, `BOLETIN_INPUT_DIR`/`BOLETIN_OUTPUT_FILE`/
`BOLETIN_CHECKPOINT`). El código de `job diario/` las setea antes de importar,
así estas copias leen/escriben en las carpetas reales del repo
(`PDFs/boletines/`, `ARCA/Descargas/`, `ARCA/Padrones procesados/`) y no en
una carpeta vacía al lado de esta copia. Sin este override, sin querer se
correría un job diario que jamás encuentra nada porque escribe/lee en el
lugar equivocado.

**Cambios de rendimiento**: `extraer_sociedades.py` paraleliza ahora las
llamadas a Claude **dentro de un mismo PDF** (`procesar_pdf()`, constante
`BLOQUES_EN_PARALELO`) — antes eran secuenciales con una pausa entre cada una.
La paralelización por ARCHIVO que ya traía el script (`MAX_WORKERS`) no ayuda
para el caso típico del job diario (1 PDF/día); la paralelización por GRUPO
dentro del PDF sí.

Si se actualiza algún original en el repo, esta copia queda desactualizada —
no hay sincronización automática, hay que revisar a mano si el cambio
también aplica acá.
