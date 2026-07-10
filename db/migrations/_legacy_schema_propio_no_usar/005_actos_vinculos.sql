-- Historial temporal: qué pasó y cuándo, con trazabilidad a la edición del
-- Boletín Oficial donde salió publicado.
CREATE TABLE actos (
    id SERIAL PRIMARY KEY,
    sociedad_id INTEGER NOT NULL REFERENCES sociedades (id),
    tipo_acto_id INTEGER NOT NULL REFERENCES tipos_acto (id),
    fecha_acto DATE,
    fecha_publicacion DATE,
    boletin_id INTEGER REFERENCES boletines (id),
    descripcion TEXT,
    capital_anterior NUMERIC(18, 2),
    capital_nuevo NUMERIC(18, 2),
    escribano_id INTEGER REFERENCES escribanos (id),
    registro_notarial TEXT
);

-- La tabla más importante: cada fila es una arista del grafo. El "miembro"
-- del vínculo es exactamente UNA de estas tres opciones:
--   1) persona_id                                  -> persona física ya cargada
--   2) sociedad_miembro_id                         -> otra sociedad ya cargada
--   3) nombre_juridico_fallback / cuit_juridico_fallback -> sociedad socia que
--      todavía no está en la base, para no perder el dato hasta que se cargue.
CREATE TABLE vinculos (
    id SERIAL PRIMARY KEY,
    sociedad_id INTEGER NOT NULL REFERENCES sociedades (id),
    rol_id INTEGER NOT NULL REFERENCES roles (id),
    persona_id INTEGER REFERENCES personas_fisicas (id),
    sociedad_miembro_id INTEGER REFERENCES sociedades (id),
    nombre_juridico_fallback TEXT,
    cuit_juridico_fallback TEXT,
    porcentaje_participacion NUMERIC(5, 2),
    cuotas_inicial NUMERIC(18, 2),
    cuotas_actual NUMERIC(18, 2),
    fecha_entrada DATE,
    fecha_salida DATE,
    acto_alta_id INTEGER REFERENCES actos (id),
    acto_baja_id INTEGER REFERENCES actos (id),
    CONSTRAINT vinculos_un_solo_tipo_miembro CHECK (
        (
            (persona_id IS NOT NULL)::INTEGER +
            (sociedad_miembro_id IS NOT NULL)::INTEGER +
            (nombre_juridico_fallback IS NOT NULL)::INTEGER
        ) = 1
    )
);
