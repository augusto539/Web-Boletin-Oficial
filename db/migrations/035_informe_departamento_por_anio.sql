CREATE TABLE informe_departamento_por_anio (
    departamento_id integer NOT NULL REFERENCES departamentos(id),
    anio integer NOT NULL,
    cantidad_sociedades integer NOT NULL,
    actualizado_el timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (departamento_id, anio)
);

GRANT SELECT, INSERT, UPDATE ON informe_departamento_por_anio TO boletin_auth;
GRANT SELECT ON informe_departamento_por_anio TO boletin_api;
