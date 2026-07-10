-- sociedades.id es bigint en el esquema real (no integer), así que el
-- parámetro de esta función tiene que matchear ese tipo — si no, PostGraphile
-- expone el argumento como Int en vez de BigInt y el front no puede pasarle
-- un id real (los ids de sociedad viajan como BigInt/string en GraphQL).
DROP FUNCTION IF EXISTS grafo_de_sociedad(integer);

CREATE FUNCTION grafo_de_sociedad(sociedad_id bigint)
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
    nivel2a AS (
        SELECT g.*
        FROM vw_grafo_aristas g
        JOIN sociedades_socias ss ON ss.id = g.destino_id
    ),
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

COMMENT ON FUNCTION grafo_de_sociedad(bigint) IS
    E'@name grafoDeSociedad\nRed de vínculos de una sociedad, a 2 saltos: quién está vinculado a ella, de qué otras empresas es socia, los socios de esas socias, y las otras sociedades de sus propios socios.';

REVOKE EXECUTE ON FUNCTION grafo_de_sociedad(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grafo_de_sociedad(bigint) TO boletin_api;
