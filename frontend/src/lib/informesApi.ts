// Ver apollo.ts/adminApi.ts: mismo criterio, usar el host actual en vez de
// "localhost" fijo. A diferencia de adminApi.ts estos endpoints son
// públicos (sin auth) — el frontend los usa solo para hidratar; el HTML que
// ve un crawler ya viene armado server-side por backend/src/seo.ts, que lee
// las mismas tablas directo.
const API = import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:5050`;

export interface DepartamentoActivo {
  departamentoId: number;
  nombre: string;
  cantidadSociedades: number;
  cantidadUltimoAnio: number;
}

export interface DepartamentosActivos {
  departamentos: DepartamentoActivo[];
  actualizadoEl: string | null;
  sinDepartamento: number;
}

export interface DepartamentoPorAnio {
  departamentoId: number;
  nombre: string;
  valores: number[];
}

export interface DepartamentosPorAnio {
  anios: number[];
  departamentos: DepartamentoPorAnio[];
}

export interface Anuario {
  anio: number;
  sociedadesConstituidas: number;
  personasInvolucradas: number;
  grupoClaeMasActivo: string | null;
  departamentoMasActivo: string | null;
  tipoSociedadMasComun: string | null;
  actualizadoEl: string;
  meses: { mes: number; cantidad: number }[];
  // "Otros" agrupa lo que pesa menos de 5% del total (ver informes.ts) --
  // ya viene recortado del backend, no hace falta repetir esa lógica acá.
  tipoSociedad: { tipo: string; cantidad: number }[];
  actividadesTop10: { grupoClae: string; cantidad: number }[];
  departamentos: { departamentoId: number; nombre: string; cantidad: number }[];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`Error ${res.status} pidiendo ${path}`);
  return res.json();
}

export function obtenerDepartamentosActivos(): Promise<DepartamentosActivos> {
  return get("/api/informes/departamentos-activos");
}

export function obtenerDepartamentosPorAnio(): Promise<DepartamentosPorAnio> {
  return get("/api/informes/departamentos-por-anio");
}

export function obtenerAnuario(anio: number): Promise<Anuario> {
  return get(`/api/informes/anuario/${anio}`);
}

export function obtenerAniosDisponibles(): Promise<{ anios: number[] }> {
  return get("/api/informes/anuarios");
}

// --- Informes de nicho sectorial: directorio de entidades resuelto en vivo
// contra la base (ver backend/src/informesNicho.ts). Solo esto -- el resto
// del contenido de cada informe (texto, evolución anual, tipo de entidad,
// mapa por departamento) sigue viniendo de frontend/src/data/nicho*.ts, sin
// llamada a la API: son agregados curados a mano, sin sociedadId/personaId,
// sin riesgo de habeas data. Ver docs/plan_centralizar_habeas_data.md.

export interface SocioNicho {
  nombre: string;
  personaId?: number;
  sociedadId?: number;
}

export interface EntidadNicho {
  sociedadId: number;
  nombre: string;
  cuit: string | null;
  capital: number | null;
  tipo: string | null;
  publicacion: string | null;
  departamento: string | null;
  objetoSocial: string | null;
  socios: SocioNicho[];
  // Extras curados por informe -- opcionales porque no todos los usan.
  nombreGenerico?: boolean;
  categoria?: string;
}

export interface EntidadesNicho {
  entidades: EntidadNicho[];
  sociosRepetidos: { nombre: string; veces: number }[];
}

export function obtenerEntidadesNicho(slug: string): Promise<EntidadesNicho> {
  return get(`/api/informes/nicho/${slug}`);
}
