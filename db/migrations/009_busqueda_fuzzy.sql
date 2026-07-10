-- Búsqueda difusa (autocompletar), no exact match. PostGraphile expone estas
-- funciones como queries de nivel superior: buscarSociedades / buscarPersonas.
CREATE FUNCTION buscar_sociedades(termino text, limite integer DEFAULT 20)
RETURNS SETOF sociedades AS $$
    SELECT *
    FROM sociedades
    WHERE oculta = FALSE
      AND nombre_normalizado % upper(unaccent(termino))
    ORDER BY similarity(nombre_normalizado, upper(unaccent(termino))) DESC
    LIMIT limite;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION buscar_sociedades(text, integer) IS
    E'@name buscarSociedades\nBúsqueda difusa de sociedades por nombre (ya filtra las ocultas).';

CREATE FUNCTION buscar_personas(termino text, limite integer DEFAULT 20)
RETURNS SETOF personas_fisicas AS $$
    SELECT *
    FROM personas_fisicas
    WHERE oculta = FALSE
      AND nombre_normalizado % upper(unaccent(termino))
    ORDER BY similarity(nombre_normalizado, upper(unaccent(termino))) DESC
    LIMIT limite;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION buscar_personas(text, integer) IS
    E'@name buscarPersonas\nBúsqueda difusa de personas físicas por nombre (ya filtra las ocultas).';

REVOKE EXECUTE ON FUNCTION buscar_sociedades(text, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION buscar_personas(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION buscar_sociedades(text, integer) TO boletin_api;
GRANT EXECUTE ON FUNCTION buscar_personas(text, integer) TO boletin_api;
