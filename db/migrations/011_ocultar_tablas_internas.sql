-- Tabla de bookkeeping del propio runner de migraciones, no es dato de dominio.
COMMENT ON TABLE schema_migrations IS E'@omit\nBookkeeping interno de migraciones, no exponer en la API.';
