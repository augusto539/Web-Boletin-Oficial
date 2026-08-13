// Ver apollo.ts: mismo criterio, usar el host actual en vez de "localhost"
// fijo para que funcione igual entrando por LAN desde el celu.
const API = import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:5050`;

export type TipoDescarga =
  | "sociedad"
  | "persona"
  | "informe_departamentos"
  | "informe_anuario"
  | "informe_nicho_cannabis"
  | "informe_nicho_enoturismo"
  | "informe_nicho_bodegas_boutique"
  | "informe_nicho_energia_renovable"
  | "informe_nicho_cripto_fintech"
  | "informe_nicho_software"
  | "informe_nicho_servicios_profesionales"
  | "informe_nicho_arquitectura"
  | "informe_nicho_cafe"
  | "informe_nicho_cerveza"
  | "informe_nicho_reciclaje"
  | "informe_nicho_fideicomisos"
  | "informe_nicho_agencias_viajes"
  | "informe_nicho_seguridad_privada"
  | "informe_mujeres_fundadoras"
  | "informe_actividades_clae"
  | "informe_analisis_redes";

// Fire-and-forget: mismo criterio que registrarBusqueda (historialApi.ts) --
// no bloquea la descarga ni rompe nada si falla (usuario anónimo -> 401,
// se ignora acá).
export function registrarDescarga(
  tipo: TipoDescarga,
  formato: "pdf" | "excel",
  entidadId: string | number | null,
  entidadNombre: string | null,
): void {
  fetch(`${API}/api/descargas`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo, formato, entidadId, entidadNombre }),
  }).catch(() => {});
}
