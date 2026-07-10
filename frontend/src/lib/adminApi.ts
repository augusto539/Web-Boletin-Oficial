const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

export interface EstadisticasAdmin {
  usuariosRegistrados: number;
  notificacionesActivas: number;
}

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  mail: string;
  creadoEl: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { credentials: "include" });
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
