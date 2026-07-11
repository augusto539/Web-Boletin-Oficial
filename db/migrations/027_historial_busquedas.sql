-- Historial de búsquedas de usuarios registrados: se guarda cada búsqueda
-- (por nombre/CUIT en el buscador rápido, o avanzada), tenga o no resultados
-- — el objetivo es que un admin pueda ver la ficha de un usuario con lo que
-- buscó, sin filtrar solo los "hits". Se loguea desde el backend REST
-- (/api/historial), no desde la API GraphQL de solo lectura.
CREATE TABLE historial_busquedas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    termino TEXT,
    resultados INTEGER NOT NULL DEFAULT 0,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX historial_busquedas_usuario_id_idx ON historial_busquedas (usuario_id, creado_el DESC);

COMMENT ON TABLE historial_busquedas IS E'@omit\nHistorial de búsquedas de usuarios registrados. No exponer en la API pública.';

GRANT SELECT, INSERT ON historial_busquedas TO boletin_auth;
GRANT USAGE ON SEQUENCE historial_busquedas_id_seq TO boletin_auth;

REVOKE ALL ON historial_busquedas FROM boletin_api;
REVOKE ALL ON historial_busquedas_id_seq FROM boletin_api;
