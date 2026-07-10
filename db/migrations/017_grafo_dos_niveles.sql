-- Extiende el grafo de una sociedad a un segundo nivel:
--   - de cada sociedad que es socia de esta, se agregan SUS propios socios/
--     autoridades/escribano (ej: los socios de "Inversiones del Oeste").
--   - de cada persona vinculada a esta, se agregan las OTRAS sociedades de
--     las que también forma parte (ej: si un socio también es socio de
--     "Viñedos del Sur", esa sociedad aparece como nodo de 2º nivel).
-- La firma no cambia, así que CREATE OR REPLACE conserva los GRANT existentes.
CREATE OR REPLACE FUNCTION grafo_de_sociedad(sociedad_id integer)
RETURNS SETOF vw_grafo_aristas AS $$
    WITH nivel1 AS (
        SELECT *
        FROM vw_grafo_aristas
        WHERE destino_id = sociedad_id
           OR (origen_tipo = 'sociedad' AND origen_id = sociedad_id)
    ),
    sociedades_socias AS (
        SELECT DISTINCT origen_id AS id
        FROM nivel1
        WHERE origen_tipo = 'sociedad' AND origen_id <> sociedad_id
    ),
    personas_vinculadas AS (
        SELECT DISTINCT origen_id AS id
        FROM nivel1
        WHERE origen_tipo = 'persona'
    ),
    -- 2º nivel (a): socios/autoridades/escribano de las sociedades socias.
    nivel2a AS (
        SELECT g.*
        FROM vw_grafo_aristas g
        JOIN sociedades_socias ss ON ss.id = g.destino_id
    ),
    -- 2º nivel (b): otras sociedades de las que forman parte los socios de esta.
    nivel2b AS (
        SELECT g.*
        FROM vw_grafo_aristas g
        JOIN personas_vinculadas pv ON pv.id = g.origen_id AND g.origen_tipo = 'persona'
        WHERE g.destino_id <> sociedad_id
    )
    SELECT * FROM nivel1
    UNION
    SELECT * FROM nivel2a
    UNION
    SELECT * FROM nivel2b;
$$ LANGUAGE sql STABLE;
