CREATE TABLE boletines (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    nro_edicion TEXT,
    id_pdf TEXT,
    url TEXT
);

CREATE TABLE escribanos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    registro_notarial TEXT
);

-- nombre_normalizado (MAYÚSCULAS sin acentos) es exclusivamente la clave de
-- matching para búsqueda difusa; la UI siempre debe mostrar `nombre`.
-- `oculta` es el flag de habeas data: cualquier consulta pública tiene que
-- filtrar oculta = false (se refuerza con RLS, ver 006_rls.sql).
CREATE TABLE sociedades (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    nombre_normalizado TEXT NOT NULL,
    cuit TEXT,
    tipo_sociedad_id INTEGER REFERENCES tipos_sociedad (id),
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    empleador BOOLEAN,
    fecha_constitucion DATE,
    capital_inicial NUMERIC(18, 2),
    objeto_social TEXT,
    sector_id INTEGER REFERENCES sectores (id),
    domicilio_id INTEGER REFERENCES domicilios (id),
    estado_ganancias_id INTEGER REFERENCES estados_ganancias (id),
    estado_iva_id INTEGER REFERENCES estados_iva (id),
    oculta BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE personas_fisicas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    nombre_normalizado TEXT NOT NULL,
    tipo_documento TEXT,
    documento TEXT,
    cuit TEXT,
    profesion TEXT,
    fecha_nacimiento DATE,
    domicilio_id INTEGER REFERENCES domicilios (id),
    oculta BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabla propia (no una columna/lista) porque una sociedad puede tener varias
-- actividades CLAE a la vez, y se conserva el historial de altas/bajas de cada una.
CREATE TABLE sociedad_actividades (
    id SERIAL PRIMARY KEY,
    sociedad_id INTEGER NOT NULL REFERENCES sociedades (id),
    actividad_clae_id INTEGER NOT NULL REFERENCES actividades_clae (id),
    principal BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_alta DATE,
    fecha_baja DATE
);
