# Checklist pre-instalación del job diario — antes de activar el timer contra producción

Salido de la revisión cruzada del 2026-07-20 entre `job diario/` (repo
"Info Boletin Oficial") y la app web. Agrupado por el modelo recomendado
para ejecutar cada bloque — ver razones abajo de cada grupo.

---

## 🔴 Bloque A — Opus, esfuerzo alto (toca datos/identidad en producción)

> Requiere razonar bien los casos borde antes de escribir, porque corre
> contra una base real con datos ya promovidos a mano — un error acá
> duplica o desvincula sociedades reales, sin vuelta atrás fácil.

- [x] **Normalización de nombres divergente (pipeline vs. web).** ✅ HECHO 2026-07-20
  Creada la función SQL `normalizar_nombre()` en la migración
  [`db/migrations/038_normalizar_nombre_funcion.sql`](../db/migrations/038_normalizar_nombre_funcion.sql).
  - Replica EXACTAMENTE `normalizacion.py:normalizar_nombre` del pipeline.
    Usa `normalize(..., NFD)` + strip de marcas combinantes (no `unaccent`),
    con `ß`→`SS`, así que es `IMMUTABLE` y byte-exacta con Python. Verificada
    carácter-por-carácter sobre 50 casos (los 10 stubs de 037, todas las
    abreviaturas, acentos, ñ, ç, eszett, latinos extendidos, puntuación y
    bordes) en un Postgres 16 desechable: **0 divergencias**.
  - Reemplazados los usos en `backend/src/admin.ts`: el `SELECT` por
    `nombre_normalizado` (línea ~453), el `INSERT` del stub (línea ~460) y
    también la `clave` de agrupación del listado de socios jurídicos
    (línea ~396). `tsc --noEmit` pasa. Ya no queda ningún `upper(unaccent(...))`
    en el backend.
  - Realineado de datos incluido en la migración: recalcula
    `nombre_normalizado` **solo** de las filas normalizadas con la fórmula
    vieja (`nombre_normalizado = upper(unaccent(nombre))` y distinto del
    canónico) → toca los stubs promovidos, deja intactas las filas del
    pipeline. Probado end-to-end contra una `sociedades` de prueba: realinea
    exactamente los stubs con puntos/acentos, no toca los ya canónicos ni las
    filas pipeline.
  - Mínimo privilegio (igual que las funciones de grafo de 036):
    `REVOKE ... FROM PUBLIC` + `GRANT ... TO boletin_auth`, para que
    PostGraphile (rol `boletin_api`) NO la exponga en la API pública.
    Verificado: `auth=true`, `api=false`.
  - **Diagnóstico incluido, requiere acción manual del usuario**: la migración
    emite por `RAISE NOTICE` los grupos de sociedades que queden compartiendo
    `nombre_normalizado` tras el realineado (candidatos a fusión). NO se
    fusionan automáticamente (destructivo, requiere criterio humano sobre cuál
    conserva actos/CUIT/domicilio). Revisar esos NOTICE tras aplicar en
    producción y fusionar a mano desde el panel de admin si corresponde.
  - **Pendiente del lado del usuario antes de aplicar en prod**: correr
    `db/migrate.ts` (o el flujo de migraciones habitual) contra producción y
    leer los NOTICE. No lo ejecuté yo contra ninguna base real — solo verifiqué
    en Postgres desechable.

---

## 🟢 Bloque B — Sonnet, esfuerzo medio (mecánico, sin tocar datos de producción)

> ✅ HECHO 2026-07-20. Commits:
> repo "Info Boletin Oficial" `983f0c0` (B1) y `dc7f0da` (B2–B5);
> repo "WEB Info Boletin Oficial" `0ad55d8` (parte de B2 — `docker-compose.prod.yml`).

### B1. Repo del pipeline — poner al día lo que hoy solo vive en el working tree

- [x] Commiteados en el repo **"Info Boletin Oficial"** (`983f0c0`) los
  cambios que ya contenían el fix de departamentos y el wiring de
  `BOLETIN_ARCA_DIR`: `migrar_a_postgres.py`, `post_procesar_excel.py`
  (raíz), `job diario/transformaciones.py`,
  `job diario/dependencias_externas/post_procesar_excel.py`. Revisados
  diff por diff antes de stagear — quedaron afuera del commit los cambios
  ajenos que había en el working tree (`.DS_Store`,
  `PLAN_ideas_informes_seo.md`, y 3 archivos untracked sin relación).
- [x] Des-trackeados los 7 `.pyc` que habían quedado versionados en
  `job diario/dependencias_externas/__pycache__/` y corregido el
  `.gitignore` de `job diario/` (`/__pycache__/` → `__pycache__/`, para
  que cubra también la subcarpeta). Verificado con `git check-ignore`.

### B2. Conectividad Postgres en producción

- [x] Publicado el puerto de Postgres a loopback en
  [`docker-compose.prod.yml`](../docker-compose.prod.yml) (`0ad55d8`):
  `ports: ["127.0.0.1:5432:5432"]` en el servicio `postgres` — no
  `0.0.0.0`, no expuesto a internet. El acceso interno de `app` por el
  hostname `postgres` sigue intacto (esto es un agregado, no un
  reemplazo).
- [x] `job-diario.service` (`dc7f0da`): `After=` pasa de
  `postgresql.service` (no existe en este host) a `docker.service`. Nota
  agregada en el propio archivo: esto garantiza que el daemon de Docker
  esté arriba, no que el contenedor ya haya pasado su healthcheck — en el
  caso raro de coincidir con un reinicio, la corrida puede fallar por
  connection refused, pero como el job es idempotente
  (`boletines.id_pdf`), la corrida del día siguiente lo resuelve solo. No
  se agregó un `ExecStartPre` que espere el healthcheck a propósito: para
  saber a qué contenedor esperar haría falta asumir un nombre de proyecto
  de compose, que puede no coincidir en el servidor real — mejor no
  hardcodear algo frágil.

### B3. Manejo de errores de extracción (pérdida silenciosa de boletines)

- [x] `job diario/dependencias_externas/extraer_sociedades.py` (`dc7f0da`):
  el `except Exception: ... return []` genérico de `procesar_pdf` ya NO
  atrapa errores genéricos — se dejó únicamente el `except` específico de
  "sin créditos" (que ya propagaba antes). Cualquier otro error ahora
  propaga hasta el loop principal, que lo cuenta en `errores` y NO marca
  el checkpoint. Además, `main()` ahora sale con código `1` si
  `errores > 0` (antes siempre salía 0 pase lo que pasara) — así
  `run_diario.py`, que ya chequeaba `returncode != 0`, detecta el fallo y
  NO llama a `_registrar_pendientes_sin_datos()`. También: `sin_creditos`
  y `Ctrl+C` ahora salen con código != 0 (`1` y `130`) en vez de `return`
  silencioso, por la misma razón.
  - Verificado con un test de sintaxis (`ast.parse`) — no hay entorno de
    extracción real (Claude) disponible en esta sesión para un test
    funcional end-to-end de este archivo puntual; la lógica de
    propagación se verificó leyendo el flujo completo (loop principal en
    `main()` ya tenía el manejo correcto para excepciones propagadas,
    solo faltaba dejar de atraparlas antes de tiempo).

### B4. Ajustes chicos de robustez (bajo riesgo, alto valor)

- [x] `run_diario.py` (`dc7f0da`): fusible de costos
  `BOLETIN_MAX_PENDIENTES` (default 5, override por env var) — si
  `_determinar_pendientes()` devuelve más que eso, aborta ANTES de correr
  extracción (con alerta), en vez de gastar en Claude sobre una
  desincronización de `ids_boletines.json`.
- [x] `cargar_incremental.py:cargar()` (`dc7f0da`): `conn.rollback()`
  agregado al inicio del `finally`, antes del `pg_advisory_unlock`.
  **Verificado con reproducción del bug**: corrida de un test que fuerza
  una excepción SQL real antes del loop por-boletín — sin el fix,
  `InFailedSqlTransaction` tapaba la excepción original; con el fix, la
  excepción original se propaga limpia y el advisory lock queda liberado
  (confirmado con `pg_try_advisory_lock` desde una segunda conexión).
- [x] `procesar_boletin` en `cargar_incremental.py` (`dc7f0da`): el CUIT
  candidato para `resolver_sociedad` ahora sale del primer CUIT no vacío
  entre TODAS las filas del grupo (antes: solo la primera fila), igual
  criterio que `_construir_sociedad_nueva`. **Verificado end-to-end**
  contra Postgres con el schema real: CSV de 2 filas del mismo boletín
  donde el CUIT aparece solo en la 2ª fila, y ese CUIT ya pertenece a una
  sociedad existente — resuelve correctamente a la sociedad existente en
  vez de intentar crear una duplicada (que antes violaba el
  `UNIQUE(cuit)` y tiraba abajo el boletín entero).
- [x] Upgrade de sociedad existente (`dc7f0da`, `cargar_incremental.py`):
  nueva `_upgrade_sociedad()` completa con `COALESCE` los campos NULL
  (tipo, domicilio, capital, objeto, domicilio electrónico,
  ganancias/IVA/match ARCA, actividades CLAE) de una sociedad ya
  existente — pensada sobre todo para los stubs promovidos desde el panel
  de admin. Nunca toca nombre/nombre_normalizado/cuit (identidad). Evita
  crear un domicilio huérfano si la sociedad ya tenía uno (`domicilio_id`
  no deduplica, así que se chequea antes de llamarlo). **Verificado
  end-to-end**: seedeado un stub tipo-037 (solo nombre+cuit), cargado un
  boletín con 2 actos para esa misma empresa → el stub terminó con
  `domicilio_id`, `capital_inicial` y 2 `actos` colgados de su mismo id
  (sin duplicar la sociedad), sin tocar nombre/cuit originales, y sin
  duplicar el domicilio en una segunda corrida idéntica (test de
  idempotencia con conexión nueva, como sería una corrida real al día
  siguiente).
- [x] `Lookup.get` en `transformaciones.py` (`dc7f0da`): loguea
  (`logging.warning`) cada vez que crea una fila nueva de catálogo
  (`tipos_acto`, `roles`), con el nombre y el id, para poder auditar.
- [x] `TimeoutStartSec` 1800→3600 en `job-diario.service` (`dc7f0da`).
  Agregada `job-diario-alerta-fallo.service` (nueva unit, dispara vía
  `OnFailure=` de `job-diario.service`) — manda un mail de respaldo
  independiente del venv (`curl` directo a Resend vía
  `alerta_fallo_systemd.sh`) para el caso en que el proceso Python muera
  ANTES de llegar a su propio `except` (lo mata el timeout, o crashea el
  intérprete) y por lo tanto nunca llega a mandar su propia alerta.
  `deploy/README.md` actualizado con el paso de instalación de la nueva
  unit.
- [x] `ALERTA_EMAIL_FROM` (`dc7f0da`): cambiado de
  `onboarding@resend.dev` a `Job Diario <no-responder@ingcome.com.ar>`
  (dominio ya verificado por la app web) tanto en `.env.example` como en
  el default hardcodeado de `run_diario.py`.
- [ ] **Pendiente del usuario (no es código)**: crear una API key de
  Anthropic separada para el job diario, para atribución de gasto — no
  hay colisión de uso hoy (la web no usa Anthropic para nada, verificado
  por grep), pero conviene separar antes de que el volumen crezca. No
  puedo generarla yo — es una acción en console.anthropic.com.
- [x] Guard-rail en `crear_tablas.py --reset` (`dc7f0da`): se negó a
  resetear si la base tiene una tabla `schema_migrations`, salvo el flag
  `--confirmo-que-tambien-borro-la-app-web`.
  **Corrección importante durante la verificación**: la señal original
  que había planeado (tabla `usuarios`) resultó estar MAL — `usuarios`
  (junto con `sesiones`/`resets_contrasena`/`leads_informe`) ya viene
  incluida en el propio `db/schema.sql` del pipeline (adaptada del dump
  de referencia de la app web, sección "TABLAS DE LA APP WEB" del
  schema), así que existe después de CUALQUIER `--reset` normal, haya
  corrido la app web o no — con esa señal, el guard-rail se hubiese
  disparado siempre, inutilizando `--reset` por completo. La señal
  correcta es `schema_migrations` (la crea `db/migrate.ts` de la app web
  para trackear sus propias migraciones, no está en `schema.sql` del
  pipeline). **Verificado con 3 escenarios reales** contra Postgres con
  el schema real: reset normal sin `schema_migrations` (procede sin
  pedir el flag), reset con `schema_migrations` presente sin el flag
  (aborta, `usuarios`/`schema_migrations` quedan intactas), reset con el
  flag de confirmación (procede y borra todo, incluida
  `schema_migrations`, como se espera).

### B5. Sincronización de `dependencias_externas/` (proceso, no código)

- [x] `job diario/dependencias_externas/check_sync.py` (nuevo, `dc7f0da`):
  guarda un "baseline" del diff de cada copia contra su original
  (`.sync_baseline/*.diff`, versionado en git) y falla si ese diff cambia
  sin que alguien lo acepte a mano con `--update`. `normalizacion.py` es
  caso especial: sin baseline, exige igualdad byte a byte siempre.
  Documentado en el README de la carpeta.
  **Verificado**: baseline inicial generado después de revisar los 6
  diffs uno por uno (confirmé que cada uno es exactamente el wiring de
  rutas/paralelización ya documentado, nada inesperado); re-corrida en
  limpio pasa; test negativo (modificar `normalizacion.py` a mano)
  detecta el drift y falla con exit 1; restaurado sin dejar cambios.

---

## Orden sugerido

1. ~~Bloque B1~~, ~~Bloque B2~~, ~~Bloque A~~, ~~Bloque B3~~, ~~Bloque
   B4/B5~~ — todo el código y las migraciones ya están hechos y
   commiteados (ver arriba).

## Lo único que falta para poder instalar el timer contra producción

Todo lo que era código/config quedó resuelto. Lo que queda es 100%
del lado del usuario, fuera del alcance de lo que se puede hacer desde acá:

1. **Aplicar la migración 038 contra producción** (correr `db/migrate.ts` o
   el flujo de migraciones habitual del repo web) y revisar los `RAISE
   NOTICE` de sociedades candidatas a fusión manual que emite.
2. **Desplegar el `docker-compose.prod.yml` actualizado** en el servidor
   (con el puerto de Postgres publicado a loopback) — si el servidor ya
   está corriendo, esto implica un `docker compose up -d` que recrea el
   contenedor de Postgres.
3. **Instalar el job diario en el servidor** siguiendo
   `job diario/deploy/README.md` (clonar el repo actualizado, `.env`,
   copiar las 3 units de systemd —incluida la nueva
   `job-diario-alerta-fallo.service`—, corrida manual de prueba antes de
   activar el timer).
4. Crear la API key de Anthropic separada para el job diario (punto
   pendiente de B4).
5. Confirmar el reloj del servidor (`timedatectl`) para el horario del
   `.timer`.
