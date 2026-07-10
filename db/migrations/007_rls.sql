-- Rol de solo lectura que usa PostGraphile para exponer la API. Nunca es
-- owner de las tablas, así que las políticas RLS se le aplican siempre
-- (a diferencia del owner/rol de migraciones, que las bypassea por defecto).
-- La contraseña de acá es solo para desarrollo local; en producción se
-- reemplaza vía variable de entorno / secret manager, nunca en el SQL.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'boletin_api') THEN
        CREATE ROLE boletin_api LOGIN PASSWORD 'boletin_api_dev_password';
    END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO boletin_api;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO boletin_api;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO boletin_api;

ALTER TABLE sociedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas_fisicas ENABLE ROW LEVEL SECURITY;

-- Requisito legal/de privacidad (habeas data), no opcional: ninguna consulta
-- de boletin_api puede ver una fila con oculta = true.
CREATE POLICY sociedades_ocultar_habeas_data ON sociedades
    FOR SELECT
    TO boletin_api
    USING (oculta = FALSE);

CREATE POLICY personas_fisicas_ocultar_habeas_data ON personas_fisicas
    FOR SELECT
    TO boletin_api
    USING (oculta = FALSE);
