-- Tokens de "olvidé mi contraseña", mismo criterio que sesiones (022): se
-- guarda el sha256 del token, nunca el token en crudo, y usado_el marca los
-- que ya se consumieron (un token solo sirve una vez).
CREATE TABLE resets_contrasena (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expira_el TIMESTAMPTZ NOT NULL,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT now(),
    usado_el TIMESTAMPTZ
);

CREATE INDEX resets_contrasena_usuario_id_idx ON resets_contrasena (usuario_id);

COMMENT ON TABLE resets_contrasena IS E'@omit\nTokens de recuperación de contraseña. No exponer en la API pública.';

GRANT SELECT, INSERT, UPDATE ON resets_contrasena TO boletin_auth;
GRANT USAGE ON SEQUENCE resets_contrasena_id_seq TO boletin_auth;

-- ALTER DEFAULT PRIVILEGES (ver 007_rls.sql) le da SELECT a boletin_api en
-- toda tabla nueva; se revoca como capa extra además del @omit.
REVOKE ALL ON resets_contrasena FROM boletin_api;
REVOKE ALL ON resets_contrasena_id_seq FROM boletin_api;
