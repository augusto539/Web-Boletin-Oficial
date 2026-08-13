// Contenido del informe "Energía solar y eólica en Mendoza", cuarto de la
// serie de nichos sectoriales. Mismo criterio que los tres anteriores:
// texto y cifras redactados a mano a partir del documento fuente,
// integrados acá como contenido estático.
//
// sociedadId/personaId: cada entidad y cada socio se cruzó a mano contra la
// base (por CUIT donde había, por nombre donde no, y por los vínculos
// reales de la sociedad para los socios) — las 50 entidades del documento
// fuente calzaron exacto contra la base real. A diferencia de los informes
// anteriores, acá varios socios son personas jurídicas (Dax Energy
// Holdings, Tassaroli S.A., Green S.A., Grupo Energías Globales, etc.), que
// no tienen ficha propia en el sitio — quedan sin link, igual que "Felito
// S.A." en el informe de Bodegas boutique.
//
// A diferencia de Enoturismo y Bodegas boutique, todas las tablas de este
// documento (evolución anual, tipo societario, departamentos, capital)
// calzaron exactas contra el directorio y la base real — no hizo falta
// corregir ningún valor.

const VINO = "#691824";
const GRIS_TENUE = "#b9b9b9";
const VINO_CLARO = "#8a2433";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 18, color: VINO },
  { etiqueta: "2018", valor: 3, color: GRIS_TENUE },
  { etiqueta: "2019", valor: 7, color: GRIS_TENUE },
  { etiqueta: "2020", valor: 1, color: GRIS_TENUE },
  { etiqueta: "2021", valor: 1, color: GRIS_TENUE },
  { etiqueta: "2022", valor: 5, color: GRIS_TENUE },
  { etiqueta: "2023", valor: 0, color: GRIS_TENUE },
  { etiqueta: "2024", valor: 7, color: VINO_CLARO },
  { etiqueta: "2025", valor: 4, color: VINO_CLARO },
  { etiqueta: "2026*", valor: 2, color: VINO_CLARO },
];

export const LEYENDA_EVOLUCION = [
  { color: VINO, etiqueta: "Ola 1: RenovAr (2017)" },
  { color: GRIS_TENUE, etiqueta: "Vacío (2018–2023)" },
  { color: VINO_CLARO, etiqueta: "Ola 2: generación distribuida (2024–2026)" },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.", cantidad: 27 },
  { tipo: "S.A.S.", cantidad: 19 },
  { tipo: "S.R.L.", cantidad: 2 },
  { tipo: "Unión Transitoria", cantidad: 2 },
];

export const DEPARTAMENTOS_ENERGIA = new Map<string, number>([
  ["Luján de Cuyo", 13],
  ["San Rafael", 11],
  ["Capital", 8],
  ["Guaymallén", 5],
  ["Godoy Cruz", 4],
  ["Rivadavia", 2],
  ["San Martín", 2],
  ["Maipú", 1],
  ["Lavalle", 1],
]);
