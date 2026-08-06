-- historial_busquedas quedó con dos secuencias: la tabla se recreó a mano
-- por fuera del runner de migraciones en algún momento, y Postgres generó
-- "historial_busquedas_id_seq1" porque el nombre original ya existía. La
-- columna id terminó apuntando a esa secuencia _seq1, que nunca recibió el
-- GRANT USAGE de 027_historial_busquedas.sql (ese grant quedó apuntando a
-- la secuencia vieja, huérfana) -- boletin_auth no podía hacer nextval() y
-- todo INSERT fallaba con "permission denied", silenciado en el frontend
-- (fetch fire-and-forget con .catch(() => {})), así que las búsquedas
-- dejaron de guardarse en el historial sin ningún error visible.
ALTER TABLE historial_busquedas ALTER COLUMN id SET DEFAULT nextval('historial_busquedas_id_seq'::regclass);

SELECT setval('historial_busquedas_id_seq', COALESCE((SELECT MAX(id) FROM historial_busquedas), 0) + 1, false);

DROP SEQUENCE IF EXISTS historial_busquedas_id_seq1;
