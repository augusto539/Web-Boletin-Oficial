-- Búsqueda de personas por CUIT o documento (compara solo dígitos, mismo
-- criterio que buscar_sociedades_por_cuit). Se necesita para la página de
-- Notificaciones, donde se puede programar un aviso sobre una persona
-- buscándola por nombre o por CUIT/DNI.
CREATE FUNCTION buscar_personas_por_cuit(termino text, limite integer DEFAULT 20)
RETURNS SETOF personas_fisicas AS $$
    SELECT *
    FROM personas_fisicas
    WHERE oculta = FALSE
      AND (
        (cuit IS NOT NULL AND regexp_replace(cuit, '\D', '', 'g') ILIKE '%' || regexp_replace(termino, '\D', '', 'g') || '%')
        OR (documento IS NOT NULL AND regexp_replace(documento, '\D', '', 'g') ILIKE '%' || regexp_replace(termino, '\D', '', 'g') || '%')
      )
    ORDER BY nombre
    LIMIT limite;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION buscar_personas_por_cuit(text, integer) IS
    E'@name buscarPersonasPorCuit\nBúsqueda de personas físicas por CUIT o documento (compara solo dígitos, ya filtra las ocultas).';

REVOKE EXECUTE ON FUNCTION buscar_personas_por_cuit(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION buscar_personas_por_cuit(text, integer) TO boletin_api;
