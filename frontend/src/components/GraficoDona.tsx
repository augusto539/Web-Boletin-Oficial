import { useState } from "react";
import { calcularSegmentosDona, type SegmentoDona, type SegmentoDonaCalculado } from "../lib/graficoDona";

const ANCHO = 280;
const ALTO = 280;
const CX = ANCHO / 2;
const CY = ALTO / 2;
const RADIO_EXT = 120;
const RADIO_INT = 72;

interface HoverInfo {
  dato: SegmentoDonaCalculado;
  x: number;
  y: number;
}

// Gráfico de dona (pie con agujero) para una sola serie de proporciones
// (ej. mujeres/varones/no clasificable sobre el total). Mismo criterio que
// GraficoBarras: SVG a mano, sin librería externa.
export function GraficoDona({
  titulo,
  subtitulo,
  datos,
  etiquetaUnidad = "",
  etiquetaCentro,
}: {
  titulo: string;
  subtitulo?: string;
  datos: SegmentoDona[];
  etiquetaUnidad?: string;
  /** Texto bajo el número central (default: etiquetaUnidad). */
  etiquetaCentro?: string;
}) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const segmentos = calcularSegmentosDona(datos, CX, CY, RADIO_EXT, RADIO_INT);
  const total = datos.reduce((acc, d) => acc + d.valor, 0);

  return (
    <div className="relative rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="text-lg font-bold">{titulo}</h2>
        {subtitulo && <p className="mt-1 text-sm text-carbon/60">{subtitulo}</p>}
      </div>

      <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
        <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label={titulo} className="w-full max-w-[240px] shrink-0">
          {segmentos.map((s) => (
            <path
              key={s.etiqueta}
              d={s.path}
              fill={s.color}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseMove={(e) => setHover({ dato: s, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHover(null)}
            />
          ))}
          <text x={CX} y={CY - 4} textAnchor="middle" style={{ fontSize: 26, fontWeight: 700, fill: "#191d20" }}>
            {total.toLocaleString("es-AR")}
          </text>
          <text x={CX} y={CY + 18} textAnchor="middle" style={{ fontSize: 11, fill: "#8a8f93" }}>
            {etiquetaCentro ?? etiquetaUnidad}
          </text>
        </svg>

        <ul className="flex flex-col gap-3">
          {segmentos.map((s) => (
            <li key={s.etiqueta} className="flex items-baseline gap-2 text-sm">
              <span
                className="mt-1 inline-block h-3 w-3 shrink-0 self-center rounded-sm"
                style={{ backgroundColor: s.color }}
                aria-hidden="true"
              />
              <span className="font-bold text-carbon">{s.etiqueta}</span>
              <span className="text-carbon/60">
                {s.valor.toLocaleString("es-AR")} ({s.pct.toLocaleString("es-AR", { style: "percent", maximumFractionDigits: 1 })})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-carbon px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <p className="font-bold">{hover.dato.etiqueta}</p>
          <p className="text-white/70">
            {hover.dato.valor.toLocaleString("es-AR")} {etiquetaUnidad} (
            {hover.dato.pct.toLocaleString("es-AR", { style: "percent", maximumFractionDigits: 1 })})
          </p>
        </div>
      )}
    </div>
  );
}
