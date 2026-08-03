import { G, Line, Rect, Svg, Text as SvgText, Text, View } from "@react-pdf/renderer";
import type { BarraHorizontalDato } from "../GraficoBarrasHorizontal";
import { CARBON, VINO } from "./estilosPDF";

const ANCHO = 460;
const MARGEN = { arriba: 8, abajo: 18, izquierda: 176, derecha: 38 };
const PASO = 20;
const ALTO_BARRA = 12;
const MAX_CARACTERES_ETIQUETA = 42;

function recortar(texto: string): string {
  return texto.length > MAX_CARACTERES_ETIQUETA
    ? `${texto.slice(0, MAX_CARACTERES_ETIQUETA - 1).trimEnd()}…`
    : texto;
}

// Equivalente PDF de GraficoBarrasHorizontal.tsx (sin hover ni tooltip).
export function GraficoBarrasHorizontalPDF({
  titulo,
  datos,
  leyenda,
  referencia,
  formatearValor,
}: {
  titulo: string;
  datos: BarraHorizontalDato[];
  leyenda?: { color: string; etiqueta: string }[];
  referencia?: { valor: number; etiqueta: string };
  formatearValor?: (valor: number) => string;
}) {
  const paso = datos.some((d) => d.etiquetaSecundaria) ? PASO + 5 : PASO;
  const alto = MARGEN.arriba + datos.length * paso + MARGEN.abajo;
  const plotAncho = ANCHO - MARGEN.izquierda - MARGEN.derecha;
  const max = Math.max(1, ...datos.map((d) => d.valor), referencia?.valor ?? 0);
  const mostrar = formatearValor ?? ((v: number) => v.toLocaleString("es-AR"));

  function x(valor: number): number {
    return (valor / max) * plotAncho;
  }

  return (
    <View style={{ marginTop: 16, marginBottom: 8 }} wrap={false}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Text style={{ fontSize: 12, fontWeight: 700, color: CARBON, marginBottom: 8 }}>{titulo}</Text>
        {leyenda && (
          <View style={{ flexDirection: "row", gap: 10 }}>
            {leyenda.map((l) => (
              <View key={l.etiqueta} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <View style={{ width: 7, height: 7, backgroundColor: l.color, borderRadius: 1 }} />
                <Text style={{ fontSize: 7, color: "#666666" }}>{l.etiqueta}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <Svg width={ANCHO} height={alto} viewBox={`0 0 ${ANCHO} ${alto}`}>
        {referencia && (
          <G>
            <Line
              x1={MARGEN.izquierda + x(referencia.valor)}
              x2={MARGEN.izquierda + x(referencia.valor)}
              y1={MARGEN.arriba - 3}
              y2={MARGEN.arriba + datos.length * paso}
              stroke="#8a8f93"
              strokeWidth={0.8}
              strokeDasharray="3 2"
            />
            <SvgText
              x={MARGEN.izquierda + x(referencia.valor)}
              y={MARGEN.arriba + datos.length * paso + 11}
              textAnchor="middle"
              style={{ fontSize: 6, fill: "#8a8f93" }}
            >
              {referencia.etiqueta}
            </SvgText>
          </G>
        )}
        {datos.map((d, i) => {
          const yBarra = MARGEN.arriba + i * paso + (paso - ALTO_BARRA) / 2;
          const ancho = x(d.valor);
          return (
            <G key={`${d.etiqueta}-${i}`}>
              {d.etiquetaSecundaria ? (
                <>
                  <SvgText
                    x={MARGEN.izquierda - 6}
                    y={yBarra + ALTO_BARRA / 2 - 1}
                    textAnchor="end"
                    style={{ fontSize: 7, fill: "#4b5259" }}
                  >
                    {recortar(d.etiqueta)}
                  </SvgText>
                  <SvgText
                    x={MARGEN.izquierda - 6}
                    y={yBarra + ALTO_BARRA / 2 + 7}
                    textAnchor="end"
                    style={{ fontSize: 6, fill: "#8a8f93" }}
                  >
                    {recortar(d.etiquetaSecundaria)}
                  </SvgText>
                </>
              ) : (
                <SvgText
                  x={MARGEN.izquierda - 6}
                  y={yBarra + ALTO_BARRA / 2 + 2}
                  textAnchor="end"
                  style={{ fontSize: 7, fill: "#4b5259" }}
                >
                  {recortar(d.etiqueta)}
                </SvgText>
              )}
              <Rect
                x={MARGEN.izquierda}
                y={yBarra}
                width={Math.max(ancho, 1)}
                height={ALTO_BARRA}
                fill={d.color ?? VINO}
              />
              <SvgText
                x={MARGEN.izquierda + ancho + 4}
                y={yBarra + ALTO_BARRA / 2 + 2}
                style={{ fontSize: 7, fill: CARBON, fontWeight: 700 }}
              >
                {mostrar(d.valor)}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
