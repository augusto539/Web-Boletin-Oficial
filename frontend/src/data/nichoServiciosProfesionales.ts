// Contenido del informe "Abogados, contadores y escribanos: los
// profesionales que fabrican empresas", séptimo de la serie de nichos
// sectoriales. Mismo criterio que los seis anteriores: texto y cifras
// redactados a mano a partir del documento fuente, integrados acá como
// contenido estático.
//
// A diferencia de los otros nichos, este informe tiene DOS mitades: los 46
// estudios profesionales constituidos como sociedad (ENTIDADES, igual que
// siempre) y el "ecosistema" -- profesionales que aparecen como socios o
// como escribano interviniente en CUALQUIER sociedad de la base, no solo en
// las 46. Esa segunda mitad no tiene sociedadId/personaId propio: son
// agregados (conteos por profesión), no un directorio de entidades.
//
// sociedadId/personaId de ENTIDADES: las 46 se cruzaron por CUIT donde había
// (24 de 46), por nombre normalizado el resto -- las 46 calzaron exacto, sin
// ambigüedad. De los 101 socios/integrantes únicos, 99 resolvieron a persona
// o sociedad. Quedaron sin enlazar, a propósito, dos casos de nombre
// ambiguo (matchean por nombre normalizado contra MÁS DE UNA persona real en
// la base, sin CUIT/DNI en el documento fuente para desambiguar -- mismo
// criterio que el resto de la serie: mejor dejarlo sin vincular que
// arriesgar enlazar a la persona equivocada):
//   - Pablo Antonio Saitta (Sas S.A.S.): dos personas con ese nombre,
//     documentos 29934914 y 29834914 (probable error de tipeo entre sí, pero
//     sin forma de saber a cuál corresponde este socio en particular).
//   - Carina Alicia Molina (Impositivo, Contable Y Comercial S.A.S.): dos
//     personas con ese nombre, documentos 23378676 y 23378616 (mismo caso).

const VINO = "#691824";
const TEJA = "#b0473f";

// Gráfico 1 del documento fuente: especialidad de los 46 estudios. Notarial
// en teja porque es el "cero elocuente" del informe -- ninguna escribanía
// puede constituirse como sociedad comercial (ver sección "La escribanía
// que no existe" en la página).
export const ESPECIALIDAD_ESTUDIOS = [
  { etiqueta: "Jurídico", valor: 25, color: VINO },
  { etiqueta: "Contable", valor: 11, color: VINO },
  { etiqueta: "Jurídico-contable", valor: 9, color: VINO },
  { etiqueta: "Gestoría y trámites", valor: 1, color: VINO },
  { etiqueta: "Notarial", valor: 0, color: TEJA },
];

export const EVOLUCION_ANUAL = [
  { etiqueta: "2018", valor: 5 },
  { etiqueta: "2019", valor: 11 },
  { etiqueta: "2020", valor: 5 },
  { etiqueta: "2021", valor: 4 },
  { etiqueta: "2022", valor: 6 },
  { etiqueta: "2023", valor: 8 },
  { etiqueta: "2024", valor: 4 },
  { etiqueta: "2025", valor: 3 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 36 },
  { tipo: "S.R.L.", cantidad: 6 },
  { tipo: "S.A.", cantidad: 4 },
];

export const DEPARTAMENTOS_SERVICIOS_PROFESIONALES = new Map<string, number>([
  ["Capital", 34],
  ["Luján de Cuyo", 3],
  ["Godoy Cruz", 2],
  ["San Martín", 2],
  ["General Alvear", 1],
  ["Guaymallén", 1],
  ["Maipú", 1],
  ["San Rafael", 1],
]);

// Segunda mitad del informe: profesionales como socios de CUALQUIER
// sociedad de la base (no solo las 46 de arriba).
export const PROFESIONES_ECOSISTEMA = [
  { profesion: "Contador/a", personas: 1136, sociedades: 1639 },
  { profesion: "Abogado/a", personas: 821, sociedades: 1028 },
  { profesion: "Escribano/a", personas: 66, sociedades: null },
];

// Gráfico 2: ranking general de profesiones liberales entre los socios de
// toda la base (19.485 sociedades). Escribano en teja: es la que menos se
// asocia, el contraste que le da sentido a la sección de escribanos.
export const RANKING_PROFESIONES_LIBERALES = [
  { etiqueta: "Ingeniero/a", valor: 1485, color: VINO },
  { etiqueta: "Contador/a", valor: 1135, color: VINO },
  { etiqueta: "Médico/a", valor: 983, color: VINO },
  { etiqueta: "Abogado/a", valor: 821, color: VINO },
  { etiqueta: "Arquitecto/a", valor: 482, color: VINO },
  { etiqueta: "Escribano/a", valor: 66, color: TEJA },
];

// Gráfico 3: los escribanos más activos como interviniente en actos
// societarios (no como socio -- nunca lo son, ver arriba).
export const ESCRIBANOS_TOP = [
  { etiqueta: "Paulo Ariel Crescitelli", valor: 43, color: VINO },
  { etiqueta: "Oscar Eduardo Rinland", valor: 36, color: VINO },
  { etiqueta: "María Claudia Palomo", valor: 36, color: VINO },
  { etiqueta: "José Rogelio Gantuz", valor: 21, color: VINO },
  { etiqueta: "Octavio Paulo Barolo", valor: 19, color: VINO },
  { etiqueta: "Carlos Alberto Vanella", valor: 19, color: VINO },
  { etiqueta: "Leonardo G. Giunta Larrañaga", valor: 18, color: VINO },
  { etiqueta: "Emanuel Sebastián Paz", valor: 17, color: VINO },
];
