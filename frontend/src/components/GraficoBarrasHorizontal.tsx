import { useState } from "react";

const ANCHO = 640;
const MARGEN = { arriba: 12, abajo: 28, izquierda: 250, derecha: 52 };
const PASO = 30;
const ALTO_BARRA = 18;
const VINO = "#691824";
// Los nombres CLAE son largos ("Expendio de comidas y bebidas con servicio de
// mesa n.c.p."): se recortan para que entren en el margen izquierdo y el
// texto completo queda en el tooltip.
const MAX_CARACTERES_ETIQUETA = 44;

export interface BarraHorizontalDato {
  etiqueta: string;
  /** Segunda línea bajo la etiqueta, más chica y tenue (ej. la profesión
   * declarada debajo del nombre de una persona). */
  etiquetaSecundaria?: string;
  valor: number;
  color?: string;
}

interface HoverInfo {
  dato: BarraHorizontalDato;
  x: number;
  y: number;
}

function recortar(texto: string): string {
  return texto.length > MAX_CARACTERES_ETIQUETA
    ? `${texto.slice(0, MAX_CARACTERES_ETIQUETA - 1).trimEnd()}…`
    : texto;
}

// Barras horizontales: la variante correcta cuando las etiquetas son textos
// largos (nombres de actividades CLAE, pares "departamento — actividad"), que
// en un eje X vertical se pisarían entre sí. Mismo criterio que el resto de
// /informes: SVG a mano, sin librería externa.
export function GraficoBarrasHorizontal({
  titulo,
  subtitulo,
  datos,
  etiquetaUnidad = "",
  leyenda,
  referencia,
  formatearValor,
}: {
  titulo: string;
  subtitulo?: string;
  datos: BarraHorizontalDato[];
  etiquetaUnidad?: string;
  leyenda?: { color: string; etiqueta: string }[];
  /** Línea vertical punteada de referencia (ej. la línea de base del 54,4%). */
  referencia?: { valor: number; etiqueta: string };
  formatearValor?: (valor: number) => string;
}) {
  const [hover, setHover] = useState<HoverInfo | null>(null);

  // Con etiqueta de dos líneas hace falta un poco más de aire entre barras
  // para que la segunda línea no quede pegada a la etiqueta de la siguiente.
  const paso = datos.some((d) => d.etiquetaSecundaria) ? PASO + 6 : PASO;
  const alto = MARGEN.arriba + datos.length * paso + MARGEN.abajo;
  const plotAncho = ANCHO - MARGEN.izquierda - MARGEN.derecha;
  const max = Math.max(1, ...datos.map((d) => d.valor), referencia?.valor ?? 0);

  const mostrar = formatearValor ?? ((v: number) => v.toLocaleString("es-AR"));

  function x(valor: number): number {
    return (valor / max) * plotAncho;
  }

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

      <svg viewBox={`0 0 ${ANCHO} ${alto}`} role="img" aria-label={titulo} className="mt-6 w-full">
        {referencia && (
          <g>
            <line
              x1={MARGEN.izquierda + x(referencia.valor)}
              x2={MARGEN.izquierda + x(referencia.valor)}
              y1={MARGEN.arriba - 4}
              y2={MARGEN.arriba + datos.length * paso}
              stroke="#8a8f93"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={MARGEN.izquierda + x(referencia.valor)}
              y={MARGEN.arriba + datos.length * paso + 16}
              textAnchor="middle"
              style={{ fontSize: 9, fill: "#8a8f93" }}
            >
              {referencia.etiqueta}
            </text>
          </g>
        )}

        {datos.map((d, i) => {
          const yBarra = MARGEN.arriba + i * paso + (paso - ALTO_BARRA) / 2;
          const ancho = x(d.valor);
          return (
            <g key={`${d.etiqueta}-${i}`}>
              {d.etiquetaSecundaria ? (
                <>
                  <text
                    x={MARGEN.izquierda - 10}
                    y={yBarra + ALTO_BARRA / 2 - 1}
                    textAnchor="end"
                    style={{ fontSize: 10, fill: "#4b5259" }}
                  >
                    {recortar(d.etiqueta)}
                  </text>
                  <text
                    x={MARGEN.izquierda - 10}
                    y={yBarra + ALTO_BARRA / 2 + 10}
                    textAnchor="end"
                    style={{ fontSize: 8.5, fill: "#8a8f93" }}
                  >
                    {recortar(d.etiquetaSecundaria)}
                  </text>
                </>
              ) : (
                <text
                  x={MARGEN.izquierda - 10}
                  y={yBarra + ALTO_BARRA / 2 + 3}
                  textAnchor="end"
                  style={{ fontSize: 10, fill: "#4b5259" }}
                >
                  {recortar(d.etiqueta)}
                </text>
              )}
              <rect
                x={MARGEN.izquierda}
                y={yBarra}
                width={Math.max(ancho, 1)}
                height={ALTO_BARRA}
                rx={3}
                fill={d.color ?? VINO}
                className="cursor-pointer transition-opacity hover:opacity-80"
                onMouseMove={(e) => setHover({ dato: d, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHover(null)}
              />
              <text
                x={MARGEN.izquierda + ancho + 6}
                y={yBarra + ALTO_BARRA / 2 + 3}
                style={{ fontSize: 10, fill: "#191d20", fontWeight: 700 }}
              >
                {mostrar(d.valor)}
              </text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 max-w-xs -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-carbon px-3 py-2 text-xs text-white shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <p className="font-bold">{hover.dato.etiqueta}</p>
          <p className="text-white/70">
            {mostrar(hover.dato.valor)} {etiquetaUnidad}
          </p>
        </div>
      )}
    </div>
  );
}
