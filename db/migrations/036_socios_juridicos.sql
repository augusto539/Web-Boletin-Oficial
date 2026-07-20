-- Socios jurídicos sin ficha propia: cuando el pipeline no puede resolver
-- un socio a una persona física o a otra sociedad ya cargada, lo deja en
-- vinculos.nombre_juridico_fallback/cuit_juridico_fallback (ver
-- vinculos_un_solo_tipo_miembro en el esquema real). Esta migración habilita
-- que el panel de admin "promueva" esos fallbacks a una fila real de
-- sociedades (mínima: nombre/nombre_normalizado/cuit) y repunte
-- vinculos.sociedad_miembro_id — con eso, esos socios pasan a ser nodos
-- reales del grafo (vw_grafo_aristas ya tiene la rama sociedad->sociedad
-- vía sociedad_miembro_id) y fichas linkeables, sin tocar nada del resto
-- del pipeline externo.
--
-- boletin_auth es un rol de solo uso interno del backend (nunca expuesto
-- vía GraphQL público) y todas las rutas /api/admin/* ya pasan por
-- requireAdmin() — mismo criterio que 028_admin_datos_completos.sql, que
-- le dio UPDATE (oculta) acotado a una sola columna. Acá se agrega, con el
-- mismo criterio de mínimo privilegio, un INSERT acotado a las 3 columnas
-- que hacen falta para una sociedad "stub" y un UPDATE acotado a las 3
-- columnas que resuelven el fallback — nunca puede tocar el resto de los
-- datos scrapeados (capital, domicilio, actos, etc.).
--
-- vinculos no tiene RLS habilitado (a diferencia de sociedades/
-- personas_fisicas, ver 007_rls.sql) — confirmado contra la base real, así
-- que alcanza con el GRANT de columna, sin política nueva.

GRANT INSERT (nombre, nombre_normalizado, cuit) ON sociedades TO boletin_auth;

CREATE POLICY sociedades_boletin_auth_insert ON sociedades
    FOR INSERT
    TO boletin_auth
    WITH CHECK (true);

GRANT UPDATE (sociedad_miembro_id, nombre_juridico_fallback, cuit_juridico_fallback)
    ON vinculos TO boletin_auth;

-- "¿Esta sociedad tiene actos propios?" ya es una pregunta que el resto del
-- sitio contesta implícitamente (ficha, SEO noindex, sitemap — ver
-- Sociedad.tsx y seo.ts) pero nunca estuvo expuesta en el grafo. Se agrega
-- acá para poder pintar en gris, en el frontend, a las sociedades "solo
-- mencionadas como socias" (recién promovidas desde un fallback, sin acto
-- de constitución propio capturado) — mismo criterio que ya usa el campo
-- cliente-side "escribano" (GrafoSociedad.tsx), derivado por nodo a partir
-- de las aristas, no un tipo de nodo nuevo en la base.
--
-- Se reescribe el cuerpo de las funciones (no se toca vw_grafo_aristas,
-- vista de origen externo/incierto) agregando 2 columnas calculadas sobre
-- las mismas CTEs que ya existían. RETURNS TABLE reemplaza a RETURNS SETOF
-- vw_grafo_aristas porque ahora las columnas de salida no son exactamente
-- las de la vista.

DROP FUNCTION grafo_de_sociedad(bigint);

CREATE FUNCTION grafo_de_sociedad(sociedad_id bigint)
RETURNS TABLE (
    origen_tipo text,
    origen_id bigint,
    origen_nombre character varying,
    destino_tipo text,
    destino_id bigint,
    destino_nombre character varying,
    relacion character varying,
    origen_sin_actos boolean,
    destino_sin_actos boolean
) AS $$
    WITH nivel1 AS (
        SELECT *
        FROM vw_grafo_aristas
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
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION grafo_de_sociedad(bigint) IS
    E'@name grafoDeSociedad\nRed de vínculos de una sociedad, a 2 saltos: quién está vinculado a ella, de qué otras empresas es socia, los socios de esas socias, y las otras sociedades de sus propios socios. origenSinActos/destinoSinActos indican si ese nodo (cuando es una sociedad) no tiene ningún acto propio capturado — típicamente, una sociedad recién promovida desde un socio jurídico sin resolver.';

REVOKE EXECUTE ON FUNCTION grafo_de_sociedad(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grafo_de_sociedad(bigint) TO boletin_api;

DROP FUNCTION grafo_de_persona(bigint);

CREATE FUNCTION grafo_de_persona(persona_id bigint)
RETURNS TABLE (
    origen_tipo text,
    origen_id bigint,
    origen_nombre character varying,
    destino_tipo text,
    destino_id bigint,
    destino_nombre character varying,
    relacion character varying,
    origen_sin_actos boolean,
    destino_sin_actos boolean
) AS $$
    SELECT
        g.*,
        false AS origen_sin_actos,
        g.destino_tipo = 'sociedad' AND NOT EXISTS (
            SELECT 1 FROM actos a WHERE a.sociedad_id = g.destino_id
        ) AS destino_sin_actos
    FROM vw_grafo_aristas g
    WHERE g.origen_tipo = 'persona' AND g.origen_id = persona_id;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION grafo_de_persona(bigint) IS
    E'@name grafoDePersona\nSociedades de las que esta persona es socia, autoridad o escribana interviniente. destinoSinActos indica si esa sociedad no tiene ningún acto propio capturado.';

REVOKE EXECUTE ON FUNCTION grafo_de_persona(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grafo_de_persona(bigint) TO boletin_api;
