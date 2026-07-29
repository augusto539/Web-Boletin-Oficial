// Ícono hamburguesa para el menú mobile del Nav. Mismo criterio que
// CerrarIcon.tsx: SVG propio en vez de depender de una fuente de íconos.
export function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block h-[1em] w-[1em] align-middle ${className}`}
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
