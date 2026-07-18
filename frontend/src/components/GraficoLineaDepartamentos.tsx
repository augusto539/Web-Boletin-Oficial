import { useMemo, useState } from "react";
import { colorDepartamento } from "../lib/coloresDepartamentos";
import type { DepartamentosPorAnio } from "../lib/informesApi";

const ANCHO = 720;
const ALTO = 360;
const MARGEN = { arriba: 16, abajo: 32, izquierda: 46, derecha: 16 };
const PLOT_ANCHO = ANCHO - MARGEN.izquierda - MARGEN.derecha;
const PLOT_ALTO = ALTO - MARGEN.arriba - MARGEN.abajo;
const CANTIDAD_DEFAULT_ACTIVOS = 6;

interface HoverInfo {
  indice: number;
  x: number;
  y: number;
}

export function GraficoLineaDepartamentos({ datos }: { datos: DepartamentosPorAnio }) {
  const { anios, departamentos } = datos;

  const ordenados = useMemo(
    () => [...departamentos].sort((a, b) => sumar(b.valores) - sumar(a.valores)),
    [departamentos],
  );

  const [activos, setActivos] = useState<Set<string>>(
    () => new Set(ordenados.slice(0, CANTIDAD_DEFAULT_ACTIVOS).map((d) => d.nombre)),
  );
  const [hover, setHover] = useState<HoverInfo | null>(null);

  const visibles = departamentos.filter((d) => activos.has(d.nombre));
  const maxY = Math.max(1, ...visibles.flatMap((d) => d.valores));

  function x(i: number): number {
    if (anios.length <= 1) return MARGEN.izquierda + PLOT_ANCHO / 2;
    return MARGEN.izquierda + (i / (anios.length - 1)) * PLOT_ANCHO;
  }

  function y(valor: number): number {
    return MARGEN.arriba + PLOT_ALTO - (valor / maxY) * PLOT_ALTO;
  }

  function alternar(nombre: string) {
    setActivos((actual) => {
      const nuevo = new Set(actual);
      if (nuevo.has(nombre)) nuevo.delete(nombre);
      else nuevo.add(nombre);
      return nuevo;
    });
  }

  function alMoverMouse(e: React.MouseEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRelativo = e.clientX - rect.left;
    const proporcion = anios.length <= 1 ? 0 : xRelativo / rect.width;
    const indice = Math.round(proporcion * (anios.length - 1));
    const indiceAcotado = Math.min(anios.length - 1, Math.max(0, indice));
    setHover({ indice: indiceAcotado, x: e.clientX, y: e.clientY });
  }

  const paradasGrilla = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="text-lg font-bold">Sociedades constituidas por año, por departamento</h2>
        <p className="mt-1 text-sm text-carbon/60">
          Activá o desactivá departamentos para comparar su evolución.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        role="img"
        aria-label="Evolución de sociedades constituidas por año, para los departamentos activados"
        className="mt-6 w-full"
      >
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
                {Math.round(maxY * p).toLocaleString("es-AR")}
              </text>
            </g>
          );
        })}

        {anios.map((anio, i) => (
          <text
            key={anio}
            x={x(i)}
            y={ALTO - MARGEN.abajo + 16}
            textAnchor="middle"
            style={{ fontSize: 9, fill: "#999" }}
          >
            {anio}
          </text>
        ))}

        {visibles.map((d) => (
          <path
            key={d.departamentoId}
            d={d.valores.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ")}
            fill="none"
            stroke={colorDepartamento(d.nombre)}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {hover && (
          <line
            x1={x(hover.indice)}
            x2={x(hover.indice)}
            y1={MARGEN.arriba}
            y2={ALTO - MARGEN.abajo}
            stroke="#69182444"
            strokeWidth={1}
          />
        )}
        {hover &&
          visibles.map((d) => (
            <circle
              key={d.departamentoId}
              cx={x(hover.indice)}
              cy={y(d.valores[hover.indice])}
              r={3}
              fill={colorDepartamento(d.nombre)}
            />
          ))}

        <rect
          x={MARGEN.izquierda}
          y={MARGEN.arriba}
          width={PLOT_ANCHO}
          height={PLOT_ALTO}
          fill="transparent"
          onMouseMove={alMoverMouse}
          onMouseLeave={() => setHover(null)}
          className="cursor-crosshair"
        />
      </svg>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {ordenados.map((d) => {
          const activo = activos.has(d.nombre);
          return (
            <button
              key={d.departamentoId}
              type="button"
              onClick={() => alternar(d.nombre)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                activo ? "bg-humo text-carbon" : "bg-humo/50 text-carbon/35 hover:text-carbon/60"
              }`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: activo ? colorDepartamento(d.nombre) : "#cccccc" }}
              />
              {d.nombre}
            </button>
          );
        })}
      </div>

      {hover && visibles.length > 0 && (
        <Tooltip
          anio={anios[hover.indice]}
          x={hover.x}
          y={hover.y}
          filas={[...visibles]
            .map((d) => ({ nombre: d.nombre, valor: d.valores[hover.indice] }))
            .sort((a, b) => b.valor - a.valor)}
        />
      )}
    </div>
  );
}

function sumar(valores: number[]): number {
  return valores.reduce((acc, v) => acc + v, 0);
}

function Tooltip({
  anio,
  x,
  y,
  filas,
}: {
  anio: number;
  x: number;
  y: number;
  filas: { nombre: string; valor: number }[];
}) {
  return (
    <div
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-carbon px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg"
      style={{ left: x, top: y }}
    >
      <p className="mb-1 font-bold">{anio}</p>
      {filas.map((f) => (
        <p key={f.nombre} className="flex items-center gap-1.5 text-white/80">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: colorDepartamento(f.nombre) }}
          />
          {f.nombre}: {f.valor.toLocaleString("es-AR")}
        </p>
      ))}
    </div>
  );
}
