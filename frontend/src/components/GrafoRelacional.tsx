import { useState } from "react";
import {
  type AristaGrafo,
  type NodoGrafo,
  type NodoPosicionado,
  type TipoNodo,
  calcularLayoutRadial,
} from "../lib/grafoRelacional";

const ANCHO = 640;
const ALTO = 640;
const RADIO_EXTERNO = 215;
const RADIO_INTERNO = 82;

// Paleta del proyecto (ver estilosPDF / el resto de /informes), no la del
// matplotlib original del análisis.
const COLOR: Record<TipoNodo, string> = {
  sociedad: "#691824",
  persona: "#5f7a61",
  domicilio: "#b0473f",
};

interface HoverInfo {
  nodo: NodoPosicionado;
  x: number;
  y: number;
}

// Diagrama de grafo estático para informes: layout radial determinístico (ver
// lib/grafoRelacional.ts), sin física ni interacción de exploración. Para los
// grafos navegables de sociedad/persona seguimos usando Cytoscape.
export function GrafoRelacional({
  titulo,
  subtitulo,
  nodos,
  aristas,
  leyenda,
}: {
  titulo: string;
  subtitulo?: string;
  nodos: NodoGrafo[];
  aristas: AristaGrafo[];
  leyenda: { color: string; etiqueta: string }[];
}) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const layout = calcularLayoutRadial(nodos, aristas, ANCHO, ALTO, RADIO_EXTERNO, RADIO_INTERNO);

  return (
    <div className="relative rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="text-lg font-bold">{titulo}</h2>
        {subtitulo && <p className="mt-1 text-sm text-carbon/60">{subtitulo}</p>}
      </div>

      <ul className="mt-4 flex flex-wrap gap-4">
        {leyenda.map((l) => (
          <li key={l.etiqueta} className="flex items-center gap-1.5 text-xs text-carbon/70">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: l.color }}
              aria-hidden="true"
            />
            {l.etiqueta}
          </li>
        ))}
      </ul>

      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label={titulo} className="mt-4 w-full">
        {layout.aristas.map((a, i) => (
          <line
            key={i}
            x1={a.x1}
            y1={a.y1}
            x2={a.x2}
            y2={a.y2}
            stroke="#c9c9c9"
            strokeWidth={0.8}
            strokeOpacity={0.7}
          />
        ))}

        {layout.nodos.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.radio}
              fill={COLOR[n.tipo]}
              stroke="#ffffff"
              strokeWidth={2}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseMove={(e) => setHover({ nodo: n, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHover(null)}
            />
            <text
              x={n.textoX}
              y={n.textoY}
              textAnchor={n.anclaje}
              className="pointer-events-none select-none"
              style={{
                fontSize: 10,
                fill: "#191d20",
                fontWeight: 700,
                // Halo blanco: el mismo truco que MapaMendoza para que la
                // etiqueta se lea aunque le pase una arista por detrás.
                paintOrder: "stroke",
                stroke: "#fff",
                strokeWidth: 3,
              }}
            >
              {n.etiqueta}
            </text>
          </g>
        ))}
      </svg>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-carbon px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <p className="font-bold">{hover.nodo.etiqueta}</p>
          <p className="text-white/70 capitalize">{hover.nodo.tipo}</p>
        </div>
      )}
    </div>
  );
}
