-- boletin_auth (el rol que usa nuestro backend, ver DATABASE_URL_AUTH en
-- backend/src/auth.ts) ya podía leer sociedades/domicilios/vinculos/etc.
-- para el panel admin, pero le faltaban estas 5 tablas — necesarias para
-- el precómputo de /informes (backend/src/informes.ts): localidades y
-- departamentos para el join geográfico, actos y tipos_acto para la fecha
-- de constitución real (más confiable que sociedades.fecha_constitucion,
-- que puede venir NULL), tipos_sociedad para el desglose del anuario.
GRANT SELECT ON localidades TO boletin_auth;
GRANT SELECT ON departamentos TO boletin_auth;
GRANT SELECT ON actos TO boletin_auth;
GRANT SELECT ON tipos_acto TO boletin_auth;
GRANT SELECT ON tipos_sociedad TO boletin_auth;
