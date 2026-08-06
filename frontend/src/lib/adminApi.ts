// Ver apollo.ts: mismo criterio, usar el host actual en vez de "localhost"
// fijo para que funcione igual entrando por LAN desde el celu.
const API = import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:5050`;

export interface EstadisticasAdmin {
  baseDeDatos: {
    sociedades: number;
    personas: number;
    relaciones: number;
    dadosDeBaja: number;
    boletinesExtraidos: number;
    emailsEnBase: number;
  };
  usuarios: {
    registrados: number;
    leads: number;
    busquedas: number;
    descargas: number;
    notificacionesActivas: number;
  };
  ultimosDatosCargados: {
    fecha: string | null;
    sociedadesNuevas: number;
    personasNuevas: number;
    sociedadesActualizadas: number;
    personasActualizadas: number;
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

export interface DescargaItem {
  id: string;
  tipo: string;
  entidadNombre: string | null;
  formato: string;
  creadoEl: string;
}

export interface SocioJuridicoDetalle {
  vinculoId: number;
  sociedadId: string;
  sociedadNombre: string;
}

export interface SocioJuridicoGrupo {
  clave: string;
  nombreSugerido: string;
  cuitSugerido: string | null;
  citas: number;
  detalle: SocioJuridicoDetalle[];
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

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    credentials: "include",
    ...(body !== undefined && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  });
  if (!res.ok) throw new Error(`Error ${res.status} pidiendo ${path}`);
  return res.json();
}

export function obtenerEstadisticasAdmin(): Promise<EstadisticasAdmin> {
  return get("/api/admin/estadisticas");
}

export interface GastoAnthropic {
  total: number;
  ultimos30Dias: number;
  hoy: number;
}

// Consulta aparte de /estadisticas: llama a la Usage & Cost Admin API de
// Anthropic (externa), puede tardar o fallar por su cuenta sin bloquear el
// resto del panel.
export function obtenerGastoAnthropicAdmin(): Promise<GastoAnthropic> {
  return get("/api/admin/gasto-anthropic");
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

export function obtenerHistorialDescargasUsuario(
  id: string,
  first: number,
  offset: number,
): Promise<{ total: number; historial: DescargaItem[] }> {
  return get(`/api/admin/usuarios/${id}/historial-descargas?limit=${first}&offset=${offset}`);
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

export function recalcularInformesAdmin(): Promise<{
  departamentos: number;
  anios: number;
  departamentosPorAnio: number;
}> {
  return post("/api/admin/informes/recalcular");
}

export function obtenerSociosJuridicosAdmin(): Promise<{ grupos: SocioJuridicoGrupo[] }> {
  return get("/api/admin/socios-juridicos");
}

export function vincularSocioJuridico(
  nombre: string,
  cuit: string | null,
  vinculoIds: number[],
): Promise<{ sociedadId: string; nombre: string }> {
  return post("/api/admin/socios-juridicos/vincular", { nombre, cuit, vinculoIds });
}

export function enviarMailPersonalizadoAdmin(
  destinatario: string,
  asunto: string,
  cuerpo: string,
): Promise<{ ok: boolean }> {
  return post("/api/admin/mail/enviar", { destinatario, asunto, cuerpo });
}
