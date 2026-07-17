// Ver apollo.ts: mismo criterio, usar el host actual en vez de "localhost"
// fijo para que funcione igual entrando por LAN desde el celu.
const API = import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:5050`;

export type TipoBusqueda = "sociedad_nombre" | "sociedad_cuit" | "sociedad_avanzada" | "persona_avanzada";

// Fire-and-forget: no bloquea la UI de búsqueda ni rompe nada si falla (por
// ejemplo si el usuario no está logueado, el backend responde 401 y acá se
// ignora). El caller ya debería chequear que hay sesión antes de llamar, para
// no generar requests de más a usuarios anónimos.
export function registrarBusqueda(tipo: TipoBusqueda, termino: string | null, resultados: number): void {
  fetch(`${API}/api/historial`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo, termino, resultados }),
  }).catch(() => {});
}
