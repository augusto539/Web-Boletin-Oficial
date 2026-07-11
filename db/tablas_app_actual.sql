-- Snapshot de las tablas propias de la app (no las del pipeline de datos:
-- sociedades, personas_fisicas, vinculos, actos, boletines, etc.).
-- Generado con pg_dump --schema-only contra la base actual, para usar como
-- base de referencia al hacer ajustes. No es una migración: los cambios reales
-- van en db/migrations/ como archivos nuevos (ver db/migrate.ts).

-- =========================================================
-- usuarios
-- =========================================================
CREATE TABLE public.usuarios (
    id bigint NOT NULL,
    mail text NOT NULL,
    contrasena_hash text NOT NULL,
    nombre text NOT NULL,
    plan text DEFAULT 'free'::text NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    creado_el timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.usuarios IS '@omit
Usuarios de la app (auth). No exponer en la API pública.';

CREATE SEQUENCE public.usuarios_id_seq
    START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;
ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);

ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_mail_key UNIQUE (mail);

GRANT SELECT, INSERT, UPDATE ON public.usuarios TO boletin_auth;
GRANT USAGE ON SEQUENCE public.usuarios_id_seq TO boletin_auth;
REVOKE ALL ON public.usuarios FROM boletin_api;

-- =========================================================
-- sesiones (refresh tokens)
-- =========================================================
CREATE TABLE public.sesiones (
    id bigint NOT NULL,
    usuario_id bigint NOT NULL,
    token_hash text NOT NULL,
    expira_el timestamp with time zone NOT NULL,
    creado_el timestamp with time zone DEFAULT now() NOT NULL,
    revocada_el timestamp with time zone
);

COMMENT ON TABLE public.sesiones IS '@omit
Sesiones/refresh tokens de auth. No exponer en la API pública.';

CREATE SEQUENCE public.sesiones_id_seq
    START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.sesiones_id_seq OWNED BY public.sesiones.id;
ALTER TABLE ONLY public.sesiones ALTER COLUMN id SET DEFAULT nextval('public.sesiones_id_seq'::regclass);

ALTER TABLE ONLY public.sesiones ADD CONSTRAINT sesiones_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sesiones ADD CONSTRAINT sesiones_token_hash_key UNIQUE (token_hash);
ALTER TABLE ONLY public.sesiones
    ADD CONSTRAINT sesiones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;

CREATE INDEX sesiones_usuario_id_idx ON public.sesiones USING btree (usuario_id);

GRANT SELECT, INSERT, UPDATE ON public.sesiones TO boletin_auth;
GRANT USAGE ON SEQUENCE public.sesiones_id_seq TO boletin_auth;
REVOKE ALL ON public.sesiones FROM boletin_api;

-- =========================================================
-- resets_contrasena
-- =========================================================
CREATE TABLE public.resets_contrasena (
    id bigint NOT NULL,
    usuario_id bigint NOT NULL,
    token_hash text NOT NULL,
    expira_el timestamp with time zone NOT NULL,
    creado_el timestamp with time zone DEFAULT now() NOT NULL,
    usado_el timestamp with time zone
);

COMMENT ON TABLE public.resets_contrasena IS '@omit
Tokens de recuperación de contraseña. No exponer en la API pública.';

CREATE SEQUENCE public.resets_contrasena_id_seq
    START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.resets_contrasena_id_seq OWNED BY public.resets_contrasena.id;
ALTER TABLE ONLY public.resets_contrasena ALTER COLUMN id SET DEFAULT nextval('public.resets_contrasena_id_seq'::regclass);

ALTER TABLE ONLY public.resets_contrasena ADD CONSTRAINT resets_contrasena_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.resets_contrasena ADD CONSTRAINT resets_contrasena_token_hash_key UNIQUE (token_hash);
ALTER TABLE ONLY public.resets_contrasena
    ADD CONSTRAINT resets_contrasena_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;

CREATE INDEX resets_contrasena_usuario_id_idx ON public.resets_contrasena USING btree (usuario_id);

GRANT SELECT, INSERT, UPDATE ON public.resets_contrasena TO boletin_auth;
GRANT USAGE ON SEQUENCE public.resets_contrasena_id_seq TO boletin_auth;
REVOKE ALL ON public.resets_contrasena FROM boletin_api;

-- =========================================================
-- leads_informe (lead magnet de la landing)
-- =========================================================
CREATE TABLE public.leads_informe (
    id bigint NOT NULL,
    mail text NOT NULL,
    creado_el timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.leads_informe IS '@omit
Leads del informe trimestral (landing). No exponer en la API pública.';

CREATE SEQUENCE public.leads_informe_id_seq
    START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.leads_informe_id_seq OWNED BY public.leads_informe.id;
ALTER TABLE ONLY public.leads_informe ALTER COLUMN id SET DEFAULT nextval('public.leads_informe_id_seq'::regclass);

ALTER TABLE ONLY public.leads_informe ADD CONSTRAINT leads_informe_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.leads_informe ADD CONSTRAINT leads_informe_mail_key UNIQUE (mail);

-- Solo lectura+alta (sin update): el form de la landing únicamente inserta.
GRANT SELECT, INSERT ON public.leads_informe TO boletin_auth;
GRANT USAGE ON SEQUENCE public.leads_informe_id_seq TO boletin_auth;
REVOKE ALL ON public.leads_informe FROM boletin_api;
