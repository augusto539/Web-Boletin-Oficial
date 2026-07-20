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

### B1. Repo del pipeline — poner al día lo que hoy solo vive en el working tree

- [ ] Commitear en el repo **"Info Boletin Oficial"** los cambios sin
  commitear que ya contienen el fix de departamentos y el wiring de
  `BOLETIN_ARCA_DIR`:
  - `migrar_a_postgres.py`
  - `post_procesar_excel.py` (raíz)
  - `job diario/transformaciones.py`
  - `job diario/dependencias_externas/post_procesar_excel.py`
  - Sin esto, un `git clone` fresco en el servidor se lleva la versión
    con el bug de departamentos y sin el override de padrones ARCA.
- [ ] Des-trackear `job diario/dependencias_externas/__pycache__/*.pyc`
  (el `.gitignore` de `job diario/` solo cubre `/__pycache__/` de primer
  nivel, no el de la subcarpeta).

### B2. Conectividad Postgres en producción

- [ ] Publicar el puerto de Postgres a loopback en
  [`docker-compose.prod.yml`](../docker-compose.prod.yml) del servidor:
  agregar `ports: ["127.0.0.1:5432:5432"]` al servicio `postgres` (no
  `0.0.0.0`, no exponer a internet).
- [ ] Ajustar `job-diario.service`:
  - `After=network-online.target postgresql.service` → cambiar
    `postgresql.service` por `docker.service` (Postgres corre en
    contenedor, no como service nativo).
  - Revisar el caso "servidor reinicia justo antes de las 15:30 UTC": con
    `Persistent=true`, el timer podría dispararse antes de que
    `docker compose` haya levantado Postgres — considerar un
    `ExecStartPre` que espere el healthcheck, o aceptar el primer fallo
    y que el reintento del día siguiente lo resuelva.

### B3. Manejo de errores de extracción (pérdida silenciosa de boletines)

- [ ] En `job diario/dependencias_externas/extraer_sociedades.py`, el
  `except Exception: ... return []` genérico de `procesar_pdf` hace que
  cualquier error no relacionado a créditos/permisos se interprete como
  "sin sociedades" — y `_registrar_pendientes_sin_datos()` en
  `run_diario.py` lo marca como cargado para siempre. Cambiar para que
  propague (o escriba una lista de "PDFs fallidos" que `run_diario`
  excluya del registro-sin-datos y haga fallar la corrida).

### B4. Ajustes chicos de robustez (bajo riesgo, alto valor)

- [ ] `run_diario.py:_determinar_pendientes` — agregar un tope (p. ej.
  abortar y alertar si `len(pendientes) > 5`) como fusible de costos si
  `ids_boletines.json` se corrompe o no se sincronizó y el descubrimiento
  arranca desde la semilla original.
- [ ] `cargar_incremental.py:cargar()` — en el `finally`, hacer
  `conn.rollback()` antes del `pg_advisory_unlock` para que una excepción
  temprana (antes del try interno) no quede enmascarada por
  `InFailedSqlTransaction`.
- [ ] `procesar_boletin` en `cargar_incremental.py` — el CUIT candidato
  para `resolver_sociedad` sale solo de la primera fila del grupo;
  `_construir_sociedad_nueva` en cambio toma el CUIT de cualquier fila.
  Si la primera fila no trae CUIT pero otra sí, y ese CUIT ya existe,
  el `INSERT` viola el UNIQUE y hace rollback del boletín entero. Usar
  el primer CUIT no vacío del grupo en los dos lugares.
- [ ] `transformaciones.py:resolver_sociedad` — agregar un "upgrade" de
  campos NULL (CUIT, tipo, domicilio, capital) cuando la sociedad ya
  existe, igual que ya hace `resolver_persona._upgrade` — así un stub
  promovido deja de quedar vacío cuando llega su constitución real.
- [ ] `Lookup.get` en `transformaciones.py` — inserta en catálogo
  (`tipos_acto`, `roles`) cualquier string nuevo devuelto por el LLM sin
  revisión. Agregar al menos un log cuando se crea catálogo nuevo, para
  poder auditar.
- [ ] `TimeoutStartSec=1800` en `job-diario.service` puede quedar corto
  (descarga de padrones ~200MB + extracción de varios PDFs tras un
  feriado). Subir a 3600 y considerar un `OnFailure=` que alerte —
  si systemd mata el proceso, no pasa por el `except` de Python y no
  hay mail ni heartbeat en falso.
- [ ] `ALERTA_EMAIL_FROM` — cambiar de `onboarding@resend.dev` (solo
  entrega al dueño de la cuenta Resend) a
  `Job Diario <no-responder@ingcome.com.ar>`, ya verificado por la web.
- [ ] Crear una API key de Anthropic separada para el job diario (mismo
  workspace o uno propio), para atribución de gasto — hoy no hay
  colisión de uso porque la web no usa Anthropic, pero conviene separar
  igual antes de que el volumen crezca.
- [ ] Guard-rail en `crear_tablas.py --reset`: negarse a resetear si ya
  existe la tabla `usuarios` (señal de que la app web ya corrió sus
  migraciones), salvo flag explícito adicional.

### B5. Sincronización de `dependencias_externas/` (proceso, no código)

- [ ] Documentar/crear un chequeo (script chico) que diffee cada copia en
  `job diario/dependencias_externas/` contra su original en la raíz del
  repo, ignorando los bloques de divergencia ya conocidos (env vars de
  rutas, paralelización), y falle si aparece drift nuevo no revisado.
  Para `normalizacion.py`, que debe ser idéntico byte a byte, exigir
  igualdad exacta. Correrlo a mano antes de cada release.

---

## Orden sugerido

1. Bloque B1 (commitear lo que ya existe) — desbloquea todo lo demás,
   es el más urgente y el más simple.
2. Bloque B2 (conectividad) — sin esto no hay corrida de prueba posible.
3. Bloque A (normalización) — antes de la primera corrida real contra
   producción, para no generar duplicados desde el día uno.
4. Bloque B3 (manejo de errores) — antes de confiar el timer sin
   supervisión.
5. Bloque B4/B5 — pueden ir en paralelo o después de la primera corrida
   supervisada, no bloquean la activación inicial si hay seguimiento
   manual los primeros días.
