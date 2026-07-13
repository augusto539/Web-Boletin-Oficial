// Misma razón que DescargarIcon.tsx: SVG propio en vez de un carácter
// unicode (✕, ×) para no depender de que la fuente del sistema lo tenga.
export function CerrarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block h-[1em] w-[1em] align-middle ${className}`}
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
