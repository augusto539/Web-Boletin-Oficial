-- Tablas de agregados precomputados para la sección /informes (ver
-- docs/pendientes.md, "Página de informes"). A diferencia del resto del
-- schema (que carga el pipeline Python externo), estas dos las escribe
-- exclusivamente nuestro propio backend (backend/src/informes.ts, job
-- diario + botón manual en admin) — por eso no pasan por boletin_api/RLS
-- como el resto: las lee el mismo rol admin que ya usa el pool de
-- backend/src/auth.ts (DATABASE_URL).

CREATE TABLE informe_departamentos_activos (
    departamento_id integer PRIMARY KEY REFERENCES departamentos(id),
    cantidad_sociedades integer NOT NULL,
    cantidad_ultimo_anio integer NOT NULL,
    actualizado_el timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE informe_anuario (
    anio integer PRIMARY KEY,
    sociedades_constituidas integer NOT NULL,
    personas_involucradas integer NOT NULL,
    grupo_clae_mas_activo text,
    departamento_mas_activo text,
    tipo_sociedad_mas_comun text,
    actualizado_el timestamptz NOT NULL DEFAULT now()
);
