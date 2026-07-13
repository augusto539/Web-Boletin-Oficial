import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { DescargarIcon } from "./DescargarIcon";

// Botón + menú desplegable genérico: quien lo usa (Sociedad.tsx / Persona.tsx)
// solo pasa las funciones que generan cada archivo, sin que este componente
// sepa nada de sociedades/personas.
export function DescargarFicha({
  tipo,
  onPDF,
  onExcel,
}: {
  tipo: "sociedad" | "persona";
  onPDF: () => Promise<void>;
  onExcel: () => Promise<void>;
}) {
  const [abierto, setAbierto] = useState(false);
  const [generando, setGenerando] = useState<"pdf" | "excel" | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    function alClickAfuera(e: MouseEvent) {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", alClickAfuera);
    return () => document.removeEventListener("mousedown", alClickAfuera);
  }, [abierto]);

  async function alElegir(formato: "pdf" | "excel") {
    setAbierto(false);
    setGenerando(formato);
    try {
      await (formato === "pdf" ? onPDF() : onExcel());
      trackEvent("descargar_ficha", { tipo, formato });
    } finally {
      setGenerando(null);
    }
  }

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        disabled={generando !== null}
        className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {generando ? (
          "Generando…"
        ) : (
          <>
            <DescargarIcon /> Descargar
          </>
        )}
      </button>

      {abierto && (
        <div className="absolute top-full right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl bg-white shadow-2xl">
          <button
            type="button"
            onClick={() => alElegir("pdf")}
            className="block w-full cursor-pointer px-5 py-3 text-left text-sm font-bold text-carbon transition-colors hover:bg-humo"
          >
            Como PDF
          </button>
          <button
            type="button"
            onClick={() => alElegir("excel")}
            className="block w-full cursor-pointer border-t border-carbon/10 px-5 py-3 text-left text-sm font-bold text-carbon transition-colors hover:bg-humo"
          >
            Como Excel
          </button>
        </div>
      )}
    </div>
  );
}
