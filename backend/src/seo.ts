import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type Request, type Response, Router } from "express";
import { Pool } from "pg";
import { asyncHandler } from "./asyncHandler.js";
import {
  DEPARTAMENTOS_CANNABIS,
  ENTIDADES,
  EVOLUCION_ANUAL,
  TIPO_ENTIDAD,
} from "./data/nichoCannabis.js";
import { resolverEntidades, type EntidadResuelta } from "./informesNicho.js";
import {
  DEPARTAMENTOS_ENOTURISMO,
  ENTIDADES as ENTIDADES_ENOTURISMO,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_ENOTURISMO,
  TIPO_ENTIDAD as TIPO_ENTIDAD_ENOTURISMO,
} from "./data/nichoEnoturismo.js";
import {
  DEPARTAMENTOS_BODEGAS,
  ENTIDADES as ENTIDADES_BODEGAS,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_BODEGAS,
  TIPO_ENTIDAD as TIPO_ENTIDAD_BODEGAS,
} from "./data/nichoBodegasBoutique.js";
import {
  DEPARTAMENTOS_ENERGIA,
  ENTIDADES as ENTIDADES_ENERGIA,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_ENERGIA,
  TIPO_ENTIDAD as TIPO_ENTIDAD_ENERGIA,
} from "./data/nichoEnergiaRenovable.js";
import {
  DEPARTAMENTOS_CRIPTO,
  ENTIDADES as ENTIDADES_CRIPTO,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_CRIPTO,
  TIPO_ENTIDAD as TIPO_ENTIDAD_CRIPTO,
} from "./data/nichoCriptoFintech.js";
import {
  DEPARTAMENTOS_SOFTWARE,
  ENTIDADES as ENTIDADES_SOFTWARE,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_SOFTWARE,
  TIPO_ENTIDAD as TIPO_ENTIDAD_SOFTWARE,
} from "./data/nichoSoftware.js";
import {
  DEPARTAMENTOS_SERVICIOS_PROFESIONALES,
  ENTIDADES as ENTIDADES_SERVICIOS_PROFESIONALES,
  ESCRIBANOS_TOP,
  ESPECIALIDAD_ESTUDIOS,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_SERVICIOS_PROFESIONALES,
  PROFESIONES_ECOSISTEMA,
  RANKING_PROFESIONES_LIBERALES,
  TIPO_ENTIDAD as TIPO_ENTIDAD_SERVICIOS_PROFESIONALES,
} from "./data/nichoServiciosProfesionales.js";
import {
  DEPARTAMENTOS_ARQUITECTURA,
  ECOSISTEMA_PROFESIONES,
  ENTIDADES as ENTIDADES_ARQUITECTURA,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_ARQUITECTURA,
  TIPO_ENTIDAD as TIPO_ENTIDAD_ARQUITECTURA,
} from "./data/nichoArquitectura.js";
import {
  DEPARTAMENTOS_CAFE,
  ENTIDADES as ENTIDADES_CAFE,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_CAFE,
  TIPO_ENTIDAD as TIPO_ENTIDAD_CAFE,
} from "./data/nichoCafe.js";
import {
  DEPARTAMENTOS_CERVEZA,
  ENTIDADES as ENTIDADES_CERVEZA,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_CERVEZA,
  TIPO_ENTIDAD as TIPO_ENTIDAD_CERVEZA,
} from "./data/nichoCerveza.js";
import {
  DEPARTAMENTOS_RECICLAJE,
  ENTIDADES as ENTIDADES_RECICLAJE,
  OLEADAS as OLEADAS_RECICLAJE,
  TIPO_ENTIDAD as TIPO_ENTIDAD_RECICLAJE,
  TOP_CAPITALES as TOP_CAPITALES_RECICLAJE,
} from "./data/nichoReciclaje.js";
import {
  DEPARTAMENTOS_FIDEICOMISOS,
  ENTIDADES as ENTIDADES_FIDEICOMISOS,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_FIDEICOMISOS,
  TIPO_ENTIDAD as TIPO_ENTIDAD_FIDEICOMISOS,
} from "./data/nichoFideicomisos.js";
import {
  DEPARTAMENTOS_AGENCIAS_VIAJES,
  ENTIDADES as ENTIDADES_AGENCIAS_VIAJES,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_AGENCIAS_VIAJES,
  TIPO_CLAE as TIPO_CLAE_AGENCIAS_VIAJES,
  TIPO_ENTIDAD as TIPO_ENTIDAD_AGENCIAS_VIAJES,
} from "./data/nichoAgenciasViajes.js";
import {
  DEPARTAMENTOS_SEGURIDAD_PRIVADA,
  ENTIDADES as ENTIDADES_SEGURIDAD_PRIVADA,
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_SEGURIDAD_PRIVADA,
  TIPO_ENTIDAD as TIPO_ENTIDAD_SEGURIDAD_PRIVADA,
} from "./data/nichoSeguridadPrivada.js";
import {
  EVOLUCION_ANUAL as EVOLUCION_ANUAL_MUJERES,
  PANORAMA,
  TOP_MUJERES,
} from "./data/mujeresFundadoras.js";
import {
  BETWEENNESS_TOP10,
  ESCENARIOS,
  ESTRUCTURA_G1,
  EVOLUCION_TABLA,
  FUNDADORES_EMBARCA,
  PARES_NICHOS,
} from "./data/analisisRedes.js";
import {
  BAJAS_SITUACION as BAJAS_SITUACION_CLAE,
  CLUSTERS as CLUSTERS_CLAE,
  COBERTURA_ANUAL as COBERTURA_ANUAL_CLAE,
  COLA_LARGA as COLA_LARGA_CLAE,
  DIVERSIFICACION as DIVERSIFICACION_CLAE,
  EVOLUCION_ACTIVIDADES as EVOLUCION_ACTIVIDADES_CLAE,
  GRUPOS_VACIOS as GRUPOS_VACIOS_CLAE,
  LOCALIZACION as LOCALIZACION_CLAE,
  NICHOS_COBERTURA as NICHOS_COBERTURA_CLAE,
  PARES_COOCURRENCIA as PARES_COOCURRENCIA_CLAE,
  TASA_BAJA as TASA_BAJA_CLAE,
  TOP_ACTIVIDADES as TOP_ACTIVIDADES_CLAE,
} from "./data/actividadesClae.js";

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

type EntidadCannabisResuelta = EntidadResuelta & { nombreGenerico?: boolean };

function entidadHtml(e: EntidadCannabisResuelta): string {
  const flag = e.nombreGenerico
    ? `<p><em>El nombre de la entidad sugiere actividad de cannabis, pero el objeto social registrado es genérico y no lo menciona explícitamente — inclusión basada en el nombre, a confirmar.</em></p>`
    : "";
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  // Un socio sin personaId (nombre suelto, nunca cruzado contra la base, o
  // sociedad -- ver resolverEntidades) va sin link, solo el texto.
  const sociosLinks = e.socios
    .map((s) =>
      s.personaId
        ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
        : s.sociedadId
          ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
    ${flag}
  `;
}

async function entidadesCannabisHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES);
  // Orden por fecha de publicación (ver título "ordenadas por fecha de
  // publicación" en la página React) -- las curadas ya venían en ese orden,
  // pero resolverEntidades puede reordenar si alguna se descarta por oculta.
  entidades.sort((a, b) => (a.publicacion ?? "").localeCompare(b.publicacion ?? ""));
  return entidades.map(entidadHtml).join("");
}

function entidadEnoturismoHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesEnoturismoHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_ENOTURISMO);
  return entidades.map(entidadEnoturismoHtml).join("");
}

function entidadBodegaHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesBodegasHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_BODEGAS);
  return entidades.map(entidadBodegaHtml).join("");
}

function entidadEnergiaHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesEnergiaHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_ENERGIA);
  return entidades.map(entidadEnergiaHtml).join("");
}

function entidadCriptoHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesCriptoHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_CRIPTO);
  return entidades.map(entidadCriptoHtml).join("");
}

function entidadSoftwareHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesSoftwareHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_SOFTWARE);
  return entidades.map(entidadSoftwareHtml).join("");
}

function entidadServiciosProfesionalesHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

const CATEGORIAS_SERVICIOS_PROFESIONALES = [
  "Jurídico",
  "Jurídico-contable",
  "Contable",
  "Gestoría y trámites",
];

async function entidadesServiciosProfesionalesHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_SERVICIOS_PROFESIONALES);
  return CATEGORIAS_SERVICIOS_PROFESIONALES.map((categoria) => {
    const entidadesCategoria = entidades.filter((e) => e.categoria === categoria);
    if (entidadesCategoria.length === 0) return "";
    return `<h3>${escapeHtml(categoria)} (${entidadesCategoria.length})</h3>${entidadesCategoria.map(entidadServiciosProfesionalesHtml).join("")}`;
  }).join("");
}

function entidadArquitecturaHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesArquitecturaHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_ARQUITECTURA);
  return entidades.map(entidadArquitecturaHtml).join("");
}

function entidadCafeHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesCafeHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_CAFE);
  return entidades.map(entidadCafeHtml).join("");
}

function entidadCervezaHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesCervezaHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_CERVEZA);
  return entidades.map(entidadCervezaHtml).join("");
}

function entidadReciclajeHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesReciclajeHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_RECICLAJE);
  return entidades.map(entidadReciclajeHtml).join("");
}

function entidadFideicomisosHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesFideicomisosHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_FIDEICOMISOS);
  return entidades.map(entidadFideicomisosHtml).join("");
}

function entidadAgenciasViajesHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesAgenciasViajesHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_AGENCIAS_VIAJES);
  return entidades.map(entidadAgenciasViajesHtml).join("");
}

function entidadSeguridadPrivadaHtml(e: EntidadResuelta): string {
  const nombreLink = `<a href="/sociedad/${e.sociedadId}">${escapeHtml(e.nombre)}</a>`;
  const sociosLinks = e.socios
    .map((s) =>
      s.sociedadId
        ? `<a href="/sociedad/${s.sociedadId}">${escapeHtml(s.nombre)}</a>`
        : s.personaId
          ? `<a href="/persona/${s.personaId}">${escapeHtml(s.nombre)}</a>`
          : escapeHtml(s.nombre),
    )
    .join(" · ");
  const capital = formatMoneda(e.capital);
  const publicacion = formatFecha(e.publicacion);
  return `
    <h3>${e.tipo ? escapeHtml(e.tipo) : ""} — ${nombreLink}</h3>
    <p>CUIT: ${e.cuit ? escapeHtml(formatCuit(e.cuit) ?? e.cuit) : "—"} · Capital: ${capital ? escapeHtml(capital) : "—"} · Publicación: ${publicacion ? escapeHtml(publicacion) : "—"} · Departamento: ${e.departamento ? escapeHtml(e.departamento) : "—"}</p>
    ${e.socios.length > 0 ? `<p>Socios/Integrantes: ${sociosLinks}</p>` : ""}
    ${e.objetoSocial ? `<p>Objeto social: ${escapeHtml(e.objetoSocial)}</p>` : ""}
  `;
}

async function entidadesSeguridadPrivadaHtml(): Promise<string> {
  const entidades = await resolverEntidades(ENTIDADES_SEGURIDAD_PRIVADA);
  return entidades.map(entidadSeguridadPrivadaHtml).join("");
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

// Mismo formato que moneda() en frontend/src/lib/format.ts (toLocaleString
// corre igual en Node que en el navegador -- mismo motor V8) para que el
// HTML server-side y la ficha React muestren el capital idéntico.
function formatMoneda(valor: number | null): string | null {
  if (valor === null) return null;
  return valor.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
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
        <li><a href="/informes/mujeres-fundadoras">Las Mujeres que Fundan Empresas en Mendoza</a></li>
        <li><a href="/informes/actividades-clae">Qué hacen realmente las empresas mendocinas: anatomía del nomenclador CLAE</a></li>
        <li><a href="/informes/analisis-redes">El mapa oculto de las sociedades mendocinas: análisis de redes</a></li>
      </ul>
      <h2>Nichos sectoriales</h2>
      <ul>
        <li><a href="/informes/nicho-cannabis">Cannabis y Cáñamo en Mendoza</a></li>
        <li><a href="/informes/nicho-enoturismo">Enoturismo en Mendoza</a></li>
        <li><a href="/informes/nicho-bodegas-boutique">Bodegas Boutique en Mendoza</a></li>
        <li><a href="/informes/nicho-energia-renovable">Energía Solar y Eólica en Mendoza</a></li>
        <li><a href="/informes/nicho-cripto-fintech">Cripto y Fintech en Mendoza</a></li>
        <li><a href="/informes/nicho-software">Desarrollo de Software en Mendoza</a></li>
        <li><a href="/informes/nicho-servicios-profesionales">Abogados, Contadores y Escribanos en Mendoza</a></li>
        <li><a href="/informes/nicho-arquitectura">Arquitectura en Mendoza</a></li>
        <li><a href="/informes/nicho-cafe">Café de Especialidad en Mendoza</a></li>
        <li><a href="/informes/nicho-cerveza">Cerveza Artesanal en Mendoza</a></li>
        <li><a href="/informes/nicho-reciclaje">Reciclaje y Economía Circular en Mendoza</a></li>
        <li><a href="/informes/nicho-fideicomisos">Servicios de Fideicomisos en Mendoza</a></li>
        <li><a href="/informes/nicho-agencias-viajes">Agencias de Viajes en Mendoza</a></li>
        <li><a href="/informes/nicho-seguridad-privada">Seguridad Privada en Mendoza</a></li>
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

    const MESES_SEO = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const { rows: filasMes } = await pool().query<{ mes: number; cantidad_sociedades: number }>(
      "SELECT mes, cantidad_sociedades FROM informe_anuario_mes WHERE anio = $1 ORDER BY mes",
      [anio],
    );
    const mesesHtml = filasMes
      .map((r) => `<tr><td>${MESES_SEO[r.mes - 1]}</td><td>${r.cantidad_sociedades}</td></tr>`)
      .join("");

    const { rows: filasTipo } = await pool().query<{ tipo_sociedad: string; cantidad_sociedades: number }>(
      "SELECT tipo_sociedad, cantidad_sociedades FROM informe_anuario_tipo_sociedad WHERE anio = $1 ORDER BY cantidad_sociedades DESC",
      [anio],
    );
    // Mismo umbral de 5% que el endpoint público (ver informesPublicoRouter
    // en informes.ts) -- se repite acá porque el SEO lee las tablas directo,
    // sin pasar por ese endpoint.
    const totalTipos = filasTipo.reduce((acc, r) => acc + r.cantidad_sociedades, 0) || 1;
    const tipoSociedadAgrupado: { tipo: string; cantidad: number }[] = [];
    let otrosSeo = 0;
    for (const r of filasTipo) {
      if (r.cantidad_sociedades / totalTipos < 0.05) otrosSeo += r.cantidad_sociedades;
      else tipoSociedadAgrupado.push({ tipo: r.tipo_sociedad, cantidad: r.cantidad_sociedades });
    }
    if (otrosSeo > 0) tipoSociedadAgrupado.push({ tipo: "Otros", cantidad: otrosSeo });
    const tipoSociedadHtml = tipoSociedadAgrupado
      .map((t) => `<tr><td>${escapeHtml(t.tipo)}</td><td>${t.cantidad}</td></tr>`)
      .join("");

    const { rows: filasActividad } = await pool().query<{ grupo_clae: string; cantidad_sociedades: number }>(
      "SELECT grupo_clae, cantidad_sociedades FROM informe_anuario_actividad WHERE anio = $1 ORDER BY cantidad_sociedades DESC LIMIT 10",
      [anio],
    );
    const actividadesHtml = filasActividad
      .map((r) => `<li>${escapeHtml(r.grupo_clae)} — ${r.cantidad_sociedades}</li>`)
      .join("");

    const { rows: filasDepartamento } = await pool().query<{ nombre: string; cantidad_sociedades: number }>(
      `SELECT d.nombre, i.cantidad_sociedades
       FROM informe_departamento_por_anio i
       JOIN departamentos d ON d.id = i.departamento_id
       WHERE i.anio = $1
       ORDER BY i.cantidad_sociedades DESC`,
      [anio],
    );
    const departamentosHtml = filasDepartamento
      .map((r) => `<tr><td>${escapeHtml(r.nombre)}</td><td>${r.cantidad_sociedades}</td></tr>`)
      .join("");

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
      ${
        mesesHtml
          ? `<h2>Distribución mensual</h2>
      <table><thead><tr><th>Mes</th><th>Sociedades</th></tr></thead><tbody>${mesesHtml}</tbody></table>`
          : ""
      }
      ${
        departamentosHtml
          ? `<h2>Distribución territorial</h2>
      <table><thead><tr><th>Departamento</th><th>Sociedades</th></tr></thead><tbody>${departamentosHtml}</tbody></table>`
          : ""
      }
      ${
        tipoSociedadHtml
          ? `<h2>Tipo de sociedad</h2>
      <table><thead><tr><th>Tipo</th><th>Sociedades</th></tr></thead><tbody>${tipoSociedadHtml}</tbody></table>`
          : ""
      }
      ${actividadesHtml ? `<h2>Actividades más frecuentes</h2><ol>${actividadesHtml}</ol>` : ""}
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

// Informe de nicho sectorial: el texto y las cifras agregadas (evolución,
// tipo de entidad, mapa) son curados a mano, ver backend/src/data/
// nichoCannabis.ts — pero el directorio de entidades (nombre/CUIT/capital/
// socios) se resuelve EN VIVO contra la base (ver entidadesCannabisHtml()),
// para que una sociedad/persona marcada oculta desde el panel de admin deje
// de aparecer acá también (antes no: ver docs/plan_centralizar_habeas_data.md).
seoRouter.get(
  "/informes/nicho-cannabis",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioHtml = await entidadesCannabisHtml();

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
      ${directorioHtml}
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

    const directorioEnoturismoHtml = await entidadesEnoturismoHtml();

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
      ${directorioEnoturismoHtml}
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

    const directorioBodegasHtml = await entidadesBodegasHtml();

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
      ${directorioBodegasHtml}
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

// Informe de nicho sectorial, cuarto de la serie: mismo criterio que los
// tres anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoEnergiaRenovable.ts.
seoRouter.get(
  "/informes/nicho-energia-renovable",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioEnergiaHtml = await entidadesEnergiaHtml();

    const title = "Energía solar y eólica en Mendoza: 50 empresas 2017–2026 | INGcome";
    const description =
      "50 empresas de energía solar, eólica y renovable en Mendoza registradas en el Boletín Oficial (2017–2026): la ola RenovAr de 2017, el vacío posterior y la ola de generación distribuida 2024–2026.";
    const canonical = `${siteUrl()}/informes/nicho-energia-renovable`;

    const contentHtml = `
    <main>
      <h1>Energía solar y eólica en Mendoza</h1>
      <p>Dos olas, un mismo objetivo</p>
      <p>Entre 2017 y 2026 se constituyeron 50 empresas de energía solar, eólica o renovable en Mendoza. Pero no llegaron de a poco: los datos muestran dos olas bien diferenciadas —una explosión en 2017 y un rebrote en 2024-2026—, separadas por un vacío de años que en 2023 fue absoluto.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>50 empresas de energía solar, eólica o renovable identificadas entre 2017 y 2026 en el Boletín Oficial de la Provincia de Mendoza.</li>
        <li>Dos olas separadas por un vacío casi total: 18 constituciones en 2017 (más de un tercio del total), 2023 en cero, y una segunda ola en 2024-2026 (7, 4 y 2).</li>
        <li>La primera ola coincide con el Programa RenovAr (rondas de licitación 2016-2017); varias empresas se constituyeron el mismo día, en tandas de sociedades de propósito específico.</li>
        <li>La S.A. domina el total (27 de 50, 54 %), empujada por la ola de 2017 con capital nominal idéntico de $100.000. La ola 2024-2026 es mayoritariamente S.A.S.: 11 de 13.</li>
        <li>Luján de Cuyo (13) y San Rafael (11) juntas superan a Capital (8) — a diferencia del resto de la serie, acá el domicilio legal tiende a coincidir con la zona real del proyecto.</li>
      </ul>
      <h2>El contexto: RenovAr primero, generación distribuida después</h2>
      <p>El Programa RenovAr (2016-2017) adjudicó 147 proyectos por 4.466,5 MW en todo el país. Cada proyecto de gran escala —un "parque solar" o "parque eólico"— se organiza como una sociedad de propósito específico con capital nominal mínimo, porque el financiamiento real viene de deuda de proyecto o inversores. La segunda ola (2024-2026) responde a un fenómeno distinto: la generación distribuida habilitada por la Ley 27.424, con empresas de instalación y servicios (Solarenergy, Suntec Energía, Solarix, Soluciones Renovables) mayoritariamente S.A.S.</p>
      <h2>Evolución temporal: dos olas separadas por un vacío</h2>
      <table>
        <thead><tr><th>Año</th><th>Empresas constituidas</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_ENERGIA.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es un año parcial: boletines relevados hasta julio de 2026. ** 2 de las 50 empresas no tienen fecha de constitución capturada y no figuran en esta tabla, aunque sí en el directorio. El arranque es un pico altísimo (18 en 2017, más de un tercio de toda la muestra); entre 2018 y 2022 ningún año supera las 7 constituciones y 2023 no tiene ni una sola; recién en 2024-2026 aparece la segunda ola, más chica y pareja (7, 4, 2).</p>
      <h2>Tipo societario y capital: cada ola tiene su propio perfil</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_ENERGIA.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>La S.A. lidera el total (27 de 50, 54 %) casi enteramente por arrastre de la ola de 2017. La ola 2024-2026 es mayoritariamente S.A.S. (11 de 13). 46 de las 50 empresas declaran capital inicial: mediana $100.000, mínimo $30.000, máximo $30.000.000 (Energías Renovables El Diamante S.A., 2024). Para los vehículos de 2017, $100.000 era el mínimo legal nominal, sin relación con la inversión real de un parque solar o eólico, que se financia aparte vía deuda o inversores.</p>
      <h2>Dónde están: acá la capital no manda</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cantidad</th></tr></thead>
        <tbody>${DEPARTAMENTOS_ENERGIA.map((d) => `<tr><td>${d.departamento}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>47 de las 50 empresas tienen departamento identificado; 3 no.</p>
      <p><strong>Advertencia metodológica:</strong> el departamento corresponde al domicilio LEGAL, no necesariamente a la ubicación física del parque. A diferencia de Enoturismo, Cannabis y Bodegas boutique —donde Capital encabeza claramente el ranking—, en energía renovable Capital queda en tercer lugar, detrás de Luján de Cuyo (13) y San Rafael (11). "Helios Río Diamante" remite al río Diamante, en San Rafael: en este rubro el domicilio legal tiende a coincidir más con la zona real del proyecto que en el resto de la serie.</p>
      <h2>Directorio completo: las 50 empresas</h2>
      ${directorioEnergiaHtml}
      <h2>Metodología y fuente de datos</h2>
      <p>Búsqueda inicial por nombre y objeto social (solar, eólica/eolica, fotovoltaica, renovable, energía renovable, energías limpias), 95 candidatas. El filtro manual descartó 45 de las 95 (47,4 %) — incluyendo casos donde "solar" no se refería a energía (apellidos, nombres de fincas, sinónimo de terreno). Varios socios de la ola 2017 son personas jurídicas (Dax Energy Argentina Holdings S.p.A., Dax Energy Holdings S.p.A., Tassaroli S.A., Green S.A., Grupo Energías Globales S.A., entre otras) sin ficha propia en este sitio.</p>
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

// Informe de nicho sectorial, quinto de la serie: mismo criterio que los
// cuatro anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoCriptoFintech.ts.
seoRouter.get(
  "/informes/nicho-cripto-fintech",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioCriptoHtml = await entidadesCriptoHtml();

    const title = "Cripto y fintech en Mendoza: 14 empresas 2017–2026 | INGcome";
    const description =
      "14 empresas de cripto/blockchain y fintech en Mendoza registradas en el Boletín Oficial (2017–2026): el ciclo de precio de Bitcoin, en miniatura, reflejado en constituciones societarias.";
    const canonical = `${siteUrl()}/informes/nicho-cripto-fintech`;

    const contentHtml = `
    <main>
      <h1>Cripto y fintech en Mendoza</h1>
      <p>El termómetro del boom</p>
      <p>Catorce empresas alcanzan para contar una historia: las constituciones societarias de cripto y fintech en Mendoza siguen, con meses de rezago, el pulso del ciclo global de precio de Bitcoin. Cuando el mercado sube, aparecen empresas en el Boletín Oficial; cuando cae, el registro se apaga.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>14 empresas de cripto/blockchain y fintech identificadas entre 2017 y 2026 en el Boletín Oficial de Mendoza. Es la muestra más chica de esta serie de informes.</li>
        <li>9 de las 14 (64,3 %) se concentran en 2020-2022, coincidiendo con el boom de precios de Bitcoin (2020-2021) y su resaca inmediata. Silencio casi total en 2023 (crypto winter) y una segunda ola en 2024-2026, en sintonía con la recuperación y la aprobación de los ETF de Bitcoin en EE.UU.</li>
        <li>La primera ola (2020-2022) se reparte casi por igual entre S.A. (6) y S.A.S. (6), con dos S.R.L. La segunda ola (2024-2026, 4 empresas) muestra capitales bastante más altos.</li>
        <li>Capital total declarado: $61.562.000, con una mediana de $600.000 — bien por encima de la mediana general de $100.000, desde $40.000 hasta $30.000.000 en un mismo caso (SDM S.A., 2025).</li>
        <li>Las 14 empresas tienen departamento identificado (100 % de cobertura): 8 en Capital, 3 en Godoy Cruz, 2 en San Rafael y 1 en Luján de Cuyo.</li>
      </ul>
      <h2>Qué es cripto/blockchain, qué es fintech, y por qué van juntos</h2>
      <p>Cripto/blockchain abarca la compraventa, custodia y minería de criptomonedas y el desarrollo de tecnología blockchain; fintech, las billeteras virtuales, los medios de pago digitales y los servicios financieros por plataforma. Muchas empresas combinan ambas actividades en un mismo objeto social, y el nomenclador CLAE no distingue ninguna de las dos como categoría propia. A diferencia de otros rubros de esta serie, con un disparador legal claro (la Ley 27.669 para el cannabis, el Programa RenovAr para la energía renovable), acá el disparador es puramente de mercado: el ciclo de precio de Bitcoin.</p>
      <h2>Evolución temporal: el ciclo de Bitcoin, en miniatura</h2>
      <table>
        <thead><tr><th>Año</th><th>Empresas constituidas</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_CRIPTO.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es un año parcial: boletines relevados hasta julio de 2026. ** No hay empresas de este rubro en la muestra antes de 2020. Nueve de las 14 empresas (64,3 %) se concentran en el trienio 2020-2022 —boom y resaca inmediata—, y las 5 restantes aparecen recién desde fines de 2024, en sintonía con la segunda gran suba del precio. En el medio, 2023: cero constituciones nuevas del rubro.</p>
      <h2>Tipo societario y capital: la segunda ola apuesta más fuerte</h2>
      <table>
        <thead><tr><th>Tipo societario</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_CRIPTO.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>A diferencia de otros informes de la serie, acá no hay un tipo societario claramente dominante: S.A. y S.A.S. empatan con 6 casos cada una, con dos S.R.L. Las 14 empresas declaran capital inicial: total $61.562.000, mediana $600.000, mínimo $40.000 (Bitmonedero S.A.S., 2020), máximo $30.000.000 (SDM S.A., 2025). La segunda ola (2024-2026) declara capitales notablemente más altos que la primera, consistente con un mercado más maduro y con más capital institucional entrando tras la aprobación de los ETF.</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cantidad</th></tr></thead>
        <tbody>${DEPARTAMENTOS_CRIPTO.map((d) => `<tr><td>${d.departamento}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Las 14 empresas tienen departamento identificado (100 % de cobertura, algo inusual en esta serie). A diferencia de otros informes de esta serie, acá no hace falta la advertencia sobre la brecha entre domicilio legal y zona real de actividad: un negocio de cripto o fintech no tiene una "zona de producción" física equivalente a un viñedo o un parque solar. Capital concentra más de la mitad de los casos (8 de 14), coherente con un rubro digital, de oficina.</p>
      <h2>Directorio completo: las 14 empresas</h2>
      ${directorioCriptoHtml}
      <h2>Metodología y fuente de datos</h2>
      <p>Búsqueda inicial por nombre y objeto social (cripto, crypto, blockchain, bitcoin, fintech, activos digitales, billetera virtual, medios de pago, pasarela de pago, moneda digital, activos virtuales, exchange), 35 candidatas. El filtro manual descartó 21 de las 35 (60 %) — la proporción de descarte más alta de la serie hasta ahora. Las constituciones se cuentan por fecha de publicación del acto en el Boletín, no por fecha de constitución declarada.</p>
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
      dateModified: "2026-07-30",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial, sexto de la serie: mismo criterio que los
// cinco anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoSoftware.ts. A diferencia de los anteriores, el
// documento fuente no trae un listado entidad por entidad (solo las tablas
// agregadas) -- ENTIDADES_SOFTWARE queda vacío hasta que esos datos estén
// disponibles, así que entidadesSoftwareHtml() no imprime nada por ahora.
seoRouter.get(
  "/informes/nicho-software",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioSoftwareHtml = await entidadesSoftwareHtml();

    const title = "Desarrollo de software en Mendoza: 103 sociedades 2017–2026 | INGcome";
    const description =
      "103 sociedades de desarrollo de software en Mendoza registradas en el Boletín Oficial (2017–2026): evolución anual, red de cofundadores, tipo societario, capital y ubicación.";
    const canonical = `${siteUrl()}/informes/nicho-software`;

    const contentHtml = `
    <main>
      <h1>Desarrollo de software en Mendoza</h1>
      <p>El sector que estuvo ahí desde el primer día</p>
      <p>103 sociedades de desarrollo de software se constituyeron en Mendoza entre 2017 y 2026 — el nicho más grande de toda esta serie de informes. A diferencia de los rubros ligados a una moda o un ciclo de precios, el software estuvo presente desde el primer año del relevamiento, sin boom ni colapso.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>103 sociedades de desarrollo de software identificadas entre 2017 y 2026 — el nicho más grande de los evaluados en esta tanda.</li>
        <li>Único nicho de toda la serie presente desde el primer año con volumen real: 7 sociedades en 2017, subiendo a 21 en 2018.</li>
        <li>No hay boom ni colapso: la curva sube y baja entre 3 y 21 sociedades por año sin un patrón de ciclo económico claro, a diferencia de cripto/fintech, atado al precio de Bitcoin.</li>
        <li>15 pares de sociedades comparten al menos un socio — la red de fundadores seriales más densa de esta serie (14,6 % de las 103 sociedades conectadas por una persona en común).</li>
        <li>Capital y Godoy Cruz concentran el 61 % (43 y 20 de 103).</li>
      </ul>
      <h2>Una curva sin ciclo aparente</h2>
      <table>
        <thead><tr><th>Año</th><th>Sociedades de software</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_SOFTWARE.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es un año parcial: boletines relevados hasta julio de 2026. El pico de 2018 (21 sociedades) no coincide con ningún evento identificable — entre esas 21 aparecen desde software factories dedicadas hasta la constitución local de Uber Eats S.A.S. La lectura más razonable es que el desarrollo de software es una categoría de demanda de fondo, presente en todos los años del relevamiento sin depender de una moda o un ciclo de precios externo.</p>
      <h2>Una red de fundadores densa, con un puente al análisis de grafos</h2>
      <p>Cruzando los socios de las 103 sociedades aparecen 15 pares con al menos una persona en común — la proporción más alta de repetición de fundadores de esta serie. El caso más notable: Linka Space S.A.S. y Litt Ar S.A.S., vinculadas por Matías Demián Benegas, son dos de las 61 sociedades del clúster de cofundadores tecnológicos identificado en el análisis de grafos de esta misma base (ligado a la aceleradora Embarca) — una validación cruzada entre dos métodos distintos sobre la misma base.</p>
      <h2>Perfil societario</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_SOFTWARE.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>80 de las 103 (78 %) son S.A.S. Capital declarado: mediana de $100.000, rango de $17.720 a $10.000.000 — la mediana más baja de toda esta tanda de informes, coherente con un rubro donde el activo principal es el conocimiento y el código, no equipamiento ni infraestructura física.</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cantidad</th></tr></thead>
        <tbody>${DEPARTAMENTOS_SOFTWARE.map((d) => `<tr><td>${d.departamento}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>99 de las 103 sociedades tienen departamento identificado; 4 no. Capital y Godoy Cruz concentran el 61 % — la mayor concentración geográfica de toda esta tanda de informes, consistente con un sector de trabajo remoto/de oficina que gravita hacia donde ya está el ecosistema profesional y universitario.</p>
      ${ENTIDADES_SOFTWARE.length > 0 ? `<h2>Directorio completo: las 103 sociedades</h2>${directorioSoftwareHtml}` : ""}
      <h2>Metodología y límites</h2>
      <p>Búsqueda: objeto social con "desarrollo de software/sistemas/aplicaciones", "programación" (en sentido informático), "servicios informáticos", "consultoría informática", "desarrollo web/de plataformas", más nombre con "software" — 214 sociedades candidatas. Clasificación asistida por script de tres niveles, con revisión manual de las 41 candidatas ambiguas y una segunda pasada sobre la palabra "programación" (ambigua en español). 111 de las 214 (52 %) se descartaron. Cobertura ARCA: 37 de 103 (35,9 %), la más baja de esta tanda. Las constituciones se cuentan por fecha de publicación del acto en el Boletín, no por fecha de constitución declarada.</p>
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
      dateModified: "2026-08-02",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial, séptimo de la serie: mismo criterio que los
// anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoServiciosProfesionales.ts.
seoRouter.get(
  "/informes/nicho-servicios-profesionales",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioServiciosProfesionalesHtml = await entidadesServiciosProfesionalesHtml();

    const title =
      "Abogados, contadores y escribanos en Mendoza: 46 estudios profesionales 2017–2026 | INGcome";
    const description =
      "46 estudios jurídicos, contables y de gestoría en Mendoza (2017–2026), y el otro lado del dato: 821 abogados y 1.136 contadores entre los socios de toda la base, contra apenas 66 escribanos.";
    const canonical = `${siteUrl()}/informes/nicho-servicios-profesionales`;

    const contentHtml = `
    <main>
      <h1>Abogados, contadores y escribanos en Mendoza</h1>
      <p>Los profesionales que fabrican empresas</p>
      <p>46 estudios profesionales se constituyeron como sociedad en Mendoza entre 2017 y 2026 — ninguno de ellos una escribanía. El rubro aparece en este informe desde dos lados distintos del mismo dato: como sociedades propias, y como los profesionales que, sin constituir un estudio, más se repiten entre los socios de las demás 19.485 sociedades de la base.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>46 estudios profesionales identificados entre 2017 y 2026 — jurídicos (25), contables (11), jurídico-contables (9) y de gestoría y trámites (1). Ninguno notarial.</li>
        <li>821 abogados/as y 1.136 contadores/as aparecen como socios en 1.028 y 1.639 sociedades de toda la base, muy por encima de cualquier estudio propio del rubro.</li>
        <li>66 escribanos/as aparecen como socios en cualquier sociedad — la profesión liberal que menos se asocia de las seis relevadas.</li>
        <li>559 escribanos/as intervinieron en 1.511 actos del boletín — mercado atomizado: el 52,9% (296 de 559) aparece una sola vez.</li>
        <li>Capital concentra el 73,9% de los 46 estudios (34 de 46).</li>
      </ul>
      <h2>Un rubro que está en los dos lados del dato</h2>
      <table>
        <thead><tr><th>Especialidad</th><th>Estudios</th></tr></thead>
        <tbody>${ESPECIALIDAD_ESTUDIOS.map((d) => `<tr><td>${escapeHtml(d.etiqueta)}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <table>
        <thead><tr>${EVOLUCION_ANUAL_SERVICIOS_PROFESIONALES.map((a) => `<th>${a.etiqueta}</th>`).join("")}</tr></thead>
        <tbody><tr>${EVOLUCION_ANUAL_SERVICIOS_PROFESIONALES.map((a) => `<td>${a.valor}</td>`).join("")}</tr></tbody>
      </table>
      <p>25 de 46 (54,3%) son estudios jurídicos, 11 (23,9%) contables y 9 (19,6%) combinan ambas especialidades. Un solo estudio (2,2%) se dedica exclusivamente a gestoría y trámites. Con números tan bajos por año, no hay tendencia real para leer en la serie temporal.</p>
      <h2>La escribanía que no existe</h2>
      <p>Ninguno de los 46 estudios es notarial. El registro notarial es personal e intransferible: un escribano no puede aportarlo como capital a una sociedad ni ejercer la función notarial a través de una persona jurídica. Una escribanía, estructuralmente, no puede aparecer en el Boletín Oficial como sociedad comercial.</p>
      <h2>El otro lado: los profesionales que fabrican empresas</h2>
      <table>
        <thead><tr><th>Profesión</th><th>Personas</th><th>Sociedades donde participan</th></tr></thead>
        <tbody>${PROFESIONES_ECOSISTEMA.map((p) => `<tr><td>${escapeHtml(p.profesion)}</td><td>${p.personas.toLocaleString("es-AR")}</td><td>${p.sociedades ? p.sociedades.toLocaleString("es-AR") : "—"}</td></tr>`).join("")}</tbody>
      </table>
      <table>
        <thead><tr><th>Profesión liberal</th><th>Personas (socios de toda la base)</th></tr></thead>
        <tbody>${RANKING_PROFESIONES_LIBERALES.map((r) => `<tr><td>${escapeHtml(r.etiqueta)}</td><td>${r.valor.toLocaleString("es-AR")}</td></tr>`).join("")}</tbody>
      </table>
      <h2>Los escribanos del Boletín: un mercado atomizado</h2>
      <p>559 escribanos/as distintos intervinieron en 1.511 actos del Boletín. Los 10 más activos concentran 237 actos (15,7%), los 50 más activos 589 (39,0%), y 296 de los 559 (52,9%) aparecen una única vez. Solo el 6,9% de los 21.989 actos totales de la base declara qué escribano intervino.</p>
      <table>
        <thead><tr><th>Escribano/a</th><th>Actos</th></tr></thead>
        <tbody>${ESCRIBANOS_TOP.map((e) => `<tr><td>${escapeHtml(e.etiqueta)}</td><td>${e.valor}</td></tr>`).join("")}</tbody>
      </table>
      <h2>Perfil societario</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_SERVICIOS_PROFESIONALES.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>36 de las 46 (78,3%) son S.A.S. Capital declarado: mediana de $101.000, entre $20.000 y $3.000.000.</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cantidad</th></tr></thead>
        <tbody>${DEPARTAMENTOS_SERVICIOS_PROFESIONALES.map((d) => `<tr><td>${escapeHtml(d.departamento)}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>45 de los 46 estudios tienen departamento identificado; 1 no. Capital concentra el 73,9% (34 de 46) — la mayor concentración geográfica de toda esta tanda de informes.</p>
      ${ENTIDADES_SERVICIOS_PROFESIONALES.length > 0 ? `<h2>Directorio completo: los 46 estudios</h2>${directorioServiciosProfesionalesHtml}` : ""}
      <h2>Metodología y límites</h2>
      <p>Búsqueda por objeto social y nombre: términos jurídicos, contables y notariales — 163 sociedades candidatas. Revisión manual completa: 117 de las 163 (71,8%) se descartaron. Los datos de escribanos y de profesiones entre socios se calculan sobre toda la base de 19.485 sociedades y 21.989 actos, no solo sobre los 46 estudios de este informe. Las constituciones se cuentan por fecha de publicación del acto en el Boletín, no por fecha de constitución declarada.</p>
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
      dateModified: "2026-08-05",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial, octavo de la serie: mismo criterio que los
// anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoArquitectura.ts.
seoRouter.get(
  "/informes/nicho-arquitectura",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioArquitecturaHtml = await entidadesArquitecturaHtml();

    const title = "Arquitectura en Mendoza: 27 estudios y una profesión de asociación media | INGcome";
    const description =
      "27 estudios de arquitectura constituidos como sociedad en Mendoza (2018–2026), sin patrón temporal y con la menor concentración en Capital de toda la serie de nichos sectoriales.";
    const canonical = `${siteUrl()}/informes/nicho-arquitectura`;

    const contentHtml = `
    <main>
      <h1>Arquitectura en Mendoza</h1>
      <p>27 estudios y una profesión de asociación media</p>
      <p>Hermano chico del informe de Servicios Profesionales: la arquitectura es otra profesión regulada por colegio propio que el nomenclador CLAE mezcla con la ingeniería en una categoría poco discriminante, y que ese informe no cubrió. 27 estudios constituidos como sociedad entre 2018 y 2026 — el nicho más chico de toda esta serie.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>27 estudios de arquitectura constituidos como sociedad comercial entre 2018 y 2026 — el nicho más chico de todos los evaluados en esta ronda.</li>
        <li>Sin patrón temporal: entre 1 y 5 constituciones por año, sin boom, sin colapso, sin meseta — un goteo constante desde 2018.</li>
        <li>Geografía mucho menos concentrada que el resto de la serie: solo el 26% (7 de 27) está en Capital — la proporción más baja de todos los nichos evaluados.</li>
        <li>475 personas declaran ser arquitectos/as en toda la base; 464 figuran como socios en alguna sociedad — menos que abogados (770) y contadores (952).</li>
        <li>Capital declarado: mediana de $450.000 — más alto que Software ($100.000) o Café ($300.000).</li>
      </ul>
      <h2>Un goteo, no una curva</h2>
      <table>
        <thead><tr><th>Año</th><th>Estudios de arquitectura</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_ARQUITECTURA.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es un año parcial: boletines relevados hasta julio de 2026. Con un universo de 27 no hay volumen suficiente para hablar de tendencia: la serie oscila entre 1 y 5 por año sin ningún patrón identificable, ni boom ni colapso.</p>
      <h2>El ángulo de ecosistema</h2>
      <table>
        <thead><tr><th>Profesión (socios, personas únicas)</th><th>Cantidad</th></tr></thead>
        <tbody>${ECOSISTEMA_PROFESIONES.map((p) => `<tr><td>${escapeHtml(p.etiqueta)}</td><td>${p.valor.toLocaleString("es-AR")}</td></tr>`).join("")}</tbody>
      </table>
      <p>475 personas declaran una profesión que contiene "arquitect@", y 464 (98%) figuran como socias en al menos una sociedad — la profesión liberal con menos socios de las cuatro comparadas. Los arquitectos con más sociedades a su nombre no siempre están al frente de un estudio de arquitectura: el caso de mayor participación, con 7 sociedades, está vinculado a una serie de sociedades anónimas de desarrollo inmobiliario, no a ninguno de los 27 estudios de este relevamiento.</p>
      <h2>Perfil societario</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_ARQUITECTURA.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Mediana de capital declarado: $450.000 (rango $40.000-$15.000.000).</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cantidad</th></tr></thead>
        <tbody>${DEPARTAMENTOS_ARQUITECTURA.map((d) => `<tr><td>${escapeHtml(d.departamento)}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Capital reúne solo el 26% de los estudios — la proporción más baja de cualquier nicho evaluado en esta tanda. El desarrollo inmobiliario y la obra privada que sostiene a un estudio de arquitectura ocurre en todos los departamentos donde hay crecimiento urbano: General Alvear, San Carlos y Tupungato, que casi no aparecen en el resto de esta serie, tienen acá su propio estudio.</p>
      ${ENTIDADES_ARQUITECTURA.length > 0 ? `<h2>Directorio completo: los 27 estudios</h2>${directorioArquitecturaHtml}` : ""}
      <h2>Metodología y límites</h2>
      <p>Búsqueda solo por nombre ("arquitect%"), a diferencia de casi todos los demás nichos de esta serie — el objeto social es una frase de boilerplate demasiado común en constructoras e inmobiliarias sin relación con un estudio real. Las 27 candidatas por nombre no tuvieron que depurarse. El ángulo de ecosistema usa el campo profesión autodeclarado de personas_fisicas, sin verificación contra la matrícula del Colegio de Arquitectos de Mendoza. Universo chico: cualquier lectura de tendencia temporal o geográfica debe tomarse como orientativa. Las constituciones se cuentan por fecha de publicación del acto en el Boletín, no por fecha de constitución declarada.</p>
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
      dateModified: "2026-08-05",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial, noveno de la serie: mismo criterio que los
// anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoCafe.ts.
seoRouter.get(
  "/informes/nicho-cafe",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioCafeHtml = await entidadesCafeHtml();

    const title =
      "Café de especialidad en Mendoza: crecimiento sostenido, sin el boom ni el colapso de la cerveza artesanal | INGcome";
    const description =
      "42 sociedades cafeteras en Mendoza (2017–2026): crecimiento parejo desde 2017, sin boom ni colapso. Norbu S.A.S., único caso de integración vertical real, y un grupo familiar de tres cafeterías en San Rafael.";
    const canonical = `${siteUrl()}/informes/nicho-cafe`;

    const contentHtml = `
    <main>
      <h1>Café de especialidad en Mendoza</h1>
      <p>Crecimiento sostenido, sin el boom ni el colapso de la cerveza artesanal</p>
      <p>42 sociedades cafeteras se constituyeron en Mendoza entre 2017 y 2026, casi todas nombradas explícitamente con "café" o "coffee" — a diferencia de otros nichos de esta serie, acá el propio nombre comercial es el filtro más confiable.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>42 sociedades cafeteras identificadas entre 2017 y 2026, casi todas nombradas explícitamente con "café" o "coffee".</li>
        <li>Crecimiento sostenido, sin boom ni colapso: de 2 sociedades en 2017 sube de forma pareja hasta un pico de 7 en 2022, y se mantiene estable en 5-6 por año hasta 2025 — el patrón opuesto al de la cerveza artesanal, que colapsó después de 2020.</li>
        <li>Norbu S.A.S. (2024) es el único caso de "especialidad" en sentido estricto: importa granos de café verde, tuesta y fabrica sus propias máquinas tostadoras, con $10.000.000 de capital declarado, el más alto del nicho por lejos.</li>
        <li>Un pequeño grupo familiar (Guillén) participa, en distintas combinaciones, de tres cafeterías en San Rafael entre 2021 y 2026.</li>
        <li>Capital y San Rafael concentran a partes iguales una porción relevante del nicho (11 y 5 de 42).</li>
      </ul>
      <h2>Una curva sin sobresaltos</h2>
      <table>
        <thead><tr><th>Año</th><th>Cafeterías constituidas</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_CAFE.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es parcial. La cerveza artesanal tuvo un boom concentrado en 2017-2019 y un colapso casi total después de 2020. El café de especialidad, en cambio, crece de forma pareja y sostenida, sin un año de despegue evidente ni una caída posterior.</p>
      <h2>El único caso de especialidad en sentido estricto</h2>
      <p>Norbu S.A.S. (03/07/2024): "Compraventas, importación y exportación de granos de café verde, procesos de tostado, torrado y molienda de café. Fabricación de maquinarias tostadoras." Capital declarado: $10.000.000 — más del doble del segundo capital más alto del nicho ($5.000.000, Un Café Copado Mza S.A.S., 2025). Ningún otro caso del nicho declara importación de grano verde ni fabricación de maquinaria propia.</p>
      <h2>Un pequeño grupo familiar</h2>
      <table>
        <thead><tr><th>Personas</th><th>Sociedades</th><th>Departamento</th><th>Años</th></tr></thead>
        <tbody>
          <tr><td>Lilia Laura Guillén</td><td>My Coffee S.A.S. → Grupo Café Del Mundo S.A.S.</td><td>San Rafael</td><td>2021 → 2023</td></tr>
          <tr><td>Marcos David Guillén</td><td>Grupo Café Del Mundo S.A.S. → Café Del Mundo Alvear S.A.S.</td><td>San Rafael</td><td>2023 → 2026</td></tr>
          <tr><td>Mateo Samuel Guillén</td><td>Café Del Mundo Alvear S.A.S.</td><td>San Rafael</td><td>2026</td></tr>
        </tbody>
      </table>
      <p>Familia sanrafaelina construyendo, en tres años, una cadena chica de tres cafeterías bajo el nombre "Café Del Mundo". Otros dos pares de fundadores repetidos: María Mercedes Rossi (Cafe 2020 S.R.L., 2020, y Cafe Rossi Tostadores S.A.S., 2022) y Lucas Germán Laborde (Café Lyn S.A.S. y El Club Del Café S.A., ambas 2022).</p>
      <h2>Perfil societario</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_CAFE.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>La S.A.S. domina con más fuerza que en el resto de la serie (81%). Capital declarado: mediana de $300.000, rango de $50.000 a $10.000.000.</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cafeterías</th></tr></thead>
        <tbody>${DEPARTAMENTOS_CAFE.map((d) => `<tr><td>${escapeHtml(d.departamento)}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>San Rafael, con 5 cafeterías (12% del nicho), es un polo llamativo para un departamento fuera del Gran Mendoza — explicado en buena parte por el grupo familiar Guillén.</p>
      <h2>Un caso de duplicado detectado</h2>
      <p>Cafeteria Tina S.A.S. aparece dos veces en la base con fechas de publicación separadas por solo 8 días, el mismo socio, el mismo capital y un objeto social casi idéntico. Es, con alta probabilidad, la misma constitución societaria publicada dos veces en el Boletín. Se cuenta una sola vez en todos los números de este informe (42 sociedades, no 43).</p>
      ${ENTIDADES_CAFE.length > 0 ? `<h2>Directorio completo: las 42 cafeterías y tostadurías</h2>${directorioCafeHtml}` : ""}
      <h2>Metodología y límites</h2>
      <p>Búsqueda por nombre ("café", "coffee", "tostad%", "barista", "roaster") — 41 de las 43 candidatas tienen "café" o "coffee" literalmente en su razón social. Solo 2 (Mondovi S.A. y Norbu S.A.S.) se incluyeron exclusivamente por objeto social. Cobertura ARCA: 20 de 42 (47,6%). Las constituciones se cuentan por fecha de publicación del acto en el Boletín, no por fecha de constitución declarada.</p>
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
      dateModified: "2026-08-05",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial, décimo de la serie: mismo criterio que los
// anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoCerveza.ts.
seoRouter.get(
  "/informes/nicho-cerveza",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioCervezaHtml = await entidadesCervezaHtml();

    const title = "Cerveza artesanal en Mendoza: un boom de tres años que no volvió a repetirse | INGcome";
    const description =
      "36 sociedades cerveceras en Mendoza (2017–2026): el 72% se constituyó en apenas tres años (2017-2019) y la curva colapsó después de 2020. Perfil societario, geografía y clúster de cofundadores repetidos.";
    const canonical = `${siteUrl()}/informes/nicho-cerveza`;

    const contentHtml = `
    <main>
      <h1>Cerveza artesanal en Mendoza</h1>
      <p>Un boom de tres años que no volvió a repetirse</p>
      <p>36 sociedades cerveceras se constituyeron en Mendoza entre 2017 y 2026: productoras artesanales, cervecerías-bar con elaboración propia y una cámara gremial del sector. El 72% se concentró en apenas tres años.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>36 sociedades cerveceras identificadas entre 2017 y 2026: productoras artesanales, cervecerías-bar con elaboración propia y una cámara gremial del sector.</li>
        <li>El sector nació de golpe y se apagó rápido: 26 de las 36 (72%) se constituyeron en apenas tres años, 2017-2019. Desde 2020 la curva colapsa, y ninguna desde 2023.</li>
        <li>La forma societaria dominante es la S.A.S. (22 de 36, 61%), pero con una proporción de S.A. inusualmente alta (6 de 36, 17%).</li>
        <li>Geografía: Capital (9) y Godoy Cruz (8) concentran casi la mitad de las cerveceras.</li>
        <li>La Asociación Cámara Mendocina de Cervecerías Artesanales se constituyó en 2018, año pico del boom.</li>
        <li>Cuatro socios fundaron Rodder S.A.S. y Leven Anclas S.A.S. con apenas tres semanas de diferencia (noviembre-diciembre de 2018).</li>
      </ul>
      <h2>El boom de 2017-2019, y lo que vino después</h2>
      <table>
        <thead><tr><th>Año</th><th>Cerveceras constituidas</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_CERVEZA.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>El patrón es opuesto al de casi todos los nichos de esta serie. El pico es 2018 (11 sociedades) y la caída es abrupta: 2020 marca el quiebre, coincidiendo con las restricciones a la gastronomía durante la pandemia. La caída no se recupera después: solo 5 cerveceras más se registraron entre 2021 y 2026, y ninguna desde 2023.</p>
      <h2>Perfil societario</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_CERVEZA.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>El 17% de Sociedades Anónimas es alto para un nicho de emprendimientos chicos. Capital declarado: mediana de $120.000, rango de $20.000 a $2.074.600 (Kühlen Beer S.A.S., 2019).</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Cerveceras</th></tr></thead>
        <tbody>${DEPARTAMENTOS_CERVEZA.map((d) => `<tr><td>${escapeHtml(d.departamento)}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Capital y Godoy Cruz juntos concentran el 47% del sector — el corredor gastronómico y de vida nocturna del Gran Mendoza, no las zonas rurales donde se cultiva el lúpulo o la cebada.</p>
      <h2>Un pequeño clúster de cofundadores repetidos</h2>
      <p>Cruzando los socios de las 36 cerveceras aparecen ocho personas que participan en más de una. El caso más llamativo: los cuatro socios de Leven Anclas S.A.S. (20/12/2018) son los mismos cuatro de Rodder S.A.S. (29/11/2018) — veintiún días antes.</p>
      <h2>La cámara gremial</h2>
      <p>La Asociación Cámara Mendocina de Cervecerías Artesanales se constituyó en 2018, en pleno pico del boom (11 cerveceras ese año).</p>
      ${ENTIDADES_CERVEZA.length > 0 ? `<h2>Directorio completo: las 36 cervecerías</h2>${directorioCervezaHtml}` : ""}
      <h2>Metodología y límites</h2>
      <p>Búsqueda por "cerveza", "cervecer[íi]a", "l[uú]pulo", "malter[íi]a", "brewing", "brewery" en nombre y objeto social — 90 sociedades candidatas. Clasificación manual: 54 de las 90 quedaron afuera por objeto social genérico sin que la cerveza fuera el eje del negocio. Cobertura ARCA: 14 de 36 (39%). Las constituciones se cuentan por fecha de publicación del acto en el Boletín, no por fecha de constitución declarada.</p>
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
      dateModified: "2026-08-06",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial, undécimo de la serie: mismo criterio que los
// anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoReciclaje.ts.
seoRouter.get(
  "/informes/nicho-reciclaje",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioReciclajeHtml = await entidadesReciclajeHtml();

    const title =
      "Reciclaje y economía circular en Mendoza: de la chatarrería al \"impacto ambiental\" como marca | INGcome";
    const description =
      "41 sociedades de reciclaje y economía circular en Mendoza (2018–2026): tres oleadas sucesivas por tipo de material — plásticos, metales/chatarra, y consultoras ambientales con capitales sensiblemente más altos.";
    const canonical = `${siteUrl()}/informes/nicho-reciclaje`;

    const contentHtml = `
    <main>
      <h1>Reciclaje y economía circular en Mendoza</h1>
      <p>De la chatarrería al "impacto ambiental" como marca</p>
      <p>41 sociedades se constituyeron en Mendoza entre 2018 y 2026 con la gestión, comercialización o reciclado de residuos como actividad central. No hay una única curva: tres oleadas sucesivas, por tipo de material y de negocio.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>41 sociedades identificadas entre 2018 y 2026: recicladoras de metales y plásticos, gestión de residuos peligrosos y urbanos, y consultoras ambientales.</li>
        <li>No hay una única curva sino tres oleadas sucesivas: recicladoras de plástico concentradas en 2018-2020, recicladoras de metales/chatarra en 2021-2023, y consultoras ambientales/economía circular desde 2023.</li>
        <li>La capitalización sube fuerte en la capa más nueva: mediana general $440.000, pero Trigenus S.A. ($4.500.000, 2023), Palcriva Estrategias Integrales ($3.000.000, 2025) y Transformación Estratégica Circular S.A. ($60.000.000, 2024) son los tres capitales más altos del nicho.</li>
        <li>Capital y Guaymallén concentran el 51% de las sociedades (21 de 41).</li>
        <li>Aparece una cooperativa (Economía Popular Y Circular Ltda., 2023) y una Unión Transitoria entre dos empresas para construir tres centros ambientales municipales en Tupungato, San Carlos y Tunuyán (2021).</li>
      </ul>
      <h2>Tres oleadas, no una curva</h2>
      <table>
        <thead><tr><th>Período</th><th>Plásticos</th><th>Chatarra/Metales</th><th>Ambiental/consultoría/otros</th></tr></thead>
        <tbody>${OLEADAS_RECICLAJE.map((o) => `<tr><td>${o.periodo}</td><td>${o.plasticos}</td><td>${o.metales}</td><td>${o.ambiental}</td></tr>`).join("")}</tbody>
      </table>
      <p>A diferencia de la mayoría de los nichos de esta serie, acá no hay un solo quiebre o boom identificable, sino un relevo entre subrubros: plástico primero, metales/chatarra después, y desde 2023 la categoría más numerosa pasa a ser la de consultoras y gestoras ambientales bajo la bandera de "economía circular" o "triple impacto".</p>
      <h2>La profesionalización se nota en el capital declarado</h2>
      <table>
        <thead><tr><th>Sociedad</th><th>Capital declarado</th></tr></thead>
        <tbody>${TOP_CAPITALES_RECICLAJE.map((c) => `<tr><td>${escapeHtml(c.etiqueta)}</td><td>$${c.valor.toLocaleString("es-AR")}</td></tr>`).join("")}</tbody>
      </table>
      <p>Mediana del nicho completo: $440.000 (rango $30.000-$60.000.000). Las tres consultoras/estrategas ambientales de 2023-2026 están entre los cinco capitales más altos del nicho — llamativo para un rubro que en su primera oleada (2018-2020) tenía capitales típicos de $50.000 a $300.000.</p>
      <h2>Perfil societario</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_RECICLAJE.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>La S.A.S. domina, pero el 24% de S.A. es alto para un nicho de este tamaño — probablemente por la escala de capital de trabajo que requiere el acopio y comercio de materiales.</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Sociedades</th></tr></thead>
        <tbody>${DEPARTAMENTOS_RECICLAJE.map((d) => `<tr><td>${escapeHtml(d.departamento)}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Capital y Guaymallén concentran más de la mitad del nicho — el corredor urbano del Gran Mendoza, donde se genera la mayor parte de los residuos a gestionar.</p>
      ${ENTIDADES_RECICLAJE.length > 0 ? `<h2>Directorio completo: las 41 empresas de reciclaje</h2>${directorioReciclajeHtml}` : ""}
      <h2>Metodología y límites</h2>
      <p>Búsqueda por "recicl%", "circular", "residuo%", "chatarr%", "compost%", "scrap" en nombre y objeto social — 81 sociedades candidatas. Clasificación manual: 40 de las 81 quedaron afuera por objeto social catálogo sin que el reciclaje/residuos fuera el eje del negocio. Las constituciones se cuentan por fecha de publicación del acto en el Boletín, no por fecha de constitución declarada.</p>
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
      dateModified: "2026-08-06",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial, duodécimo de la serie: mismo criterio que los
// anteriores — contenido estático duplicado a mano desde
// frontend/src/data/nichoFideicomisos.ts.
seoRouter.get(
  "/informes/nicho-fideicomisos",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioFideicomisosHtml = await entidadesFideicomisosHtml();

    const title =
      "Servicios de fideicomisos en Mendoza: el vehículo financiero del boom inmobiliario | INGcome";
    const description =
      "63 sociedades de servicios de fideicomisos en Mendoza (2017–2026): el 79% declara actividad inmobiliaria o constructora, es el único nicho sin una sola S.R.L. ni fundadores repetidos.";
    const canonical = `${siteUrl()}/informes/nicho-fideicomisos`;

    const contentHtml = `
    <main>
      <h1>Servicios de fideicomisos en Mendoza</h1>
      <p>El vehículo financiero del boom inmobiliario, no un servicio patrimonial genérico</p>
      <p>63 sociedades identificadas vía el código CLAE "Servicios de fideicomisos" — el universo más chico de la serie, pero el más nítido en su identidad real: pese al nombre oficial, en Mendoza esta figura es casi por completo el vehículo legal del "fideicomiso al costo" inmobiliario.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>63 sociedades de servicios de fideicomisos identificadas vía el código CLAE 643001, declarado como actividad principal — el universo más chico de los tres nichos basados en CLAE de esta serie, y el único sin ningún año en cero desde que arranca el relevamiento.</li>
        <li>No es un servicio patrimonial genérico: es el vehículo del "fideicomiso al costo" inmobiliario. El 79% (50 de 63) declara explícitamente actividad inmobiliaria, constructora o de desarrollo urbano en su objeto social — un fiduciario administra los aportes de inversores particulares para construir y luego distribuir unidades o rentabilidad, no la administración de fideicomisos financieros o testamentarios en sentido amplio.</li>
        <li>Arranca fuerte desde el primer año con datos (10 sociedades en 2018) y 2025 es el pico de toda la serie (13) — sin la curva de despegue gradual que muestran otros nichos de esta tanda.</li>
        <li>Ningún fundador se repite entre las 63 sociedades — el único de los tres nichos CLAE de esta serie sin una sola cadena de socios compartidos. Cada proyecto fiduciario parece constituirse con un equipo propio.</li>
        <li>100% S.A.S. o S.A.: es el único nicho de la serie sin una sola S.R.L. — coherente con que administrar fideicomisos de terceros exige una estructura de responsabilidad limitada por acciones, no de cuotas.</li>
      </ul>
      <h2>Una curva sin rampa de despegue</h2>
      <table>
        <thead><tr><th>Año</th><th>Sociedades constituidas</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_FIDEICOMISOS.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es parcial: el relevamiento llega hasta julio. No hay sociedades del nicho con fecha de Constitución en 2017 — 2018 es el primer año con datos, y ya arranca como el segundo año más alto de la serie.</p>
      <p>A diferencia de los demás nichos —que muestran una rampa de crecimiento gradual desde 2017— este arranca fuerte en 2018 (10 sociedades) y se mantiene en una banda de 4 a 8 por año durante seis años, sin un patrón de boom ni de colapso, hasta el salto de 2025 (13, el año más alto de toda la serie). No hay un evento de origen visible en los datos: para 2018 la figura del fideicomiso inmobiliario ya estaba consolidada como vehículo de inversión en Mendoza, y este relevamiento —que arranca en 2017— la encuentra ya en régimen, no naciendo.</p>
      <h2>No es "gestión patrimonial": es financiamiento de obra</h2>
      <p>El objeto social de las 63 sociedades deja poca ambigüedad sobre a qué se dedica realmente este código CLAE en Mendoza:</p>
      <table>
        <thead><tr><th>Actividad declarada (además de "fiduciaria")</th><th>Sociedades</th></tr></thead>
        <tbody>
          <tr><td>Inmobiliaria / constructora / desarrollo urbano</td><td>50 (79%)</td></tr>
          <tr><td>Financiera / inversora</td><td>31 (49%)</td></tr>
        </tbody>
      </table>
      <p>La combinación típica —fiduciaria + inmobiliaria/constructora— es la firma textual del fideicomiso al costo: la figura donde un grupo de inversores ("fiduciantes") aporta capital a una sociedad ("fiduciaria") que administra la construcción de un edificio o loteo y distribuye unidades o rentabilidad al terminar la obra, sin que el desarrollador ponga capital propio de riesgo.</p>
      <p>"Fiduciaria: ejercer el carácter de fiduciaria en todo tipo de fideicomiso con excepción de los financieros y aquellos sujetos a la normativa de la ley de entidades financieras." — Fontalba S.A.</p>
      <p>"Operaciones inmobiliarias: compraventa, locación, leasing, fideicomiso de inmuebles. Actos jurídicos, inversiones y aportes de capitales, actuación como fiduciario..." — Furmich S.A.S.</p>
      <p>Casi ninguna sociedad del nicho declara fideicomisos testamentarios, de garantía o de administración patrimonial familiar como actividad — el uso mendocino de esta figura societaria es, de manera abrumadora, financiamiento de desarrollo inmobiliario.</p>
      <h2>Perfil societario</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_FIDEICOMISOS.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Es el único nicho de toda la serie sin una sola S.R.L. — coherente con que actuar como fiduciario de terceros es una actividad que exige una estructura de responsabilidad limitada por acciones (S.A.S. o S.A.), no la forma de cuotas sociales típica de un negocio familiar chico. Capital declarado: mediana de $292.000, rango de $20.000 a $20.000.000 (Grupo Magoviva S.A.S., 2025).</p>
      <table>
        <thead><tr><th>Sociedad</th><th>Capital</th><th>Departamento</th></tr></thead>
        <tbody>
          <tr><td>Grupo Magoviva S.A.S.</td><td>$20.000.000</td><td>Capital</td></tr>
          <tr><td>Fundamenta Pilares Desarrollos S.A.S.</td><td>$10.000.000</td><td>Capital</td></tr>
          <tr><td>Utopía Desarrollos S.A.S.</td><td>$8.000.000</td><td>San Rafael</td></tr>
          <tr><td>Betania S.A.S.</td><td>$4.000.000</td><td>Luján de Cuyo</td></tr>
          <tr><td>Poldena Moon Sas</td><td>$2.000.000</td><td>Las Heras</td></tr>
          <tr><td>Flogulu S.A.S.</td><td>$2.000.000</td><td>Capital</td></tr>
          <tr><td>Grupo Gestión Urbana S.A.S.</td><td>$1.500.000</td><td>San Rafael</td></tr>
          <tr><td>Jolmogori S.A.S.</td><td>$1.500.000</td><td>Guaymallén</td></tr>
        </tbody>
      </table>
      <p>Los nombres mismos del top del ranking ("Fundamenta Pilares Desarrollos", "Utopía Desarrollos", "Grupo Gestión Urbana") refuerzan la lectura: son firmas de desarrollo inmobiliario que adoptaron la figura fiduciaria como estructura legal, no administradoras de fideicomisos como servicio abstracto.</p>
      <h2>Sin cadenas de fundadores repetidos</h2>
      <p>A diferencia de otros nichos de esta serie basados en CLAE, ningún socio se repite entre las 63 sociedades de este nicho. Cada proyecto fiduciario parece armarse con un equipo de inversores propio, sin que aparezca en los datos ningún desarrollador serial constituyendo múltiples vehículos fiduciarios sucesivos — al menos no bajo los mismos nombres de socios captados en el Boletín. No se puede descartar que un mismo grupo económico use apoderados o sociedades intermedias distintas en cada proyecto, algo que este relevamiento (basado en personas físicas nombradas como socios) no puede ver.</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Sociedades</th></tr></thead>
        <tbody>${DEPARTAMENTOS_FIDEICOMISOS.map((d) => `<tr><td>${escapeHtml(d.departamento)}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Capital, Luján de Cuyo y Godoy Cruz concentran el 69% del nicho — los tres departamentos del Gran Mendoza con más desarrollo inmobiliario de edificios y countries en la última década, consistente con la lectura de que este es, ante todo, un vehículo de financiamiento de obra urbana.</p>
      ${ENTIDADES_FIDEICOMISOS.length > 0 ? `<h2>Directorio completo: las 63 sociedades de servicios de fideicomisos</h2>${directorioFideicomisosHtml}` : ""}
      <h2>Metodología y límites</h2>
      <p>Búsqueda por CLAE, mismo método que otros nichos de esta serie. Se usó el código 643001 ("Servicios de fideicomisos") como actividad principal (orden 1, estado activo) declarada ante ARCA. Este método solo alcanza al 61,7% del corpus con cruce ARCA — una sociedad fiduciaria real sin ese cruce queda invisible, sin forma de estimar cuántas son.</p>
      <p>71 candidatas → 63 sociedades únicas: el cruce dio 71 filas, pero 8 nombres normalizados aparecían dos veces por el mismo patrón de republicación en el Boletín — se deduplicó por nombre normalizado, conservando la primera publicación cronológica.</p>
      <p>Cobertura ARCA: 37 de 63 (58,7%) cruzan contra el padrón de AFIP — la más baja de los tres nichos CLAE de esta serie, aunque todas las que cruzan están activas salvo un caso "No Inscripto" en IVA.</p>
      <p>Límite del método de socios: la ausencia de socios repetidos entre estas 63 sociedades no significa necesariamente ausencia de desarrolladores seriales — este relevamiento identifica personas físicas nombradas como "Socio" en el Boletín, y una misma firma desarrolladora podría usar apoderados distintos o estructuras societarias intermedias en cada proyecto fiduciario sin que eso se refleje en los datos disponibles.</p>
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
      dateModified: "2026-08-12",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial: mismo criterio que los anteriores — contenido
// estático duplicado a mano desde frontend/src/data/nichoAgenciasViajes.ts.
seoRouter.get(
  "/informes/nicho-agencias-viajes",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioAgenciasViajesHtml = await entidadesAgenciasViajesHtml();

    const title =
      "Agencias de viajes en Mendoza: la pandemia frenó la curva un año, no la cortó | INGcome";
    const description =
      "168 agencias de viajes en Mendoza (2017–2026): la pandemia frena la curva en 2020 pero el pico llega en 2023 (40, el más alto de toda la serie). 85% minoristas, cobertura ARCA la más alta de la serie.";
    const canonical = `${siteUrl()}/informes/nicho-agencias-viajes`;

    const contentHtml = `
    <main>
      <h1>Agencias de viajes en Mendoza</h1>
      <p>La pandemia frenó la curva un año, no la cortó</p>
      <p>168 agencias de viajes identificadas entre 2017 y 2026 — el universo más grande de esta serie hasta ahora, construido con el código CLAE oficial (791100 minorista o 791200 mayorista) en vez de una búsqueda de texto libre.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>168 agencias de viajes identificadas entre 2017 y 2026 — el universo más grande de esta serie hasta ahora, y el primero construido con el código CLAE oficial que cada sociedad declaró ante ARCA como actividad principal.</li>
        <li>La pandemia frenó la curva de constituciones, no la cortó: de 14 agencias en 2019 cae a 8 en 2020 y ya en 2021 supera el nivel prepandemia (16). El pico real llega en 2023 (40, el año más alto de toda la serie).</li>
        <li>85% son minoristas (143 de 168) contra 15% mayoristas (25).</li>
        <li>Cobertura ARCA excepcionalmente alta para esta serie: 130 de 168 (77,4%) tienen cruce con el padrón de AFIP, todas activas — la más alta de todos los nichos de la serie.</li>
        <li>Viajo Facil S.A. (2025, Luján de Cuyo) reúne, en una sociedad nueva con $30.000.000 de capital, a dos socios que un año y medio antes habían fundado agencias separadas el mismo día.</li>
      </ul>
      <h2>Un año de pausa, no de quiebre</h2>
      <table>
        <thead><tr><th>Año</th><th>Agencias constituidas</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_AGENCIAS_VIAJES.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es parcial: el relevamiento llega hasta julio. Dos sociedades del nicho no tienen fecha de Constitución capturada y no figuran en esta tabla.</p>
      <p>El turismo internacional fue uno de los sectores más golpeados por la pandemia, y la caída de 2019 a 2020 (14 → 8, -43%) lo confirma en los datos societarios locales. Pero el freno duró exactamente un año: 2021 ya cierra por encima de 2019 (16 contra 14), y de ahí el crecimiento es prácticamente ininterrumpido hasta el pico de 40 agencias en 2023 — el año más alto de cualquier nicho relevado en esta serie hasta ahora. 2024 y 2025 se mantienen en una meseta alta (29 y 27) sin volver a los niveles pre-2022, lo que sugiere que 2023 fue un pico de reapertura post-pandemia ("revenge travel") más que un nuevo piso estructural del sector.</p>
      <h2>Minoristas y mayoristas</h2>
      <table>
        <thead><tr><th>Tipo CLAE</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_CLAE_AGENCIAS_VIAJES.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>La proporción es la esperable en cualquier mercado turístico: la mayoría vende directo al público (minorista), y un grupo más chico opera como intermediario mayorista/operador. El capital declarado no distingue claramente a un grupo del otro: dos de los tres capitales más altos del nicho (Viajo Facil S.A. e Intermission S.A.S., ambas $30.000.000) están clasificadas como minoristas, no mayoristas.</p>
      <h2>Perfil societario</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_AGENCIAS_VIAJES.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>El dominio de la S.A.S. (89%) es el más alto de toda la serie de nichos — coherente con que el 70% de las agencias se constituyeron desde 2021, el período en que la S.A.S. ya era la forma societaria por defecto para un emprendimiento chico en Mendoza. Capital declarado: mediana de $400.000, rango de $20.000 (Puerto Montt Viajes S.A.S., 2018) a $30.000.000 (dos casos: Viajo Facil S.A. y Lantier S.A., ambas 2025).</p>
      <h2>Una fusión de trayectorias: el caso Viajo Facil</h2>
      <p>Cruzando socios entre las 168 agencias aparecen 15 pares de personas que participaron, en momentos distintos, de más de una agencia del nicho. Viajo Facil S.A. (03/04/2025, Luján de Cuyo, $30.000.000) es la sociedad con más capital del nicho, y sus dos socios no llegaron ahí como primerizos: Nicolas Furtado Flores había fundado Be Fun Travel S.A. ($5.000.000, Guaymallén) y Martin Lopez había fundado Global Xplore S.A. ($6.000.000, Capital) — ambas el mismo día, 15/05/2023. Casi dos años después, los dos se asociaron en una sociedad nueva con casi seis veces el capital de cualquiera de sus emprendimientos individuales anteriores.</p>
      <p>Un patrón inverso, de sociedad que se divide en vez de fusionarse, aparece en Sg S.A.S. (05/10/2020, Capital): sus dos socios fundadores se separaron societariamente al año siguiente, cada uno fundando una agencia nueva con un objeto social casi calcado del original.</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Agencias</th></tr></thead>
        <tbody>${DEPARTAMENTOS_AGENCIAS_VIAJES.map((d) => `<tr><td>${escapeHtml(d.departamento)}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Capital concentra un tercio del nicho, esperable para un rubro de oficina y atención al público. Lo notable es la fuerte presencia de Luján de Cuyo (26, segundo lugar) por encima de Godoy Cruz — sede también de dos de las tres agencias con capital más alto, y de gran parte de la industria vitivinícola y del turismo del vino de la provincia.</p>
      ${ENTIDADES_AGENCIAS_VIAJES.length > 0 ? `<h2>Directorio completo: las 168 agencias de viajes</h2>${directorioAgenciasViajesHtml}` : ""}
      <h2>Metodología y límites</h2>
      <p>Búsqueda por CLAE, no por palabra clave. Se usó el código de actividad económica que cada sociedad declaró ante ARCA al inscribirse: 791100 ("Servicios minoristas de agencias de viajes") o 791200 ("Servicios mayoristas de agencias de viajes"), tomando siempre la actividad marcada como principal. Es más preciso que el texto libre, pero solo alcanza al 61,7% del corpus que logró cruzar contra el Registro Nacional de Sociedades.</p>
      <p>191 candidatas → 168 agencias únicas: el cruce por CLAE principal dio 191 filas (164 minorista + 27 mayorista); 189 sobrevivieron al filtro de duplicados exactos. De esas, 19 pares/tríos correspondían a la misma sociedad publicada más de una vez en el Boletín — se deduplicó por nombre normalizado, conservando la primera publicación cronológica.</p>
      <p>Cobertura ARCA: 130 de 168 (77,4%) cruzan contra el padrón de AFIP, todas con estado "Activo" — la cobertura más alta de toda la serie de nichos, coherente con que operar como agencia de viajes es una actividad regulada que exige inscripción formal.</p>
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
      dateModified: "2026-08-13",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de nicho sectorial: mismo criterio que los anteriores — contenido
// estático duplicado a mano desde frontend/src/data/nichoSeguridadPrivada.ts.
seoRouter.get(
  "/informes/nicho-seguridad-privada",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const directorioSeguridadPrivadaHtml = await entidadesSeguridadPrivadaHtml();

    const title =
      "Seguridad privada en Mendoza: el único rubro de la serie que no sintió la pandemia | INGcome";
    const description =
      "136 empresas de seguridad privada en Mendoza (2017–2026): el único nicho de la serie sin caída en 2020, con 2024 y 2025 como los años más altos de toda la serie.";
    const canonical = `${siteUrl()}/informes/nicho-seguridad-privada`;

    const contentHtml = `
    <main>
      <h1>Seguridad privada en Mendoza</h1>
      <p>El único rubro de la serie que no sintió la pandemia</p>
      <p>136 empresas de seguridad privada identificadas entre 2017 y 2026, vía el código CLAE 801090 ("Servicios de seguridad e investigación n.c.p.") declarado como actividad principal — mismo método por clasificación oficial que el informe anterior de esta serie (Agencias de Viajes).</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>136 empresas de seguridad privada identificadas entre 2017 y 2026, vía el código CLAE 801090 declarado como actividad principal.</li>
        <li>El único nicho de la serie sin caída en 2020: mientras las agencias de viajes cayeron 43% ese año, la seguridad privada apenas bajó de 15 a 13 empresas nuevas (-13%) y ya en 2021 se mantiene en el mismo nivel.</li>
        <li>Crecimiento sostenido hasta el final de la serie: 2024 y 2025 son los dos años más altos (21 empresas cada uno), sin señales de meseta ni de declive.</li>
        <li>Un código, dos negocios distintos: 26 empresas declaran explícitamente sistemas técnicos (alarmas, cámaras, monitoreo), 9 declaran transporte de caudales/valores, y solo 6 mencionan "investigación privada" en sentido literal de detective.</li>
        <li>Grupo Rl: Lorena Belén Lescano y Pablo Andrés Juliani fundaron tres empresas de seguridad en Maipú en cuatro años — la cadena de fundadores repetidos más larga de toda la serie de nichos.</li>
      </ul>
      <h2>Crecimiento sin pausa, ni siquiera en pandemia</h2>
      <table>
        <thead><tr><th>Año</th><th>Empresas de seguridad constituidas</th></tr></thead>
        <tbody>${EVOLUCION_ANUAL_SEGURIDAD_PRIVADA.map((d) => `<tr><td>${d.etiqueta}</td><td>${d.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 es parcial: el relevamiento llega hasta julio. Cinco empresas del nicho no tienen fecha de acto capturada y no figuran en esta tabla.</p>
      <p>El contraste con el informe anterior de esta serie es directo: las agencias de viajes cayeron 43% interanual en 2020 y tardaron un año en recuperar el nivel prepandemia. La seguridad privada, en cambio, apenas sintió el golpe (-13%) y nunca dejó de crecer en el mediano plazo — 2024 y 2025 son los dos años más altos de toda la serie del rubro (21 cada uno), sin el patrón de pico-y-meseta que muestran café, cerveza o incluso las propias agencias de viajes.</p>
      <h2>Un código, dos negocios distintos (y un tercero minoritario)</h2>
      <p>El nombre del código CLAE —"servicios de seguridad e investigación"— es una herencia de la clasificación internacional (ISIC/CIIU), que agrupa históricamente vigilancia privada y detectives bajo una misma categoría. De las 136 empresas, 26 declaran explícitamente sistemas técnicos (alarmas, cámaras, monitoreo), 9 declaran transporte de caudales/valores, y solo 6 mencionan "investigación privada" en sentido literal — siempre junto con vigilancia y custodia, nunca como actividad exclusiva.</p>
      <p>"Servicios de investigación privada, vigilancia, custodia de bienes, seguridad en transporte de mercadería y caudales, fabricación y comercialización de [artículos de seguridad]..." — Asabay Seguridad Privada S.A.S.</p>
      <p>No aparece ningún caso de una sociedad dedicada solo a investigación privada sin vigilancia — el detective como actividad exclusiva, si existe en Mendoza, no se constituye bajo este código ni con esta combinación de palabras.</p>
      <h2>Perfil societario</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>${TIPO_ENTIDAD_SEGURIDAD_PRIVADA.map((d) => `<tr><td>${d.tipo}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Capital declarado: mediana de $200.000 (la más baja de toda la serie de nichos hasta ahora), rango de $1 a $30.000.000. El caso de $1 (Valhalla Servicios S.A.S., 2026) es casi con certeza un artefacto de extracción o un error de tipeo en el Boletín original, no un capital real — se conserva en los datos sin corregir, siguiendo el mismo criterio del resto del pipeline de no alterar lo publicado.</p>
      <h2>Grupo Rl: tres empresas, dos socios, cuatro años</h2>
      <p>Cruzando socios entre las 136 empresas aparece la cadena de fundadores repetidos más larga de toda la serie de nichos: Lorena Belén Lescano y Pablo Andrés Juliani aparecen juntos como socios en tres sociedades de seguridad sucesivas, todas en Maipú — Grupo Rl Seguridad Privada S.A. (08/09/2020), Vabeju S.A.S. (05/05/2023) y Grupo Rl Vigilancia Er S.A.S. (19/12/2024). El patrón sugiere una misma operación comercial reconstituida bajo sociedades nuevas, más que tres emprendimientos independientes.</p>
      <p>Un segundo caso, más simple, es una historia de continuidad de marca: Javier Andrés Muñoz fundó Visión Seguridad S.A.S. (10/05/2022, Capital) y tres años después Seguridad Grupo Visión Sas (28/07/2025, Guaymallén) — mismo nombre de fantasía, otro departamento, un posible relanzamiento o expansión de la misma marca.</p>
      <h2>Dónde están</h2>
      <table>
        <thead><tr><th>Departamento</th><th>Empresas</th></tr></thead>
        <tbody>${DEPARTAMENTOS_SEGURIDAD_PRIVADA.map((d) => `<tr><td>${escapeHtml(d.departamento)}</td><td>${d.cantidad}</td></tr>`).join("")}</tbody>
      </table>
      <p>Capital y Guaymallén concentran casi la mitad del nicho a partes iguales (32 cada uno). Lo más llamativo es la presencia de Junín (6 empresas) — un departamento chico y agrícola que no aparece con este peso en ningún otro nicho de la serie, y que junto con Tunuyán y Tupungato sugiere una porción de la demanda ligada a custodia rural y de establecimientos agroindustriales, no solo a seguridad urbana.</p>
      ${ENTIDADES_SEGURIDAD_PRIVADA.length > 0 ? `<h2>Directorio completo: las 136 empresas de seguridad</h2>${directorioSeguridadPrivadaHtml}` : ""}
      <h2>Metodología y límites</h2>
      <p>Búsqueda por CLAE, mismo método que Agencias de Viajes. Se usó el código 801090 ("Servicios de seguridad e investigación n.c.p.") como actividad principal declarada ante ARCA. Se excluyó deliberadamente el código 801020 ("Servicios de sistemas de seguridad", 22 empresas en el corpus) — es una actividad más específicamente técnica, y mezclarla hubiera diluido el foco del informe. Este método solo alcanza al 61,7% del corpus con cruce ARCA.</p>
      <p>153 candidatas → 136 empresas únicas. El cruce dio 153 filas; ninguna quedó marcada como duplicado exacto, pero 17 nombres normalizados aparecían dos veces por el mismo patrón de republicación en el Boletín — se deduplicó por nombre normalizado, conservando la primera publicación cronológica. Cinco de las 153 filas no son actos de Constitución — sociedades sin acto de Constitución identificado, donde se usó la fecha del acto disponible.</p>
      <p>Cobertura ARCA: 93 de 136 (68,4%) cruzan contra el padrón de AFIP, todas con estado "Activo" — más alta que el promedio de la serie, aunque algo menor que Agencias de Viajes (77,4%).</p>
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
      dateModified: "2026-08-13",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

// Informe de corte transversal (no es un nicho sectorial, ver nota en
// frontend/src/data/mujeresFundadoras.ts): mismo criterio de duplicado a
// mano que el resto de /informes. Sin ENTIDADES: no hay sociedades/personas
// puntuales referenciadas -- el ranking de fundadoras se muestra sin
// nombre, solo profesión y cantidad.
seoRouter.get(
  "/informes/mujeres-fundadoras",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const title = "Las mujeres que fundan empresas en Mendoza | INGcome";
    const description =
      "El 31,5% de quienes participan en sociedades mendocinas son mujeres, y la proporción cae cuanto más alto el rol: 27,9% entre socios, 21,2% en roles de decisión. Análisis 2017-2026.";
    const canonical = `${siteUrl()}/informes/mujeres-fundadoras`;

    const totalPanorama = PANORAMA.reduce((a, p) => a + p.valor, 0);

    const contentHtml = `
    <main>
      <h1>Las mujeres que fundan empresas en Mendoza</h1>
      <p>Una brecha que no se cierra, y que se agranda cuanto más arriba se mira</p>
      <p>No es un nicho sectorial: es un corte transversal de toda la base (33.694 personas físicas, 62.201 vínculos) mirado a través de una única variable — el género inferido de cada persona.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>El 31,5% de las personas que participan en sociedades mendocinas son mujeres (10.264 de 32.592 clasificables). Estancado en la década: 28,3% en 2017, 29,7% en 2026.</li>
        <li>La brecha se agranda con la jerarquía: 27,9% de mujeres entre socios, 21,2% en roles de decisión, 19,4% entre síndicos.</li>
        <li>Hallazgo más nítido: mujeres sobrerrepresentadas en roles Suplente, subrepresentadas en Titular, en los tres cargos medibles (brecha de 14 a 16 pp).</li>
        <li>Los hombres que fundan una empresa tienen 45% más probabilidad de fundar una segunda que las mujeres (20,9% vs. 14,4%).</li>
        <li>Solo 3 mujeres superan las 10 sociedades en toda la base, contra 36 varones.</li>
      </ul>
      <h2>Cómo se mide esto sin que el dato exista</h2>
      <p>El catálogo de roles del Boletín casi nunca marca género explícitamente. Se infiere el género desde el nombre de pila de cada persona física, validado contra los pocos casos donde el Boletín sí lo marca de forma explícita: entre "Directora Suplente" el 93,3% coincide con la clasificación por nombre; entre "Administradora Titular", el 77,8%.</p>
      <h2>El panorama general</h2>
      <table>
        <thead><tr><th></th><th>Personas</th><th>%</th></tr></thead>
        <tbody>${PANORAMA.map((p) => `<tr><td>${p.etiqueta}</td><td>${p.valor.toLocaleString("es-AR")}</td><td>${((p.valor / totalPanorama) * 100).toFixed(1)}%</td></tr>`).join("")}</tbody>
      </table>
      <p>Sobre las personas clasificables, 31,5% son mujeres.</p>
      <h2>La brecha se agranda en los roles de decisión</h2>
      <table>
        <thead><tr><th>Categoría</th><th>Vínculos</th><th>% mujeres</th></tr></thead>
        <tbody>
          <tr><td>Socio/a</td><td>37.653</td><td>27,9%</td></tr>
          <tr><td>Roles de decisión (presidente, administrador/gerente/director titular)</td><td>11.262</td><td>21,2%</td></tr>
          <tr><td>Apoderado/a</td><td>364</td><td>20,9%</td></tr>
          <tr><td>Fiscalización (síndico)</td><td>165</td><td>19,4%</td></tr>
        </tbody>
      </table>
      <p>Cuanto más alto el rol en la estructura formal de poder de la sociedad, menor la proporción de mujeres.</p>
      <h2>El hallazgo más nítido: Titular vs. Suplente</h2>
      <table>
        <thead><tr><th>Cargo</th><th>% mujeres — Titular</th><th>% mujeres — Suplente</th><th>Diferencia</th></tr></thead>
        <tbody>
          <tr><td>Administrador</td><td>22,2% (n=5.600)</td><td>36,6% (n=5.327)</td><td>+14,4 pp</td></tr>
          <tr><td>Gerente</td><td>21,9% (n=2.172)</td><td>36,8% (n=1.315)</td><td>+14,9 pp</td></tr>
          <tr><td>Director</td><td>15,5% (n=1.075)</td><td>31,9% (n=2.676)</td><td>+16,4 pp</td></tr>
        </tbody>
      </table>
      <p>En los tres cargos, sin excepción, las mujeres están sobrerrepresentadas en el rol suplente y subrepresentadas en el rol titular, con una brecha estable de 14 a 16 puntos porcentuales.</p>
      <h2>Una brecha que no se cerró en diez años</h2>
      <table>
        <thead><tr><th>Año</th><th>Socios/as</th><th>% mujeres</th></tr></thead>
        <tbody>${[
          ["2017", "1.767"],
          ["2018", "3.364"],
          ["2019", "4.263"],
          ["2020", "3.903"],
          ["2021", "4.781"],
          ["2022", "4.882"],
          ["2023", "5.049"],
          ["2024", "5.445"],
          ["2025", "5.244"],
          ["2026*", "2.794"],
        ]
          .map(([anio, socios], i) => `<tr><td>${anio}</td><td>${socios}</td><td>${EVOLUCION_ANUAL_MUJERES[i]!.valor}%</td></tr>`)
          .join("")}</tbody>
      </table>
      <p>* 2026 es parcial. La serie oscila entre 26% y 30% sin tendencia clara — ni deterioro ni mejora sostenida.</p>
      <h2>Ellas fundan una vez; ellos, más de una</h2>
      <table>
        <thead><tr><th></th><th>Con 2+ sociedades</th><th>Total</th><th>%</th></tr></thead>
        <tbody>
          <tr><td>Mujeres</td><td>1.429</td><td>9.902</td><td>14,4%</td></tr>
          <tr><td>Varones</td><td>4.637</td><td>22.182</td><td>20,9%</td></tr>
        </tbody>
      </table>
      <p>Los varones tienen 45% más probabilidades de convertirse en fundadores seriales (2 o más sociedades) que las mujeres.</p>
      <h2>Las mujeres con más sociedades</h2>
      <p>Solo tres mujeres superan las 10 sociedades en toda la base. Se mantiene la profesión declarada y la cantidad de sociedades; se omite la identidad.</p>
      <table>
        <thead><tr><th>Profesión declarada</th><th>Sociedades</th></tr></thead>
        <tbody>${TOP_MUJERES.map((m) => `<tr><td>${escapeHtml(m.profesion)}</td><td>${m.sociedades}</td></tr>`).join("")}</tbody>
      </table>
      <h2>Metodología y límites</h2>
      <p>Inferencia de género por diccionario curado de los 600 nombres más frecuentes (87,3% de cobertura) más una regla heurística para el resto. No clasificable (3,3%): tokens que resultaron ser apellidos, no nombres de pila. Los porcentajes por rol y por año se calculan sobre vínculos, no sobre personas únicas. Este informe no mide intención, mérito ni causas — solo la distribución observable en el registro societario público.</p>
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
      dateModified: "2026-08-03",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

seoRouter.get(
  "/informes/actividades-clae",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const title = "Qué hacen realmente las empresas mendocinas: anatomía del nomenclador CLAE | INGcome";
    const description =
      "El 42,3% de las asignaciones de actividad CLAE en Mendoza son categorías residuales n.c.p. Análisis de 25.583 asignaciones sobre 11.918 sociedades: clusters, especialización territorial y cobertura, 2017-2026.";
    const canonical = `${siteUrl()}/informes/actividades-clae`;

    const contentHtml = `
    <main>
      <h1>Qué hacen realmente las empresas mendocinas</h1>
      <p>Anatomía del nomenclador CLAE</p>
      <p>Este informe no analiza un rubro: analiza el instrumento con el que se clasifican todos los rubros. Sobre 25.583 asignaciones de actividad a 11.918 sociedades mendocinas, mide qué declara cada empresa que hace, qué actividades abandona, qué combinaciones forman cadenas de valor reales, y cuánto de la economía mendocina termina metida en cajones de sastre porque el nomenclador no tiene una casilla mejor.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>El 42,3% de todas las asignaciones de actividad son categorías residuales "n.c.p." (no clasificado en otra parte). Entre las principales sube al 44,7%.</li>
        <li>La actividad más frecuente de toda la economía mendocina es "Servicios empresariales n.c.p." (672 asignaciones).</li>
        <li>Las bajas de actividad no miden muerte de empresas: ninguna de las 11.918 sociedades tiene todas sus actividades dadas de baja.</li>
        <li>Diez clusters económicos reales emergen del análisis de co-ocurrencia (modularidad Q=0,390), y no coinciden con la jerarquía del nomenclador.</li>
        <li>Especialización geográfica nítida: Tupungato tiene 11 veces más servicios de apoyo agrícola de lo que le correspondería por su tamaño; Capital, 2,6 veces más servicios jurídicos.</li>
        <li>19 grupos CLAE completos no tienen ni una sola sociedad mendocina: pesca, carbón, armas, locomotoras, instrumentos musicales, reaseguros.</li>
      </ul>
      <h2>1. El nomenclador es, sobre todo, un cajón de sastre</h2>
      <table>
        <thead><tr><th></th><th>Asignaciones</th><th>%</th></tr></thead>
        <tbody>
          <tr><td>Categorías n.c.p. (residuales)</td><td>10.819</td><td>42,3%</td></tr>
          <tr><td>Categorías específicas</td><td>14.764</td><td>57,7%</td></tr>
          <tr><td>Total</td><td>25.583</td><td>100%</td></tr>
        </tbody>
      </table>
      <h2>Las diez actividades más declaradas de Mendoza</h2>
      <table>
        <thead><tr><th>Código</th><th>Actividad</th><th>Asignaciones</th></tr></thead>
        <tbody>${TOP_ACTIVIDADES_CLAE.map((a) => `<tr><td>${escapeHtml(a.codigo)}</td><td>${escapeHtml(a.actividad)}</td><td>${a.asignaciones}</td></tr>`).join("")}</tbody>
      </table>
      <p>Siete de las diez primeras terminan en "n.c.p.". La única actividad del top 10 que describe con precisión lo que la empresa hace —y no lo que no es— es cultivo de vid para vinificar, en sexto lugar.</p>
      <h2>Cola larga, no concentración</h2>
      <table>
        <thead><tr><th>Top N actividades</th><th>% del total</th></tr></thead>
        <tbody>${COLA_LARGA_CLAE.map((c) => `<tr><td>${escapeHtml(c.etiqueta)}</td><td>${c.valor}%</td></tr>`).join("")}</tbody>
      </table>
      <p>Hacen falta 100 códigos distintos para cubrir el 62% de la economía declarada, y los 1.016 códigos del nomenclador se usan todos al menos una vez.</p>
      <h2>2. Las bajas no son muertes: son podas</h2>
      <table>
        <thead><tr><th>Situación</th><th>Sociedades</th></tr></thead>
        <tbody>${BAJAS_SITUACION_CLAE.map((b) => `<tr><td>${escapeHtml(b.situacion)}</td><td>${b.sociedades.toLocaleString("es-AR")}</td></tr>`).join("")}</tbody>
      </table>
      <p>Ninguna sociedad del corpus tiene la totalidad de sus actividades dadas de baja: la que cesa por completo desaparece del padrón de ARCA. Lo que las bajas miden es poda de actividades dentro de empresas que siguen operando.</p>
      <table>
        <thead><tr><th>Actividades declaradas</th><th>Sociedades</th><th>% de sus actividades dadas de baja</th></tr></thead>
        <tbody>${DIVERSIFICACION_CLAE.map((d) => `<tr><td>${escapeHtml(d.rango)}</td><td>${d.sociedades.toLocaleString("es-AR")}</td><td>${d.pctBaja}%</td></tr>`).join("")}</tbody>
      </table>
      <h2>Qué se poda y qué no</h2>
      <table>
        <thead><tr><th>Actividad</th><th>n</th><th>% baja</th></tr></thead>
        <tbody>${TASA_BAJA_CLAE.map((t) => `<tr><td>${escapeHtml(t.actividad)}</td><td>${t.n}</td><td>${t.pctBaja}%</td></tr>`).join("")}</tbody>
      </table>
      <p>Las actividades que más se abandonan son residuales y financieras — categorías que se declaran "por las dudas" al constituir la sociedad y después no se ejercen. Las que casi nunca se abandonan son actividades con activos físicos e infraestructura específica: un frigorífico, una panadería, un viñedo.</p>
      <h2>3. Diez clusters que el nomenclador no declara</h2>
      <table>
        <thead><tr><th>Cluster</th><th>Actividades</th><th>Asignaciones</th><th>Núcleo</th></tr></thead>
        <tbody>${CLUSTERS_CLAE.map((c) => `<tr><td>${escapeHtml(c.nombre)}</td><td>${c.actividades}</td><td>${c.asignaciones.toLocaleString("es-AR")}</td><td>${escapeHtml(c.nucleo)}</td></tr>`).join("")}</tbody>
      </table>
      <p>Los clusters no respetan la jerarquía del nomenclador. El cluster vitivinícola cruza tres ramas que CLAE trata como mundos separados: agricultura (cultivo de vid), industria manufacturera (elaboración de vinos) y comercio mayorista (venta de vino).</p>
      <table>
        <thead><tr><th>Par de actividades</th><th>Sociedades que declaran ambas</th></tr></thead>
        <tbody>${PARES_COOCURRENCIA_CLAE.map((p) => `<tr><td>${escapeHtml(p.etiqueta)}</td><td>${p.valor}</td></tr>`).join("")}</tbody>
      </table>
      <h2>4. La geografía tiene especialidades muy marcadas</h2>
      <table>
        <thead><tr><th>Departamento y actividad</th><th>Casos</th><th>Cociente de localización</th></tr></thead>
        <tbody>${LOCALIZACION_CLAE.map((l) => `<tr><td>${escapeHtml(l.etiqueta)}</td><td>${l.casos}</td><td>${l.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>El Valle de Uco (Tupungato, Tunuyán, San Carlos) aparece como un bloque nítido especializado en servicios de apoyo agrícola y cultivos temporales — no en elaboración de vino, que se concentra más al este (San Martín, Rivadavia). Capital es el único departamento cuya especialización más fuerte no es agropecuaria ni industrial sino de servicios profesionales.</p>
      <h2>5. Qué crece y qué se apaga</h2>
      <table>
        <thead><tr><th>Actividad</th><th>2017-21</th><th>2022-26</th><th>% reciente</th></tr></thead>
        <tbody>${EVOLUCION_ACTIVIDADES_CLAE.map((e) => `<tr><td>${escapeHtml(e.etiqueta)}</td><td>${e.previo}</td><td>${e.reciente}</td><td>${e.valor}%</td></tr>`).join("")}</tbody>
      </table>
      <p>Línea de base global: 54,4% de las asignaciones corresponden al período reciente; una actividad por encima de eso crece, por debajo se apaga. El turismo es el gran ganador de la segunda mitad de la década. "Generación de energía n.c.p." con solo 25,6% confirma por otra vía el hallazgo del informe de Energía Solar y Eólica de esta serie.</p>
      <h2>6. La cobertura CLAE valida la premisa de la serie de nichos</h2>
      <table>
        <thead><tr><th>Nicho</th><th>Sociedades</th><th>Con CLAE</th><th>Código principal más frecuente</th></tr></thead>
        <tbody>${NICHOS_COBERTURA_CLAE.map((n) => `<tr><td>${escapeHtml(n.nicho)}</td><td>${n.sociedades}</td><td>${n.cobertura}%</td><td>${escapeHtml(n.codigo)}</td></tr>`).join("")}</tbody>
      </table>
      <p>Cannabis, con 29,2% de cobertura, es el nicho peor cubierto de todos, y su código más usado aparece una sola vez: no existe ningún código CLAE que contenga la palabra "cannabis". En el otro extremo, Bodegas Boutique, Arquitectura y Software mapean limpiamente a códigos propios y específicos.</p>
      <h2>7. Lo que Mendoza no hace: 19 grupos vacíos</h2>
      <table>
        <thead><tr><th>Grupo</th><th>Actividad ausente</th></tr></thead>
        <tbody>${GRUPOS_VACIOS_CLAE.map((g) => `<tr><td>${escapeHtml(g.grupo)}</td><td>${escapeHtml(g.actividad)}</td></tr>`).join("")}</tbody>
      </table>
      <h2>8. La cobertura CLAE como termómetro de actividad real</h2>
      <table>
        <thead><tr><th>Año de constitución</th><th>Sociedades</th><th>Con CLAE</th><th>Cobertura</th></tr></thead>
        <tbody>${COBERTURA_ANUAL_CLAE.map((c) => `<tr><td>${escapeHtml(c.anio)}</td><td>${c.sociedades.toLocaleString("es-AR")}</td><td>${c.conClae.toLocaleString("es-AR")}</td><td>${c.cobertura}%</td></tr>`).join("")}</tbody>
      </table>
      <p>* 2026 parcial (relevamiento hasta julio). La cobertura se estabiliza en torno al 67% desde 2021. El derrumbe de 2026 al 32,9% no indica que las empresas nuevas no operen: refleja el rezago de aproximadamente un año entre constituir la sociedad y darse de alta en el padrón de actividades de ARCA. Leído al revés, ese techo del 67% es informativo: cerca de un tercio de las sociedades que se constituyen en Mendoza nunca registra ninguna actividad económica en ARCA.</p>
      <h2>Metodología y límites</h2>
      <p>Fuentes: tablas de actividades CLAE (1.016 códigos), grupos CLAE (225) y sus vínculos con sociedades (25.583 vínculos, 11.918 sociedades), del padrón de ARCA cruzado por CUIT contra las sociedades extraídas del Boletín Oficial. El análisis cubre el 60,9% del corpus, sesgado hacia empresas que efectivamente operaron. Las bajas no miden cese de actividad empresarial sino poda de actividades declaradas. Clusters por detección de comunidades Louvain sobre el grafo de co-ocurrencia, ponderado por 1/(n−1), mejor de 10 semillas (Q=0,390). El cociente de localización se restringe a combinaciones con al menos 15 casos en departamentos con al menos 200 asignaciones, y depende del domicilio legal, que no siempre coincide con el lugar de la actividad productiva.</p>
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
      dateModified: "2026-08-03",
    };

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderHtml(base, { title, description, canonical, noindex: false, jsonLd, contentHtml }));
  }),
);

seoRouter.get(
  "/informes/analisis-redes",
  asyncHandler(async (_req: Request, res: Response, next) => {
    const base = leerIndexHtml();
    if (!base) return next();

    const title = "El mapa oculto de las sociedades mendocinas: análisis de redes | INGcome";
    const description =
      "El registro societario de Mendoza modelado como grafo: 12.004 componentes conexas, un quiebre de conectividad en 2022 y dos estructuras económicas que la centralidad encontró sin hipótesis previa. 2017-2026.";
    const canonical = `${siteUrl()}/informes/analisis-redes`;

    const contentHtml = `
    <main>
      <h1>El mapa oculto de las sociedades mendocinas</h1>
      <p>Qué dice la teoría de grafos del registro societario</p>
      <p>De todos los informes de esta serie, el único que no mira un rubro ni una variable: mira la forma del registro societario completo, tratado como lo que es -- un grafo de 62.201 vínculos, 19.563 sociedades y 33.694 personas -- y deja que esa forma, no una hipótesis previa, dicte los hallazgos.</p>
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>El registro societario mendocino no es una red: es un archipiélago. Sobre 52.056 nodos hay 12.004 componentes conexas, y la componente típica tiene 3 nodos. La más grande reúne apenas el 3,1% del grafo.</li>
        <li>Los domicilios compartidos, no la sociedad entre personas, son el tejido conectivo real: multiplican por 6,3 el tamaño de la componente gigante (de 3,1% a 18,9%).</li>
        <li>Hay un quiebre neto en 2022: la conectividad vía domicilio salta de 3,2% a 10,2% en un solo año y sigue creciendo hasta 18,6% en 2026.</li>
        <li>La misma métrica -- centralidad de intermediación -- encontró dos estructuras completamente distintas: una red de cofundación ligada a una aceleradora de startups real y un holding energético de 15 sociedades con directorio y domicilio idénticos.</li>
        <li>Los 12 nichos sectoriales de esta serie no se tocan entre sí de forma directa: cuando conectan, es casi siempre a través de domicilios compartidos.</li>
      </ul>
      <h2>1. El archipiélago: por qué el registro societario no es una red</h2>
      <table>
        <tbody>${ESTRUCTURA_G1.map((s) => `<tr><td>${escapeHtml(s.concepto)}</td><td>${escapeHtml(s.valor)}</td></tr>`).join("")}</tbody>
      </table>
      <p>La componente típica del registro societario mendocino son una sociedad y sus dos socios -- la S.A.S. estándar de dos personas, sin ninguna conexión con el resto del universo. No hay "seis grados de separación": hay doce mil islas. Cualquier métrica de centralidad calculada sobre el grafo completo sería casi puro ruido, porque el 97% de los nodos vive en componentes donde no hay nada que medir.</p>
      <h2>2. Lo que conecta el archipiélago: los domicilios, no las personas</h2>
      <table>
        <thead><tr><th>Escenario</th><th>Componentes</th><th>Componente gigante</th></tr></thead>
        <tbody>${ESCENARIOS.map((s) => `<tr><td>${escapeHtml(s.escenario)}</td><td>${escapeHtml(s.componentes)}</td><td>${escapeHtml(s.nodos)} (${String(s.gigante).replace(".", ",")}%)</td></tr>`).join("")}</tbody>
      </table>
      <p>El domicilio compartido multiplica por 6,3 la componente gigante. La estructura del ecosistema societario mendocino no está en quién se asocia con quién: está en dónde se domicilian. El escenario C es una advertencia metodológica: agrupar direcciones sin excluir barrios privados y rutas infla la componente gigante un 23% adicional con puentes que no existen.</p>
      <h2>3. El quiebre de 2022</h2>
      <table>
        <thead><tr><th>Año</th><th>% gigante (solo persona-sociedad)</th><th>% gigante (+ domicilio)</th></tr></thead>
        <tbody>${EVOLUCION_TABLA.map((e) => `<tr><td>${escapeHtml(e.anio)}</td><td>${String(e.g1).replace(".", ",")}%</td><td>${String(e.g2).replace(".", ",")}%</td></tr>`).join("")}</tbody>
      </table>
      <p>Sin domicilios, el archipiélago es estructural desde el origen y prácticamente no cambia: la componente gigante se mantiene por debajo del 2% durante siete años. Con domicilios hay un quiebre neto en 2022, y no vuelve a bajar. La lectura más consistente con el resto de esta serie: la consolidación no vino de que las personas empezaran a co-fundar más entre sí, sino de que más sociedades nuevas empezaron a compartir domicilio con sociedades ya existentes.</p>
      <h2>4. Quiénes son los puentes</h2>
      <table>
        <thead><tr><th>Persona</th><th>Profesión declarada</th><th>Betweenness</th></tr></thead>
        <tbody>${BETWEENNESS_TOP10.map((b) => `<tr><td>${escapeHtml(b.etiqueta)}</td><td>${escapeHtml(b.etiquetaSecundaria)}</td><td>${String(b.valor).replace(".", ",")}</td></tr>`).join("")}</tbody>
      </table>
      <p>El ranking está filtrado a personas: las sociedades con muchos socios aparecían como "puente" por pura estructura bipartita, sin ser intermediarias reales. No aparecen los nombres del informe de Domicilios Hub: el ranking por cantidad de sociedades y el ranking por posición estructural en el grafo no coinciden, porque miden cosas distintas. Nada de lo que aparece acá implica irregularidad: "puente estructural" describe una posición dentro de un grafo, no una conducta.</p>
      <h2>5.1 La red de cofundación de Embarca</h2>
      <table>
        <thead><tr><th>Fundador (fuente pública)</th><th>En la base</th></tr></thead>
        <tbody>${FUNDADORES_EMBARCA.map((f) => `<tr><td>${escapeHtml(f.publico)}</td><td>${escapeHtml(f.enLaBase)}</td></tr>`).join("")}</tbody>
      </table>
      <p>El portfolio público de Embarca son 15 empresas; solo 1 cayó en el clúster que encontró la centralidad, y por coincidencia. Ningún fundador figura como socio en ninguna empresa de su propio portfolio: el equity que una aceleradora toma se transfiere después de la constitución, y esos actos casi no se publican (22 cesiones en 22.065 actos). El clúster no es el portfolio: es la red personal de cofundación de sus socios, con vehículos de sindicación de inversores en el centro.</p>
      <h2>5.2 El holding energético: gobierno corporativo replicado</h2>
      <p>El núcleo más denso del grafo (k-core máximo = 7) son 15 sociedades anónimas -- Allen, Auquinco, Butaco, Calbuco, Collico, Kuar, Kuntur, Kunuk, Liuco, Nahuen, Nauco, Petrehué, Trancurá, Xetiu e Yelap Energía S.A. -- todas constituidas en un lapso de tres meses de 2017, con el mismo directorio (tres directores titulares), los mismos tres síndicos titulares y el mismo domicilio (Patricias Mendocinas 1285). Cruzado contra el catálogo CLAE la confirmación es total e independiente: 14 de las 15 tienen actividad registrada, 13 declaran "Generación de energía n.c.p." y 1 "Generación de energía hidráulica". Es la estructura clásica de sociedades vehículo de un grupo de generación de energía.</p>
      <h2>6. ¿Los nichos de esta serie están aislados entre sí?</h2>
      <table>
        <thead><tr><th>Par de nichos</th><th>Personas compartidas</th></tr></thead>
        <tbody>${PARES_NICHOS.map((p) => `<tr><td>${escapeHtml(p.etiqueta)}</td><td>${p.valor}</td></tr>`).join("")}</tbody>
      </table>
      <p>Ninguna sociedad pertenece a dos nichos a la vez; donde hay conexión, es por personas compartidas. El par Cannabis-Publicidad resultó ser un falso cruce: las 8 personas vienen de una sola sociedad capturada por dos criterios de búsqueda distintos. Ningún nicho, por sí solo, es central en el grafo general.</p>
      <h2>Metodología y límites</h2>
      <p>Se construyeron tres grafos distintos, nunca mezclados: G1 (societario puro: persona-sociedad), G2 (G1 + sociedad-domicilio) y G3 (proyección persona-persona, ponderada por 1/(n-1) al estilo Newman). Comunidades por Louvain con 10 semillas sobre la componente gigante de G2: entre 100 y 106 comunidades por corrida, con 68,9% de estabilidad. El escribano interviniente se evaluó como eje adicional y se descartó por cobertura insuficiente (6,9% de los actos). Error propio corregido antes de publicar: correr k-core sobre G1 daba un núcleo espurio que mezclaba parques renovables, un grupo farmacéutico y una sociedad sin relación entre ellos; se usó la corrida sobre G2.</p>
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
      dateModified: "2026-08-03",
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

// Formato de llmstxt.org: Markdown con un único H1 obligatorio, blockquote
// de resumen, y secciones H2 con listas de links -- Lighthouse (categoría
// "Agentic browsing") lo valida como texto plano en /llms.txt, y sin esta
// ruta el catch-all de la SPA (server.ts) devolvía el index.html ahí mismo,
// que Lighthouse interpretaba como "sin H1 ni links" al no ser Markdown.
seoRouter.get("/llms.txt", (_req: Request, res: Response) => {
  res.type("text/plain").send(
    `# INGcome

> Buscador de sociedades, personas y vínculos societarios de Mendoza, construido sobre los edictos que la provincia publica en el Boletín Oficial desde 2017. Cada dato citado con link a la publicación de origen.

INGcome estructura constituciones, modificaciones y demás actos societarios publicados en el Boletín Oficial de Mendoza en una base consultable: fichas de sociedades y personas, la red de vínculos entre ellas, e informes agregados por rubro y período. Los datos se actualizan a diario a partir de los boletines nuevos.

## Páginas principales

- [${siteUrl()}](${siteUrl()}): búsqueda de sociedades por nombre o CUIT/DNI.
- [${siteUrl()}/busqueda-avanzada](${siteUrl()}/busqueda-avanzada): búsqueda filtrada por rubro, departamento y fecha de constitución.
- [${siteUrl()}/informes](${siteUrl()}/informes): estudios agregados y series de datos por rubro, incluida una serie de informes sectoriales (café, cerveza artesanal, cannabis, energías renovables, arquitectura, y más).

## Datos y fuente

- [${siteUrl()}/sitemap.xml](${siteUrl()}/sitemap.xml): mapa completo de fichas de sociedades e informes.
- Fuente primaria: Boletín Oficial de la Provincia de Mendoza, https://boletinoficial.mendoza.gov.ar/.
`,
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
      `  <url><loc>${siteUrl()}/informes/nicho-energia-renovable</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-cripto-fintech</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-software</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-servicios-profesionales</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-arquitectura</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-cafe</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-cerveza</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-reciclaje</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-fideicomisos</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-agencias-viajes</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/nicho-seguridad-privada</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/mujeres-fundadoras</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/actividades-clae</loc><lastmod>${hoy}</lastmod></url>`,
      `  <url><loc>${siteUrl()}/informes/analisis-redes</loc><lastmod>${hoy}</lastmod></url>`,
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
