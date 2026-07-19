// Escala secuencial de un solo hue (piso casi blanco -> vino -> vino-oscuro)
// para el mapa de departamentos. Se interpola en OKLCH en vez de RGB para
// que la luminosidad baje de forma monótona y prolija (interpolar RGB
// directo da un tramo medio grisáceo/lavado, nada que ver con "cada vez más
// rojo").
//
// 3 paradas fijas, tomadas de los colores de marca ya definidos en
// index.css/estilosPDF.ts (no son valores inventados), salvo el piso:
//   t=0    piso casi blanco #fce9ea (cero sociedades) — no blanco puro para
//          que el mapa se distinga de la tarjeta blanca que lo contiene
//   t=0.55 vino     #691824      (el rojo de marca)
//   t=1    vino-oscuro #4a0f19   (el máximo de la escala)
const PARADA_BLANCO = { L: 0.95, C: 0.02, H: 17.2 };
const PARADA_VINO = { L: 0.3499, C: 0.1134, H: 17.2231 };
const PARADA_VINO_OSCURO = { L: 0.2764, C: 0.088, H: 15.6109 };
const T_VINO = 0.55;

function linealAsrgb(c: number): number {
  const v = c <= 0 ? 0 : c >= 1 ? 1 : c;
  const s = v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(s * 255);
}

export function oklchAsrgbHex(L: number, C: number, H: number): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const rr = linealAsrgb(r);
  const gg = linealAsrgb(g);
  const bb = linealAsrgb(bl);
  return `#${[rr, gg, bb].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function interpolar(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** t en [0,1] -> color hex de la escala blanco -> vino -> vino-oscuro. */
export function colorEscala(t: number): string {
  const tc = t <= 0 ? 0 : t >= 1 ? 1 : t;
  const [desde, hasta, tLocal] =
    tc <= T_VINO
      ? [PARADA_BLANCO, PARADA_VINO, tc / T_VINO]
      : [PARADA_VINO, PARADA_VINO_OSCURO, (tc - T_VINO) / (1 - T_VINO)];
  const L = interpolar(desde.L, hasta.L, tLocal);
  const C = interpolar(desde.C, hasta.C, tLocal);
  const H = interpolar(desde.H, hasta.H, tLocal);
  return oklchAsrgbHex(L, C, H);
}

/** Color para un valor dado un dominio [0, max]. max<=0 siempre da blanco. */
export function colorParaValor(valor: number, max: number): string {
  if (max <= 0) return colorEscala(0);
  return colorEscala(valor / max);
}
