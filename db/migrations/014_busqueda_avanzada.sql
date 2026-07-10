-- Búsqueda avanzada: todos los filtros son opcionales (NULL = no filtrar por
-- ese campo). Combina texto libre (nombre/CUIT de la sociedad, o nombre/
-- documento/CUIT de un socio) con grupo CLAE, departamento y rango de fecha
-- de constitución.
--
-- El "sector" del diseño original no lo usa el pipeline real (sectores está
-- vacío); se filtra por grupo CLAE (grupos_clae vía sociedad_actividades),
-- que sí tiene datos reales, usando la actividad principal (orden = 1).
--
-- El departamento se resuelve sociedad -> domicilio -> localidad ->
-- departamento; las sociedades sin domicilio resuelto a una localidad quedan
-- afuera si se filtra por departamento (no hay forma de ubicarlas).
CREATE FUNCTION buscar_sociedades_avanzado(
    termino text DEFAULT NULL,
    grupo_clae text DEFAULT NULL,
    departamento_id integer DEFAULT NULL,
    fecha_desde date DEFAULT NULL,
    fecha_hasta date DEFAULT NULL,
    limite integer DEFAULT 200
)
RETURNS SETOF sociedades AS $$
    SELECT s.*
    FROM sociedades s
    LEFT JOIN domicilios d ON d.id = s.domicilio_id
    LEFT JOIN localidades l ON l.id = d.localidad_id
    WHERE s.oculta = FALSE
      AND (
        buscar_sociedades_avanzado.grupo_clae IS NULL
        OR EXISTS (
            SELECT 1 FROM sociedad_actividades sa
            WHERE sa.sociedad_id = s.id
              AND sa.clae_grupo = buscar_sociedades_avanzado.grupo_clae
              AND sa.estado = 'AC'
        )
      )
      AND (
        buscar_sociedades_avanzado.departamento_id IS NULL
        OR l.departamento_id = buscar_sociedades_avanzado.departamento_id
      )
      AND (
        buscar_sociedades_avanzado.fecha_desde IS NULL
        OR s.fecha_constitucion >= buscar_sociedades_avanzado.fecha_desde
      )
      AND (
        buscar_sociedades_avanzado.fecha_hasta IS NULL
        OR s.fecha_constitucion <= buscar_sociedades_avanzado.fecha_hasta
      )
      AND (
        buscar_sociedades_avanzado.termino IS NULL
        OR s.nombre_normalizado ILIKE '%' || upper(unaccent(buscar_sociedades_avanzado.termino)) || '%'
        OR (
          regexp_replace(buscar_sociedades_avanzado.termino, '\D', '', 'g') <> ''
          AND regexp_replace(s.cuit, '\D', '', 'g') ILIKE
              '%' || regexp_replace(buscar_sociedades_avanzado.termino, '\D', '', 'g') || '%'
        )
        OR EXISTS (
            SELECT 1
            FROM vinculos v
            JOIN personas_fisicas p ON p.id = v.persona_id
            WHERE v.sociedad_id = s.id
              AND p.oculta = FALSE
              AND (
                p.nombre_normalizado ILIKE
                    '%' || upper(unaccent(buscar_sociedades_avanzado.termino)) || '%'
                OR (
                  regexp_replace(buscar_sociedades_avanzado.termino, '\D', '', 'g') <> ''
                  AND regexp_replace(coalesce(p.documento, '') || coalesce(p.cuit, ''), '\D', '', 'g') ILIKE
                      '%' || regexp_replace(buscar_sociedades_avanzado.termino, '\D', '', 'g') || '%'
                )
              )
        )
      )
    ORDER BY s.fecha_constitucion DESC NULLS LAST, s.nombre
    LIMIT buscar_sociedades_avanzado.limite;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION buscar_sociedades_avanzado(text, text, integer, date, date, integer) IS
    E'@name buscarSociedadesAvanzado\nLista de sociedades filtrada por texto libre, grupo CLAE, departamento y rango de fecha de constitución.';

REVOKE EXECUTE ON FUNCTION buscar_sociedades_avanzado(text, text, integer, date, date, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION buscar_sociedades_avanzado(text, text, integer, date, date, integer) TO boletin_api;
