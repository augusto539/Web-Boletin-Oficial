// Contenido del informe "Cripto y fintech en Mendoza", quinto de la serie de
// nichos sectoriales. Mismo criterio que los cuatro anteriores: texto y
// cifras redactados a mano a partir del documento fuente, integrados acá
// como contenido estático.
//
// sociedadId/personaId: las 14 entidades y sus socios se cruzaron a mano
// contra la base (por CUIT donde había, por nombre normalizado donde no) —
// las 14 calzaron exacto. A diferencia del informe de Energía renovable,
// acá ningún socio es persona jurídica: los 32 socios/integrantes del
// directorio son todos personas físicas con ficha propia.
//
// Todas las tablas del documento fuente (evolución anual, tipo societario,
// departamentos, capital) calzaron exactas contra el directorio y la base
// real — no hizo falta corregir ningún valor.

const VINO = "#691824";
const GRIS_TENUE = "#b9b9b9";
const VINO_CLARO = "#8a2433";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2020", valor: 3, color: VINO },
  { etiqueta: "2021", valor: 4, color: VINO },
  { etiqueta: "2022", valor: 2, color: VINO },
  { etiqueta: "2023", valor: 0, color: GRIS_TENUE },
  { etiqueta: "2024", valor: 1, color: VINO_CLARO },
  { etiqueta: "2025", valor: 3, color: VINO_CLARO },
  { etiqueta: "2026*", valor: 1, color: VINO_CLARO },
];

export const LEYENDA_EVOLUCION = [
  { color: VINO, etiqueta: "Boom 2020–2021 y resaca (2022)" },
  { color: GRIS_TENUE, etiqueta: "Crypto winter (2023)" },
  { color: VINO_CLARO, etiqueta: "Recuperación / ETF (2024–2026)" },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.", cantidad: 6 },
  { tipo: "S.A.S.", cantidad: 6 },
  { tipo: "S.R.L.", cantidad: 2 },
];

export const DEPARTAMENTOS_CRIPTO = new Map<string, number>([
  ["Capital", 8],
  ["Godoy Cruz", 3],
  ["San Rafael", 2],
  ["Luján de Cuyo", 1],
]);
