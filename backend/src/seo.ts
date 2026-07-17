import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type Request, type Response, Router } from "express";
import { Pool } from "pg";
import { asyncHandler } from "./asyncHandler.js";

// Middleware de SEO: sirve el mismo index.html de la SPA pero con
// title/description/canonical/JSON-LD únicos por entidad, más un bloque de
// HTML plano con los datos clave — así el crawler ve contenido real en el
// primer response, sin depender de que ejecute el JS de React. Cuando React
// monta, reemplaza ese bloque con la ficha interactiva de siempre.
//
// Usa boletin_api (mismo rol de solo lectura que PostGraphile), así que la
// RLS de habeas data (oculta = false) aplica automáticamente acá también.
let poolSingleton: Pool | null = null;
function pool(): Pool {
  if (!poolSingleton) {
    poolSingleton = new Pool({ connectionString: process.env.DATABASE_URL_API });
  }
  return poolSingleton;
}

const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "frontend", "dist");
const indexHtmlPath = join(distDir, "index.html");

// Se lee una sola vez y se cachea en memoria: el archivo no cambia sin un
// rebuild + restart del proceso.
let indexHtmlCache: string | null = null;
function leerIndexHtml(): string | null {
  if (indexHtmlCache) return indexHtmlCache;
  if (!existsSync(indexHtmlPath)) return null;
  indexHtmlCache = readFileSync(indexHtmlPath, "utf-8");
  return indexHtmlCache;
}

function escapeHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function siteUrl(): string {
  return (process.env.SITE_URL ?? "http://localhost:5050").replace(/\/$/, "");
}

function formatCuit(valor: string | null): string | null {
  if (!valor) return null;
  const d = valor.replace(/\D/g, "");
  return d.length === 11 ? `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}` : valor;
}

function formatFecha(iso: string | Date | null): string | null {
  if (!iso) return null;
  const s = typeof iso === "string" ? iso : iso.toISOString();
  const [anio, mes, dia] = s.slice(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
}

interface Inyeccion {
  title: string;
  description: string;
  canonical: string;
  noindex: boolean;
  jsonLd?: object;
  contentHtml: string;
}

function renderHtml(base: string, i: Inyeccion): string {
  let html = base;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(i.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"[^>]*\/>/,
    `<meta name="description" content="${escapeHtml(i.description)}" />`,
  );
  const extras = [
    `<link rel="canonical" href="${escapeHtml(i.canonical)}" />`,
    i.noindex
      ? `<meta name="robots" content="noindex, follow" />`
      : `<meta name="robots" content="index, follow" />`,
    `<meta property="og:title" content="${escapeHtml(i.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(i.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeHtml(i.canonical)}" />`,
    i.jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(i.jsonLd)}</script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");
  html = html.replace("</head>", `    ${extras}\n  </head>`);
  // El bloque estático va antes que el script de React, para que sea lo
  // primero que aparece en el HTML de respuesta. React lo pisa al montar
  // (mismo id que usaría cualquier contenido inicial de #root).
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${i.contentHtml}</div>`,
  );
  return html;
}

export const seoRouter = Router();

seoRouter.get(
  "/sociedad/:id",
  asyncHandler(async (req: Request, res: Response, next) => {
  const base = leerIndexHtml();
  if (!base) return next(); // sin build de prod, deja que el dev server de Vite maneje la ruta

  const id = req.params.id;
  const { rows } = await pool().query<{
    id: string;
    nombre: string;
    cuit: string | null;
    fecha_constitucion: string | null;
    updated_at: string;
    tipo_sociedad: string | null;
    departamento: string | null;
    actividad_principal: string | null;
    cant_vinculos: string;
    cant_actos: string;
  }>(
    `SELECT
       s.id, s.nombre, s.cuit, s.fecha_constitucion, s.updated_at,
       ts.nombre AS tipo_sociedad,
       dep.nombre AS departamento,
       gc.nombre AS actividad_principal,
       (SELECT count(*) FROM vinculos v WHERE v.sociedad_id = s.id) AS cant_vinculos,
       (SELECT count(*) FROM actos a WHERE a.sociedad_id = s.id) AS cant_actos
     FROM sociedades s
     LEFT JOIN tipos_sociedad ts ON ts.id = s.tipo_sociedad_id
     LEFT JOIN domicilios d ON d.id = s.domicilio_id
     LEFT JOIN localidades loc ON loc.id = d.localidad_id
     LEFT JOIN departamentos dep ON dep.id = loc.departamento_id
     LEFT JOIN sociedad_actividades sa ON sa.sociedad_id = s.id AND sa.orden = 1
     LEFT JOIN grupos_clae gc ON gc.codigo = sa.clae_grupo
     WHERE s.id = $1 AND s.oculta = FALSE`,
    [id],
  );
  const s = rows[0];
  if (!s) {
    // Id con formato válido pero que no existe (o está oculta): 404 real, no
    // un 200 silencioso — importa para que el crawler no la trate como
    // contenido válido. React igual muestra el "no encontramos esa sociedad"
    // de siempre al montar sobre este mismo HTML base.
    res.status(404).set("Content-Type", "text/html; charset=utf-8");
    return res.send(
      renderHtml(base, {
        title: "Sociedad no encontrada | INGcome",
        description: "No encontramos esa sociedad en la base.",
        canonical: `${siteUrl()}/sociedad/${id}`,
        noindex: true,
        contentHtml: "",
      }),
    );
  }

  const { rows: socios } = await pool().query<{
    nombre: string;
    rol: string;
    tipo: string | null;
    id: string | null;
  }>(
    `SELECT
       coalesce(p.nombre, sm.nombre, v.nombre_juridico_fallback) AS nombre,
       r.nombre AS rol,
       CASE WHEN p.id IS NOT NULL THEN 'persona' WHEN sm.id IS NOT NULL THEN 'sociedad' ELSE NULL END AS tipo,
       coalesce(p.id, sm.id)::text AS id
     FROM vinculos v
     JOIN roles r ON r.id = v.rol_id
     LEFT JOIN personas_fisicas p ON p.id = v.persona_id AND p.oculta = FALSE
     LEFT JOIN sociedades sm ON sm.id = v.sociedad_miembro_id AND sm.oculta = FALSE
     WHERE v.sociedad_id = $1
     ORDER BY v.fecha_entrada NULLS LAST
     LIMIT 20`,
    [id],
  );

  const cuit = formatCuit(s.cuit);
  const fechaConst = formatFecha(s.fecha_constitucion);
  const cantVinculos = Number(s.cant_vinculos);
  const cantActos = Number(s.cant_actos);

  const title = cuit
    ? `${s.nombre} — CUIT ${cuit} | INGcome`
    : `${s.nombre} | INGcome`;

  const descPartes = [
    s.tipo_sociedad ? `${s.tipo_sociedad}` : "Sociedad",
    fechaConst ? `constituida el ${fechaConst}` : null,
    s.departamento ? `en ${s.departamento}, Mendoza` : null,
  ].filter(Boolean);
  let description = descPartes.join(" ") + ".";
  if (s.actividad_principal) description += ` Actividad: ${s.actividad_principal}.`;
  if (cantVinculos > 0) {
    description += ` ${cantVinculos} vínculo${cantVinculos === 1 ? "" : "s"} societario${cantVinculos === 1 ? "" : "s"} registrado${cantVinculos === 1 ? "" : "s"}.`;
  }

  // "Thin content": sin CUIT, sin fecha de constitución, sin vínculos y sin
  // actos no aporta nada distinto a un listado — no vale la pena indexarla
  // (mejor pocas páginas sustanciosas que miles casi vacías).
  const noindex = !s.cuit && !s.fecha_constitucion && cantVinculos === 0 && cantActos === 0;

  // Cuando el pipeline todavía no resolvió el socio a una persona o sociedad
  // real (solo tiene el nombre en texto, "nombre_juridico_fallback"), no hay
  // a dónde linkear — mismo criterio que la ficha interactiva ("aún no
  // relevada").
  const sociosHtml = socios
    .map((v) =>
      v.tipo && v.id
        ? `<li><a href="/${v.tipo}/${v.id}">${escapeHtml(v.nombre)}</a> — ${escapeHtml(v.rol)}</li>`
        : `<li>${escapeHtml(v.nombre)} — ${escapeHtml(v.rol)}</li>`,
    )
    .join("");

  const contentHtml = `
    <main>
      <h1>${escapeHtml(s.nombre)}</h1>
      <p>${cuit ? `CUIT ${escapeHtml(cuit)}` : ""}${s.tipo_sociedad ? ` · ${escapeHtml(s.tipo_sociedad)}` : ""}${fechaConst ? ` · Constituida el ${escapeHtml(fechaConst)}` : ""}</p>
      ${s.departamento ? `<p>Domicilio: ${escapeHtml(s.departamento)}, Mendoza</p>` : ""}
      ${s.actividad_principal ? `<p>Actividad principal: ${escapeHtml(s.actividad_principal)}</p>` : ""}
      ${socios.length > 0 ? `<h2>Socios y autoridades</h2><ul>${sociosHtml}</ul>` : ""}
    </main>
  `.trim();

  const canonical = `${siteUrl()}/sociedad/${s.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.nombre,
    ...(cuit
      ? { identifier: { "@type": "PropertyValue", propertyID: "CUIT", value: cuit } }
      : {}),
    ...(s.fecha_constitucion ? { foundingDate: s.fecha_constitucion } : {}),
    ...(s.departamento
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: s.departamento,
            addressRegion: "Mendoza",
            addressCountry: "AR",
          },
        }
      : {}),
    url: canonical,
  };

  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(
    renderHtml(base, { title, description, canonical, noindex, jsonLd, contentHtml }),
  );
  }),
);

// Personas: siempre noindex. A diferencia de las sociedades, publicar en
// buscadores nombre + domicilio + fecha de nacimiento de una persona física
// es un riesgo de habeas data (Ley 25.326) que no vale el beneficio de SEO
// — la sociedad ya es indexable y cubre la búsqueda relevante ("quién es
// socio de tal empresa"). Si en el futuro se decide indexar personas, nunca
// debe ir el DNI en title/description.
seoRouter.get(
  "/persona/:id",
  asyncHandler(async (req: Request, res: Response, next) => {
  const base = leerIndexHtml();
  if (!base) return next();

  const { rows } = await pool().query<{ id: string; nombre: string }>(
    "SELECT id, nombre FROM personas_fisicas WHERE id = $1 AND oculta = FALSE",
    [req.params.id],
  );
  const p = rows[0];
  if (!p) {
    res.status(404).set("Content-Type", "text/html; charset=utf-8");
    return res.send(
      renderHtml(base, {
        title: "Persona no encontrada | INGcome",
        description: "No encontramos esa persona en la base.",
        canonical: `${siteUrl()}/persona/${req.params.id}`,
        noindex: true,
        contentHtml: "",
      }),
    );
  }

  const title = `${p.nombre} | INGcome`;
  const canonical = `${siteUrl()}/persona/${p.id}`;
  const contentHtml = `<main><h1>${escapeHtml(p.nombre)}</h1></main>`;

  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(
    renderHtml(base, {
      title,
      description: "Ficha de persona física en el Boletín Oficial de Mendoza.",
      canonical,
      noindex: true,
      contentHtml,
    }),
  );
  }),
);

seoRouter.get("/robots.txt", (_req: Request, res: Response) => {
  res.type("text/plain").send(
    [
      "User-agent: *",
      "Disallow: /admin",
      "Disallow: /login",
      "Disallow: /registro",
      "Disallow: /notificaciones",
      "Disallow: /olvide-contrasena",
      "Disallow: /restablecer-contrasena",
      "Disallow: /persona/",
      "",
      `Sitemap: ${siteUrl()}/sitemap.xml`,
      "",
    ].join("\n"),
  );
});

seoRouter.get("/sitemap.xml", (_req: Request, res: Response) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${siteUrl()}/sitemap-sociedades.xml</loc></sitemap>
</sitemapindex>`;
  res.type("application/xml").send(xml);
});

seoRouter.get(
  "/sitemap-sociedades.xml",
  asyncHandler(async (_req: Request, res: Response) => {
    // Mismo criterio de "thin content" que en la inyección de meta tags: solo
    // van al sitemap las sociedades con algo sustancial para mostrar.
    const { rows } = await pool().query<{ id: string; updated_at: string }>(
      `SELECT s.id, s.updated_at
     FROM sociedades s
     WHERE s.oculta = FALSE
       AND (
         s.cuit IS NOT NULL
         OR s.fecha_constitucion IS NOT NULL
         OR EXISTS (SELECT 1 FROM vinculos v WHERE v.sociedad_id = s.id)
         OR EXISTS (SELECT 1 FROM actos a WHERE a.sociedad_id = s.id)
       )
     ORDER BY s.id`,
    );
    const urls = rows
      .map(
        (r) =>
          `  <url><loc>${siteUrl()}/sociedad/${r.id}</loc><lastmod>${new Date(r.updated_at).toISOString().slice(0, 10)}</lastmod></url>`,
      )
      .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    res.type("application/xml").send(xml);
  }),
);
