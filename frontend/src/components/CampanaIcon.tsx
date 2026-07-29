// Campana de notificaciones. SVG propio, mismo criterio que DescargarIcon:
// los glyphs unicode (🔔, ⌥) no están garantizados en todas las fuentes del
// sistema y pueden renderizar como tofu.
//
// Con `activa` se rellena, para que "Siguiendo" se distinga de un vistazo del
// estado sin seguir aunque el usuario no lea el texto del botón.
export function CampanaIcon({
  activa = false,
  className = "",
}: {
  activa?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={activa ? "currentColor" : "none"}
      className={`inline-block h-[1em] w-[1em] align-middle ${className}`}
      aria-hidden="true"
    >
      <path
        d="M18 9a6 6 0 1 0-12 0c0 4.5-2 6-2 6h16s-2-1.5-2-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7 19a2 2 0 0 1-3.4 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
