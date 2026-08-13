// Contenido del informe "Cerveza Artesanal en Mendoza". Metodología de
// cruce (CUIT primero, normalizar_nombre() como fallback, "parece sociedad"
// por regex para decidir si un socio se busca en sociedades o
// personas_fisicas) documentada en detalle en nichoSoftware.ts y
// nichoServiciosProfesionales.ts -- mismo criterio acá. Cruce resultó
// perfecto: las 36 entidades y los 89 socios únicos resolvieron sin ningún
// caso ambiguo. La Asociación Cámara Mendocina de Cervecerías Artesanales
// (Asoc. Civil) no tiene CUIT/capital/publicación/objeto social capturados
// en la fuente -- son null, no datos faltantes por error de cruce.

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 6 },
  { etiqueta: "2018", valor: 11 },
  { etiqueta: "2019", valor: 9 },
  { etiqueta: "2020", valor: 4 },
  { etiqueta: "2021", valor: 1 },
  { etiqueta: "2022", valor: 1 },
  { etiqueta: "2023", valor: 3 },
  { etiqueta: "2024", valor: 0 },
  { etiqueta: "2025", valor: 0 },
  { etiqueta: "2026*", valor: 0 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 22 },
  { tipo: "S.R.L.", cantidad: 7 },
  { tipo: "S.A.", cantidad: 6 },
  { tipo: "Asociación Civil", cantidad: 1 },
];

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const GRIS_CLARO = "#c9c9c9";
const TEJA = "#b0473f";

export const PERFIL_SOCIETARIO_DONA = [
  { etiqueta: "S.A.S.", valor: 22, color: VINO },
  { etiqueta: "S.R.L.", valor: 7, color: CARBON_SUAVE },
  { etiqueta: "S.A.", valor: 6, color: GRIS_CLARO },
  { etiqueta: "Asociación Civil", valor: 1, color: TEJA },
];

export const DEPARTAMENTOS_CERVEZA = new Map<string, number>([
  ["Capital", 9],
  ["Godoy Cruz", 8],
  ["Guaymallén", 5],
  ["Rivadavia", 3],
  ["Las Heras", 2],
  ["San Rafael", 2],
  ["San Martín", 2],
  ["Maipú", 2],
  ["Junín", 1],
  ["Luján de Cuyo", 1],
]);
