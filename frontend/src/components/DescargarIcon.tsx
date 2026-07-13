// Flecha hacia una bandeja, el ícono universal de "descargar". SVG propio en
// vez de un carácter unicode (⭳, ⬇, etc.): esos glyphs no están garantizados
// en todas las fuentes del sistema y en algunos aparecían como un cuadrado
// vacío (tofu) en vez de renderizar.
export function DescargarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block h-[1em] w-[1em] align-middle ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
