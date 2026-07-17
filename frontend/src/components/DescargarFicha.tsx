import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { useAccionConSesion } from "../lib/useAccionConSesion";
import { ModalRegistro } from "./auth/ModalRegistro";
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
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  useEffect(() => {
    if (!abierto) return;
    function alClickAfuera(e: MouseEvent) {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", alClickAfuera);
    return () => document.removeEventListener("mousedown", alClickAfuera);
  }, [abierto]);

  async function generar(formato: "pdf" | "excel") {
    setGenerando(formato);
    try {
      await (formato === "pdf" ? onPDF() : onExcel());
      trackEvent("descargar_ficha", { tipo, formato });
    } finally {
      setGenerando(null);
    }
  }

  function alElegir(formato: "pdf" | "excel") {
    setAbierto(false);
    ejecutar(() => generar(formato));
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
        // left-0 en mobile (default): en Sociedad.tsx/Persona.tsx el header
        // envuelve a su propia línea con el botón pegado al borde izquierdo,
        // así que anclar el menú a la derecha (right-0) lo mandaba fuera de
        // pantalla por la izquierda. Desde sm (donde el botón sí queda a la
        // derecha del header) vuelve al anclaje original.
        <div className="absolute top-full left-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl bg-white shadow-2xl sm:left-auto sm:right-0">
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

      {modalAbierto && (
        <ModalRegistro
          titulo="Registrate gratis para descargar"
          onExito={alExito}
          onCerrar={cerrar}
        />
      )}
    </div>
  );
}
