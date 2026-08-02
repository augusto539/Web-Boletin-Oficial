-- Historial de descargas de usuarios registrados: mismo criterio que
-- historial_busquedas (027_historial_busquedas.sql) -- se guarda cada
-- descarga de ficha (sociedad/persona, PDF o Excel) e informe (PDF), para
-- que un admin pueda ver en el perfil de un usuario qué descargó. Se
-- loguea desde el backend REST (/api/descargas), no desde la API GraphQL
-- de solo lectura.
--
-- entidad_id/entidad_nombre no llevan FK a sociedades/personas_fisicas a
-- propósito: los informes (departamentos, anuario, nichos) no tienen una
-- fila de origen (entidad_id queda NULL ahí), y entidad_nombre se guarda
-- tal cual al momento de la descarga para no depender de un JOIN futuro
-- contra una fila que podría cambiar de nombre o darse de baja (oculta).
CREATE TABLE historial_descargas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    entidad_id BIGINT,
    entidad_nombre TEXT,
    formato TEXT NOT NULL,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX historial_descargas_usuario_id_idx ON historial_descargas (usuario_id, creado_el DESC);

COMMENT ON TABLE historial_descargas IS E'@omit\nHistorial de descargas de usuarios registrados. No exponer en la API pública.';

GRANT SELECT, INSERT ON historial_descargas TO boletin_auth;
GRANT USAGE ON SEQUENCE historial_descargas_id_seq TO boletin_auth;

REVOKE ALL ON historial_descargas FROM boletin_api;
REVOKE ALL ON historial_descargas_id_seq FROM boletin_api;
