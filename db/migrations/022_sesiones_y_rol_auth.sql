-- Auth: rol propio para el backend de login/registro (separado de boletin_api,
-- que es solo lectura de sociedades/personas), y tabla de sesiones para los
-- refresh tokens.
--
-- boletin_auth es el único rol que puede tocar usuarios y sesiones. Como es un
-- rol LOGIN sin BYPASSRLS y no es owner de las tablas, sus permisos se limitan
-- a los GRANT explícitos de acá. La contraseña es solo para desarrollo local;
-- en producción va por variable de entorno / secret manager.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'boletin_auth') THEN
        CREATE ROLE boletin_auth LOGIN PASSWORD 'boletin_auth_dev_password';
    END IF;
END
$$;

-- Refresh tokens: se guarda el sha256 del token (no el token en crudo), igual
-- criterio que la contraseña. token_hash es único para poder buscar la sesión
-- directamente por hash al refrescar. revocada_el marca los tokens ya rotados
-- o cerrados: si llega un refresh token ya revocado, es señal de reuso.
CREATE TABLE sesiones (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expira_el TIMESTAMPTZ NOT NULL,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT now(),
    revocada_el TIMESTAMPTZ
);

CREATE INDEX sesiones_usuario_id_idx ON sesiones (usuario_id);

COMMENT ON TABLE sesiones IS E'@omit\nSesiones/refresh tokens de auth. No exponer en la API pública.';

GRANT USAGE ON SCHEMA public TO boletin_auth;

-- usuarios: registro (INSERT), login/me (SELECT), y UPDATE para cambios de
-- plan/perfil más adelante. No DELETE por ahora.
GRANT SELECT, INSERT, UPDATE ON usuarios TO boletin_auth;
GRANT USAGE ON SEQUENCE usuarios_id_seq TO boletin_auth;

GRANT SELECT, INSERT, UPDATE ON sesiones TO boletin_auth;
GRANT USAGE ON SEQUENCE sesiones_id_seq TO boletin_auth;

-- ALTER DEFAULT PRIVILEGES (ver 007_rls.sql) le da SELECT a boletin_api en toda
-- tabla nueva; sesiones guarda hashes de tokens, así que se lo revocamos como
-- capa extra además del @omit.
REVOKE ALL ON sesiones FROM boletin_api;
REVOKE ALL ON sesiones_id_seq FROM boletin_api;
