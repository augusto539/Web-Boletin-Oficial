const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

export interface EstadisticasAdmin {
  baseDeDatos: {
    sociedades: number;
    personas: number;
    relaciones: number;
    dadosDeBaja: number;
    ultimoBoletin: string | null;
  };
  usuarios: {
    registrados: number;
    leads: number;
    busquedas: number;
  };
}

export interface SociedadAdmin {
  id: string;
  nombre: string;
  cuit: string | null;
  fechaConstitucion: string | null;
  domicilioElectronico: string | null;
  oculta: boolean;
  domicilioCompleto: string | null;
  claeGrupoNombre: string | null;
  claeDescripcion: string | null;
  socios: string | null;
}

export interface PersonaAdmin {
  id: string;
  nombre: string;
  documento: string | null;
  cuit: string | null;
  profesion: string | null;
  fechaNacimiento: string | null;
  domicilioElectronico: string | null;
  oculta: boolean;
  domicilioCompleto: string | null;
}

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  mail: string;
  plan: string;
  admin: boolean;
  creadoEl: string;
}

export interface LeadAdmin {
  id: string;
  mail: string;
  creadoEl: string;
}

export interface HistorialItem {
  id: string;
  tipo: string;
  termino: string | null;
  resultados: number;
  creadoEl: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { credentials: "include" });
  if (!res.ok) throw new Error(`Error ${res.status} pidiendo ${path}`);
  return res.json();
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status} pidiendo ${path}`);
  return res.json();
}

export function obtenerEstadisticasAdmin(): Promise<EstadisticasAdmin> {
  return get("/api/admin/estadisticas");
}

export function obtenerUsuariosAdmin(
  first: number,
  offset: number,
): Promise<{ total: number; usuarios: UsuarioAdmin[] }> {
  return get(`/api/admin/usuarios?limit=${first}&offset=${offset}`);
}

export function obtenerLeadsAdmin(
  first: number,
  offset: number,
): Promise<{ total: number; leads: LeadAdmin[] }> {
  return get(`/api/admin/leads?limit=${first}&offset=${offset}`);
}

export function obtenerUsuarioAdmin(id: string): Promise<{ usuario: UsuarioAdmin }> {
  return get(`/api/admin/usuarios/${id}`);
}

export function alternarAdminUsuario(id: string, admin: boolean): Promise<{ usuario: UsuarioAdmin }> {
  return patch(`/api/admin/usuarios/${id}/admin`, { admin });
}

export function obtenerHistorialUsuario(
  id: string,
  first: number,
  offset: number,
): Promise<{ total: number; historial: HistorialItem[] }> {
  return get(`/api/admin/usuarios/${id}/historial?limit=${first}&offset=${offset}`);
}

export function obtenerSociedadesAdmin(
  first: number,
  offset: number,
): Promise<{ total: number; sociedades: SociedadAdmin[] }> {
  return get(`/api/admin/sociedades?limit=${first}&offset=${offset}`);
}

export function alternarOcultaSociedad(
  id: string,
  oculta: boolean,
): Promise<{ sociedad: { id: string; oculta: boolean } }> {
  return patch(`/api/admin/sociedades/${id}/oculta`, { oculta });
}

export function obtenerPersonasAdmin(
  first: number,
  offset: number,
): Promise<{ total: number; personas: PersonaAdmin[] }> {
  return get(`/api/admin/personas?limit=${first}&offset=${offset}`);
}

export function alternarOcultaPersona(
  id: string,
  oculta: boolean,
): Promise<{ persona: { id: string; oculta: boolean } }> {
  return patch(`/api/admin/personas/${id}/oculta`, { oculta });
}

export function obtenerConfiguracionAdmin(): Promise<{ modoSoloAdmin: boolean }> {
  return get("/api/admin/configuracion");
}

export function actualizarModoSoloAdmin(modoSoloAdmin: boolean): Promise<{ modoSoloAdmin: boolean }> {
  return patch("/api/admin/configuracion", { modoSoloAdmin });
}
