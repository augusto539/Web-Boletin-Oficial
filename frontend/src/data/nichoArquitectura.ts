// Contenido del informe "Arquitectura en Mendoza". Metodología de cruce
// (CUIT primero, normalizar_nombre() como fallback, "parece sociedad" por
// regex para decidir si un socio se busca en sociedades o personas_fisicas)
// documentada en detalle en nichoSoftware.ts y nichoServiciosProfesionales.ts
// -- mismo criterio acá. Único socio sin link: "Juan Gabriel Sanchez" (en
// Liendo Arquitectos S.A.), dos personas reales distintas en la base
// (ids 7339 y 36246) sin CUIT/DNI en la fuente para desambiguar.

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const GRIS_CLARO = "#c9c9c9";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2018", valor: 1 },
  { etiqueta: "2019", valor: 4 },
  { etiqueta: "2020", valor: 2 },
  { etiqueta: "2021", valor: 4 },
  { etiqueta: "2022", valor: 1 },
  { etiqueta: "2023", valor: 4 },
  { etiqueta: "2024", valor: 5 },
  { etiqueta: "2025", valor: 2 },
  { etiqueta: "2026*", valor: 3 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 22 },
  { tipo: "S.R.L.", cantidad: 3 },
  { tipo: "S.A.", cantidad: 2 },
];

export const PERFIL_SOCIETARIO_DONA = [
  { etiqueta: "S.A.S.", valor: 22, color: VINO },
  { etiqueta: "S.R.L.", valor: 3, color: CARBON_SUAVE },
  { etiqueta: "S.A.", valor: 2, color: GRIS_CLARO },
];

export const ECOSISTEMA_PROFESIONES = [
  { etiqueta: "Ingeniero (todas las especialidades)", valor: 1465 },
  { etiqueta: "Contador/a", valor: 952 },
  { etiqueta: "Abogado/a", valor: 770 },
  { etiqueta: "Arquitecto/a", valor: 464, color: VINO },
];

export const DEPARTAMENTOS_ARQUITECTURA = new Map<string, number>([
  ["Capital", 7],
  ["Guaymallén", 5],
  ["Luján de Cuyo", 4],
  ["San Martín", 3],
  ["Godoy Cruz", 2],
  ["General Alvear", 2],
  ["Tupungato", 1],
  ["Maipú", 1],
  ["Rivadavia", 1],
  ["San Carlos", 1],
]);
