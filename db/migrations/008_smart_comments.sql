-- Smart comments de PostGraphile: nombre_normalizado es solo la clave de
-- matching para búsqueda difusa (MAYÚSCULAS sin acentos). La UI siempre debe
-- mostrar `nombre`, así que se oculta por completo del schema GraphQL.
COMMENT ON COLUMN sociedades.nombre_normalizado IS E'@omit\nUso interno para búsqueda difusa, no exponer en la API.';
COMMENT ON COLUMN personas_fisicas.nombre_normalizado IS E'@omit\nUso interno para búsqueda difusa, no exponer en la API.';
