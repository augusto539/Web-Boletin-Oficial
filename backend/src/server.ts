import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import pluralize from "pluralize";
import { postgraphile } from "postgraphile";
import { adminRouter } from "./admin.js";
import { authRouter, requireAdmin, usuarioDesdeToken } from "./auth.js";
import {
  cargarConfiguracion,
  configuracionAdminRouter,
  configuracionPublicaRouter,
  modoSoloAdminActivo,
} from "./configuracion.js";
import { historialRouter } from "./historial.js";
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
//
// En dev siempre se acepta cualquier origin puerto 5173 (no solo
// localhost, aunque el .env de dev traiga CORS_ORIGIN=http://localhost:5173
// como default documentado): así se puede entrar desde el celu por la IP de
// LAN de la máquina (para revisar el sitio en mobile) sin tocar el .env cada
// vez que esa IP cambia. En producción NODE_ENV=production fuerza el
// whitelist estricto de CORS_ORIGIN (ver docker-compose.prod.yml).
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? (process.env.CORS_ORIGIN ?? "http://localhost:5173")
        : /^http:\/\/[^/]+:5173$/,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Auth (REST) va antes de PostGraphile; son rutas separadas de la API GraphQL.
app.use("/api/auth", authRouter);
app.use("/api/admin", requireAdmin(), adminRouter);
app.use("/api/admin", requireAdmin(), configuracionAdminRouter);
app.use("/api/configuracion", configuracionPublicaRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/historial", historialRouter);

// "Modo solo administradores" (tab Configuración de /admin): bloquea la
// búsqueda avanzada para cualquiera que no sea admin. El front también
// oculta el punto de entrada (Nav, rutas), pero eso es solo UX — esta es
// la protección real, porque es una operación GraphQL pública que
// cualquiera podría llamar directo sin pasar por la UI.
//
// grafoDeSociedad/grafoDePersona NO se bloquean acá a propósito: son las
// mismas queries que usan los mini-grafos de vínculos embebidos en las
// fichas de Sociedad/Persona (siempre públicas, no forman parte de este
// toggle) — bloquearlas rompería esas páginas para todo el mundo. La
// exploración interactiva (/exploracion) queda protegida solo a nivel de
// ruta en el frontend (RutaSoloAdminSiActivo); no hay forma de distinguir
// "vengo del mini-grafo" de "vengo de /exploracion" en la misma query.
const OPERACIONES_SOLO_ADMIN = ["buscarSociedadesAvanzado", "buscarPersonasAvanzado"];
app.use("/graphql", async (req, res, next) => {
  if (!modoSoloAdminActivo()) return next();
  const query = typeof req.body?.query === "string" ? req.body.query : "";
  if (!OPERACIONES_SOLO_ADMIN.some((op) => query.includes(op))) return next();

  const usuario = await usuarioDesdeToken(req.cookies?.access_token);
  if (usuario?.admin) return next();

  return res.status(200).json({
    errors: [{ message: "Esta función está disponible solo para administradores por el momento." }],
  });
});

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

// Error handler global, al final de todos los app.use()/app.get() (Express
// solo lo reconoce como error handler por tener 4 parámetros). Sin esto, un
// error en un handler async que ya pasó por asyncHandler() (ver
// asyncHandler.ts) igual tumbaba el proceso entero: Express no tiene a quién
// más mandarle el error, y sin un handler acá la promesa rechazada quedaba
// sin manejar. Ahora responde 500 y el proceso sigue vivo.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (res.headersSent) return;
  res.status(500).json({ error: "Error interno del servidor." });
});

await cargarConfiguracion();

const port = Number(process.env.PORT ?? 5000);
app.listen(port, () => {
  console.log(`PostGraphile escuchando en http://localhost:${port}/graphiql`);
});
