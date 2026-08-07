# Plan — Refresco semanal de ARCA, registro de cambios y notificaciones

Sábados 03:00 (hora Mendoza): descargar y procesar los padrones ARCA,
comparar contra toda la base, **registrar** los cambios detectados y
**notificar** a los usuarios que siguen esas sociedades.

Escrito el 2026-08-05 tras revisar los tres repos. Nada implementado
todavía — este documento es para revisar antes de escribir código.

---

## 1. Punto de partida: la mitad ya está escrita

El refresco de padrones **ya existe y está deliberadamente apagado**,
esperando exactamente este job. En `run_diario.py` del repo
`job-diario-boletin-oficial`:

```python
# Deshabilitado a propósito (...): la descarga+parseo de los padrones ARCA
# se va a mover a un job semanal aparte (sábados 3am), no a correr más
# desde acá.
# import actualizar_padrones_arca
```

- `actualizar_padrones_arca.py` (descarga los 2 zips: AFIP con URL fija +
  Registro Nacional resuelto por la API de CKAN) — **listo, sin usar**.
- `dependencias_externas/actualizar_padrones.py` → `preparar_padron.py` /
  `limpiar_padron.py` (descomprimen, filtran, normalizan) — **listos**.
- El job diario hoy reusa indefinidamente los CSV ya presentes en el
  volumen, sin refrescarlos nunca.

Lo nuevo de este plan es todo lo que viene **después** de tener los CSV
frescos: comparar, registrar y notificar.

## 2. Qué datos pueden cambiar

Los dos padrones producen exactamente 5 campos que ya viven en la base:

| Fuente | Archivo | Clave de cruce | Campo en la base |
|---|---|---|---|
| Padrón Contribuyentes (AFIP) | `Padrón sociedades.csv` (536k filas, todo el país) | CUIT exacto | `sociedades.estado_ganancias_id` |
| ídem | ídem | CUIT exacto | `sociedades.estado_iva_id` |
| ídem | ídem | CUIT exacto | `sociedades.empleador` |
| Registro Nacional Sociedades | `CLAEsMendoza.csv` (138k filas, solo Mendoza) | nombre normalizado | `sociedades.cuit` (¡el alta de CUIT!) |
| ídem | ídem | CUIT | `sociedad_actividades` (CLAE + estado AC/BD) |

Valores reales (verificados sobre los CSV actuales):

- `ganancias`: Activo (393k) · No Inscripto (96k) · Exento (25k) · No Corresponde (22k)
- `iva`: Resp. Inscripto (385k) · Exento (105k) · No Inscripto (42k) · No Alcanzado (3k) · +2 marginales
- `empleador`: Sí (290k) · No (246k)

Son conjuntos chicos y cerrados, que ya mapean a los catálogos existentes
(`estados_ganancias`, `estados_iva`) vía la clase `Lookup`.

**El cambio más valioso comercialmente** es probablemente
`empleador: No → Sí` (la empresa empezó a tener empleados) y el alta de
CUIT (la sociedad recién constituida ya está inscripta). Eso es
inteligencia de negocio real, no un dato administrativo.

## 3. La decisión técnica que define todo: el diff va en SQL, no en Python

**Restricción dura**: el servidor es una `VM.Standard.E2.1.Micro` con
**956Mi de RAM totales**, compartidos con postgres + app + caddy. El
contenedor del job está capado a 800m. Y hay antecedente documentado en
`deploy/job-diario.service`: parsear el Registro Nacional con pandas
"fue lo que de verdad tumbó el servidor", dejándolo sin responder ni por
SSH.

El código actual de cruce (`post_procesar_excel.py`) carga los padrones
**enteros a diccionarios de Python** (`_cargar_padron_cuits`,
`_cargar_registro_nacional`). Eso funciona para enriquecer 5 filas de un
boletín, pero **no** para comparar contra la base entera: 536k filas en
un dict de dicts se va tranquilamente a 300–500 MB.

**Propuesta: cargar los CSV a tablas de staging en Postgres (`COPY`) y
hacer el diff con SQL.**

- La memoria del proceso Python queda plana (COPY es streaming).
- El diff pasa a ser un JOIN indexado — Postgres es bueno justo en eso.
- Queda auditable y reejecutable.
- `COPY ... WITH (FORMAT csv)` respeta el quoting, necesario porque las
  denominaciones traen comas adentro (verificado: rompe cualquier parseo
  naive por coma).

Costo: ~60 MB de CSV → estimado 100–150 MB de tablas en el volumen de
Postgres. **A verificar el espacio libre real en el servidor antes de
implementar.**

### El riesgo de memoria que queda

`limpiar_padron.py` hace `pd.read_csv()` del Registro Nacional **completo,
sin chunking** (línea 66) — ese es el paso que tumbó el servidor.
`preparar_padron.py` en cambio ya streamea línea por línea (`for linea in
f`) y solo arma el DataFrame con lo filtrado: ese está bien.

Opciones para `limpiar_padron.py`, a decidir en implementación:
1. Reescribirlo con `chunksize=` y filtrar por Mendoza de a bloques
   (cambio chico, elimina el riesgo).
2. Dejarlo y confiar en el límite del contenedor + swap, aprovechando que
   corre sábado 3am sin nada más compitiendo.

Recomiendo (1): es media hora de trabajo y saca del medio el único
antecedente conocido de caída total del servidor.

## 4. Esquema nuevo

### Dónde viven las tablas

Precedente claro y ya probado: **`gasto_extraccion_ia`** (migración 039)
es una tabla que **escribe el job** pero **crea la migración de la web** y
**lee el panel de admin**. Se sigue ese mismo patrón, porque en la
práctica el runner de migraciones de la web (`db/migrate.ts`) es lo único
que corre automáticamente contra producción en cada deploy —
`crear_tablas.py` del pipeline solo aplica `schema.sql` en instalaciones
desde cero.

O sea: **todas las tablas nuevas van como migración en el repo web**, y el
job (que conecta como `boletin_admin`, el owner) las escribe.

### Las tablas

```sql
-- Una fila por corrida semanal. Sirve de bitácora, de fuente para el
-- chequeo de sanidad contra la semana anterior, y para el panel de admin.
CREATE TABLE corridas_arca (
    id            bigserial PRIMARY KEY,
    iniciada_el   timestamptz NOT NULL DEFAULT now(),
    terminada_el  timestamptz,
    estado        text NOT NULL DEFAULT 'corriendo',  -- corriendo|ok|abortada|error
    filas_padron  integer,
    filas_clae    integer,
    cambios       integer,
    detalle       text
);

-- Staging: se TRUNCA y recarga por COPY cada sábado. UNLOGGED = sin WAL
-- (más rápido y no infla los backups); es data descartable por definición.
CREATE UNLOGGED TABLE arca_staging_padron (
    cuit      varchar(11) PRIMARY KEY,
    ganancias text,
    iva       text,
    empleador text
);
CREATE UNLOGGED TABLE arca_staging_clae (
    cuit              varchar(11) NOT NULL,
    denominacion_norm text,
    actividad_codigo  text,
    actividad_orden   integer,
    actividad_estado  varchar(2)
);

-- La auditoría que pediste: qué cambió, cuándo, de qué a qué.
CREATE TABLE cambios_arca (
    id             bigserial PRIMARY KEY,
    corrida_id     bigint NOT NULL REFERENCES corridas_arca(id) ON DELETE CASCADE,
    sociedad_id    bigint NOT NULL REFERENCES sociedades(id) ON DELETE CASCADE,
    campo          text NOT NULL,   -- empleador|estado_iva|estado_ganancias|cuit|actividad
    valor_anterior text,
    valor_nuevo    text,
    -- Separa "lo registro" de "lo aviso": permite auditar TODO sin mandar
    -- mail por ruido (ver §6).
    notificable    boolean NOT NULL DEFAULT true,
    detectado_el   timestamptz NOT NULL DEFAULT now()
);
```

## 5. El problema de las notificaciones (y por qué no alcanza con la tabla actual)

El sistema de notificaciones existente (migración 041 +
`backend/src/notificaciones.ts`) está **anclado al acto**:

```sql
CREATE TABLE notificaciones_enviadas (
    suscripcion_id BIGINT NOT NULL ...,
    boletin_id     INTEGER NOT NULL REFERENCES boletines(id),
    acto_id        BIGINT  NOT NULL REFERENCES actos(id),
    UNIQUE (suscripcion_id, acto_id)
);
```

Un cambio de ARCA **no tiene acto ni boletín**. Y no alcanza con hacer
esas columnas nullables: el propio comentario de la migración 041 explica
por qué, para las suscripciones, tuvieron que usar índices parciales en
vez de un UNIQUE común —

> *"en Postgres dos filas con NULL en la columna del UNIQUE se consideran
> distintas entre sí"*

Hacer `acto_id` nullable reintroduce exactamente ese bug **en el UNIQUE
que hace idempotente al worker**, que es lo que hoy evita que a alguien le
llegue dos veces el mismo aviso.

**Propuesta: una tabla hermana**, dejando ambos UNIQUE totales y simples:

```sql
CREATE TABLE notificaciones_cambio_enviadas (
    id             bigserial PRIMARY KEY,
    suscripcion_id bigint NOT NULL REFERENCES suscripciones_notificacion(id) ON DELETE CASCADE,
    cambio_id      bigint NOT NULL REFERENCES cambios_arca(id) ON DELETE CASCADE,
    enviada_el     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (suscripcion_id, cambio_id)
);
```

### Worker nuevo, no modificado

`procesarNotificaciones(idsPdf)` es boletín-shaped de punta a punta. Se
agrega un hermano `procesarCambiosArca(corridaId)` en el mismo módulo,
que reusa el patrón ya probado:

- advisory lock propio (**727004**; 727001 = `cargar_incremental`,
  727002 = notificaciones, 727003 = `reproceso_historico`),
- agrupa por usuario → **un** mail resumen,
- registra en la tabla nueva **solo si el mail salió** (si Resend falla,
  se reintenta la semana que viene),
- respeta `NOT soc.oculta` (habeas data) — fácil de olvidar.

Endpoint nuevo `POST /api/notificaciones/procesar-cambios`, con el mismo
`JOB_WEBHOOK_TOKEN` y `timingSafeEqual` que ya usa `/procesar`.

Y un tipo de mail nuevo en `mail.ts` (`NovedadCambioArca` +
`enviarNotificacionCambiosArca`): el contenido no se parece en nada al de
un acto (no hay escribano, ni participantes, ni PDF de boletín).

## 6. Riesgos y válvulas de seguridad

Esto es lo que más me preocupa del pedido, porque el modo de fallo es
ruidoso y va directo al mail de los usuarios.

### R1 — Una descarga parcial/corrupta vacía media base y spamea a todos
Si AFIP cambia el formato o la descarga se corta, un diff naive concluye
"5.000 sociedades perdieron su estado de IVA" → UPDATE masivo + miles de
mails. Mitigaciones, todas antes de aplicar nada:
- **Chequeo de sanidad**: las filas del staging deben ser ≥80% de las de
  la corrida anterior (de ahí `corridas_arca`). Si no, abortar y alertar.
- **La ausencia no es un cambio**: que un CUIT no aparezca en el padrón
  nuevo **no** se trata como "cambió a NULL". Solo cuenta valor→otro valor.
- **Tope de cambios**: si el diff supera un umbral (ej. 5% de las
  sociedades), abortar y alertar en vez de notificar — eso es señal de que
  cambió el padrón, no la realidad.

### R2 — No sabemos cuánto ruido tiene ARCA semana a semana
Nadie midió todavía cuántos cambios reales produce una semana. Si son 50,
perfecto; si son 8.000, el diseño de notificaciones necesita otra forma.
**Recomiendo fuertemente correr 2 semanas en modo observación** (registra
en `cambios_arca`, no manda un solo mail) antes de encender los avisos.
Es gratis y convierte una incógnita en un dato.

### R3 — Alta de CUIT y el UNIQUE
`sociedades.cuit` es UNIQUE. El alta de CUIT se resuelve **por nombre**
(`nombre_normalizado = denominacion_norm`), y ya sabemos que puede haber
sociedades distintas compartiendo `nombre_normalizado` — es justo lo que
detecta el diagnóstico que dejamos en la migración 038. Si dos filas
matchean el mismo CUIT nuevo, el UPDATE explota. Hay que resolver
explícitamente (asignar solo cuando el match es único; registrar el resto
como "ambiguo" para revisión manual).

Nota: que el join por nombre funcione depende de que
`sociedades.nombre_normalizado` y `denominacion_norm` del CSV se calculen
igual — que es exactamente lo que unificó la migración 038. Sin ese
trabajo previo, este cruce fallaría en silencio.

### R4 — Divergencia deliberada con el job diario
`_upgrade_sociedad` (job diario) solo **rellena NULLs** con `COALESCE`.
Este job semanal, en cambio, **pisa** con la verdad fresca de ARCA. Es una
diferencia intencional que hay que dejar documentada en el código, o el
próximo que lo lea va a pensar que es un bug.

## 7. Flujo del job semanal

Archivo nuevo `refresco_arca.py` en `job-diario-boletin-oficial`:

```
1. advisory lock 727004
2. INSERT corridas_arca (estado='corriendo')
3. actualizar_padrones_arca.actualizar()      # ya existe: descarga + limpieza
4. TRUNCATE staging + COPY de los 2 CSV
5. chequeos de sanidad (R1)  -> si fallan: estado='abortada' + alerta, salir
6. UNA transacción:
     - INSERT INTO cambios_arca  (el diff)
     - UPDATE sociedades / sync sociedad_actividades
7. corridas_arca -> estado='ok' + contadores
8. webhook -> POST /api/notificaciones/procesar-cambios {corridaId}
9. mail de resumen de la corrida (reusa el mecanismo de _enviar_resultado)
```

El paso 6 en una sola transacción es lo que garantiza que nunca quede un
cambio registrado que no se aplicó (ni al revés).

### Despliegue

- `deploy/refresco-arca.timer` → `OnCalendar=Sat *-*-* 06:00:00`
  (06:00 UTC = 03:00 Mendoza; el server está en UTC, mismo criterio que el
  timer diario). Sin colisión con el diario, que corre `Mon..Fri 15:30`.
- `deploy/refresco-arca.service` → mismo patrón que `job-diario.service`
  (mismo contenedor, distinto `ENTRYPOINT`/comando), con su `OnFailure=`
  apuntando a la unit de alerta que ya existe.
- Probablemente convenga un `--memory` más generoso que el del diario para
  el paso de limpieza de padrones, salvo que se haga el chunking de §3.

## 8. Decisiones tomadas (2026-08-05)

1. **Los cambios SÍ se muestran en la ficha pública** (`/sociedad/:id`),
   además del mail y el panel de admin. Ver §8.1 — suma trabajo de
   backend/frontend y una consideración de habeas data.
2. **Notifican los 4 tipos de cambio**: alta de CUIT, `empleador`, estado
   IVA/Ganancias, y actividades CLAE (alta/baja). Se excluye igual el
   ruido puro: reordenamientos de `actividad_orden` y cambios de
   descripción se registran con `notificable = false`.
3. **Las suscripciones por PERSONA no reciben cambios de ARCA.** Solo las
   de sociedad (y las de CUIT suelto, que se auto-vinculan a la sociedad).
4. **Baja del padrón**: se registra pero no notifica (falso positivo más
   probable de una descarga parcial).

### 8.1 Lo que implica exponerlo en la ficha pública

- `GRANT SELECT ON cambios_arca TO boletin_api` + `corridas_arca` si se
  quiere mostrar la fecha de la última verificación.
- **Habeas data — decidir explícitamente.** Hoy `actos` y
  `sociedad_actividades` se exponen por PostGraphile **sin RLS propia**:
  solo `sociedades` y `personas_fisicas` tienen la política
  `oculta = FALSE` (migración 007). Si `cambios_arca` sigue ese
  precedente, las filas de cambio de una sociedad **oculta** quedarían
  consultables por la API pública, revelando que existe y que está
  activa, aunque su ficha esté dada de baja.
  **Recomiendo agregarle RLS a `cambios_arca`** (política análoga a la de
  007, filtrando por la sociedad no oculta). Es barato y respeta la
  intención de la política existente, no solo su letra. Es una mejora
  sobre el precedente, no una copia.
- Frontend: bloque nuevo en `Sociedad.tsx`, alimentado por la conexión
  que PostGraphile genera sola a partir de la FK a `sociedades`.
- Bonus real: es contenido fresco y fechado en cada ficha — bueno para
  SEO, alineado con el trabajo de `Informes`/`seo.ts`.

## 9. Orden de implementación sugerido

| Fase | Qué | Por qué en este orden |
|---|---|---|
| 1 | Migración con las 5 tablas (+RLS de §8.1) + `limpiar_padron.py` con chunking | Base de todo, sin efectos visibles |
| 2 | `refresco_arca.py` hasta el paso 6, **en modo observación** (registra en `cambios_arca`, NO aplica UPDATE ni notifica) + timer | Mide el ruido real de ARCA (R2) sin arriesgar nada |
| 3 | *(esperar 2 corridas y mirar los datos)* | Decide el diseño final de notificaciones con datos, no con suposiciones |
| 4 | Activar el UPDATE a `sociedades` | Ya con confianza en el diff |
| 5 | Línea de tiempo en la ficha pública (grants + `Sociedad.tsx`) | Ya hay datos reales que mostrar; independiente de los mails |
| 6 | Worker de notificaciones + endpoint + mail nuevo | Lo último, cuando ya sabemos qué volumen tiene |

La fase 3 no es burocracia: es la diferencia entre encender los mails
sabiendo qué va a pasar y encenderlos a ciegas. Las fases 5 y 6 son
independientes entre sí — se pueden hacer en cualquier orden, o en
paralelo.
