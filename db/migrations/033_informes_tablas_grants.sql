-- Las tablas de 031_informes.sql las crea el rol owner de las migraciones
-- (boletin_admin) pero las escribe/lee en runtime boletin_auth (ver
-- DATABASE_URL_AUTH en backend/src/auth.ts, que es el pool que usa
-- backend/src/informes.ts) — sin este GRANT explícito, crear una tabla
-- nueva no le da acceso automático a ningún otro rol.
GRANT SELECT, INSERT, UPDATE ON informe_departamentos_activos TO boletin_auth;
GRANT SELECT, INSERT, UPDATE ON informe_anuario TO boletin_auth;
