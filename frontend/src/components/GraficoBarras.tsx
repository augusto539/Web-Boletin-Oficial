import { useState } from "react";

const ANCHO = 640;
const ALTO = 320;
const MARGEN = { arriba: 28, abajo: 32, izquierda: 40, derecha: 12 };
const PLOT_ANCHO = ANCHO - MARGEN.izquierda - MARGEN.derecha;
const PLOT_ALTO = ALTO - MARGEN.arriba - MARGEN.abajo;
const VINO = "#691824";

interface BarraDato {
  etiqueta: string;
  valor: number;
  color?: string;
}

interface HoverInfo {
  dato: BarraDato;
  x: number;
  y: number;
}

// Gráfico de barras verticales de una sola serie (ej. cantidad por año). Sin
// librería externa, mismo criterio que el resto de /informes: SVG a mano,
// nada que arrastre peso al bundle para un gráfico de este tamaño.
export function GraficoBarras({
  titulo,
  subtitulo,
  datos,
  etiquetaUnidad = "",
  leyenda,
}: {
  titulo: string;
  subtitulo?: string;
  datos: BarraDato[];
  etiquetaUnidad?: string;
  leyenda?: { color: string; etiqueta: string }[];
}) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const max = Math.max(1, ...datos.map((d) => d.valor));

  const anchoBarra = (PLOT_ANCHO / datos.length) * 0.6;
  const paso = PLOT_ANCHO / datos.length;

  function x(i: number): number {
    return MARGEN.izquierda + i * paso + paso / 2;
  }

  function y(valor: number): number {
    return MARGEN.arriba + PLOT_ALTO - (valor / max) * PLOT_ALTO;
  }

  const paradasGrilla = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{titulo}</h2>
          {subtitulo && <p className="mt-1 text-sm text-carbon/60">{subtitulo}</p>}
        </div>
        {leyenda && (
          <ul className="flex flex-wrap gap-3">
            {leyenda.map((l) => (
              <li key={l.etiqueta} className="flex items-center gap-1.5 text-xs text-carbon/70">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: l.color }}
                  aria-hidden="true"
                />
                {l.etiqueta}
              </li>
            ))}
          </ul>
        )}
      </div>

      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label={titulo} className="mt-6 w-full">
        {paradasGrilla.map((p) => {
          const yPos = MARGEN.arriba + PLOT_ALTO - p * PLOT_ALTO;
          return (
            <g key={p}>
              <line
                x1={MARGEN.izquierda}
                x2={ANCHO - MARGEN.derecha}
                y1={yPos}
                y2={yPos}
                stroke="#e5e5e5"
                strokeWidth={1}
              />
              <text x={MARGEN.izquierda - 8} y={yPos + 3} textAnchor="end" style={{ fontSize: 9, fill: "#999" }}>
                {Math.round(max * p).toLocaleString("es-AR")}
              </text>
            </g>
          );
        })}

        {datos.map((d, i) => {
          const xBarra = x(i) - anchoBarra / 2;
          const yBarra = y(d.valor);
          return (
            <g key={d.etiqueta}>
              <rect
                x={xBarra}
                y={yBarra}
                width={anchoBarra}
                height={MARGEN.arriba + PLOT_ALTO - yBarra}
                rx={3}
                fill={d.color ?? VINO}
                className="cursor-pointer transition-opacity hover:opacity-80"
                onMouseMove={(e) => setHover({ dato: d, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHover(null)}
              />
              <text x={x(i)} y={yBarra - 8} textAnchor="middle" style={{ fontSize: 11, fill: "#191d20", fontWeight: 700 }}>
                {d.valor.toLocaleString("es-AR")}
              </text>
              <text
                x={x(i)}
                y={ALTO - MARGEN.abajo + 16}
                textAnchor="middle"
                style={{ fontSize: 10, fill: "#666" }}
              >
                {d.etiqueta}
              </text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-carbon px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <p className="font-bold">{hover.dato.etiqueta}</p>
          <p className="text-white/70">
            {hover.dato.valor.toLocaleString("es-AR")} {etiquetaUnidad}
          </p>
        </div>
      )}
    </div>
  );
}
