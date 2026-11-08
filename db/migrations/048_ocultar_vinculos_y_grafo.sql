-- Ocultar una persona o sociedad (habeas data) no la sacaba ni del grafo ni
-- de la tabla de socios de las sociedades donde participa.
--
-- Caso real: con "Lucas Lopez Fiterman" oculto, la ficha de "555 Cafe S.A.S."
--   - seguía dibujándolo en el grafo, CON SU NOMBRE COMPLETO;
--   - en "Socios y autoridades" mostraba su fila como "— aún no relevada"
--     (el vínculo seguía visible, solo la persona llegaba vacía);
--   - y, peor, la API GraphQL pública devolvía su nombre a cualquiera, sin
--     sesión, vía allVwGrafoAristas.
--
-- CAUSA DE FONDO: vw_grafo_aristas (la define el pipeline, db/schema.sql)
-- se ejecuta con los permisos de su DUEÑO (boletin_admin, owner de las
-- tablas), y el owner no está sujeto a RLS. Toda consulta que la lea --la API
-- directa o las funciones grafo_*, que sí son SECURITY INVOKER-- ve también
-- las filas ocultas. La migración 010 y docs/plan_centralizar_habeas_data.md
-- daban por hecho que la vista filtraba oculta=false: nunca lo hizo, en
-- ninguna versión de db/schema.sql. El grafo expuso entidades ocultas
-- (personas Y sociedades) desde el primer día.
--
-- ─── 1. Cerrar la consulta directa a la vista ──────────────────────────────
-- allVwGrafoAristas no la usa nada del sitio (el frontend consume solo las
-- funciones grafo_*), y por construcción se saltea la RLS. Se saca de la API.
-- Las funciones devuelven TABLE(...) explícito, no SETOF vw_grafo_aristas,
-- así que PostGraphile no necesita el tipo de la vista.
COMMENT ON VIEW vw_grafo_aristas IS
    E'@omit\nDefinida por el pipeline, corre con permisos de su dueño y se saltea la RLS: no exponer. El grafo público sale de grafo_* vía vw_grafo_aristas_visibles (048).';

-- ─── 2. Grafo: filtrar aristas con alguna punta oculta ─────────────────────
-- Por qué una vista NUEVA y no "ALTER VIEW vw_grafo_aristas SET
-- (security_invoker = true)", que era la solución obvia y se probó primero:
-- es correcta, pero combinada con la RLS de vinculos (punto 3) hacía el
-- grafo ~35 veces más lento (50 sociedades más conectadas: 1 s -> 34 s). Con
-- las políticas evaluándose dentro de la vista, el planificador estima mal el
-- segundo nivel del grafo ("otras sociedades de cada socio") y en vez de usar
-- el índice recorre los ~80 mil vínculos completos por cada socio.
--
-- Acá la vista del pipeline se deja tal cual (rápida, sin RLS en el camino
-- caliente) y esta envoltura descarta DESPUÉS las aristas con alguna punta no
-- visible. security_invoker = true hace que los EXISTS corran con la RLS de
-- quien consulta: para boletin_api, "visible" significa exactamente lo mismo
-- que en el resto del sitio. Como se filtran ya en el primer nivel, tampoco
-- se "atraviesa" a una persona oculta para llegar a sus otras sociedades.
CREATE VIEW vw_grafo_aristas_visibles WITH (security_invoker = true) AS
SELECT g.*
FROM vw_grafo_aristas g
WHERE EXISTS (SELECT 1 FROM sociedades s WHERE s.id = g.destino_id)
  AND CASE g.origen_tipo
        WHEN 'persona' THEN EXISTS (SELECT 1 FROM personas_fisicas p WHERE p.id = g.origen_id)
        ELSE                EXISTS (SELECT 1 FROM sociedades so WHERE so.id = g.origen_id)
      END;

COMMENT ON VIEW vw_grafo_aristas_visibles IS
    E'@omit\nUso interno de grafo_de_sociedad/grafo_de_persona; no exponer en la API.';

GRANT SELECT ON vw_grafo_aristas_visibles TO boletin_api;

-- Mismos cuerpos que la versión vigente (036), solo cambia de qué vista leen.
-- grafo_de_sociedades_lote / grafo_de_personas_lote (046) llaman a estas dos,
-- así que heredan el filtro sin tocarlas.
CREATE OR REPLACE FUNCTION grafo_de_sociedad(sociedad_id bigint)
RETURNS TABLE(origen_tipo text, origen_id bigint, origen_nombre character varying,
              destino_tipo text, destino_id bigint, destino_nombre character varying,
              relacion character varying, origen_sin_actos boolean, destino_sin_actos boolean)
LANGUAGE sql STABLE AS $$
    WITH nivel1 AS (
        SELECT *
        FROM vw_grafo_aristas_visibles
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
        FROM vw_grafo_aristas_visibles g
        JOIN sociedades_socias ss ON ss.id = g.destino_id
    ),
    nivel2b AS (
        SELECT g.*
        FROM vw_grafo_aristas_visibles g
        JOIN personas_vinculadas pv ON pv.id = g.origen_id AND g.origen_tipo = 'persona'
        WHERE g.destino_id <> sociedad_id
    ),
    todas AS (
        SELECT * FROM nivel1
        UNION
        SELECT * FROM nivel2a
        UNION
        SELECT * FROM nivel2b
    )
    SELECT
        t.*,
        t.origen_tipo = 'sociedad' AND NOT EXISTS (
            SELECT 1 FROM actos a WHERE a.sociedad_id = t.origen_id
        ) AS origen_sin_actos,
        t.destino_tipo = 'sociedad' AND NOT EXISTS (
            SELECT 1 FROM actos a WHERE a.sociedad_id = t.destino_id
        ) AS destino_sin_actos
    FROM todas t;
$$;

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
    FROM vw_grafo_aristas_visibles g
    WHERE g.origen_tipo = 'persona' AND g.origen_id = persona_id;
$$;

-- ─── 3. Tabla de socios: RLS en vinculos ───────────────────────────────────
-- vinculos no tenía RLS: el vínculo seguía saliendo aunque su persona o
-- sociedad estuviera oculta, y el frontend no podía distinguir "persona
-- oculta" de "persona aún no relevada" (en los dos casos llega null). Ahora,
-- para boletin_api, un vínculo solo existe si sus TRES puntas (sociedad,
-- persona y sociedad socia, las que no sean null) son visibles. Ocultar desde
-- cualquier punta funciona igual: ocultar una sociedad la saca también de la
-- ficha de cada socio. Lo respetan solos la ficha (GraphQL) y el HTML
-- server-side para crawlers (seo.ts), que leen con boletin_api.
--
-- QUIÉN LEE vinculos Y CÓMO QUEDA
--   boletin_api   -> sitio público: solo vínculos con las 3 puntas visibles.
--   boletin_auth  -> panel admin, recálculo de informes, notificaciones: sigue
--                    viendo TODO (USING (true), mismo criterio que 028). Ojo:
--                    con RLS activa, un rol sin política ve CERO filas -- estas
--                    dos políticas son obligatorias, no decorativas. La de
--                    UPDATE cubre el "Vincular" de socios jurídicos (admin.ts),
--                    que usa el UPDATE por columnas que le dio 036.
--   boletin_admin -> pipeline: owner de la tabla, no está sujeto a RLS (no se
--                    usa FORCE ROW LEVEL SECURITY), no cambia nada. Por lo
--                    mismo, la vista del pipeline (que corre como owner) no se
--                    ve afectada y el grafo conserva su plan rápido.
ALTER TABLE vinculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY vinculos_ocultar_habeas_data ON vinculos
    FOR SELECT
    TO boletin_api
    USING (
        EXISTS (SELECT 1 FROM sociedades s WHERE s.id = vinculos.sociedad_id)
        AND (
            vinculos.persona_id IS NULL
            OR EXISTS (SELECT 1 FROM personas_fisicas p WHERE p.id = vinculos.persona_id)
        )
        AND (
            vinculos.sociedad_miembro_id IS NULL
            OR EXISTS (SELECT 1 FROM sociedades sm WHERE sm.id = vinculos.sociedad_miembro_id)
        )
    );

CREATE POLICY vinculos_boletin_auth_select ON vinculos
    FOR SELECT
    TO boletin_auth
    USING (true);

CREATE POLICY vinculos_boletin_auth_update ON vinculos
    FOR UPDATE
    TO boletin_auth
    USING (true)
    WITH CHECK (true);
