// Ver apollo.ts: mismo criterio, usar el host actual en vez de "localhost"
// fijo para que funcione igual entrando por LAN desde el celu.
const API = import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:5050`;

export type TipoSuscripcion = "sociedad" | "persona" | "documento";

export interface Suscripcion {
  id: string;
  tipo: TipoSuscripcion;
  // null en las de documento: todavía no hay ficha a la que linkear.
  entidadId: string | null;
  nombre: string | null;
  cuit: string | null;
  creadaEl: string;
}

interface SuscripcionApi {
  id: string;
  tipo: TipoSuscripcion;
  entidad_id: string | null;
  nombre: string | null;
  cuit: string | null;
  creada_el: string;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}));
    throw new Error(cuerpo.error ?? "No pudimos completar la operación.");
  }
  return res.json() as Promise<T>;
}

export async function listarNotificaciones(): Promise<Suscripcion[]> {
  const res = await fetch(`${API}/api/notificaciones`, { credentials: "include" });
  const filas = await json<SuscripcionApi[]>(res);
  return filas.map((f) => ({
    id: f.id,
    tipo: f.tipo,
    entidadId: f.entidad_id,
    nombre: f.nombre,
    cuit: f.cuit,
    creadaEl: f.creada_el,
  }));
}

export async function crearNotificacion(entrada: {
  tipo: TipoSuscripcion;
  id?: string;
  documento?: string;
  etiqueta?: string | null;
}): Promise<void> {
  const res = await fetch(`${API}/api/notificaciones`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entrada),
  });
  await json<{ ok: boolean }>(res);
}

export async function eliminarNotificacion(id: string): Promise<void> {
  const res = await fetch(`${API}/api/notificaciones/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await json<{ ok: boolean }>(res);
}
