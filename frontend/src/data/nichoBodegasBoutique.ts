// Contenido del informe "Bodegas boutique en Mendoza", tercero de la serie
// de nichos sectoriales. Mismo criterio que nichoCannabis.ts y
// nichoEnoturismo.ts: texto y cifras redactados a mano a partir del
// documento fuente, integrados acá como contenido estático.
//
// sociedadId/personaId: cada entidad y cada socio se cruzó a mano contra la
// base (por CUIT donde había, por nombre donde no, y por los vínculos
// reales de la sociedad para los socios) — las 63 entidades del documento
// fuente calzaron exacto contra la base real. Enlazan a las fichas
// /sociedad/:id y /persona/:id.
//
// Nota de corrección: el documento fuente traía una tabla de evolución
// anual con 2020: 8, pero el directorio final de 63 bodegas que el propio
// documento detalla una por una solo tiene 7 publicaciones en 2020 (58 de
// las 63 tienen fecha capturada, 5 no — cifra que sí coincide con el
// directorio). Se corrigió ese único valor (8 → 7) contando directamente
// las fechas de publicación de las 58 entidades con fecha en el
// directorio. El resto de las tablas del documento (tipo societario,
// departamentos, mediana/rango de capital) se verificaron exactas contra
// la base real y no se modificaron.

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 3 },
  { etiqueta: "2018", valor: 6 },
  { etiqueta: "2019", valor: 6 },
  { etiqueta: "2020", valor: 7 },
  { etiqueta: "2021", valor: 7 },
  { etiqueta: "2022", valor: 7 },
  { etiqueta: "2023", valor: 9 },
  { etiqueta: "2024", valor: 6 },
  { etiqueta: "2025", valor: 5 },
  { etiqueta: "2026*", valor: 2 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 33 },
  { tipo: "S.A.", cantidad: 28 },
  { tipo: "S.R.L.", cantidad: 2 },
];

export const DEPARTAMENTOS_BODEGAS = new Map<string, number>([
  ["Capital", 13],
  ["Luján de Cuyo", 10],
  ["San Martín", 6],
  ["Guaymallén", 6],
  ["San Rafael", 5],
  ["Maipú", 5],
  ["Junín", 3],
  ["Tunuyán", 3],
  ["Las Heras", 2],
  ["San Carlos", 2],
  ["Godoy Cruz", 2],
  ["Tupungato", 1],
  ["Lavalle", 1],
  ["Rivadavia", 1],
  ["Santa Rosa", 1],
]);
