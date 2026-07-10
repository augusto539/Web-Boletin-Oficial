CREATE TABLE tipos_sociedad (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE tipos_acto (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE sectores (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE estados_ganancias (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE estados_iva (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE actividades_clae (
    id SERIAL PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL
);

INSERT INTO tipos_sociedad (nombre) VALUES
    ('S.A.'), ('S.R.L.'), ('S.A.S.'), ('S.C.'), ('S.A.C.I.'), ('Sociedad de Hecho');

INSERT INTO tipos_acto (nombre) VALUES
    ('Constitución'), ('Aumento de capital'), ('Disolución'), ('Modificación de autoridades'),
    ('Cesión de cuotas'), ('Cambio de objeto social'), ('Cambio de domicilio'), ('Transformación');

INSERT INTO roles (nombre) VALUES
    ('Socio'), ('Presidente'), ('Vicepresidente'), ('Director Titular'), ('Director Suplente'),
    ('Gerente'), ('Apoderado'), ('Síndico'), ('Socio Comanditado'), ('Socio Comanditario');

INSERT INTO sectores (nombre) VALUES
    ('Agropecuario'), ('Comercio'), ('Construcción'), ('Industria'), ('Servicios'),
    ('Tecnología'), ('Transporte'), ('Turismo y Gastronomía');

INSERT INTO estados_ganancias (nombre) VALUES
    ('Inscripto'), ('No inscripto'), ('Exento'), ('Monotributo');

INSERT INTO estados_iva (nombre) VALUES
    ('Responsable Inscripto'), ('Monotributo'), ('Exento'), ('No alcanzado');

INSERT INTO actividades_clae (codigo, nombre) VALUES
    ('011110', 'Cultivo de cereales'),
    ('412000', 'Construcción de edificios residenciales'),
    ('471110', 'Venta al por menor en comercios de alimentos'),
    ('620100', 'Actividades de programación informática'),
    ('681000', 'Actividades inmobiliarias con bienes propios'),
    ('691000', 'Actividades jurídicas'),
    ('561011', 'Restaurantes y servicios de comida');
