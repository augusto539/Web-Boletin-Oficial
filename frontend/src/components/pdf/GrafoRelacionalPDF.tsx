import { Circle, G, Line, Svg, Text as SvgText, Text, View } from "@react-pdf/renderer";
import {
  type AristaGrafo,
  type NodoGrafo,
  type TipoNodo,
  calcularLayoutRadial,
} from "../../lib/grafoRelacional";
import { CARBON } from "./estilosPDF";

const ANCHO = 430;
const ALTO = 430;
const RADIO_EXTERNO = 145;
const RADIO_INTERNO = 55;

const COLOR: Record<TipoNodo, string> = {
  sociedad: "#691824",
  persona: "#5f7a61",
  domicilio: "#b0473f",
};

// Equivalente PDF de GrafoRelacional.tsx: mismo layout determinístico, sin
// hover. react-pdf no soporta paint-order, así que la etiqueta no lleva el
// halo blanco de la versión web -- se compensa con aristas más tenues.
export function GrafoRelacionalPDF({
  titulo,
  nodos,
  aristas,
  leyenda,
}: {
  titulo: string;
  nodos: NodoGrafo[];
  aristas: AristaGrafo[];
  leyenda: { color: string; etiqueta: string }[];
}) {
  const layout = calcularLayoutRadial(nodos, aristas, ANCHO, ALTO, RADIO_EXTERNO, RADIO_INTERNO);

  return (
    <View style={{ marginTop: 16, marginBottom: 8 }} wrap={false}>
      <Text style={{ fontSize: 12, fontWeight: 700, color: CARBON, marginBottom: 6 }}>{titulo}</Text>
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 6 }}>
        {leyenda.map((l) => (
          <View key={l.etiqueta} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <View style={{ width: 7, height: 7, backgroundColor: l.color, borderRadius: 4 }} />
            <Text style={{ fontSize: 7, color: "#666666" }}>{l.etiqueta}</Text>
          </View>
        ))}
      </View>
      <Svg width={ANCHO} height={ALTO} viewBox={`0 0 ${ANCHO} ${ALTO}`}>
        {layout.aristas.map((a, i) => (
          <Line
            key={i}
            x1={a.x1}
            y1={a.y1}
            x2={a.x2}
            y2={a.y2}
            stroke="#d8d8d8"
            strokeWidth={0.5}
          />
        ))}
        {layout.nodos.map((n) => (
          <G key={n.id}>
            <Circle cx={n.x} cy={n.y} r={n.radio} fill={COLOR[n.tipo]} stroke="#ffffff" strokeWidth={1.5} />
            <SvgText
              x={n.textoX}
              y={n.textoY}
              textAnchor={n.anclaje}
              style={{ fontSize: 6.5, fill: CARBON, fontWeight: 700 }}
            >
              {n.etiqueta}
            </SvgText>
          </G>
        ))}
      </Svg>
    </View>
  );
}
