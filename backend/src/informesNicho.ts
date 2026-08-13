import { Pool } from "pg";
import { Router } from "express";
import { asyncHandler } from "./asyncHandler.js";

// Resuelve identidad (nombre/cuit/capital/tipo/departamento/objeto social/
// fecha de publicación) de las sociedades y personas citadas en los informes
// de nicho sectorial, EN VIVO contra la base -- ver
// docs/plan_centralizar_habeas_data.md.
//
// Antes, cada informe de nicho tenía esos datos copiados a mano en
// frontend/src/data/nicho*.ts (y una segunda copia en backend/src/data/ para
// el HTML de SEO) -- si una sociedad/persona se marcaba oculta desde el panel
// de admin, sus datos seguían apareciendo tal cual en estos 12 informes: ni
// el bundle de React, ni el HTML server-side para crawlers, ni el PDF
// descargable consultaban la base. Ahora `data/nicho*.ts` guarda solo los
// ids + lo curado a mano (por qué está en la lista); este módulo resuelve el
// resto contra la base en cada request, así que "oculta" se respeta solo.
//
// Usa boletin_api (mismo rol que seo.ts/PostGraphile) a propósito: la RLS de
// habeas data (oculta = false, ver 007_rls.sql) se aplica TO boletin_api
// específicamente -- boletin_auth (el rol que usa el panel de admin) la
// bypassea, así que reusar el pool de auth.ts acá sería un error silencioso.
let poolSingleton: Pool | null = null;
function pool(): Pool {
  if (!poolSingleton) {
    poolSingleton = new Pool({ connectionString: process.env.DATABASE_URL_API });
  }
  return poolSingleton;
}

export interface SocioCurado {
  // Fallback de despliegue: si no hay personaId/sociedadId (nunca se pudo
  // cruzar contra la base), o si el id ya no resuelve (oculto/borrado), no
  // hay contra qué verificar "oculta" -- se muestra tal cual, sin link.
  nombre: string;
  personaId?: number;
  sociedadId?: number;
}

export interface SocioResuelto {
  nombre: string;
  personaId?: number;
  sociedadId?: number;
}

export interface EntidadCuradaBase {
  sociedadId: number;
  socios: SocioCurado[];
}

export interface EntidadResuelta {
  sociedadId: number;
  nombre: string;
  cuit: string | null;
  capital: number | null; // crudo -- moneda() en frontend, toLocaleString en seo.ts
  tipo: string | null; // abreviatura de tipos_sociedad si existe, si no el nombre completo
  publicacion: string | null; // fecha_publicacion del acto de Constitución, ISO (YYYY-MM-DD)
  departamento: string | null;
  objetoSocial: string | null;
  socios: SocioResuelto[];
}

interface SociedadFila {
  id: string;
  nombre: string;
  cuit: string | null;
  capital_inicial: string | null;
  objeto_social: string | null;
  tipo: string | null;
  departamento: string | null;
  publicacion: string | null;
}

/**
 * Resuelve una lista de entidades "curadas" (solo ids + lo editorial propio
 * de cada informe) contra sociedades/personas_fisicas EN VIVO.
 *
 * Una entidad cuyo sociedadId no resuelve (oculta o borrada) se DESCARTA del
 * resultado -- no se muestra "a medias" sin nombre. Un socio cuyo id no
 * resuelve se descarta de la lista de socios de SU entidad, sin tirar abajo
 * la entidad entera. Un socio sin id (nombre suelto sin cruzar) se conserva
 * tal cual.
 */
export async function resolverEntidades<T extends EntidadCuradaBase>(
  curadas: T[],
): Promise<(Omit<T, "socios"> & EntidadResuelta)[]> {
  const sociedadIds = new Set<number>();
  const personaIds = new Set<number>();
  for (const c of curadas) {
    sociedadIds.add(c.sociedadId);
    for (const s of c.socios) {
      if (s.sociedadId) sociedadIds.add(s.sociedadId);
      if (s.personaId) personaIds.add(s.personaId);
    }
  }

  const { rows: filasSociedad } = await pool().query<SociedadFila>(
    `SELECT
       s.id::text, s.nombre, s.cuit, s.capital_inicial::text, s.objeto_social,
       COALESCE(ts.abreviatura, ts.nombre) AS tipo,
       dep.nombre AS departamento,
       pub.fecha_publicacion::text AS publicacion
     FROM sociedades s
     LEFT JOIN tipos_sociedad ts ON ts.id = s.tipo_sociedad_id
     LEFT JOIN domicilios dom ON dom.id = s.domicilio_id
     LEFT JOIN localidades loc ON loc.id = dom.localidad_id
     LEFT JOIN departamentos dep ON dep.id = loc.departamento_id
     LEFT JOIN LATERAL (
       SELECT a.fecha_publicacion
       FROM actos a
       JOIN tipos_acto ta ON ta.id = a.tipo_acto_id AND ta.nombre = 'Constitucion'
       WHERE a.sociedad_id = s.id
       ORDER BY a.fecha_publicacion ASC
       LIMIT 1
     ) pub ON true
     WHERE s.id = ANY($1::bigint[])`,
    [[...sociedadIds]],
  );
  const sociedades = new Map(filasSociedad.map((f) => [Number(f.id), f]));

  const { rows: filasPersona } = await pool().query<{ id: string; nombre: string }>(
    "SELECT id::text, nombre FROM personas_fisicas WHERE id = ANY($1::bigint[])",
    [[...personaIds]],
  );
  const personas = new Map(filasPersona.map((f) => [Number(f.id), f.nombre]));

  const resultado: (Omit<T, "socios"> & EntidadResuelta)[] = [];
  for (const c of curadas) {
    const s = sociedades.get(c.sociedadId);
    if (!s) continue; // oculta o borrada: no se muestra

    const socios: SocioResuelto[] = [];
    for (const socio of c.socios) {
      if (socio.personaId) {
        const nombre = personas.get(socio.personaId);
        if (nombre) socios.push({ nombre, personaId: socio.personaId });
        continue; // no resuelve -> se descarta, no tira abajo la entidad
      }
      if (socio.sociedadId) {
        const soc = sociedades.get(socio.sociedadId);
        if (soc) socios.push({ nombre: soc.nombre, sociedadId: socio.sociedadId });
        continue;
      }
      socios.push({ nombre: socio.nombre }); // sin id: nada contra qué resolver
    }

    const { socios: _descartar, ...resto } = c;
    resultado.push({
      ...resto,
      sociedadId: c.sociedadId,
      nombre: s.nombre,
      cuit: s.cuit,
      capital: s.capital_inicial !== null ? Number(s.capital_inicial) : null,
      tipo: s.tipo,
      publicacion: s.publicacion,
      departamento: s.departamento,
      objetoSocial: s.objeto_social,
      socios,
    } as Omit<T, "socios"> & EntidadResuelta);
  }
  return resultado;
}

/** Socios (por personaId) que aparecen en más de una entidad de la lista ya resuelta. */
export function socioRepetidos(
  entidades: { socios: SocioResuelto[] }[],
): { nombre: string; veces: number }[] {
  const conteo = new Map<number, { nombre: string; veces: number }>();
  for (const e of entidades) {
    for (const s of e.socios) {
      if (!s.personaId) continue;
      const actual = conteo.get(s.personaId);
      if (actual) actual.veces++;
      else conteo.set(s.personaId, { nombre: s.nombre, veces: 1 });
    }
  }
  return [...conteo.values()]
    .filter((c) => c.veces > 1)
    .sort((a, b) => b.veces - a.veces || a.nombre.localeCompare(b.nombre));
}

// --- Registro de curadas por slug + endpoint público ------------------------
// Import explícito (no auto-registro por efecto secundario): mismo criterio
// que ya usa seo.ts para estos mismos 12 archivos -- más simple de rastrear
// que depender del orden en que ESM ejecuta imports con solo efectos
// secundarios.

import { ENTIDADES as AGENCIAS_VIAJES } from "./data/nichoAgenciasViajes.js";
import { ENTIDADES as CANNABIS } from "./data/nichoCannabis.js";
import { ENTIDADES as ARQUITECTURA } from "./data/nichoArquitectura.js";
import { ENTIDADES as BODEGAS_BOUTIQUE } from "./data/nichoBodegasBoutique.js";
import { ENTIDADES as CAFE } from "./data/nichoCafe.js";
import { ENTIDADES as CERVEZA } from "./data/nichoCerveza.js";
import { ENTIDADES as CRIPTO_FINTECH } from "./data/nichoCriptoFintech.js";
import { ENTIDADES as ENERGIA_RENOVABLE } from "./data/nichoEnergiaRenovable.js";
import { ENTIDADES as ENOTURISMO } from "./data/nichoEnoturismo.js";
import { ENTIDADES as FIDEICOMISOS } from "./data/nichoFideicomisos.js";
import { ENTIDADES as RECICLAJE } from "./data/nichoReciclaje.js";
import { ENTIDADES as SERVICIOS_PROFESIONALES } from "./data/nichoServiciosProfesionales.js";
import { ENTIDADES as SOFTWARE } from "./data/nichoSoftware.js";

const REGISTRO: Record<string, EntidadCuradaBase[]> = {
  "agencias-viajes": AGENCIAS_VIAJES,
  cannabis: CANNABIS,
  arquitectura: ARQUITECTURA,
  "bodegas-boutique": BODEGAS_BOUTIQUE,
  cafe: CAFE,
  cerveza: CERVEZA,
  "cripto-fintech": CRIPTO_FINTECH,
  "energia-renovable": ENERGIA_RENOVABLE,
  enoturismo: ENOTURISMO,
  fideicomisos: FIDEICOMISOS,
  reciclaje: RECICLAJE,
  "servicios-profesionales": SERVICIOS_PROFESIONALES,
  software: SOFTWARE,
};

export const informesNichoRouter = Router();

informesNichoRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const curadas = REGISTRO[req.params.slug];
    if (!curadas) return res.status(404).json({ error: "Informe no encontrado." });
    const entidades = await resolverEntidades(curadas);
    return res.json({ entidades, sociosRepetidos: socioRepetidos(entidades) });
  }),
);
