-- Configuraciones globales del sitio, editables desde el panel de admin
-- (tab Configuración). Clave/valor en vez de una columna por config: evita
-- una migración nueva cada vez que se agregue un toggle más.
CREATE TABLE configuraciones (
    clave text PRIMARY KEY,
    valor boolean NOT NULL DEFAULT false,
    actualizado_el timestamptz NOT NULL DEFAULT now()
);

-- "Modo solo administradores": mientras esté activo, búsqueda avanzada,
-- exploración del grafo y el buscador de la landing quedan inaccesibles
-- para cualquiera que no sea admin (ver backend/src/configuracion.ts).
INSERT INTO configuraciones (clave, valor) VALUES ('modo_solo_admin', false);

-- Solo boletin_auth la toca (rutas /api/configuracion y /api/admin/*, nunca
-- expuesta vía GraphQL público).
GRANT SELECT, UPDATE ON configuraciones TO boletin_auth;
