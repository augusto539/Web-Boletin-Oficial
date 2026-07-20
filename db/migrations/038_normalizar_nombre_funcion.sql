-- Función SQL `normalizar_nombre(text)` que replica EXACTAMENTE la
-- normalización del pipeline (`normalizacion.py:normalizar_nombre` en el repo
-- "Info Boletin Oficial"), y realinea el `nombre_normalizado` de las
-- sociedades que la app web había promovido con la fórmula vieja
-- (`upper(unaccent(...))`, que conserva puntos y no colapsa las abreviaturas).
--
-- POR QUÉ
-- El pipeline resuelve identidad de sociedades por `nombre_normalizado`
-- (además de por CUIT). La app web, al "promover" un socio jurídico a fila
-- real de `sociedades` (ver 036/037), venía calculando `nombre_normalizado`
-- como `upper(unaccent(nombre))` — que difiere de la normalización del
-- pipeline para cualquier nombre con puntuación o abreviatura societaria:
--
--   "Obras Andinas S.A."
--     pipeline : OBRAS ANDINAS SA      (punto -> espacio, "S A" -> "SA")
--     web vieja: OBRAS ANDINAS S.A.    (conserva los puntos)
--
-- Con los dos valores distintos, cuando el job diario vuelve a citar a esa
-- misma empresa NO la reconoce por nombre (solo la salvaría el CUIT, que no
-- siempre está), y termina creando un fallback o una sociedad duplicada — y
-- el stub promovido queda "gris" para siempre en el grafo. Unificar la
-- normalización de los dos lados cierra ese hueco.
--
-- La fórmula canónica es la del PIPELINE (dueño del schema de datos); esta
-- migración adapta la web a esa fórmula, no al revés.
--
-- EQUIVALENCIA CON PYTHON — mismo orden de operaciones que normalizacion.py:
--   1. upper() (con eszett ß -> SS, igual que Python str.upper)
--   2. NFD + descarte de marcas combinantes (acentos)  -> normalize(..., NFD)
--                                                          + strip [\u0300-\u036f]
--   3. '.' -> ' '
--   4. abreviaturas EN ESTE ORDEN: S A S->SAS, S A U->SAU, S A->SA,
--      S R L->SRL, S C->SC   (\y = word boundary, equivalente al \b de Python)
--   5. todo lo que no sea [A-Z0-9 espacio] -> ' '
--   6. colapsar espacios + trim
--
-- Se usa `normalize(..., NFD)` (no `unaccent`) a propósito: replica el paso
-- exacto de Python (descomponer y quitar marcas Mn), incluidos los latinos
-- extendidos que NO se descomponen (Ø, Æ, Œ, Ł, Đ...), que Python descarta y
-- `unaccent` en cambio mapearía a una letra. Resultado: la función es
-- IMMUTABLE (no depende del diccionario de unaccent) y byte-exacta con Python.
-- Verificado carácter-por-carácter contra la implementación Python sobre 50
-- casos (los 10 stubs de 037, todas las abreviaturas, acentos, ñ, ç, eszett,
-- latinos extendidos, puntuación y bordes) en un Postgres 16 desechable antes
-- de commitear: 0 divergencias.

CREATE EXTENSION IF NOT EXISTS unaccent;  -- lo usa el predicado de realineado de abajo

CREATE OR REPLACE FUNCTION normalizar_nombre(s text)
RETURNS text
LANGUAGE sql
IMMUTABLE
RETURNS NULL ON NULL INPUT
AS $func$
  SELECT btrim(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  replace(
                    regexp_replace(normalize(replace(upper(s), 'ß', 'SS'), NFD), '[\u0300-\u036f]', '', 'g'),
                  '.', ' '),
                '\yS\s+A\s+S\y', 'SAS', 'g'),
              '\yS\s+A\s+U\y', 'SAU', 'g'),
            '\yS\s+A\y', 'SA', 'g'),
          '\yS\s+R\s+L\y', 'SRL', 'g'),
        '\yS\s+C\y', 'SC', 'g'),
      '[^A-Z0-9[:space:]]', ' ', 'g'),
    '\s+', ' ', 'g')
  )
$func$;

COMMENT ON FUNCTION normalizar_nombre(text) IS
  'Normaliza una denominación societaria igual que normalizacion.py del pipeline (mayúsculas, sin acentos, sin puntuación, S.A.->SA / S.A.S.->SAS / S.R.L.->SRL / S.A.U.->SAU / S.C.->SC, espacios colapsados). Usar para dedup/matching por nombre — mantener sincronizada byte a byte con la versión Python del pipeline.';

-- Mínimo privilegio, igual que las funciones de grafo en 036: solo la usa el
-- panel de admin (rol boletin_auth, ver admin.ts). Se revoca de PUBLIC para
-- que PostGraphile —que conecta como boletin_api— NO la exponga como campo
-- de la API GraphQL pública. boletin_admin (dueño) y el pipeline no la
-- necesitan vía este grant (el pipeline normaliza en Python).
REVOKE EXECUTE ON FUNCTION normalizar_nombre(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION normalizar_nombre(text) TO boletin_auth;

-- Realineado de datos: recalcula `nombre_normalizado` SOLO de las filas que
-- fueron normalizadas con la fórmula vieja de la web (`upper(unaccent(nombre))`)
-- y cuyo resultado difiere de la fórmula canónica. Este predicado deja
-- intactas todas las filas del pipeline (cuyo `nombre_normalizado` ya es
-- `normalizar_nombre(nombre)`), así que en la práctica solo toca los stubs
-- promovidos por el panel de admin / la migración 037.
DO $$
DECLARE
  v_filas int;
BEGIN
  UPDATE sociedades
     SET nombre_normalizado = left(normalizar_nombre(nombre), 255)
   WHERE nombre_normalizado = upper(unaccent(nombre))
     AND nombre_normalizado IS DISTINCT FROM left(normalizar_nombre(nombre), 255);
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE 'normalizar_nombre: % fila(s) de sociedades realineadas a la normalización del pipeline.', v_filas;
END $$;

-- Diagnóstico (no modifica nada): deja en el log los grupos de sociedades que
-- quedan compartiendo `nombre_normalizado` tras el realineado — candidatos a
-- fusión manual desde el panel de admin. No se fusiona automáticamente acá:
-- unir dos filas de `sociedades` es destructivo y requiere criterio humano
-- (cuál conserva los actos, el CUIT, el domicilio, etc.).
DO $$
DECLARE
  r record;
  v_grupos int := 0;
BEGIN
  FOR r IN
    SELECT nombre_normalizado, count(*) AS n, array_agg(id ORDER BY id) AS ids
    FROM sociedades
    GROUP BY nombre_normalizado
    HAVING count(*) > 1
    ORDER BY count(*) DESC
  LOOP
    v_grupos := v_grupos + 1;
    RAISE NOTICE 'nombre_normalizado duplicado: "%" -> % filas: %', r.nombre_normalizado, r.n, r.ids;
  END LOOP;
  IF v_grupos = 0 THEN
    RAISE NOTICE 'Sin sociedades con nombre_normalizado duplicado tras el realineado.';
  ELSE
    RAISE NOTICE '% grupo(s) de sociedades comparten nombre_normalizado — revisar para posible fusión manual.', v_grupos;
  END IF;
END $$;
