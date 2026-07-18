import { oklchAsrgbHex } from "./colorEscala";
import { MAPA_DEPARTAMENTOS } from "./mapaMendoza";

// Paleta categórica para el gráfico de líneas: un hue fijo por departamento,
// nunca reasignado por más que se activen/desactiven series (la identidad
// va atada al nombre, no al orden en pantalla). 18 departamentos exceden el
// techo de ~8-12 hues distinguibles por color solo, así que acá el color es
// un apoyo visual, no la única forma de identificar una línea: cada control
// de la leyenda siempre lleva el nombre en texto al lado del swatch.
const NOMBRES_ORDENADOS = Object.keys(MAPA_DEPARTAMENTOS).sort((a, b) => a.localeCompare(b, "es"));

const L = 0.6;
const C = 0.13;

export const COLOR_POR_DEPARTAMENTO: Record<string, string> = Object.fromEntries(
  NOMBRES_ORDENADOS.map((nombre, i) => [nombre, oklchAsrgbHex(L, C, (i * 360) / NOMBRES_ORDENADOS.length)]),
);

export function colorDepartamento(nombre: string): string {
  return COLOR_POR_DEPARTAMENTO[nombre] ?? "#888888";
}
