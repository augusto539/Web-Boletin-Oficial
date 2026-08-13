// Contenido del informe "Reciclaje y economía circular en Mendoza". Metodología
// de cruce (CUIT primero, normalizar_nombre() como fallback, "parece sociedad"
// por regex para decidir si un socio se busca en sociedades o
// personas_fisicas) documentada en detalle en nichoSoftware.ts y
// nichoServiciosProfesionales.ts -- mismo criterio acá. Socios sin link: un
// caso de nombre ambiguo (Jorge Luis Garofalo, dos personas reales en la
// base) y tres socios jurídicos que no están registrados como sociedad en
// el Boletín (Construcciones Electromecánicas Del Oeste S.A. y Tecnologías
// Y Servicios Ambientales S.A., las dos partes de la Unión Transitoria; y
// Recyclart S.A., socio de Gea Gestión Ambiental Mendoza) -- se dejan como
// texto plano, sin link, en vez de asumir un match.

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 27 },
  { tipo: "S.A.", cantidad: 10 },
  { tipo: "S.R.L.", cantidad: 2 },
  { tipo: "Cooperativa", cantidad: 1 },
  { tipo: "Unión Transitoria", cantidad: 1 },
];

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const GRIS_CLARO = "#c9c9c9";
const TEJA = "#b0473f";
const OCRE = "#a6873a";

export const PERFIL_SOCIETARIO_DONA = [
  { etiqueta: "S.A.S.", valor: 27, color: VINO },
  { etiqueta: "S.A.", valor: 10, color: CARBON_SUAVE },
  { etiqueta: "S.R.L.", valor: 2, color: GRIS_CLARO },
  { etiqueta: "Cooperativa", valor: 1, color: TEJA },
  { etiqueta: "Unión Transitoria", valor: 1, color: OCRE },
];

export const OLEADAS = [
  { periodo: "2018-2020", plasticos: 4, metales: 3, ambiental: 10 },
  { periodo: "2021-2023", plasticos: 0, metales: 7, ambiental: 7 },
  { periodo: "2024-2026", plasticos: 1, metales: 0, ambiental: 6 },
];

export const OLEADAS_LEYENDA = [
  { color: VINO, etiqueta: "Plásticos" },
  { color: CARBON_SUAVE, etiqueta: "Chatarra/Metales" },
  { color: TEJA, etiqueta: "Ambiental/consultoría/otros" },
];

// Mismo patrón de barras agrupadas que PANORAMA_POR_ROL en
// mujeresFundadoras.ts: cada período son tres barras (una por subrubro),
// pero solo la del medio lleva el texto del período en el eje X para no
// repetirlo tres veces.
export const OLEADAS_BARRAS = OLEADAS.flatMap((o) => [
  { etiqueta: `${o.periodo} — Plásticos`, etiquetaEje: "", valor: o.plasticos, color: VINO },
  { etiqueta: `${o.periodo} — Chatarra/Metales`, etiquetaEje: o.periodo, valor: o.metales, color: CARBON_SUAVE },
  { etiqueta: `${o.periodo} — Ambiental/consultoría/otros`, etiquetaEje: "", valor: o.ambiental, color: TEJA },
]);

export const TOP_CAPITALES = [
  { etiqueta: "Transformación Estratégica Circular S.A. (2024)", valor: 60000000, color: VINO },
  { etiqueta: "Trigenus S.A. (2023)", valor: 4500000 },
  { etiqueta: "Palcriva Estrategias Integrales S.A.S. (2025)", valor: 3000000 },
  { etiqueta: "Hibrida S.R.L. (2019)", valor: 3500000 },
  { etiqueta: "Norplast S.A.S. (2018)", valor: 2000000 },
  { etiqueta: "Junín Punto Limpio S.A.U. (2021)", valor: 2000000 },
];

export const DEPARTAMENTOS_RECICLAJE = new Map<string, number>([
  ["Capital", 11],
  ["Guaymallén", 10],
  ["Godoy Cruz", 7],
  ["Luján de Cuyo", 4],
  ["Las Heras", 2],
  ["San Rafael", 2],
  ["Junín", 1],
  ["Maipú", 1],
  ["Malargüe", 1],
]);
