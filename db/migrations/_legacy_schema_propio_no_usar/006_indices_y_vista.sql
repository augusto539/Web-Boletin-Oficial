-- Índices para búsqueda difusa (autocompletar / fuzzy match), no exact match.
CREATE INDEX idx_sociedades_nombre_normalizado_trgm
    ON sociedades USING gin (nombre_normalizado gin_trgm_ops);

CREATE INDEX idx_personas_nombre_normalizado_trgm
    ON personas_fisicas USING gin (nombre_normalizado gin_trgm_ops);

CREATE INDEX idx_vinculos_sociedad_id ON vinculos (sociedad_id);
CREATE INDEX idx_vinculos_persona_id ON vinculos (persona_id);
CREATE INDEX idx_vinculos_sociedad_miembro_id ON vinculos (sociedad_miembro_id);
CREATE INDEX idx_actos_sociedad_id ON actos (sociedad_id);

-- Unifica persona->sociedad, sociedad->sociedad y escribano->sociedad en un
-- solo formato para dibujar el grafo de relaciones de una empresa. Filtra
-- `oculta` explícitamente acá (no delega solo en RLS) porque las vistas en
-- Postgres no siempre heredan las políticas de la tabla base según el rol
-- que las creó.
CREATE VIEW vw_grafo_aristas AS
-- Persona física -> sociedad (socio, director, apoderado, etc.)
SELECT
    'persona' AS origen_tipo,
    p.id AS origen_id,
    p.nombre AS origen_nombre,
    'sociedad' AS destino_tipo,
    s.id AS destino_id,
    s.nombre AS destino_nombre,
    r.nombre AS relacion
FROM vinculos v
JOIN personas_fisicas p ON p.id = v.persona_id
JOIN sociedades s ON s.id = v.sociedad_id
JOIN roles r ON r.id = v.rol_id
WHERE p.oculta = FALSE AND s.oculta = FALSE

UNION ALL

-- Sociedad -> sociedad (una sociedad es socia/miembro de otra)
SELECT
    'sociedad' AS origen_tipo,
    sm.id AS origen_id,
    sm.nombre AS origen_nombre,
    'sociedad' AS destino_tipo,
    s.id AS destino_id,
    s.nombre AS destino_nombre,
    r.nombre AS relacion
FROM vinculos v
JOIN sociedades sm ON sm.id = v.sociedad_miembro_id
JOIN sociedades s ON s.id = v.sociedad_id
JOIN roles r ON r.id = v.rol_id
WHERE sm.oculta = FALSE AND s.oculta = FALSE

UNION ALL

-- Escribano -> sociedad (interviniente en algún acto de esa sociedad)
SELECT
    'escribano' AS origen_tipo,
    e.id AS origen_id,
    e.nombre AS origen_nombre,
    'sociedad' AS destino_tipo,
    s.id AS destino_id,
    s.nombre AS destino_nombre,
    ta.nombre AS relacion
FROM actos a
JOIN escribanos e ON e.id = a.escribano_id
JOIN sociedades s ON s.id = a.sociedad_id
JOIN tipos_acto ta ON ta.id = a.tipo_acto_id
WHERE s.oculta = FALSE;
