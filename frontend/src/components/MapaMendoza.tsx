import { type ReactNode, useMemo, useState } from "react";
import { colorEscala, colorParaValor } from "../lib/colorEscala";
import {
  MAPA_CENTROIDES,
  MAPA_DEPARTAMENTOS,
  MAPA_INSET_DEPARTAMENTOS,
  MAPA_INSET_VIEWBOX,
  MAPA_VIEWBOX,
} from "../lib/mapaMendoza";

// Presentación pura del mapa (siluetas + leyenda + tooltip), sin estado de
// métrica/toggle: MapaDepartamentos.tsx la envuelve para /informes
// departamentos-mas-activos (con el toggle histórico/último año) y los
// informes de nicho la usan directo con un solo valor por departamento.
interface HoverInfo {
  nombre: string;
  valor: number;
  x: number;
  y: number;
}

export function MapaMendoza({
  titulo,
  subtitulo,
  valorPorNombre,
  etiquetaUnidad = "sociedades",
  controles,
}: {
  titulo: string;
  subtitulo: string;
  valorPorNombre: Map<string, number>;
  etiquetaUnidad?: string;
  controles?: ReactNode;
}) {
  const [hover, setHover] = useState<HoverInfo | null>(null);

  const max = useMemo(() => Math.max(1, ...Array.from(valorPorNombre.values())), [valorPorNombre]);

  function alMover(nombre: string, valor: number, e: React.MouseEvent) {
    setHover({ nombre, valor, x: e.clientX, y: e.clientY });
  }

  function siluetas(mostrarEtiquetas: boolean) {
    return Object.entries(MAPA_DEPARTAMENTOS).map(([nombre, path]) => {
      const valor = valorPorNombre.get(nombre) ?? 0;
      const esAmba = MAPA_INSET_DEPARTAMENTOS.includes(nombre);
      const [cx, cy] = MAPA_CENTROIDES[nombre] ?? [0, 0];
      return (
        <g key={nombre}>
          <path
            d={path}
            fill={colorParaValor(valor, max)}
            stroke="#ffffff"
            strokeWidth={1.5}
            className="cursor-pointer transition-opacity hover:opacity-80"
            onMouseMove={(e) => alMover(nombre, valor, e)}
            onMouseLeave={() => setHover(null)}
          />
          {mostrarEtiquetas && !esAmba && (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              className="pointer-events-none select-none"
              style={{ fontSize: 11, fill: "#191d20", fontWeight: 700, paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 }}
            >
              {nombre}
            </text>
          )}
        </g>
      );
    });
  }

  return (
    <div className="relative rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">{titulo}</h2>
          <p className="mt-1 text-sm text-carbon/60">{subtitulo}</p>
        </div>
        {controles}
      </div>

      <div className="mt-6 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
        <svg
          viewBox={MAPA_VIEWBOX}
          role="img"
          aria-label={`Mapa de Mendoza coloreado por cantidad de ${etiquetaUnidad} por departamento`}
          className="mx-auto w-full max-w-sm"
        >
          {siluetas(true)}
        </svg>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">Zona metropolitana</p>
          <svg
            viewBox={MAPA_INSET_VIEWBOX}
            role="img"
            aria-hidden="true"
            className="w-full max-w-[240px] rounded-xl border border-carbon/10 sm:w-[240px]"
          >
            {siluetas(false)}
            {MAPA_INSET_DEPARTAMENTOS.map((nombre) => {
              const [cx, cy] = MAPA_CENTROIDES[nombre] ?? [0, 0];
              return (
                <text
                  key={nombre}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  style={{ fontSize: 4.5, fill: "#191d20", fontWeight: 700, paintOrder: "stroke", stroke: "#fff", strokeWidth: 1 }}
                >
                  {nombre}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      <Leyenda max={max} etiquetaUnidad={etiquetaUnidad} />

      {hover && <Tooltip info={hover} etiquetaUnidad={etiquetaUnidad} />}
    </div>
  );
}

function Leyenda({ max, etiquetaUnidad }: { max: number; etiquetaUnidad: string }) {
  const paradas = Array.from({ length: 11 }, (_, i) => colorEscala(i / 10));
  return (
    <div className="mt-8">
      <div
        className="h-3 w-full rounded-full border border-carbon/10"
        style={{ background: `linear-gradient(to right, ${paradas.join(",")})` }}
      />
      <div className="mt-1.5 flex justify-between text-xs text-carbon/50">
        <span>0 {etiquetaUnidad}</span>
        <span>
          {max.toLocaleString("es-AR")} {etiquetaUnidad}
        </span>
      </div>
    </div>
  );
}

function Tooltip({ info, etiquetaUnidad }: { info: HoverInfo; etiquetaUnidad: string }) {
  return (
    <div
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-carbon px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg"
      style={{ left: info.x, top: info.y }}
    >
      <p className="font-bold">{info.nombre}</p>
      <p className="text-white/70">
        {info.valor.toLocaleString("es-AR")} {etiquetaUnidad}
      </p>
    </div>
  );
}
