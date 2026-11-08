-- La 048 dejó el grafo ~28 veces más lento en producción (~130 ms -> ~3,7 s
-- por carga). La consulta en sí casi no cambió: el 95% del tiempo era el JIT
-- de Postgres. Dos arreglos complementarios.
--
-- ─── 1. JIT apagado para el sitio público ──────────────────────────────────
-- Postgres decide compilar una consulta a código máquina cuando su costo
-- ESTIMADO pasa jit_above_cost (100 mil) y la optimiza a fondo pasado
-- jit_optimize_above_cost (500 mil). En la VM de producción (1 OCPU) esa
-- compilación cuesta segundos, y se paga en CADA consulta: no hay caché de
-- código compilado entre consultas. Para una web interactiva sobre este
-- hardware es pérdida pura. Medido en producción, como boletin_api, el
-- 08/11/2026 -- ninguna consulta pública salió beneficiada:
--
--     consulta                         JIT on      JIT off
--     grafo de una sociedad            3.782 ms      229 ms
--     sitemap-sociedades.xml           1.695 ms      135 ms
--     búsqueda avanzada "sa"           1.596 ms      507 ms
--     búsqueda avanzada sin filtros       73 ms       21 ms
--
-- O sea: no era solo el grafo, la búsqueda avanzada venía pagando ~1 s de
-- compilación por búsqueda. Se apaga a nivel ROL (no global) para no tocar
-- al pipeline ni al panel admin, que usan otros roles. Aplica a las sesiones
-- que se abran desde ahora: el deploy recrea el contenedor de la app, así que
-- el pool de PostGraphile/seo.ts reconecta solo.
ALTER ROLE boletin_api SET jit = off;

-- ─── 2. Grafo: volver al plan rápido de antes de la 048 ────────────────────
-- Con JIT apagado el grafo quedaba en ~225 ms contra ~175 ms del diseño
-- original: el resto venía de vw_grafo_aristas_visibles (048), que metía los
-- EXISTS de visibilidad dentro de CADA recorrido de la vista -- incluidos los
-- del segundo nivel, donde el planificador estimaba la consulta ~80 veces más
-- cara (33 mil -> 2,75 millones de unidades de costo; eso además era lo que
-- disparaba el JIT del punto 1).
--
-- Ahora los recorridos vuelven a leer vw_grafo_aristas directo (el plan de
-- siempre) y la visibilidad se chequea en dos puntos, sobre pocas filas:
--   a) en el NIVEL 1: para no "atravesar" una persona o sociedad oculta y
--      terminar mostrando sus otras sociedades;
--   b) sobre el RESULTADO FINAL (~100 aristas): para las aristas de segundo
--      nivel que apunten o lleguen desde algo oculto.
-- El conjunto de aristas resultante es exactamente el mismo que con 048
-- (verificado arista por arista antes de aplicar).
--
-- vw_grafo_aristas (del pipeline) sigue corriendo como su dueño y salteándose
-- la RLS -- por eso los dos filtros de abajo son OBLIGATORIOS, no una
-- optimización: sin ellos el grafo volvería a mostrar entidades ocultas.
-- Los EXISTS sí respetan la RLS de quien llama (las funciones son SECURITY
-- INVOKER y leen las tablas directo), así que "visible" significa lo mismo
-- que en el resto del sitio.
CREATE OR REPLACE FUNCTION grafo_de_sociedad(sociedad_id bigint)
RETURNS TABLE(origen_tipo text, origen_id bigint, origen_nombre character varying,
              destino_tipo text, destino_id bigint, destino_nombre character varying,
              relacion character varying, origen_sin_actos boolean, destino_sin_actos boolean)
LANGUAGE sql STABLE AS $$
    WITH nivel1 AS (
        SELECT g.*
        FROM vw_grafo_aristas g
        WHERE (g.destino_id = sociedad_id
               OR (g.origen_tipo = 'sociedad' AND g.origen_id = sociedad_id))
          -- (a) visibilidad en el nivel 1
          AND EXISTS (SELECT 1 FROM sociedades s WHERE s.id = g.destino_id)
          AND CASE g.origen_tipo
                WHEN 'persona' THEN EXISTS (SELECT 1 FROM personas_fisicas p WHERE p.id = g.origen_id)
                ELSE                EXISTS (SELECT 1 FROM sociedades so WHERE so.id = g.origen_id)
              END
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
    ),
    todas AS (
        SELECT * FROM nivel1
        UNION
        SELECT * FROM nivel2a
        UNION
        SELECT * FROM nivel2b
    ),
    -- (b) visibilidad del resultado final
    visibles AS (
        SELECT t.*
        FROM todas t
        WHERE EXISTS (SELECT 1 FROM sociedades s WHERE s.id = t.destino_id)
          AND CASE t.origen_tipo
                WHEN 'persona' THEN EXISTS (SELECT 1 FROM personas_fisicas p WHERE p.id = t.origen_id)
                ELSE                EXISTS (SELECT 1 FROM sociedades so WHERE so.id = t.origen_id)
              END
    )
    SELECT
        t.*,
        t.origen_tipo = 'sociedad' AND NOT EXISTS (
            SELECT 1 FROM actos a WHERE a.sociedad_id = t.origen_id
        ) AS origen_sin_actos,
        t.destino_tipo = 'sociedad' AND NOT EXISTS (
            SELECT 1 FROM actos a WHERE a.sociedad_id = t.destino_id
        ) AS destino_sin_actos
    FROM visibles t;
$$;

-- Un solo nivel: los dos filtros de arriba se reducen a uno.
CREATE OR REPLACE FUNCTION grafo_de_persona(persona_id bigint)
RETURNS TABLE(origen_tipo text, origen_id bigint, origen_nombre character varying,
              destino_tipo text, destino_id bigint, destino_nombre character varying,
              relacion character varying, origen_sin_actos boolean, destino_sin_actos boolean)
LANGUAGE sql STABLE AS $$
    SELECT
        g.*,
        false AS origen_sin_actos,
        g.destino_tipo = 'sociedad' AND NOT EXISTS (
            SELECT 1 FROM actos a WHERE a.sociedad_id = g.destino_id
        ) AS destino_sin_actos
    FROM vw_grafo_aristas g
    WHERE g.origen_tipo = 'persona' AND g.origen_id = persona_id
      AND EXISTS (SELECT 1 FROM personas_fisicas p WHERE p.id = g.origen_id)
      AND EXISTS (SELECT 1 FROM sociedades s WHERE s.id = g.destino_id);
$$;

-- Ya nada la usa (las funciones de lote de 046 llaman a las dos de arriba).
DROP VIEW vw_grafo_aristas_visibles;
