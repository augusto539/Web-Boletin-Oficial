import { Path, Svg, Text as SvgText, Text, View } from "@react-pdf/renderer";
import { calcularSegmentosDona, type SegmentoDona } from "../../lib/graficoDona";
import { CARBON } from "./estilosPDF";

const ANCHO = 170;
const ALTO = 170;
const CX = ANCHO / 2;
const CY = ALTO / 2;
const RADIO_EXT = 72;
const RADIO_INT = 43;

export function GraficoDonaPDF({
  titulo,
  datos,
  etiquetaUnidad = "",
  etiquetaCentro,
}: {
  titulo: string;
  datos: SegmentoDona[];
  etiquetaUnidad?: string;
  etiquetaCentro?: string;
}) {
  const segmentos = calcularSegmentosDona(datos, CX, CY, RADIO_EXT, RADIO_INT);
  const total = datos.reduce((acc, d) => acc + d.valor, 0);

  return (
    <View style={{ marginTop: 16, marginBottom: 8 }}>
      <Text style={{ fontSize: 12, fontWeight: 700, color: CARBON, marginBottom: 8 }}>{titulo}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <Svg width={ANCHO} height={ALTO} viewBox={`0 0 ${ANCHO} ${ALTO}`}>
          {segmentos.map((s) => (
            <Path key={s.etiqueta} d={s.path} fill={s.color} />
          ))}
          <SvgText x={CX} y={CY - 1} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700, fill: CARBON }}>
            {total.toLocaleString("es-AR")}
          </SvgText>
          <SvgText x={CX} y={CY + 12} textAnchor="middle" style={{ fontSize: 7, fill: "#999999" }}>
            {etiquetaCentro ?? etiquetaUnidad}
          </SvgText>
        </Svg>
        <View style={{ gap: 6 }}>
          {segmentos.map((s) => (
            <View key={s.etiqueta} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 8, height: 8, backgroundColor: s.color, borderRadius: 1 }} />
              <Text style={{ fontSize: 8, color: CARBON, fontWeight: 700 }}>{s.etiqueta}</Text>
              <Text style={{ fontSize: 8, color: "#666666" }}>
                {s.valor.toLocaleString("es-AR")} ({(s.pct * 100).toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
