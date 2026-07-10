import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import pluralize from "pluralize";
import { postgraphile } from "postgraphile";
import { adminRouter } from "./admin.js";
import { authRouter, requireAdmin } from "./auth.js";
import { leadsRouter } from "./leads.js";
import { seoRouter } from "./seo.js";

config({ path: join(dirname(fileURLToPath(import.meta.url)), "..", "..", ".env") });

// El inflector por defecto de PostGraphile asume reglas de pluralización en
// inglés (solo saca la "s" final), lo que rompe nombres en español como
// "sociedades" -> "sociedade" en vez de "sociedad". `pluralize` es la misma
// instancia que usa PostGraphile internamente, así que estas reglas
// irregulares corrigen los nombres generados en el schema GraphQL.
const irregulares: Array<[singular: string, plural: string]> = [
  ["sociedad", "sociedades"],
  ["persona_fisica", "personas_fisicas"],
  ["vinculo", "vinculos"],
  ["acto", "actos"],
  ["boletin", "boletines"],
  ["sociedad_actividad", "sociedad_actividades"],
  ["provincia", "provincias"],
  ["departamento", "departamentos"],
  ["localidad", "localidades"],
  ["domicilio", "domicilios"],
  ["tipo_sociedad", "tipos_sociedad"],
  ["tipo_acto", "tipos_acto"],
  ["rol", "roles"],
  ["sector", "sectores"],
  ["estado_ganancias", "estados_ganancias"],
  ["estado_iva", "estados_iva"],
  ["actividad_clae", "actividades_clae"],
  ["grupo_clae", "grupos_clae"],
  ["tipo_match_arca", "tipos_match_arca"],
];
for (const [singular, plural] of irregulares) {
  pluralize.addIrregularRule(singular, plural);
}

const app = express();

// credentials: true para que el navegador mande/reciba las cookies de auth en
// los fetch cross-origin (front 5173 -> back 5050). Requiere origin explícito,
// no "*".
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Auth (REST) va antes de PostGraphile; son rutas separadas de la API GraphQL.
app.use("/api/auth", authRouter);
app.use("/api/admin", requireAdmin(), adminRouter);
app.use("/api/leads", leadsRouter);

app.use(
  postgraphile(process.env.DATABASE_URL_API, "public", {
    watchPg: process.env.NODE_ENV !== "production",
    // El rol de queries (boletin_api) es de solo lectura a propósito; el modo
    // watch necesita privilegios de owner para instalar sus triggers de
    // notificación de cambios de schema, así que se los damos aparte.
    ownerConnectionString: process.env.DATABASE_URL,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    // Respeta los GRANT/RLS reales de Postgres al armar el schema, en vez de
    // exponer todo e ignorar los permisos del rol boletin_api.
    ignoreRBAC: false,
    // La API es de solo lectura por ahora: la carga de datos la hace el
    // pipeline Python directo contra Postgres, no esta API.
    disableDefaultMutations: true,
  }),
);

// SEO: title/description/canonical/JSON-LD únicos por sociedad/persona,
// inyectados sobre el mismo index.html de la SPA (ver seo.ts). También sirve
// robots.txt y el sitemap. Antes del catch-all de abajo para poder
// interceptar esas rutas puntuales.
app.use(seoRouter);

// Solo en producción (o cuando ya se corrió `npm run build --workspace
// frontend`) existe frontend/dist: en dev, el frontend corre aparte con
// `vite dev` en su propio puerto, así que esto queda inerte y no afecta el
// flujo de desarrollo habitual.
const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "frontend", "dist");
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  // Cualquier ruta que no matcheó arriba (ni /api, ni SEO, ni un archivo del
  // build) es una ruta de React Router: se le manda el index.html y el
  // router del lado del cliente resuelve.
  app.get("*", (_req, res) => {
    res.sendFile(join(distDir, "index.html"));
  });
}

const port = Number(process.env.PORT ?? 5000);
app.listen(port, () => {
  console.log(`PostGraphile escuchando en http://localhost:${port}/graphiql`);
});
