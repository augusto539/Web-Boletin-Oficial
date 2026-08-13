// Contenido del informe "Agencias de viajes en Mendoza". Metodología de
// cruce (CUIT primero, normalizar_nombre() como fallback, "parece sociedad"
// por regex para decidir si un socio se busca en sociedades o
// personas_fisicas) documentada en detalle en nichoSoftware.ts y
// nichoServiciosProfesionales.ts -- mismo criterio acá. Las 168 agencias
// resolvieron por CUIT/nombre sin ambigüedad, y los 337 socios/integrantes
// (con el marcador de "sin dato" del documento fuente descartado, no
// tratado como nombre de socio) resolvieron 100%.
// Directorio completo NO vive acá -- ver backend/src/data/nichoAgenciasViajes.ts
// (ENTIDADES) y backend/src/informesNicho.ts: se resuelve en vivo contra la
// base para que "oculta" se respete (ver docs/plan_centralizar_habeas_data.md).

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const GRIS_CLARO = "#c9c9c9";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 3 },
  { etiqueta: "2018", valor: 3 },
  { etiqueta: "2019", valor: 14 },
  { etiqueta: "2020", valor: 8 },
  { etiqueta: "2021", valor: 16 },
  { etiqueta: "2022", valor: 21 },
  { etiqueta: "2023", valor: 40 },
  { etiqueta: "2024", valor: 29 },
  { etiqueta: "2025", valor: 27 },
  { etiqueta: "2026*", valor: 5 },
];

export const TIPO_CLAE_DONA = [
  { etiqueta: "Minorista", valor: 143, color: VINO },
  { etiqueta: "Mayorista", valor: 25, color: CARBON_SUAVE },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 149 },
  { tipo: "S.A.", cantidad: 13 },
  { tipo: "S.R.L.", cantidad: 6 },
];

export const PERFIL_SOCIETARIO_DONA = [
  { etiqueta: "S.A.S.", valor: 149, color: VINO },
  { etiqueta: "S.A.", valor: 13, color: CARBON_SUAVE },
  { etiqueta: "S.R.L.", valor: 6, color: GRIS_CLARO },
];

export const DEPARTAMENTOS_AGENCIAS_VIAJES = new Map<string, number>([
  ["Capital", 56],
  ["Luján de Cuyo", 26],
  ["Guaymallén", 25],
  ["Maipú", 23],
  ["Godoy Cruz", 13],
  ["Las Heras", 6],
  ["San Martín", 5],
  ["Tunuyán", 4],
  ["Rivadavia", 2],
  ["San Rafael", 2],
  ["General Alvear", 1],
]);
