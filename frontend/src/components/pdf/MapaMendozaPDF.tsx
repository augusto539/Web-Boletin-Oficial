import { G, Path, Rect, Svg, Text as SvgText, View, Text } from "@react-pdf/renderer";
import { colorEscala, colorParaValor } from "../../lib/colorEscala";
import {
  MAPA_CENTROIDES,
  MAPA_DEPARTAMENTOS,
  MAPA_INSET_DEPARTAMENTOS,
  MAPA_INSET_VIEWBOX,
  MAPA_VIEWBOX,
} from "../../lib/mapaMendoza";
import { CARBON } from "./estilosPDF";

// Núcleo estático (sin toggle ni hover) del mapa, para PDF — mismo criterio
// que MapaMendoza.tsx del lado web: MapaDepartamentosPDF.tsx lo envuelve
// para /informes/departamentos-mas-activos y los informes de nicho lo usan
// directo con un solo valor por departamento.
export function MapaMendozaPDF({
  titulo,
  valorPorNombre,
  etiquetaUnidad = "sociedades",
}: {
  titulo: string;
  valorPorNombre: Map<string, number>;
  etiquetaUnidad?: string;
}) {
  const max = Math.max(1, ...Array.from(valorPorNombre.values()));

  function siluetas(mostrarEtiquetas: boolean) {
    return Object.entries(MAPA_DEPARTAMENTOS).map(([nombre, path]) => {
      const valor = valorPorNombre.get(nombre) ?? 0;
      const esAmba = MAPA_INSET_DEPARTAMENTOS.includes(nombre);
      const [cx, cy] = MAPA_CENTROIDES[nombre] ?? [0, 0];
      return (
        <G key={nombre}>
          <Path d={path} fill={colorParaValor(valor, max)} stroke="#ffffff" strokeWidth={1.5} />
          {mostrarEtiquetas && !esAmba && (
            <SvgText x={cx} y={cy} textAnchor="middle" style={{ fontSize: 9, fill: CARBON }}>
              {nombre}
            </SvgText>
          )}
        </G>
      );
    });
  }

  // Franjas sólidas en vez de un LinearGradient/Pattern real: react-pdf no
  // recorta bien el shading de un Pattern a los límites de su Rect cuando no
  // está anclado al origen de la página, y termina "sangrando" en diagonal
  // sobre el resto del contenido. Con rectángulos sólidos se evita el bug.
  const SEGMENTOS = 24;
  const segmentosLeyenda = Array.from({ length: SEGMENTOS }, (_, i) => colorEscala(i / (SEGMENTOS - 1)));

  return (
    <View style={{ marginTop: 16, marginBottom: 8 }}>
      <Text style={{ fontSize: 12, fontWeight: 700, color: CARBON, marginBottom: 8 }}>{titulo}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <Svg width={190} height={190 * (1058.74 / 640)} viewBox={MAPA_VIEWBOX}>
          {siluetas(true)}
        </Svg>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 7, color: "#888888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Zona metropolitana
          </Text>
          <Svg width={150} height={150 / (104 / 80)} viewBox={MAPA_INSET_VIEWBOX}>
            {siluetas(false)}
            {MAPA_INSET_DEPARTAMENTOS.map((nombre) => {
              const [cx, cy] = MAPA_CENTROIDES[nombre] ?? [0, 0];
              return (
                <SvgText key={nombre} x={cx} y={cy} textAnchor="middle" style={{ fontSize: 4.5, fill: CARBON }}>
                  {nombre}
                </SvgText>
              );
            })}
          </Svg>
        </View>
      </View>

      <Svg width={300} height={16} style={{ marginTop: 12 }}>
        {segmentosLeyenda.map((color, i) => (
          <Rect
            key={i}
            x={(i * 300) / SEGMENTOS}
            y={0}
            width={300 / SEGMENTOS + 0.5}
            height={8}
            fill={color}
          />
        ))}
        <SvgText x={0} y={15} style={{ fontSize: 7, fill: "#888888" }}>
          0
        </SvgText>
        <SvgText x={270} y={15} style={{ fontSize: 7, fill: "#888888" }}>
          {`${max.toLocaleString("es-AR")} ${etiquetaUnidad}`}
        </SvgText>
      </Svg>
    </View>
  );
}
