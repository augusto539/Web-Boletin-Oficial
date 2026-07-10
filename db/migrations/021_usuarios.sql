-- Tabla de usuarios de la propia app (no son datos del Boletín Oficial).
-- La contraseña nunca se guarda en texto plano: se persiste su hash
-- (bcrypt/argon2 en el backend que haga el registro/login, todavía no
-- implementado — Login.tsx/Registro.tsx son solo UI por ahora).
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    mail TEXT NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    nombre TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free',
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Se oculta toda la tabla de PostGraphile: no tiene que haber forma de
-- leer/listar usuarios (ni su contrasena_hash) desde la API pública.
-- Cuando se implemente login/registro real, esas operaciones van a ser
-- funciones SQL puntuales (o resolvers de backend) con sus propios
-- permisos, no CRUD genérico expuesto por introspección.
COMMENT ON TABLE usuarios IS E'@omit\nUsuarios de la app (auth). No exponer en la API pública.';

-- ALTER DEFAULT PRIVILEGES (ver 007_rls.sql) le da SELECT a boletin_api en
-- toda tabla nueva; se revoca explícitamente acá como capa extra, ya que
-- @omit solo esconde la tabla de PostGraphile, no cambia permisos de Postgres.
REVOKE ALL ON usuarios FROM boletin_api;
REVOKE ALL ON usuarios_id_seq FROM boletin_api;
