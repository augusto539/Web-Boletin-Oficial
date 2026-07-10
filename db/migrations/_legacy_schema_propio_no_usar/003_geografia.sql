CREATE TABLE provincias (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    provincia_id INTEGER NOT NULL REFERENCES provincias (id),
    nombre TEXT NOT NULL,
    UNIQUE (provincia_id, nombre)
);

CREATE TABLE localidades (
    id SERIAL PRIMARY KEY,
    departamento_id INTEGER NOT NULL REFERENCES departamentos (id),
    nombre TEXT NOT NULL,
    UNIQUE (departamento_id, nombre)
);

-- domicilio_completo guarda siempre el texto crudo tal como salió publicado en
-- el Boletín; localidad_id es opcional porque no todos los domicilios se
-- pueden resolver a una localidad conocida.
CREATE TABLE domicilios (
    id SERIAL PRIMARY KEY,
    domicilio_completo TEXT NOT NULL,
    localidad_id INTEGER REFERENCES localidades (id)
);

INSERT INTO provincias (nombre) VALUES ('Mendoza');

INSERT INTO departamentos (provincia_id, nombre) VALUES
    (1, 'Capital'), (1, 'Godoy Cruz'), (1, 'Guaymallén'), (1, 'Las Heras'),
    (1, 'Luján de Cuyo'), (1, 'Maipú'), (1, 'San Rafael');

INSERT INTO localidades (departamento_id, nombre) VALUES
    (1, 'Ciudad de Mendoza'),
    (2, 'Godoy Cruz'),
    (3, 'Guaymallén'),
    (5, 'Chacras de Coria'),
    (5, 'Luján de Cuyo'),
    (7, 'San Rafael');
