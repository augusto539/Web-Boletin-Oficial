-- Notificaciones: un usuario "vigila" una sociedad, una persona, o un
-- CUIT/DNI que todavía no tiene ficha en la base. Cuando el job diario carga
-- boletines nuevos le pega a POST /api/notificaciones/procesar (ver
-- backend/src/notificaciones.ts) y ese worker cruza lo cargado contra estas
-- suscripciones y manda un mail resumen por usuario.
--
-- Hasta esta migración /notificaciones era solo UI, guardando en
-- localStorage del navegador (ver el comentario que encabezaba
-- frontend/src/pages/Notificaciones.tsx).

CREATE TABLE suscripciones_notificacion (
    id           BIGSERIAL PRIMARY KEY,
    usuario_id   BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    -- Exactamente uno de estos tres define el objetivo (ver CHECK):
    sociedad_id  BIGINT REFERENCES sociedades(id) ON DELETE CASCADE,
    persona_id   BIGINT REFERENCES personas_fisicas(id) ON DELETE CASCADE,
    -- Vigilancia por documento: solo dígitos, CUIT (11) o DNI (7-8). Es para
    -- entidades que TODAVÍA no existen en la base; cuando aparecen, el worker
    -- pisa este modo seteando sociedad_id/persona_id (auto-vinculación), y a
    -- partir de ahí la suscripción sigue por id.
    documento    TEXT,
    -- Nombre que puso el usuario al vigilar un documento suelto (opcional):
    -- sin ficha en la base no hay de dónde sacar un nombre para mostrar.
    etiqueta     TEXT,
    activa       BOOLEAN NOT NULL DEFAULT TRUE,
    creada_el    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT suscripcion_un_solo_objetivo CHECK (
        (sociedad_id IS NOT NULL)::int
      + (persona_id  IS NOT NULL)::int
      + (documento   IS NOT NULL)::int = 1
    )
);

-- Dedupe por usuario. Van como índices parciales y no como un UNIQUE común
-- porque en Postgres dos filas con NULL en la columna del UNIQUE se
-- consideran distintas entre sí: un UNIQUE (usuario_id, sociedad_id) no
-- impediría suscribirse dos veces a la misma persona (sociedad_id NULL en
-- ambas filas).
CREATE UNIQUE INDEX suscripciones_notificacion_sociedad_idx
    ON suscripciones_notificacion (usuario_id, sociedad_id) WHERE sociedad_id IS NOT NULL;
CREATE UNIQUE INDEX suscripciones_notificacion_persona_idx
    ON suscripciones_notificacion (usuario_id, persona_id)  WHERE persona_id  IS NOT NULL;
CREATE UNIQUE INDEX suscripciones_notificacion_documento_idx
    ON suscripciones_notificacion (usuario_id, documento)   WHERE documento   IS NOT NULL;

-- El worker busca por objetivo (no por usuario) al cruzar contra un boletín.
CREATE INDEX suscripciones_notificacion_por_sociedad_idx
    ON suscripciones_notificacion (sociedad_id) WHERE activa AND sociedad_id IS NOT NULL;
CREATE INDEX suscripciones_notificacion_por_persona_idx
    ON suscripciones_notificacion (persona_id)  WHERE activa AND persona_id  IS NOT NULL;
CREATE INDEX suscripciones_notificacion_por_documento_idx
    ON suscripciones_notificacion (documento)   WHERE activa AND documento   IS NOT NULL;

-- Log de lo ya avisado. Es lo que hace idempotente al worker: se puede
-- re-procesar el mismo boletín (reintento del job, cron de respaldo, o el
-- disparador manual del panel admin) sin que a nadie le llegue dos veces el
-- mismo aviso.
CREATE TABLE notificaciones_enviadas (
    id             BIGSERIAL PRIMARY KEY,
    suscripcion_id BIGINT NOT NULL REFERENCES suscripciones_notificacion(id) ON DELETE CASCADE,
    boletin_id     INTEGER NOT NULL REFERENCES boletines(id) ON DELETE CASCADE,
    -- NOT NULL a propósito: todo aviso nace de un acto concreto (el alta de
    -- una sociedad también genera acto), y así el UNIQUE de abajo funciona
    -- sin toparse con el problema de los NULLs distintos entre sí.
    acto_id        BIGINT NOT NULL REFERENCES actos(id) ON DELETE CASCADE,
    enviada_el     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (suscripcion_id, acto_id)
);

COMMENT ON TABLE suscripciones_notificacion IS E'@omit\nSuscripciones a notificaciones de usuarios registrados. No exponer en la API pública.';
COMMENT ON TABLE notificaciones_enviadas IS E'@omit\nLog de notificaciones ya enviadas. No exponer en la API pública.';

-- El backend REST usa el pool boletin_auth (DATABASE_URL_AUTH, ver
-- backend/src/auth.ts), NO boletin_admin -- sin estos grants las queries
-- fallan con "permission denied" (ya pasó con gasto_extraccion_ia).
-- El UPDATE sobre suscripciones es para la auto-vinculación por CUIT/DNI.
GRANT SELECT, INSERT, UPDATE, DELETE ON suscripciones_notificacion TO boletin_auth;
GRANT SELECT, INSERT ON notificaciones_enviadas TO boletin_auth;
GRANT USAGE ON SEQUENCE suscripciones_notificacion_id_seq TO boletin_auth;
GRANT USAGE ON SEQUENCE notificaciones_enviadas_id_seq TO boletin_auth;

-- 028_admin_datos_completos.sql ya le dio a boletin_auth SELECT sobre
-- sociedades, personas_fisicas, vinculos y boletines, pero no sobre estas
-- tres, que el worker necesita para describir qué pasó (tipo de acto,
-- descripción, y el rol de los vínculos nuevos).
GRANT SELECT ON actos, tipos_acto, roles TO boletin_auth;

-- ALTER DEFAULT PRIVILEGES (ver 007_rls.sql) le da SELECT a boletin_api en
-- toda tabla nueva; se revoca acá porque son datos privados de usuarios, no
-- del Boletín Oficial (mismo criterio que usuarios/historial_busquedas).
REVOKE ALL ON suscripciones_notificacion FROM boletin_api;
REVOKE ALL ON notificaciones_enviadas FROM boletin_api;
REVOKE ALL ON suscripciones_notificacion_id_seq FROM boletin_api;
REVOKE ALL ON notificaciones_enviadas_id_seq FROM boletin_api;
