-- Costo estimado de la API de Anthropic usada por el job diario para
-- extraer sociedades de cada boletín (ver extraer_sociedades.py en el repo
-- job-diario-boletin-oficial, función _costo_estimado()). Alimenta la
-- tarjeta "Gasto API" del panel de admin.
--
-- Reemplaza a la Usage & Cost Admin API de Anthropic: esa API requiere una
-- Admin API key, que solo existe para cuentas tipo Organización -- no
-- disponible para la cuenta individual de este proyecto. El estimado propio
-- (ya calculado por extraer_sociedades.py con el pricing de Haiku) es la
-- alternativa sin esa dependencia.
--
-- Una fila por CORRIDA del job diario, no por boletín: extraer_sociedades.py
-- procesa todos los PDFs de una corrida en un solo proceso y no desglosa el
-- costo por boletín individual (normalmente 1 PDF/corrida de todos modos).
CREATE TABLE gasto_extraccion_ia (
    id                  bigserial PRIMARY KEY,
    corrida_en          timestamptz NOT NULL DEFAULT now(),
    llamadas            integer NOT NULL,
    tokens_input        integer NOT NULL,
    tokens_output       integer NOT NULL,
    tokens_cache_write  integer NOT NULL,
    tokens_cache_read   integer NOT NULL,
    costo_usd           numeric(10,4) NOT NULL
);

CREATE INDEX idx_gasto_extraccion_ia_corrida_en ON gasto_extraccion_ia (corrida_en);

-- El panel de admin (backend/src/admin.ts) consulta esta tabla con el rol
-- boletin_auth (mismo patrón que 028_admin_datos_completos.sql) -- sin este
-- grant, /api/admin/gasto-anthropic falla con "permission denied". No hace
-- falta política RLS: esta tabla no tiene columna "oculta" ni datos por
-- sociedad/persona, es un log de corridas del job diario.
GRANT SELECT ON gasto_extraccion_ia TO boletin_auth;
