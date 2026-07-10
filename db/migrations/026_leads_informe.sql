-- Lead magnet de la landing: mail para el informe trimestral. Deliberadamente
-- liviana (sin password, sin cuenta) para minimizar la fricción de dejar el
-- mail. Se usa el mismo rol boletin_auth que usuarios/sesiones, mismo
-- criterio de confianza (escrituras públicas anónimas desde el frontend).
CREATE TABLE leads_informe (
    id BIGSERIAL PRIMARY KEY,
    mail TEXT NOT NULL UNIQUE,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE leads_informe IS E'@omit\nLeads del informe trimestral (landing). No exponer en la API pública.';

GRANT SELECT, INSERT ON leads_informe TO boletin_auth;
GRANT USAGE ON SEQUENCE leads_informe_id_seq TO boletin_auth;

-- ALTER DEFAULT PRIVILEGES (ver 007_rls.sql) le da SELECT a boletin_api en
-- toda tabla nueva; se revoca como capa extra además del @omit.
REVOKE ALL ON leads_informe FROM boletin_api;
REVOKE ALL ON leads_informe_id_seq FROM boletin_api;
