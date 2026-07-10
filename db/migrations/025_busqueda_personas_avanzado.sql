-- Búsqueda avanzada de personas físicas, mismo criterio que
-- buscar_sociedades_avanzado (019): término unificado (nombre o CUIT/DNI,
-- comparando solo dígitos), filtro por departamento (vía domicilio) y rango
-- de fecha de nacimiento. limite en 50.000 por la misma razón documentada en
-- 019: deja que first/offset de PostGraphile hagan la paginación real sobre
-- el resultado completo, en vez de truncar antes y romper totalCount.
CREATE FUNCTION buscar_personas_avanzado(
    termino text DEFAULT NULL,
    departamento_id integer DEFAULT NULL,
    fecha_nac_desde date DEFAULT NULL,
    fecha_nac_hasta date DEFAULT NULL,
    limite integer DEFAULT 50000
)
RETURNS SETOF personas_fisicas AS $$
    SELECT p.*
    FROM personas_fisicas p
    LEFT JOIN domicilios d ON d.id = p.domicilio_id
    LEFT JOIN localidades l ON l.id = d.localidad_id
    WHERE p.oculta = FALSE
      AND (
        buscar_personas_avanzado.departamento_id IS NULL
        OR l.departamento_id = buscar_personas_avanzado.departamento_id
      )
      AND (
        buscar_personas_avanzado.fecha_nac_desde IS NULL
        OR p.fecha_nacimiento >= buscar_personas_avanzado.fecha_nac_desde
      )
      AND (
        buscar_personas_avanzado.fecha_nac_hasta IS NULL
        OR p.fecha_nacimiento <= buscar_personas_avanzado.fecha_nac_hasta
      )
      AND (
        buscar_personas_avanzado.termino IS NULL
        OR p.nombre_normalizado ILIKE '%' || upper(unaccent(buscar_personas_avanzado.termino)) || '%'
        OR (
          regexp_replace(buscar_personas_avanzado.termino, '\D', '', 'g') <> ''
          AND regexp_replace(coalesce(p.documento, '') || coalesce(p.cuit, ''), '\D', '', 'g') ILIKE
              '%' || regexp_replace(buscar_personas_avanzado.termino, '\D', '', 'g') || '%'
        )
      )
    ORDER BY p.nombre
    LIMIT buscar_personas_avanzado.limite;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION buscar_personas_avanzado(text, integer, date, date, integer) IS
    E'@name buscarPersonasAvanzado\nLista de personas físicas filtrada por texto libre (nombre o CUIT/DNI), departamento y rango de fecha de nacimiento. Pedir first/offset para paginar.';

REVOKE EXECUTE ON FUNCTION buscar_personas_avanzado(text, integer, date, date, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION buscar_personas_avanzado(text, integer, date, date, integer) TO boletin_api;
