-- Agregados nuevos para /informes/anuario-:anio (ver InformeAnuario.tsx):
-- distribución mensual, distribución por tipo de sociedad, y ranking de
-- actividades (grupo CLAE) -- mismo patrón que informe_departamento_por_anio
-- (031/035): una fila por (anio, dimension), recalculadas enteras en cada
-- corrida de recalcularInformes() (backend/src/informes.ts).
--
-- La distribución territorial no necesita tabla nueva: ya la cubre
-- informe_departamento_por_anio, filtrando por anio.

CREATE TABLE informe_anuario_mes (
    anio integer NOT NULL,
    mes integer NOT NULL CHECK (mes BETWEEN 1 AND 12),
    cantidad_sociedades integer NOT NULL,
    actualizado_el timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (anio, mes)
);

CREATE TABLE informe_anuario_tipo_sociedad (
    anio integer NOT NULL,
    tipo_sociedad text NOT NULL,
    cantidad_sociedades integer NOT NULL,
    actualizado_el timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (anio, tipo_sociedad)
);

-- Ranking completo de grupos CLAE por año (no solo el más frecuente, que ya
-- guarda informe_anuario.grupo_clae_mas_activo) -- el top 10 se recorta en
-- el endpoint, no acá, para poder cambiar cuántos mostrar sin recalcular.
CREATE TABLE informe_anuario_actividad (
    anio integer NOT NULL,
    grupo_clae text NOT NULL,
    cantidad_sociedades integer NOT NULL,
    actualizado_el timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (anio, grupo_clae)
);

GRANT SELECT, INSERT, UPDATE ON informe_anuario_mes TO boletin_auth;
GRANT SELECT ON informe_anuario_mes TO boletin_api;

GRANT SELECT, INSERT, UPDATE ON informe_anuario_tipo_sociedad TO boletin_auth;
GRANT SELECT ON informe_anuario_tipo_sociedad TO boletin_api;

GRANT SELECT, INSERT, UPDATE ON informe_anuario_actividad TO boletin_auth;
GRANT SELECT ON informe_anuario_actividad TO boletin_api;
