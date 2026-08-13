// Contenido del informe "Enoturismo en Mendoza", segundo de la serie de
// nichos sectoriales. Mismo criterio que nichoCannabis.ts: texto y cifras
// redactados a mano a partir del documento fuente, integrados acá como
// contenido estático (ver docs/pendientes.md sobre el criterio acordado
// para esta serie).
//
// sociedadId/personaId: cada entidad y cada socio se cruzó a mano contra la
// base (por CUIT donde había, por los vínculos reales de la sociedad para
// los socios) — las 43 entidades del documento fuente calzaron exacto
// contra la base real. Enlazan a las fichas /sociedad/:id y /persona/:id.
//
// Nota de corrección: el documento fuente traía una tabla de evolución
// anual (2021: 7, 2024: 8, 2025: 9 → total 49) que no coincide con el
// directorio final de 43 empresas que el propio documento define y detalla
// una por una. Se recalculó la serie anual contando directamente las
// fechas de publicación de las 43 entidades del directorio (que sí calzan
// exacto contra CUIT/capital/departamento en la base real), no la tabla
// resumen del documento. Mismo criterio para "26 de 43 en 2023-2025", que
// pasa a ser "22 de 43".

const GRIS_TENUE = "#b9b9b9";
const VINO = "#691824";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 2, color: GRIS_TENUE },
  { etiqueta: "2018", valor: 0, color: GRIS_TENUE },
  { etiqueta: "2019", valor: 5, color: GRIS_TENUE },
  { etiqueta: "2020", valor: 3, color: GRIS_TENUE },
  { etiqueta: "2021", valor: 5, color: GRIS_TENUE },
  { etiqueta: "2022", valor: 2, color: GRIS_TENUE },
  { etiqueta: "2023", valor: 9, color: VINO },
  { etiqueta: "2024", valor: 6, color: VINO },
  { etiqueta: "2025", valor: 7, color: VINO },
  { etiqueta: "2026*", valor: 4, color: VINO },
];

export const LEYENDA_EVOLUCION = [
  { color: GRIS_TENUE, etiqueta: "2017–2022" },
  { color: VINO, etiqueta: "2023–2026: escalón sostenido" },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 36 },
  { tipo: "S.A.", cantidad: 4 },
  { tipo: "S.R.L.", cantidad: 2 },
  { tipo: "Unión Transitoria", cantidad: 1 },
];

export const DEPARTAMENTOS_ENOTURISMO = new Map<string, number>([
  ["Capital", 17],
  ["Luján de Cuyo", 5],
  ["Maipú", 4],
  ["Guaymallén", 4],
  ["Godoy Cruz", 3],
  ["Tupungato", 2],
  ["Rivadavia", 1],
  ["San Carlos", 1],
  ["San Martín", 1],
  ["San Rafael", 1],
  ["Tunuyán", 1],
  ["Junín", 1],
]);
