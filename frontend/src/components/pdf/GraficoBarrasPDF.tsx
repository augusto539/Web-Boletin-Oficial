import { G, Rect, Svg, Text as SvgText, Text, View } from "@react-pdf/renderer";
import { CARBON, VINO } from "./estilosPDF";

const ANCHO = 460;
const ALTO = 190;
const MARGEN = { arriba: 16, abajo: 22, izquierda: 26, derecha: 6 };
const PLOT_ANCHO = ANCHO - MARGEN.izquierda - MARGEN.derecha;
const PLOT_ALTO = ALTO - MARGEN.arriba - MARGEN.abajo;

export function GraficoBarrasPDF({
  titulo,
  datos,
  leyenda,
}: {
  titulo: string;
  datos: { etiqueta: string; valor: number; color?: string }[];
  leyenda?: { color: string; etiqueta: string }[];
}) {
  const max = Math.max(1, ...datos.map((d) => d.valor));
  const paso = PLOT_ANCHO / datos.length;
  const anchoBarra = paso * 0.6;

  function x(i: number): number {
    return MARGEN.izquierda + i * paso + paso / 2;
  }
  function y(valor: number): number {
    return MARGEN.arriba + PLOT_ALTO - (valor / max) * PLOT_ALTO;
  }

  return (
    <View style={{ marginTop: 16, marginBottom: 8 }}>
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
      <Svg width={ANCHO} height={ALTO} viewBox={`0 0 ${ANCHO} ${ALTO}`}>
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const yPos = MARGEN.arriba + PLOT_ALTO - p * PLOT_ALTO;
          return (
            <SvgText key={p} x={MARGEN.izquierda - 4} y={yPos + 3} textAnchor="end" style={{ fontSize: 7, fill: "#999999" }}>
              {Math.round(max * p).toLocaleString("es-AR")}
            </SvgText>
          );
        })}
        {datos.map((d, i) => {
          const yBarra = y(d.valor);
          return (
            <G key={d.etiqueta}>
              <Rect
                x={x(i) - anchoBarra / 2}
                y={yBarra}
                width={anchoBarra}
                height={MARGEN.arriba + PLOT_ALTO - yBarra}
                fill={d.color ?? VINO}
              />
              <SvgText x={x(i)} y={yBarra - 6} textAnchor="middle" style={{ fontSize: 9, fill: CARBON, fontWeight: 700 }}>
                {d.valor.toLocaleString("es-AR")}
              </SvgText>
              <SvgText x={x(i)} y={ALTO - MARGEN.abajo + 12} textAnchor="middle" style={{ fontSize: 8, fill: "#666666" }}>
                {d.etiqueta}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
