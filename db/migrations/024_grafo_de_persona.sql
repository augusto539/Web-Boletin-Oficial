-- Grafo rooted en una persona: en vw_grafo_aristas el origen siempre es
-- persona (o sociedad_miembro) y el destino siempre sociedad (ver
-- 006_indices_y_vista.sql en _legacy_schema_propio_no_usar y 017/018), así
-- que alcanza con las aristas donde esta persona es el origen — un solo
-- salto, sin necesidad de la expansión a 2 niveles que usa grafo_de_sociedad.
CREATE FUNCTION grafo_de_persona(persona_id bigint)
RETURNS SETOF vw_grafo_aristas AS $$
    SELECT *
    FROM vw_grafo_aristas
    WHERE origen_tipo = 'persona' AND origen_id = persona_id;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION grafo_de_persona(bigint) IS
    E'@name grafoDePersona\nSociedades de las que esta persona es socia, autoridad o escribana interviniente.';

REVOKE EXECUTE ON FUNCTION grafo_de_persona(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grafo_de_persona(bigint) TO boletin_api;
