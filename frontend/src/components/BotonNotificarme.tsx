import { useEffect, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { useAuth } from "../lib/auth";
import {
  crearNotificacion,
  eliminarNotificacion,
  listarNotificaciones,
} from "../lib/notificacionesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";
import { ModalRegistro } from "./auth/ModalRegistro";
import { CampanaIcon } from "./CampanaIcon";

// Alta/baja del seguimiento de una sociedad o persona. Vive en el encabezado
// bordó de Sociedad.tsx / Persona.tsx, de ahí los colores sobre fondo oscuro
// (mismo criterio que DescargarFicha).
//
// Para un usuario sin sesión no se esconde el botón: se muestra y, al
// apretarlo, useAccionConSesion() abre el modal de registro y ejecuta el alta
// apenas se registra — así el botón funciona como gancho de registro en vez
// de ser invisible para quien todavía no tiene cuenta.
export function BotonNotificarme({
  tipo,
  id,
}: {
  tipo: "sociedad" | "persona";
  id: string;
}) {
  const { usuario } = useAuth();
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();
  const [suscripcionId, setSuscripcionId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sin sesión no hay nada que consultar: el backend respondería 401.
  useEffect(() => {
    if (!usuario) {
      setSuscripcionId(null);
      setCargando(false);
      return;
    }
    let vigente = true;
    listarNotificaciones()
      .then((lista) => {
        if (!vigente) return;
        const propia = lista.find((s) => s.tipo === tipo && s.entidadId === id);
        setSuscripcionId(propia?.id ?? null);
      })
      .catch(() => {})
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [usuario, tipo, id]);

  async function alternar() {
    setGuardando(true);
    setError(null);
    try {
      if (suscripcionId) {
        await eliminarNotificacion(suscripcionId);
        setSuscripcionId(null);
        trackEvent("notificacion_baja", { tipo });
      } else {
        await crearNotificacion({ tipo, id });
        // El POST no devuelve la fila completa; se recarga para quedarse con
        // el id real (necesario para poder darla de baja sin recargar).
        const lista = await listarNotificaciones();
        setSuscripcionId(lista.find((s) => s.tipo === tipo && s.entidadId === id)?.id ?? null);
        trackEvent("notificacion_alta", { tipo });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar el cambio.");
    } finally {
      setGuardando(false);
    }
  }

  const activa = suscripcionId !== null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => ejecutar(alternar)}
        disabled={cargando || guardando}
        aria-pressed={activa}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          activa
            ? "bg-white text-vino hover:bg-white/90"
            : "border border-white/30 text-white hover:bg-white/10"
        }`}
      >
        <CampanaIcon activa={activa} />
        {guardando ? "Guardando…" : activa ? "Siguiendo" : "Notificarme"}
      </button>

      {error && (
        <p className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-white p-3 text-xs text-vino shadow-2xl">
          {error}
        </p>
      )}

      {modalAbierto && (
        <ModalRegistro
          titulo="Registrate gratis para recibir avisos"
          onExito={alExito}
          onCerrar={cerrar}
        />
      )}
    </div>
  );
}
