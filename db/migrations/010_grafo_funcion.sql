-- Aristas conectadas a una sociedad, en ambos sentidos:
--   - destino_id = sociedad_id       -> quién es socio/director/apoderado/escribano DE esta sociedad
--   - origen_id = sociedad_id (y origen_tipo = 'sociedad') -> empresas de las que esta sociedad es socia
-- vw_grafo_aristas ya filtra oculta=false, así que esta función hereda ese filtro.
CREATE FUNCTION grafo_de_sociedad(sociedad_id integer)
RETURNS SETOF vw_grafo_aristas AS $$
    SELECT *
    FROM vw_grafo_aristas
    WHERE destino_id = sociedad_id
       OR (origen_tipo = 'sociedad' AND origen_id = sociedad_id);
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION grafo_de_sociedad(integer) IS
    E'@name grafoDeSociedad\nRed de vínculos de una sociedad: quién está vinculado a ella y de qué otras empresas es socia.';

REVOKE EXECUTE ON FUNCTION grafo_de_sociedad(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grafo_de_sociedad(integer) TO boletin_api;
