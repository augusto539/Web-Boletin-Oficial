-- El panel de admin necesita ver y ocultar/desocultar sociedades y personas
-- (incluidas las ya ocultas, que boletin_api nunca ve por habeas data — ver
-- 007_rls.sql). boletin_auth es un rol de solo uso interno del backend,
-- jamás expuesto vía GraphQL público, y todas las rutas /api/admin/* ya
-- pasan por requireAdmin(). Se le da lectura completa a las tablas del
-- dominio (para armar estadísticas y listados) y una política RLS propia
-- que no filtra por oculta, más permiso de escritura acotado a esa sola
-- columna (nunca puede tocar el resto de los datos scrapeados).

GRANT SELECT ON sociedades, personas_fisicas, vinculos, domicilios,
    sociedad_actividades, actividades_clae, grupos_clae, boletines
    TO boletin_auth;

GRANT UPDATE (oculta) ON sociedades TO boletin_auth;
GRANT UPDATE (oculta) ON personas_fisicas TO boletin_auth;

CREATE POLICY sociedades_boletin_auth_select ON sociedades
    FOR SELECT
    TO boletin_auth
    USING (true);

CREATE POLICY sociedades_boletin_auth_update ON sociedades
    FOR UPDATE
    TO boletin_auth
    USING (true)
    WITH CHECK (true);

CREATE POLICY personas_fisicas_boletin_auth_select ON personas_fisicas
    FOR SELECT
    TO boletin_auth
    USING (true);

CREATE POLICY personas_fisicas_boletin_auth_update ON personas_fisicas
    FOR UPDATE
    TO boletin_auth
    USING (true)
    WITH CHECK (true);
