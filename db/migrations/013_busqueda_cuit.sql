-- Búsqueda por CUIT: compara solo dígitos (ignora guiones/espacios) para que
-- "30715552221", "30-71555222-1" o un fragmento encuentren la misma sociedad.
CREATE FUNCTION buscar_sociedades_por_cuit(termino text, limite integer DEFAULT 20)
RETURNS SETOF sociedades AS $$
    SELECT *
    FROM sociedades
    WHERE oculta = FALSE
      AND cuit IS NOT NULL
      AND regexp_replace(cuit, '\D', '', 'g') ILIKE '%' || regexp_replace(termino, '\D', '', 'g') || '%'
    ORDER BY nombre
    LIMIT limite;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION buscar_sociedades_por_cuit(text, integer) IS
    E'@name buscarSociedadesPorCuit\nBúsqueda de sociedades por CUIT (compara solo dígitos, ya filtra las ocultas).';

REVOKE EXECUTE ON FUNCTION buscar_sociedades_por_cuit(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION buscar_sociedades_por_cuit(text, integer) TO boletin_api;
