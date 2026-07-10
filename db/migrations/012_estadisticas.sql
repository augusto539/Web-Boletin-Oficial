-- Estadísticas para la landing: actividad de los últimos 12 meses.
-- La ventana se ancla a la última fecha_publicacion cargada (no a now())
-- para que la landing nunca muestre ceros si el pipeline se atrasa unos días.
--
-- El "sector" del diseño original no lo usa el pipeline real (sectores/
-- sociedades.sector_id están siempre vacíos); la clasificación real que sí
-- tiene datos es grupos_clae vía sociedad_actividades (orden = 1 = actividad
-- principal), así que el "sector más activo" se calcula con eso.
CREATE TYPE estadisticas_anio AS (
    sociedades_nuevas integer,
    personas_involucradas integer,
    grupo_clae_mas_activo text,
    desde date,
    hasta date
);

CREATE FUNCTION estadisticas_ultimo_anio()
RETURNS estadisticas_anio AS $$
    WITH ventana AS (
        SELECT
            max(fecha_publicacion) - INTERVAL '1 year' AS desde,
            max(fecha_publicacion) AS hasta
        FROM actos
    ),
    constituciones AS (
        SELECT a.id, a.sociedad_id
        FROM actos a
        JOIN tipos_acto ta ON ta.id = a.tipo_acto_id AND ta.nombre = 'Constitucion'
        CROSS JOIN ventana v
        WHERE a.fecha_publicacion > v.desde
          AND a.fecha_publicacion <= v.hasta
    )
    SELECT
        (SELECT count(*) FROM constituciones)::integer,
        (
            SELECT count(DISTINCT vi.persona_id)
            FROM vinculos vi
            JOIN constituciones c ON c.id = vi.acto_alta_id
            WHERE vi.persona_id IS NOT NULL
        )::integer,
        (
            SELECT g.nombre
            FROM constituciones c
            JOIN sociedad_actividades sa ON sa.sociedad_id = c.sociedad_id AND sa.orden = 1
            JOIN grupos_clae g ON g.codigo = sa.clae_grupo
            GROUP BY g.nombre
            ORDER BY count(*) DESC, g.nombre
            LIMIT 1
        ),
        (SELECT desde::date FROM ventana),
        (SELECT hasta FROM ventana);
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION estadisticas_ultimo_anio() IS
    E'@name estadisticasUltimoAnio\nActividad del último año: sociedades nuevas, personas involucradas y grupo CLAE más activo.';

REVOKE EXECUTE ON FUNCTION estadisticas_ultimo_anio() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION estadisticas_ultimo_anio() TO boletin_api;
