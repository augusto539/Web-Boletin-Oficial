// Matemática pura (sin React ni dependencias de renderer) para un gráfico de
// dona: se comparte entre GraficoDona.tsx (web, SVG de navegador) y
// GraficoDonaPDF.tsx (react-pdf) porque el cálculo de los arcos es idéntico
// en los dos -- la única diferencia entre ambos es qué componente pinta el
// <path> resultante. Path (M/A/L/A/Z) en vez de stroke-dasharray sobre un
// <circle>: es la forma que funciona igual de bien en el SVG del navegador
// y en el motor de SVG de react-pdf (que ya se usa así para las siluetas de
// MapaMendozaPDF).
export interface SegmentoDona {
  etiqueta: string;
  valor: number;
  color: string;
}

export interface SegmentoDonaCalculado extends SegmentoDona {
  pct: number;
  path: string;
}

export function calcularSegmentosDona(
  datos: SegmentoDona[],
  cx: number,
  cy: number,
  radioExterior: number,
  radioInterior: number,
): SegmentoDonaCalculado[] {
  const total = datos.reduce((acc, d) => acc + d.valor, 0) || 1;
  let anguloAcum = -Math.PI / 2; // arranca arriba (12 en punto), en sentido horario

  return datos
    .filter((d) => d.valor > 0)
    .map((d) => {
      const pct = d.valor / total;
      const anguloInicio = anguloAcum;
      const anguloFin = anguloAcum + pct * Math.PI * 2;
      anguloAcum = anguloFin;

      const punto = (r: number, ang: number): [number, number] => [
        cx + r * Math.cos(ang),
        cy + r * Math.sin(ang),
      ];
      const [x1, y1] = punto(radioExterior, anguloInicio);
      const [x2, y2] = punto(radioExterior, anguloFin);
      const [x3, y3] = punto(radioInterior, anguloFin);
      const [x4, y4] = punto(radioInterior, anguloInicio);
      const arcoLargo = anguloFin - anguloInicio > Math.PI ? 1 : 0;

      const path = [
        `M ${x1} ${y1}`,
        `A ${radioExterior} ${radioExterior} 0 ${arcoLargo} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${radioInterior} ${radioInterior} 0 ${arcoLargo} 0 ${x4} ${y4}`,
        "Z",
      ].join(" ");

      return { ...d, pct, path };
    });
}
