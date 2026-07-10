// Versión SVG del logotipo INGcome (aproximación del manual de marca).
// Cuando esté el vector original exportado, reemplazar solo este componente.
export function Logo({ claro = false, className = "" }: { claro?: boolean; className?: string }) {
  const texto = claro ? "#ffffff" : "#191d20";
  const marca = claro ? "#ffffff" : "#691824";
  return (
    <span className={`inline-flex select-none items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 22 44" className="h-9 w-auto" aria-hidden="true">
        <path d="M4 1 H18 V20 Q4 20 4 6 Z" fill={marca} />
        <path d="M4 24 Q18 24 18 38 V43 H4 Z" fill={marca} />
      </svg>
      <span className="leading-none">
        <span className="block text-xl leading-none tracking-tight" style={{ color: texto }}>
          <b>ING</b>come
        </span>
        <span
          className="mt-1 block text-[8px] font-normal tracking-[0.42em]"
          style={{ color: texto }}
        >
          CONSULTORA
        </span>
      </span>
    </span>
  );
}
