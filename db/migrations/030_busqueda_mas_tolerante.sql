-- Las búsquedas por nombre eran demasiado estrictas en dos casos reales:
-- 1) Nombre completo con palabras de más: "AUGUSTO ANTONELLI" no encontraba
--    a "AUGUSTO NEVIO ANTONELLI POL" porque similarity() compara las cadenas
--    completas, y dos palabras de diferencia (NEVIO, POL) bajan el puntaje
--    por debajo del umbral (0.27 con similarity(), contra 0.3 mínimo).
-- 2) Palabras pegadas: "HYPERLEAF" no encontraba a "ASOCIACION CIVIL HYPER
--    LEAF" ni con similarity() (mismo problema) ni con ILIKE (no es substring
--    literal por el espacio faltante).
-- word_similarity()/'<%' resuelve ambos: en vez de comparar las cadenas
-- completas, busca el mejor extracto de la cadena larga que se parezca al
-- término buscado. Con el umbral por default (0.6) ya alcanza para los dos
-- casos reales (0.74 y 0.62 respectivamente) sin aflojar tanto como para
-- inundar de resultados irrelevantes. Usa el mismo índice GIN trigram que ya
-- existía (gin_trgm_ops soporta '%', '<%' y '%>' con el mismo índice).

-- --- Autocomplete (buscar_sociedades / buscar_personas, 009) ---------------
CREATE OR REPLACE FUNCTION buscar_sociedades(termino text, limite integer DEFAULT 20)
RETURNS SETOF sociedades AS $$
    SELECT *
    FROM sociedades
    WHERE oculta = FALSE
      AND (
        nombre_normalizado % upper(unaccent(termino))
        OR upper(unaccent(termino)) <% nombre_normalizado
      )
    ORDER BY GREATEST(
      similarity(nombre_normalizado, upper(unaccent(termino))),
      word_similarity(upper(unaccent(termino)), nombre_normalizado)
    ) DESC
    LIMIT limite;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION buscar_personas(termino text, limite integer DEFAULT 20)
RETURNS SETOF personas_fisicas AS $$
    SELECT *
    FROM personas_fisicas
    WHERE oculta = FALSE
      AND (
        nombre_normalizado % upper(unaccent(termino))
        OR upper(unaccent(termino)) <% nombre_normalizado
      )
    ORDER BY GREATEST(
      similarity(nombre_normalizado, upper(unaccent(termino))),
      word_similarity(upper(unaccent(termino)), nombre_normalizado)
    ) DESC
    LIMIT limite;
$$ LANGUAGE sql STABLE;

-- --- Búsqueda avanzada (buscar_sociedades_avanzado 019, buscar_personas_avanzado 025) ---
-- Mismo criterio: se agrega el fuzzy '<%' como OR adicional a las condiciones
-- ILIKE/CUIT que ya existían (no se les toca nada, siguen siendo el camino
-- rápido para el caso común de coincidencia exacta).
CREATE OR REPLACE FUNCTION buscar_sociedades_avanzado(
    termino text DEFAULT NULL,
    grupo_clae text DEFAULT NULL,
    tipo_sociedad_id integer DEFAULT NULL,
    departamento_id integer DEFAULT NULL,
    fecha_desde date DEFAULT NULL,
    fecha_hasta date DEFAULT NULL,
    limite integer DEFAULT 50000
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
        buscar_sociedades_avanzado.tipo_sociedad_id IS NULL
        OR s.tipo_sociedad_id = buscar_sociedades_avanzado.tipo_sociedad_id
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
        OR upper(unaccent(buscar_sociedades_avanzado.termino)) <% s.nombre_normalizado
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
                OR upper(unaccent(buscar_sociedades_avanzado.termino)) <% p.nombre_normalizado
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

CREATE OR REPLACE FUNCTION buscar_personas_avanzado(
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
        OR upper(unaccent(buscar_personas_avanzado.termino)) <% p.nombre_normalizado
        OR (
          regexp_replace(buscar_personas_avanzado.termino, '\D', '', 'g') <> ''
          AND regexp_replace(coalesce(p.documento, '') || coalesce(p.cuit, ''), '\D', '', 'g') ILIKE
              '%' || regexp_replace(buscar_personas_avanzado.termino, '\D', '', 'g') || '%'
        )
      )
    ORDER BY p.nombre
    LIMIT buscar_personas_avanzado.limite;
$$ LANGUAGE sql STABLE;
