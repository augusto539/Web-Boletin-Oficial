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
