// Contenido del informe "Seguridad privada en Mendoza". Metodología de
// cruce (CUIT primero, normalizar_nombre() como fallback, "parece sociedad"
// por regex para decidir si un socio se busca en sociedades o
// personas_fisicas) documentada en detalle en nichoAgenciasViajes.ts -- mismo
// criterio acá. Las 136 empresas resolvieron por CUIT/nombre sin ambigüedad,
// y los 239 socios/integrantes resolvieron 100%.
// Directorio completo NO vive acá -- ver backend/src/data/nichoSeguridadPrivada.ts
// (ENTIDADES) y backend/src/informesNicho.ts: se resuelve en vivo contra la
// base para que "oculta" se respete (ver docs/plan_centralizar_habeas_data.md).

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const GRIS_CLARO = "#c9c9c9";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 7 },
  { etiqueta: "2018", valor: 9 },
  { etiqueta: "2019", valor: 15 },
  { etiqueta: "2020", valor: 13 },
  { etiqueta: "2021", valor: 13 },
  { etiqueta: "2022", valor: 16 },
  { etiqueta: "2023", valor: 13 },
  { etiqueta: "2024", valor: 21 },
  { etiqueta: "2025", valor: 21 },
  { etiqueta: "2026*", valor: 3 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 109 },
  { tipo: "S.A.", cantidad: 17 },
  { tipo: "S.R.L.", cantidad: 10 },
];

export const PERFIL_SOCIETARIO_DONA = [
  { etiqueta: "S.A.S.", valor: 109, color: VINO },
  { etiqueta: "S.A.", valor: 17, color: CARBON_SUAVE },
  { etiqueta: "S.R.L.", valor: 10, color: GRIS_CLARO },
];

export const DEPARTAMENTOS_SEGURIDAD_PRIVADA = new Map<string, number>([
  ["Capital", 32],
  ["Guaymallén", 32],
  ["Godoy Cruz", 19],
  ["San Martín", 9],
  ["Las Heras", 8],
  ["Maipú", 6],
  ["Luján de Cuyo", 6],
  ["Junín", 6],
  ["San Rafael", 5],
  ["Tunuyán", 3],
  ["General Alvear", 2],
  ["Tupungato", 1],
  ["Lavalle", 1],
]);
