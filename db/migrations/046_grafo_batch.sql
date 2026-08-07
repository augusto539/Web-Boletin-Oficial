-- "Expandir todo" en el grafo de exploración disparaba una llamada GraphQL
-- por cada nodo visible sin expandir (Promise.all sobre N ids), cada una
-- con el overhead completo de auth/sesión de PostGraphile. Estas dos
-- funciones toman un array de ids y devuelven las aristas de todos de una,
-- con raiz_id marcando de qué id de entrada vino cada fila -- así el
-- frontend puede seguir agrupando por nodo (fusionarAristas necesita saber
-- qué aristas corresponden a qué nodo para posicionar los nuevos alrededor
-- del que los generó) pero con 1 request en vez de N. Reutilizan
-- grafo_de_sociedad/grafo_de_persona vía LATERAL en vez de duplicar su
-- lógica, así que cualquier cambio futuro a esas funciones se hereda solo.
--
-- El nombre no es simplemente el plural de la función singular a propósito:
-- PostGraphile singulariza el nombre de función para nombrar el tipo Edge
-- resultante, así que "grafo_de_sociedad"/"grafo_de_sociedades" chocan (las
-- dos generan "GrafoDeSociedadEdge") y el build del schema falla al
-- arrancar. El sufijo "_lote" evita la colisión.

CREATE FUNCTION grafo_de_sociedades_lote(sociedad_ids bigint[])
RETURNS TABLE (
    raiz_id bigint,
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
    SELECT sid, g.*
    FROM unnest(sociedad_ids) AS sid
    CROSS JOIN LATERAL grafo_de_sociedad(sid) AS g;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION grafo_de_sociedades_lote(bigint[]) IS
    E'@name grafoDeSociedadesLote\nVersión en lote de grafoDeSociedad: la red de vínculos a 2 saltos de varias sociedades a la vez. raizId indica de qué sociedad de entrada vino cada arista.';

REVOKE EXECUTE ON FUNCTION grafo_de_sociedades_lote(bigint[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grafo_de_sociedades_lote(bigint[]) TO boletin_api;

CREATE FUNCTION grafo_de_personas_lote(persona_ids bigint[])
RETURNS TABLE (
    raiz_id bigint,
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
    SELECT pid, g.*
    FROM unnest(persona_ids) AS pid
    CROSS JOIN LATERAL grafo_de_persona(pid) AS g;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION grafo_de_personas_lote(bigint[]) IS
    E'@name grafoDePersonasLote\nVersión en lote de grafoDePersona: las sociedades vinculadas a varias personas a la vez. raizId indica de qué persona de entrada vino cada arista.';

REVOKE EXECUTE ON FUNCTION grafo_de_personas_lote(bigint[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grafo_de_personas_lote(bigint[]) TO boletin_api;
