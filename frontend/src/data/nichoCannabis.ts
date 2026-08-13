// Agregados curados a mano del informe "Cannabis y Cáñamo en Mendoza". El
// directorio de entidades (nombre/CUIT/capital/socios) ya NO vive acá — se
// resuelve en vivo contra la base vía GET /api/informes/nicho/cannabis (ver
// backend/src/informesNicho.ts e InformeNichoCannabis.tsx), para que una
// sociedad/persona marcada oculta desde el panel de admin deje de aparecer
// en este informe. Ver docs/plan_centralizar_habeas_data.md.

export const EVOLUCION_ANUAL = [
  { etiqueta: "2021", valor: 6 },
  { etiqueta: "2022", valor: 2 },
  { etiqueta: "2023", valor: 3 },
  { etiqueta: "2024", valor: 5 },
  { etiqueta: "2025", valor: 6 },
  { etiqueta: "2026*", valor: 5 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 16 },
  { tipo: "Asociación Civil", cantidad: 4 },
  { tipo: "S.R.L.", cantidad: 3 },
  { tipo: "S.A.", cantidad: 4 },
];

export const DEPARTAMENTOS_CANNABIS = new Map<string, number>([
  ["Capital", 9],
  ["Luján de Cuyo", 5],
  ["San Rafael", 2],
  ["San Martín", 2],
  ["Las Heras", 2],
  ["Guaymallén", 2],
  ["Lavalle", 1],
  ["General Alvear", 1],
  ["Godoy Cruz", 1],
]);
