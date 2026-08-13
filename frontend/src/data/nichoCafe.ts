// Contenido del informe "Café de especialidad en Mendoza". Metodología de
// cruce (CUIT primero, normalizar_nombre() como fallback, "parece sociedad"
// por regex para decidir si un socio se busca en sociedades o
// personas_fisicas) documentada en detalle en nichoSoftware.ts y
// nichoServiciosProfesionales.ts -- mismo criterio acá. Único socio sin
// link: "Edgardo Omar Dosio" (en Winning Coffee S.A.), dos personas reales
// distintas en la base (ids 1245 y 6272) sin CUIT/DNI en la fuente para
// desambiguar. Caso de duplicado en el Boletín detectado en la fuente
// (Cafeteria Tina S.A.S., publicada dos veces con 8 días de diferencia,
// mismo socio y capital): se cuenta una sola vez acá, como en el informe.

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 2 },
  { etiqueta: "2018", valor: 1 },
  { etiqueta: "2019", valor: 2 },
  { etiqueta: "2020", valor: 4 },
  { etiqueta: "2021", valor: 6 },
  { etiqueta: "2022", valor: 7 },
  { etiqueta: "2023", valor: 6 },
  { etiqueta: "2024", valor: 5 },
  { etiqueta: "2025", valor: 5 },
  { etiqueta: "2026*", valor: 3 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 34 },
  { tipo: "S.A.", cantidad: 5 },
  { tipo: "S.R.L.", cantidad: 3 },
];

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const GRIS_CLARO = "#c9c9c9";

export const PERFIL_SOCIETARIO_DONA = [
  { etiqueta: "S.A.S.", valor: 34, color: VINO },
  { etiqueta: "S.A.", valor: 5, color: CARBON_SUAVE },
  { etiqueta: "S.R.L.", valor: 3, color: GRIS_CLARO },
];

export const DEPARTAMENTOS_CAFE = new Map<string, number>([
  ["Capital", 11],
  ["Godoy Cruz", 6],
  ["Maipú", 5],
  ["San Rafael", 5],
  ["Guaymallén", 4],
  ["Las Heras", 3],
  ["Luján de Cuyo", 3],
  ["San Martín", 2],
]);
