import { Circle, G, Line, Path, Svg, Text as SvgText, Text, View } from "@react-pdf/renderer";
import type { PuntoLinea, SerieLinea } from "../GraficoLinea";
import { CARBON, VINO } from "./estilosPDF";

const ANCHO = 460;
const ALTO = 190;
const MARGEN = { arriba: 16, abajo: 22, izquierda: 32, derecha: 12 };
const PLOT_ANCHO = ANCHO - MARGEN.izquierda - MARGEN.derecha;
const PLOT_ALTO = ALTO - MARGEN.arriba - MARGEN.abajo;

// Equivalente PDF de GraficoLinea.tsx (sin hover ni tooltip). Acepta serie
// única (`datos`) o varias (`series` + `etiquetas`), igual que la versión web.
export function GraficoLineaPDF({
  titulo,
  datos,
  series,
  etiquetas,
  formatearValor,
  maximoY,
  referencia,
}: {
  titulo: string;
  datos?: PuntoLinea[];
  series?: SerieLinea[];
  etiquetas?: string[];
  formatearValor?: (valor: number) => string;
  maximoY?: number;
  referencia?: { indice: number; etiqueta: string };
}) {
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

  return (
    <View style={{ marginTop: 16, marginBottom: 8 }} wrap={false}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Text style={{ fontSize: 12, fontWeight: 700, color: CARBON, marginBottom: 8 }}>{titulo}</Text>
        {esMultiSerie && (
          <View style={{ flexDirection: "row", gap: 10 }}>
            {seriesEfectivas.map((s) => (
              <View key={s.nombre} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <View style={{ width: 7, height: 7, backgroundColor: s.color, borderRadius: 1 }} />
                <Text style={{ fontSize: 7, color: "#666666" }}>{s.nombre}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <Svg width={ANCHO} height={ALTO} viewBox={`0 0 ${ANCHO} ${ALTO}`}>
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const yPos = MARGEN.arriba + PLOT_ALTO - p * PLOT_ALTO;
          return (
            <G key={p}>
              <Line
                x1={MARGEN.izquierda}
                x2={ANCHO - MARGEN.derecha}
                y1={yPos}
                y2={yPos}
                stroke="#e5e5e5"
                strokeWidth={0.8}
              />
              <SvgText
                x={MARGEN.izquierda - 4}
                y={yPos + 2}
                textAnchor="end"
                style={{ fontSize: 6, fill: "#999999" }}
              >
                {mostrar(max * p)}
              </SvgText>
            </G>
          );
        })}

        {referencia && etiquetasEje[referencia.indice] !== undefined && (
          <G>
            <Line
              x1={x(referencia.indice)}
              x2={x(referencia.indice)}
              y1={MARGEN.arriba - 5}
              y2={MARGEN.arriba + PLOT_ALTO}
              stroke="#b0473f"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <SvgText
              x={x(referencia.indice)}
              y={MARGEN.arriba - 8}
              textAnchor="middle"
              style={{ fontSize: 6.5, fill: "#b0473f", fontWeight: 700 }}
            >
              {referencia.etiqueta}
            </SvgText>
          </G>
        )}

        {seriesEfectivas.map((s) => (
          <Path
            key={s.nombre}
            d={s.valores.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ")}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
          />
        ))}

        {etiquetasEje.map((etiqueta, i) => (
          <G key={`${etiqueta}-${i}`}>
            {seriesEfectivas.map((s) =>
              s.valores[i] === undefined ? null : (
                <Circle
                  key={s.nombre}
                  cx={x(i)}
                  cy={y(s.valores[i]!)}
                  r={2.5}
                  fill="#ffffff"
                  stroke={s.color}
                  strokeWidth={1.5}
                />
              ),
            )}
            <SvgText
              x={x(i)}
              y={ALTO - MARGEN.abajo + 12}
              textAnchor="middle"
              style={{ fontSize: 7, fill: "#666666" }}
            >
              {etiqueta}
            </SvgText>
          </G>
        ))}
      </Svg>
    </View>
  );
}
