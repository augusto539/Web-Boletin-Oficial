-- El middleware SEO (backend/src/seo.ts) lee la base con boletin_api (el
-- mismo rol de solo lectura que usa PostGraphile) para armar el HTML
-- server-rendered de /informes/*. Sin RLS acá: son tablas de agregados
-- propias, sin columna "oculta" ni datos personales.
GRANT SELECT ON informe_departamentos_activos TO boletin_api;
GRANT SELECT ON informe_anuario TO boletin_api;
