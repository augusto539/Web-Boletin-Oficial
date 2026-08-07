-- "¿Qué informe estás buscando?" en /informes: cualquiera puede pedir un
-- informe nuevo sin necesidad de cuenta. Mismo patrón que leads_informe
-- (027) e historial_busquedas: tabla de solo-escritura pública vía
-- boletin_auth, lectura solo desde el panel de admin.
CREATE TABLE solicitudes_informe (
    id BIGSERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    mail TEXT,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX solicitudes_informe_creado_el_idx ON solicitudes_informe (creado_el DESC);

COMMENT ON TABLE solicitudes_informe IS E'@omit\nPedidos de informes nuevos desde /informes. No exponer en la API pública.';

GRANT SELECT, INSERT ON solicitudes_informe TO boletin_auth;
GRANT USAGE ON SEQUENCE solicitudes_informe_id_seq TO boletin_auth;

REVOKE ALL ON solicitudes_informe FROM boletin_api;
REVOKE ALL ON solicitudes_informe_id_seq FROM boletin_api;
