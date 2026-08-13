// Contenido del informe "Servicios de fideicomisos en Mendoza". Metodología
// de cruce (CUIT primero, normalizar_nombre() como fallback, "parece
// sociedad" por regex para decidir si un socio se busca en sociedades o
// personas_fisicas) documentada en detalle en nichoSoftware.ts y
// nichoServiciosProfesionales.ts -- mismo criterio acá. Las 63 sociedades
// resolvieron por CUIT/nombre sin ambigüedad, y los 140 socios/integrantes
// resolvieron 100% (desambiguando tocayos por vínculo real con la sociedad
// del caso, no solo por nombre).

export const EVOLUCION_ANUAL = [
  { etiqueta: "2018", valor: 10 },
  { etiqueta: "2019", valor: 6 },
  { etiqueta: "2020", valor: 7 },
  { etiqueta: "2021", valor: 4 },
  { etiqueta: "2022", valor: 6 },
  { etiqueta: "2023", valor: 7 },
  { etiqueta: "2024", valor: 8 },
  { etiqueta: "2025", valor: 13 },
  { etiqueta: "2026*", valor: 2 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 56 },
  { tipo: "S.A.", cantidad: 7 },
];

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";

export const PERFIL_SOCIETARIO_DONA = [
  { etiqueta: "S.A.S.", valor: 56, color: VINO },
  { etiqueta: "S.A.", valor: 7, color: CARBON_SUAVE },
];

export const DEPARTAMENTOS_FIDEICOMISOS = new Map<string, number>([
  ["Capital", 19],
  ["Luján de Cuyo", 14],
  ["Godoy Cruz", 11],
  ["Guaymallén", 5],
  ["San Rafael", 4],
  ["Maipú", 4],
  ["Las Heras", 2],
  ["Lavalle", 1],
  ["General Alvear", 1],
  ["Tunuyán", 1],
]);
