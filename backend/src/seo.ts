import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type Request, type Response, Router } from "express";
import { Pool } from "pg";
import { asyncHandler } from "./asyncHandler.js";
import {
  DEPARTAMENTOS_CANNABIS,
  type EntidadCannabis,
  ENTIDADES,
  EVOLUCION_ANUAL,
  TIPO_ENTIDAD,
} from "./data/nichoCannabis.js";
import {
  DEPARTAMENTOS_ENOTURISMO,
  type EntidadEnoturismo,
  ENTIDADES as ENTIDADES_ENOTURISMO,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_ENOTURISMO,
  TIPO_ENTIDAD as TIPO_ENTIDAD_ENOTURISMO,
} from "./data/nichoEnoturismo.js";
import {
  DEPARTAMENTOS_BODEGAS,
  type EntidadBodega,
  ENTIDADES as ENTIDADES_BODEGAS,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_BODEGAS,
  TIPO_ENTIDAD as TIPO_ENTIDAD_BODEGAS,
} from "./data/nichoBodegasBoutique.js";

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

// Sección final compartida por las tres páginas de /informes (ver
// FuenteDatos.tsx en el frontend, mismo texto). `extraHtml` deja que
// /informes/departamentos-mas-activos agregue su propio párrafo sobre
// sociedades sin departamento dentro de la misma sección.
function fuenteDatosHtml(extraHtml = ""): string {
  return `
    <h2>Fuente y metodología</h2>
    <p>Este informe se elabora a partir de las publicaciones del Boletín Oficial de Mendoza —
    específicamente los edictos de constitución, modificación y demás actos societarios que la
    provincia publica de forma pública. Un proceso de extracción automatizado procesa cada
    publicación y estructura la información (nombre, domicilio, capital, actividad, fecha de
    constitución) en la base de datos que alimenta tanto la búsqueda del sitio como este informe.</p>
    <p>Por tratarse de datos extraídos de forma automatizada a partir de texto publicado en
    formatos heterogéneos a lo largo de los años, pueden existir imprecisiones. Distinguimos dos
    fuentes de error:</p>
    <p><strong>Errores del Boletín de origen.</strong> El proceso de extracción no corrige ni
    verifica el contenido de la publicación: si el Boletín Oficial publicó un dato con un error de
    tipeo, una fecha inconsistente o un capital mal transcripto, ese mismo error se refleja en
    nuestra base.</p>
    <p><strong>Limitaciones del proceso de extracción.</strong> Cuando un dato del Boletín es
    ambiguo, está incompleto o redactado de una forma que el proceso automatizado no puede
    interpretar con certeza, optamos por dejarlo sin informar antes que asignarle un valor que
    podría ser incorrecto.</p>
    ${extraHtml}
    <p>Este y el resto de los informes de esta sección son agregados estadísticos construidos
    sobre esa misma base, así que heredan sus limitaciones. Para un caso puntual, recomendamos
    verificar el dato contra la ficha de la sociedad correspondiente — que cita la publicación de
    origen del Boletín — o contra el Boletín Oficial directamente.</p>
  `;
}

function entidadHtml(e: EntidadCannabis): string {
  const flag = e.nombreGenerico
    ? `<p><em>El nombre de la entidad sugiere actividad de cannabis, pero el objeto social registrado es genérico y no lo menciona explícitamente — inclusión basada en el nombre, a confirmar.</em></p>`
    : "";
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) => `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`)
    .join(" · ");
  return `
    <h3>${escapeHtml(e.tipo)} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(e.cuit) : "—"} · Capital: ${e.capital ? escapeHtml(e.capital) : "—"} · Publicación: ${escapeHtml(e.publicacion)} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    <p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>
    ${flag}
  `;
}

function entidadesCannabisHtml(): string {
  return ENTIDADES.map(entidadHtml).join("");
}

function entidadEnoturismoHtml(e: EntidadEnoturismo): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.personaId
        ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
        : escapeHtml(s.nombre),
    )
    .join(" · ");
  return `
    <h3>${escapeHtml(e.tipo)} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(e.cuit) : "—"} · Capital: ${e.capital ? escapeHtml(e.capital) : "—"} · Publicación: ${escapeHtml(e.publicacion)} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    <p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>
  `;
}

function entidadesEnoturismoHtml(): string {
  return ENTIDADES_ENOTURISMO.map(entidadEnoturismoHtml).join("");
}

function entidadBodegaHtml(e: EntidadBodega): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.personaId
        ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
        : escapeHtml(s.nombre),
    )
    .join(" · ");
  return `
    <h3>${escapeHtml(e.tipo)} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(e.cuit) : "—"} · Capital: ${e.capital ? escapeHtml(e.capital) : "—"} · Publicación: ${e.publicacion ? escapeHtml(e.publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    <p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>
  `;
}

function entidadesBodegasHtml(): string {
  return ENTIDADES_BODEGAS.map(entidadBodegaHtml).join("");
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

// /informes/*: mismo patrón que sociedad/persona arriba (leerIndexHtml +
// renderHtml + contentHtml server-rendered), pero sobre las tablas
// precomputadas por backend/src/informes.ts (ver migraciones 031/034) en
// vez de calcular por request — son las páginas que más va a crawlear
// Google, no vale la pena pagar el join pesado en cada visita.
seoRouter.get(
  "/informes",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const { rows: anios } = await pool().query<{ anio: number }>(
      "SELECT anio FROM informe_anuario ORDER BY anio DESC",
    );

    const title = "Informes | INGcome";
    const description =
      "Estadísticas de sociedades constituidas en Mendoza: departamentos más activos y anuarios por año, con fuente citada en cada dato.";
    const canonical = `${siteUrl()}/informes`;

    const anuarioLinksHtml = anios
      .map((a) => `<li><a href="/informes/anuario-${a.anio}">Anuario ${a.anio}</a></li>`)
      .join("");

    const contentHtml = `
    <main>
      <h1>Informes</h1>
      <p>${escapeHtml(description)}</p>
      <h2>Estudios</h2>
      <ul>
        <li><a href="/informes/departamentos-mas-activos">Departamentos más activos</a></li>
      </ul>
      <h2>Nichos sectoriales</h2>
      <ul>
        <li><a href="/informes/nicho-cannabis">Cannabis y Cáñamo en Mendoza</a></li>
        <li><a href="/informes/nicho-enoturismo">Enoturismo en Mendoza</a></li>
        <li><a href="/informes/nicho-bodegas-boutique">Bodegas Boutique en Mendoza</a></li>
      </ul>
      ${anios.length > 0 ? `<h2>Anuarios</h2><ul>${anuarioLinksHtml}</ul>` : ""}
      ${fuenteDatosHtml()}
    </main>
  `.trim();

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, contentHtml }));
  }),
);

seoRouter.get(
  "/informes/departamentos-mas-activos",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const { rows } = await pool().query<{
      nombre: string;
      cantidad_sociedades: number;
      cantidad_ultimo_anio: number;
      actualizado_el: string;
    }>(
      `SELECT d.nombre, i.cantidad_sociedades, i.cantidad_ultimo_anio, i.actualizado_el
       FROM informe_departamentos_activos i
       JOIN departamentos d ON d.id = i.departamento_id
       ORDER BY i.cantidad_sociedades DESC`,
    );

    const { rows: filasPorAnio } = await pool().query<{
      nombre: string;
      anio: number;
      cantidad_sociedades: number;
    }>(
      `SELECT d.nombre, i.anio, i.cantidad_sociedades
       FROM informe_departamento_por_anio i
       JOIN departamentos d ON d.id = i.departamento_id
       ORDER BY d.nombre, i.anio`,
    );

    const { rows: sinDepto } = await pool().query<{ sin_departamento: number }>(
      `SELECT count(*)::int AS sin_departamento
       FROM sociedades s
       LEFT JOIN domicilios d ON d.id = s.domicilio_id
       WHERE s.oculta = FALSE AND (s.domicilio_id IS NULL OR d.localidad_id IS NULL)`,
    );
    const sinDepartamento = sinDepto[0]?.sin_departamento ?? 0;
    const totalConSinDepartamento =
      rows.reduce((acc, r) => acc + r.cantidad_sociedades, 0) + sinDepartamento;
    const porcentajeSinDepartamento =
      totalConSinDepartamento > 0 ? ((sinDepartamento / totalConSinDepartamento) * 100).toFixed(1) : "0";

    const actualizadoEl = rows[0] ? formatFecha(rows[0].actualizado_el) : null;
    const title = "Departamentos más activos en Mendoza | INGcome";
    const description =
      "Ranking de departamentos de Mendoza por cantidad de sociedades constituidas, con la actividad del último año. Datos del Boletín Oficial de Mendoza.";
    const canonical = `${siteUrl()}/informes/departamentos-mas-activos`;

    const filasHtml = rows
      .map(
        (r, i) =>
          `<tr><td>${i + 1}</td><td>${escapeHtml(r.nombre)}</td><td>${r.cantidad_sociedades}</td><td>${r.cantidad_ultimo_anio}</td><td>${totalConSinDepartamento > 0 ? ((r.cantidad_sociedades / totalConSinDepartamento) * 100).toFixed(1) : "0"}%</td></tr>`,
      )
      .join("");

    // Misma tabla que ve el gráfico de líneas del lado del cliente, pero
    // como HTML real (fila = departamento, columna = año): un crawler no
    // ejecuta el SVG interactivo, así que el dato tiene que existir acá
    // también, igual que la tabla de arriba respecto del mapa.
    const aniosPorAnio = [...new Set(filasPorAnio.map((r) => r.anio))].sort((a, b) => a - b);
    const porDepartamento = new Map<string, Map<number, number>>();
    for (const r of filasPorAnio) {
      if (!porDepartamento.has(r.nombre)) porDepartamento.set(r.nombre, new Map());
      porDepartamento.get(r.nombre)!.set(r.anio, r.cantidad_sociedades);
    }
    const filasSerieHtml = [...porDepartamento.entries()]
      .map(([nombre, valores]) => {
        const celdas = aniosPorAnio.map((a) => `<td>${valores.get(a) ?? 0}</td>`).join("");
        return `<tr><td>${escapeHtml(nombre)}</td>${celdas}</tr>`;
      })
      .join("");
    const encabezadoSerieHtml = aniosPorAnio.map((a) => `<th>${a}</th>`).join("");

    const contentHtml = `
    <main>
      <h1>Departamentos más activos en Mendoza</h1>
      ${actualizadoEl ? `<p>Actualizado el ${escapeHtml(actualizadoEl)}.</p>` : ""}
      <table>
        <thead><tr><th>Puesto</th><th>Departamento</th><th>Sociedades constituidas (histórico)</th><th>Último año</th><th>% del total</th></tr></thead>
        <tbody>${filasHtml}</tbody>
      </table>
      ${
        aniosPorAnio.length > 0
          ? `<h2>Sociedades constituidas por año</h2>
      <table>
        <thead><tr><th>Departamento</th>${encabezadoSerieHtml}</tr></thead>
        <tbody>${filasSerieHtml}</tbody>
      </table>`
          : ""
      }
      ${
        sinDepartamento > 0
          ? `<p>Además, ${sinDepartamento.toLocaleString("es-AR")} sociedades (${porcentajeSinDepartamento}% del total) no tienen un departamento asignado en este informe. Ver el motivo en "Fuente y metodología", más abajo.</p>`
          : ""
      }
      ${fuenteDatosHtml(
        sinDepartamento > 0
          ? `<p><strong>Sobre las sociedades sin departamento asignado.</strong> De las
      ${totalConSinDepartamento.toLocaleString("es-AR")} sociedades activas consideradas en este
      informe, ${sinDepartamento.toLocaleString("es-AR")} (${porcentajeSinDepartamento}%) no tienen
      un departamento asignado. Esto ocurre por dos motivos distintos. Primero, hay sociedades cuyo
      domicilio publicado no indica ninguna localidad: en la práctica, muchas veces el domicilio
      informado es literalmente "Provincia de Mendoza" o, más escuetamente, "Mendoza" — sin calle,
      sin localidad, sin ningún dato que permita ubicarlas en un departamento puntual. Segundo, hay
      domicilios que sí incluyen una calle y un número, pero cuya localidad es simplemente
      "Mendoza" (por ejemplo, "Martínez de Rozas 263, Mendoza, Mendoza"), lo que no alcanza para
      distinguir con certeza entre el departamento Capital y el resto del área metropolitana. En
      ambos casos, el proceso de extracción prefiere dejar el departamento sin informar antes que
      asumir uno de forma incorrecta.</p>
      <p>A esto se suma un caso menos frecuente: domicilios que sí mencionan un departamento real,
      pero escrito de forma abreviada o no estandarizada — por ejemplo, "G. Cruz" en lugar de
      "Godoy Cruz", o "Mza." en lugar de "Mendoza" — que el proceso de coincidencia automática no
      siempre reconoce. Estas sociedades sí existen y están incluidas en el total de la provincia,
      pero no aparecen en el desglose por departamento ni en el mapa de esta página.</p>`
          : "",
      )}
    </main>
  `.trim();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: title,
      description,
      url: canonical,
      creator: { "@type": "Organization", name: "INGcome" },
      ...(rows[0]?.actualizado_el ? { dateModified: rows[0].actualizado_el } : {}),
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

seoRouter.get(
  "/informes/anuario-:anio(\\d+)",
  asyncHandler(async (req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const anio = Number(req.params.anio);
    const { rows } = await pool().query<{
      anio: number;
      sociedades_constituidas: number;
      personas_involucradas: number;
      grupo_clae_mas_activo: string | null;
      departamento_mas_activo: string | null;
      tipo_sociedad_mas_comun: string | null;
      actualizado_el: string;
    }>(
      `SELECT anio, sociedades_constituidas, personas_involucradas,
              grupo_clae_mas_activo, departamento_mas_activo, tipo_sociedad_mas_comun, actualizado_el
       FROM informe_anuario WHERE anio = $1`,
      [anio],
    );
    const a = rows[0];
    const canonical = `${siteUrl()}/informes/anuario-${anio}`;
    if (!a) {
      res.status(404).set("Content-Type", "text/html; charset=utf-8");
      return res.send(
        renderHtml(base, {
          title: `Anuario ${anio} no encontrado | INGcome`,
          description: `No hay un informe anual para ${anio} en la base.`,
          canonical,
          noindex: true,
          contentHtml: "",
        }),
      );
    }

    const title = `Anuario ${anio}: sociedades constituidas en Mendoza | INGcome`;
    const description = `En ${anio} se constituyeron ${a.sociedades_constituidas} sociedades en Mendoza, con ${a.personas_involucradas} personas involucradas. Actividad más común: ${a.grupo_clae_mas_activo ?? "sin datos"}.`;

    const actualizadoEl = formatFecha(a.actualizado_el);
    const contentHtml = `
    <main>
      <h1>Anuario ${anio}: sociedades constituidas en Mendoza</h1>
      ${actualizadoEl ? `<p>Actualizado el ${escapeHtml(actualizadoEl)}.</p>` : ""}
      <ul>
        <li>Sociedades constituidas: ${a.sociedades_constituidas}</li>
        <li>Personas involucradas: ${a.personas_involucradas}</li>
        ${a.grupo_clae_mas_activo ? `<li>Actividad más común: ${escapeHtml(a.grupo_clae_mas_activo)}</li>` : ""}
        ${a.departamento_mas_activo ? `<li>Departamento más activo: ${escapeHtml(a.departamento_mas_activo)}</li>` : ""}
        ${a.tipo_sociedad_mas_comun ? `<li>Tipo de sociedad más común: ${escapeHtml(a.tipo_sociedad_mas_comun)}</li>` : ""}
      </ul>
      ${fuenteDatosHtml()}
    </main>
  `.trim();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: title,
      description,
      url: canonical,
      creator: { "@type": "Organization", name: "INGcome" },
      temporalCoverage: String(anio),
      dateModified: a.actualizado_el,
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial: a diferencia del resto de /informes/*, el
// contenido es estático (texto y cifras ya redactados a mano, ver
// frontend/src/data/nichoCannabis.ts) — no hay tabla precomputada ni query a
// la base acá, solo el mismo HTML que ve un crawler duplicado a mano desde
// la página React (mismo criterio que el resto de este archivo: el server
// no puede ejecutar el SVG interactivo del cliente, así que la tabla
// equivalente tiene que existir también como HTML real).
seoRouter.get(
  "/informes/nicho-cannabis",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const title = "Cannabis en Mendoza: empresas registradas 2017–2026 | INGcome";
    const description =
      "27 empresas y entidades de cannabis en Mendoza registradas en el Boletín Oficial (2017–2026): quién cultiva cannabis en la provincia, dónde están domiciliadas, evolución anual y directorio completo con socios.";
    const canonical = `${siteUrl()}/informes/nicho-cannabis`;

    const contentHtml = `
    <main>
      <h1>Cannabis y Cáñamo en Mendoza</h1>
      <p>Entidades registradas en el Boletín Oficial · 2017–2026</p>
      <p>27 empresas y entidades de cannabis en Mendoza registradas en el Boletín Oficial entre 2017 y 2026, con casi la mitad nacida en 2025-2026: el rubro combina dos mundos, empresas comerciales que apuestan a la industria y asociaciones civiles orientadas al acceso a la salud.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>27 entidades identificadas entre 2017 y 2026 en el Boletín Oficial de Mendoza: 23 empresas comerciales y 4 asociaciones civiles.</li>
        <li>La primera entidad del sector es de mayo de 2021 (Cannabafl S.A.S.); la más reciente, de junio de 2026 (Eirene Cannabica Asociación Civil).</li>
        <li>11 de las 27 (40,7 %) se registraron en 2025-2026: 6 en 2025 y 5 en el tramo de 2026 relevado.</li>
        <li>16 de las 27 (59,3 %) eligieron la S.A.S. como forma societaria.</li>
        <li>Capital total declarado: $142,7 millones, con una mediana de $1.000.000.</li>
      </ul>
      <h2>Contexto legal</h2>
      <p>El cannabis medicinal tiene marco legal en Argentina desde la Ley 27.350 (2017). El marco que habilitó una cadena productiva y comercial es la Ley 27.669 (2022), que creó la ARICCAME. Las primeras entidades de esta muestra (2021) son anteriores a la Ley 27.669; el grueso del crecimiento llega recién en 2025-2026, con la maduración operativa de la agencia.</p>
      <h2>¿Quién cultiva cannabis en Mendoza?</h2>
      <p>No hay una única respuesta: la actividad se reparte entre 27 empresas y asociaciones civiles de cannabis en Mendoza con sede legal en la provincia, concentradas sobre todo en Luján de Cuyo, San Rafael, San Martín, Las Heras y Guaymallén — departamentos con perfil agrícola donde es más probable que ocurra el cultivo real, más allá de que el domicilio legal figure con más frecuencia en Capital.</p>
      <p>Esta lista no pretende ser exhaustiva. Nuestra metodología rastrea el Boletín Oficial por nombre y objeto social de la sociedad, y eso deja afuera entidades cuyo objeto social publicado es genérico y no menciona cannabis en absoluto. Un caso público conocido es <strong>Wichan S.A.S.</strong> (Los Corralitos, Guaymallén), habilitada en el Registro Provincial de Cannabis y activa en genética y producción de semillas: su objeto social en el Boletín no menciona la palabra cannabis, así que no aparece en nuestro rastreo automático por palabras clave aunque sí figure en fuentes públicas del sector.</p>
      <h2>Evolución temporal</h2>
      <table>
        <thead><tr><th>Año</th><th>Entidades registradas</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es un año parcial: boletines relevados hasta principios de junio de 2026.</p>
      <h2>Tipo de entidad y capital</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>El capital total asciende a $142.733.200, con una mediana de $1.000.000 — diez veces la mediana general de $100.000 del resto de las sociedades mendocinas.</p>
      <h2>Dónde están domiciliadas</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cantidad</th></tr></thead>
        <tbody>${DEPARTAMENTOS_CANNABIS.map((d) => `<tr><td>${d.departamento}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>25 de las 27 entidades tienen departamento identificado; 2 no.</p>
      <p><strong>Advertencia metodológica:</strong> el domicilio es LEGAL, no necesariamente el lugar donde ocurre el cultivo o la producción. Luján de Cuyo, San Rafael, San Martín, Las Heras y Guaymallén son más representativos de dónde efectivamente se desarrollan actividades agropecuarias e industriales vinculadas al cannabis y el cáñamo que Capital, que domina el ranking solo por concentrar domicilios legales.</p>
      <h2>Directorio completo: las 27 entidades</h2>
      ${entidadesCannabisHtml()}
      <h2>Fuente y metodología</h2>
      <p>Fuente: Boletín Oficial de la Provincia de Mendoza, sección Contratos Sociales. Términos de búsqueda: cannabis, cáñamo, marihuana, hemp, CBD, cannabidiol, THC, cbn, cbg y variantes. Algunas entidades fueron incluidas por nombre aunque su objeto social registrado no menciona cannabis explícitamente — marcadas individualmente arriba. Ninguna búsqueda por palabras clave es perfecta: quedan afuera entidades con objeto social genérico y sin ningún término cannábico en el nombre (ver más arriba el caso de Wichan S.A.S.). Capital expresado en pesos nominales, sin ajuste por inflación. CUIT cruzado con el Registro Nacional de Sociedades / padrón ARCA-AFIP donde estuvo disponible.</p>
      ${fuenteDatosHtml()}
    </main>
  `.trim();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: title,
      description,
      url: canonical,
      creator: { "@type": "Organization", name: "INGcome" },
      temporalCoverage: "2017/2026",
      dateModified: "2026-07-18",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial, segundo de la serie: mismo criterio que
// /informes/nicho-cannabis — contenido estático duplicado a mano desde
// frontend/src/data/nichoEnoturismo.ts.
seoRouter.get(
  "/informes/nicho-enoturismo",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const title = "Enoturismo en Mendoza: empresas registradas 2017–2026 | INGcome";
    const description =
      "43 empresas de enoturismo y turismo del vino en Mendoza registradas en el Boletín Oficial (2017–2026): evolución anual, tipo societario, ubicación y directorio completo.";
    const canonical = `${siteUrl()}/informes/nicho-enoturismo`;

    const contentHtml = `
    <main>
      <h1>Enoturismo en Mendoza</h1>
      <p>El negocio detrás de la Ruta del Vino</p>
      <p>Detrás de la postal de viñedos y degustaciones hay una industria formal que se puede medir: 43 empresas de enoturismo y turismo del vino en Mendoza se constituyeron con esa actividad real y específica desde 2017, y algo más de la mitad nació en los últimos tres años.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>43 empresas de Mendoza tienen al enoturismo o turismo del vino como actividad real y específica en su nombre u objeto social, identificadas entre enero de 2017 y julio de 2026 en el Boletín Oficial.</li>
        <li>22 de las 43 (51,2 %) se constituyeron en los últimos tres años: 9 en 2023, 6 en 2024 y 7 en 2025. 2026, con boletines relevados solo hasta mayo, ya lleva 4.</li>
        <li>La primera de la muestra es de marzo de 2017 (Chacras de Loria S.R.L.), casi en simultáneo con la sanción de la Ley de la S.A.S.</li>
        <li>36 de las 43 (83,7 %) eligieron la S.A.S. como forma societaria.</li>
        <li>Mediana de capital inicial: $450.000. Capital total declarado: $172,2 millones.</li>
      </ul>
      <h2>Qué es el enoturismo y por qué Mendoza es un caso de estudio</h2>
      <p>Mendoza concentra más del 70 % de la producción vitivinícola argentina y es la región vitivinícola más visitada del país. Este informe cuantifica por primera vez el lado de la oferta formal de las empresas de enoturismo en Mendoza: cuántas se constituyen específicamente para explotar ese negocio, cuándo, con qué forma jurídica y con cuánto capital.</p>
      <h2>Evolución temporal</h2>
      <table>
        <thead><tr><th>Año</th><th>Empresas constituidas</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_ENOTURISMO.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es un año parcial: boletines relevados hasta principios de mayo de 2026. El primer tramo (2017-2022) es errático; desde 2023 el rubro sube a un escalón más alto y sostenido.</p>
      <h2>Tipo societario y capital</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_ENOTURISMO.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Mediana de capital inicial: $450.000 (sobre 42 de las 43 empresas), diez veces la mediana general de $100.000 de las sociedades mendocinas. Capital total: $172.154.000. Las tres empresas de mayor capital ($30.000.000 cada una) son Viticultores Argentinos S.A.S., Rosardi Wine Of Mendoza S.A.S. y Winebeetle S.A.S.</p>
      <h2>Dónde están domiciliadas</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cantidad</th></tr></thead>
        <tbody>${DEPARTAMENTOS_ENOTURISMO.map((d) => `<tr><td>${d.departamento}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>41 de las 43 empresas tienen departamento identificado; 2 no.</p>
      <p><strong>Advertencia metodológica:</strong> el domicilio es LEGAL, no necesariamente donde ocurre la experiencia turística — la ciudad de Mendoza (Capital) no es zona vitivinícola. Luján de Cuyo, Maipú, Guaymallén, Godoy Cruz y Tupungato son más representativas de las zonas vitivinícolas tradicionales que Capital, que domina el ranking solo por concentrar domicilios legales.</p>
      <h2>Quiénes son: diversidad del rubro</h2>
      <p>El enoturismo mendocino no es un solo negocio sino al menos tres perfiles que conviven: bodegas que suman una pata turística, agencias especializadas en turismo del vino, y alojamientos boutique construidos alrededor de la experiencia vitivinícola, con híbridos y variantes digitales en el medio.</p>
      <h2>Directorio completo: las 43 empresas</h2>
      ${entidadesEnoturismoHtml()}
      <h2>Metodología de selección</h2>
      <p>Búsqueda amplia por palabras clave en nombre y objeto social (403 candidatas), seguida de revisión individual de cada una para confirmar actividad de enoturismo real y específica, no una mención de relleno en un objeto social genérico. El filtro descartó 360 de los 403 candidatos (89 %). Las constituciones se cuentan por la fecha de publicación del acto en el Boletín, no por la fecha de constitución declarada en el estatuto.</p>
      ${fuenteDatosHtml()}
    </main>
  `.trim();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: title,
      description,
      url: canonical,
      creator: { "@type": "Organization", name: "INGcome" },
      temporalCoverage: "2017/2026",
      dateModified: "2026-07-18",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial, tercero de la serie: mismo criterio que los
// dos anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoBodegasBoutique.ts.
seoRouter.get(
  "/informes/nicho-bodegas-boutique",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const title = "Bodegas boutique en Mendoza: 63 empresas 2017–2026 | INGcome";
    const description =
      "63 bodegas boutique y emprendimientos vitivinícolas chicos de Mendoza registrados en el Boletín Oficial (2017–2026): evolución anual, tipo societario, capital y ubicación.";
    const canonical = `${siteUrl()}/informes/nicho-bodegas-boutique`;

    const contentHtml = `
    <main>
      <h1>Bodegas boutique en Mendoza</h1>
      <p>La otra vitivinicultura mendocina</p>
      <p>63 bodegas y emprendimientos vitivinícolas chicos se constituyeron o registraron actividad en el Boletín Oficial de Mendoza entre 2017 y 2026, con una mediana de capital inicial de apenas $200.000. Lejos de las grandes bodegas industriales, es un flujo que no explota ni se apaga: se sostiene, año tras año, durante toda la década.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>63 bodegas y emprendimientos vitivinícolas identificados entre 2017 y 2026, cuya actividad real es la explotación de viñedos y/o la elaboración de vino propio.</li>
        <li>No es un fenómeno nuevo: se constituyen de forma sostenida durante los diez años de cobertura, con un pico de 9 en 2023 y un piso de 3 en 2017, sin la aceleración reciente que sí se observa en enoturismo.</li>
        <li>Mediana de capital inicial: $200.000 (rango $25.000 a $60.000.000). Capital total declarado por las 59 empresas que lo informan: $202,5 millones.</li>
        <li>33 de las 63 (52,4 %) son S.A.S., pero la S.A. tiene presencia inusualmente alta: 28 de 63 (44,4 %). Solo 2 (3,2 %) son S.R.L.</li>
        <li>5 de las 63 bodegas no tienen fecha de constitución capturada — probablemente preexistentes a 2017, aparecen por actos posteriores.</li>
      </ul>
      <h2>Qué es una "bodega boutique" y por qué es distinta de la industria grande</h2>
      <p>El nomenclador oficial de actividades económicas (CLAE) no distingue entre escalas: "elaboración de vinos" es una sola categoría, que mete en la misma bolsa a una bodega que exporta millones de litros y a un emprendimiento de dos hectáreas. Este informe usa el capital inicial declarado en el Boletín Oficial para aislar, por primera vez, a los actores chicos del promedio industrial vitivinícola mendocino.</p>
      <h2>Evolución temporal</h2>
      <table>
        <thead><tr><th>Año</th><th>Bodegas/emprendimientos constituidos</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_BODEGAS.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es un año parcial: boletines relevados hasta julio de 2026. ** 5 de las 63 bodegas no tienen fecha de constitución capturada y no figuran en esta tabla, aunque sí en el directorio. El ritmo se mantiene en un rango de 3 a 9 por año durante toda la década, sin tendencia clara de crecimiento ni de caída — a diferencia de Enoturismo y Cannabis, los dos informes previos de esta serie, ambos con aceleración fuerte en 2023-2025.</p>
      <h2>Tipo societario y capital: acá la S.A. pelea de igual a igual</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_BODEGAS.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>En casi todos los demás rubros de esta serie la S.A.S. arrasa (70-90 %). Acá la S.A.S. encabeza con 33 casos (52,4 %) pero la S.A. la sigue de cerca con 28 (44,4 %), la proporción más alta de S.A. en cualquier rubro analizado hasta ahora — una hipótesis razonable es que el sector vitivinícola arrastra estructuras societarias familiares más antiguas. 59 de las 63 sociedades declaran capital inicial; mediana $200.000, mínimo $25.000, máximo $60.000.000 (Bodega Morato Gonzalez S.A.S., un outlier).</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cantidad</th></tr></thead>
        <tbody>${DEPARTAMENTOS_BODEGAS.map((d) => `<tr><td>${d.departamento}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>61 de las 63 sociedades tienen departamento identificado; 2 no.</p>
      <p><strong>Advertencia metodológica:</strong> el domicilio es LEGAL, no necesariamente donde está la finca. A diferencia de Enoturismo y Cannabis, acá la distribución fuera de Capital está más repartida entre zonas vitivinícolas tradicionales: Luján de Cuyo (10), San Martín y Guaymallén (6 cada uno), San Rafael y Maipú (5 cada uno) — sumadas, más que duplican a Capital y reflejan mejor la geografía real de la producción vitivinícola mendocina.</p>
      <h2>Directorio completo: las 63 bodegas y emprendimientos</h2>
      ${entidadesBodegasHtml()}
      <h2>Metodología y fuente de datos</h2>
      <p>Búsqueda inicial por nombre ("bodega", "viñedo", "viñas", "viña") y objeto social, 112 candidatas. Desafío específico: en español "bodega" es ambigua (también significa depósito o almacén), así que aparecieron empresas de self-storage, proveedoras de insumos y uniones transitorias sin relación con el vino. El filtro manual descartó 49 de las 112 (43,8 %). Las constituciones se cuentan por fecha de publicación del acto en el Boletín, no por la fecha declarada en el contrato.</p>
      ${fuenteDatosHtml()}
    </main>
  `.trim();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: title,
      description,
      url: canonical,
      creator: { "@type": "Organization", name: "INGcome" },
      temporalCoverage: "2017/2026",
      dateModified: "2026-07-18",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
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
  <sitemap><loc>${siteUrl()}/sitemap-informes.xml</loc></sitemap>
</sitemapindex>`;
  res.type("application/xml").send(xml);
});

seoRouter.get(
  "/sitemap-informes.xml",
  asyncHandler(async (_req: Request, res: Response) => {
    const { rows: anios } = await pool().query<{ anio: number; actualizado_el: string }>(
      "SELECT anio, actualizado_el FROM informe_anuario ORDER BY anio",
    );
    const { rows: depto } = await pool().query<{ actualizado_el: string }>(
      "SELECT max(actualizado_el) AS actualizado_el FROM informe_departamentos_activos",
    );

    const hoy = new Date().toISOString().slice(0, 10);
    const urls = [
      `  <url><loc>${siteUrl()}/informes</loc><lastmod>${hoy}</lastmod></url>`,
      depto[0]?.actualizado_el
        ? `  <url><loc>${siteUrl()}/informes/departamentos-mas-activos</loc><lastmod>${new Date(depto[0].actualizado_el).toISOString().slice(0, 10)}</lastmod></url>`
        : "",
      `  <url><loc>${siteUrl()}/informes/nicho-cannabis</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-enoturismo</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-bodegas-boutique</loc><lastmod>${hoy}</lastmod></url>`,
      ...anios.map(
        (a) =>
          `  <url><loc>${siteUrl()}/informes/anuario-${a.anio}</loc><lastmod>${new Date(a.actualizado_el).toISOString().slice(0, 10)}</lastmod></url>`,
      ),
    ]
      .filter(Boolean)
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    res.type("application/xml").send(xml);
  }),
);

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
