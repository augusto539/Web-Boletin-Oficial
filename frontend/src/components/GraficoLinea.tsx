import { useState } from "react";

const ANCHO = 640;
const ALTO = 320;
const MARGEN = { arriba: 20, abajo: 34, izquierda: 46, derecha: 20 };
const PLOT_ANCHO = ANCHO - MARGEN.izquierda - MARGEN.derecha;
const PLOT_ALTO = ALTO - MARGEN.arriba - MARGEN.abajo;
const VINO = "#691824";

export interface PuntoLinea {
  etiqueta: string;
  valor: number;
}

export interface SerieLinea {
  nombre: string;
  color: string;
  /** Un valor por cada etiqueta del eje X, en el mismo orden. */
  valores: number[];
}

interface HoverInfo {
  etiqueta: string;
  entradas: { nombre: string; color: string; valor: number }[];
  x: number;
  y: number;
}

// Líneas para series temporales y curvas de acumulación. Acepta una sola serie
// (`datos`, el caso simple) o varias (`series` + `etiquetas`). Distinto de
// GraficoLineaDepartamentos, que es multi-serie pero está acoplado al shape de
// DepartamentosPorAnio y trae su propio toggle de visibilidad.
export function GraficoLinea({
  titulo,
  subtitulo,
  datos,
  series,
  etiquetas,
  etiquetaUnidad = "",
  formatearValor,
  /** Fuerza el tope del eje Y (ej. 100 en un gráfico de porcentajes). */
  maximoY,
  /** Línea vertical punteada sobre un punto del eje X, para marcar un quiebre. */
  referencia,
}: {
  titulo: string;
  subtitulo?: string;
  datos?: PuntoLinea[];
  series?: SerieLinea[];
  etiquetas?: string[];
  etiquetaUnidad?: string;
  formatearValor?: (valor: number) => string;
  maximoY?: number;
  referencia?: { indice: number; etiqueta: string };
}) {
  const [hover, setHover] = useState<HoverInfo | null>(null);

  const etiquetasEje = etiquetas ?? datos?.map((d) => d.etiqueta) ?? [];
  const seriesEfectivas: SerieLinea[] =
    series ?? [{ nombre: "", color: VINO, valores: datos?.map((d) => d.valor) ?? [] }];
  const esMultiSerie = seriesEfectivas.length > 1;

  const max = maximoY ?? Math.max(1, ...seriesEfectivas.flatMap((s) => s.valores));
  const mostrar = formatearValor ?? ((v: number) => v.toLocaleString("es-AR"));

  function x(i: number): number {
    if (etiquetasEje.length <= 1) return MARGEN.izquierda + PLOT_ANCHO / 2;
    return MARGEN.izquierda + (i / (etiquetasEje.length - 1)) * PLOT_ANCHO;
  }

  function y(valor: number): number {
    return MARGEN.arriba + PLOT_ALTO - (valor / max) * PLOT_ALTO;
  }

  function pathDe(s: SerieLinea): string {
    return s.valores.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  }

  const paradasGrilla = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{titulo}</h2>
          {subtitulo && <p className="mt-1 text-sm text-carbon/60">{subtitulo}</p>}
        </div>
        {esMultiSerie && (
          <ul className="flex flex-wrap gap-3">
            {seriesEfectivas.map((s) => (
              <li key={s.nombre} className="flex items-center gap-1.5 text-xs text-carbon/70">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: s.color }}
                  aria-hidden="true"
                />
                {s.nombre}
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
                {mostrar(max * p)}
              </text>
            </g>
          );
        })}

        {referencia && etiquetasEje[referencia.indice] !== undefined && (
          <g>
            <line
              x1={x(referencia.indice)}
              x2={x(referencia.indice)}
              y1={MARGEN.arriba - 6}
              y2={MARGEN.arriba + PLOT_ALTO}
              stroke="#b0473f"
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            <text
              x={x(referencia.indice)}
              y={MARGEN.arriba - 10}
              textAnchor="middle"
              style={{ fontSize: 10, fill: "#b0473f", fontWeight: 700 }}
            >
              {referencia.etiqueta}
            </text>
          </g>
        )}

        {/* El relleno bajo la curva solo tiene sentido con una serie: con
            varias, las áreas se pisan y ensucian la lectura. */}
        {!esMultiSerie && seriesEfectivas[0] && seriesEfectivas[0].valores.length > 0 && (
          <path
            d={`${pathDe(seriesEfectivas[0])} L ${x(etiquetasEje.length - 1)} ${MARGEN.arriba + PLOT_ALTO} L ${x(0)} ${MARGEN.arriba + PLOT_ALTO} Z`}
            fill={VINO}
            fillOpacity={0.08}
          />
        )}

        {seriesEfectivas.map((s) => (
          <path
            key={s.nombre}
            d={pathDe(s)}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {etiquetasEje.map((etiqueta, i) => (
          <g key={`${etiqueta}-${i}`}>
            {seriesEfectivas.map((s) =>
              s.valores[i] === undefined ? null : (
                <circle
                  key={s.nombre}
                  cx={x(i)}
                  cy={y(s.valores[i]!)}
                  r={4}
                  fill="#ffffff"
                  stroke={s.color}
                  strokeWidth={2}
                />
              ),
            )}
            {/* Franja invisible a lo alto del gráfico: hace que el hover
                funcione en toda la columna del año, no solo justo encima del
                punto (que con 2 series es un blanco muy chico). */}
            <rect
              x={x(i) - PLOT_ANCHO / Math.max(1, etiquetasEje.length - 1) / 2}
              y={MARGEN.arriba}
              width={PLOT_ANCHO / Math.max(1, etiquetasEje.length - 1)}
              height={PLOT_ALTO}
              fill="transparent"
              className="cursor-pointer"
              onMouseMove={(e) =>
                setHover({
                  etiqueta,
                  entradas: seriesEfectivas
                    .filter((s) => s.valores[i] !== undefined)
                    .map((s) => ({ nombre: s.nombre, color: s.color, valor: s.valores[i]! })),
                  x: e.clientX,
                  y: e.clientY,
                })
              }
              onMouseLeave={() => setHover(null)}
            />
            <text
              x={x(i)}
              y={ALTO - MARGEN.abajo + 18}
              textAnchor="middle"
              style={{ fontSize: 10, fill: "#666" }}
            >
              {etiqueta}
            </text>
          </g>
        ))}
      </svg>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-carbon px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <p className="font-bold">{hover.etiqueta}</p>
          {hover.entradas.map((e) => (
            <p key={e.nombre} className="flex items-center gap-1.5 text-white/70">
              {esMultiSerie && (
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ backgroundColor: e.color }}
                  aria-hidden="true"
                />
              )}
              {esMultiSerie && `${e.nombre}: `}
              {mostrar(e.valor)} {etiquetaUnidad}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
