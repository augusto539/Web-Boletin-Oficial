// Copia server-side de frontend/src/data/mujeresFundadoras.ts, mismo
// criterio que el resto de backend/src/data/*.ts: el backend no importa del
// workspace frontend, así que este contenido se duplica acá para el HTML
// server-rendered de SEO (ver seo.ts). A diferencia de los informes de
// nicho, acá no hay Map ni conversión de forma -- son los mismos arrays
// planos que ya usa el frontend, sin ENTIDADES/sociedadId/personaId (ver
// nota completa en el archivo del frontend).

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const GRIS_CLARO = "#c9c9c9";

export const PANORAMA = [
  { etiqueta: "Mujeres", valor: 10264, color: VINO },
  { etiqueta: "Varones", valor: 22328, color: CARBON_SUAVE },
  { etiqueta: "No clasificable", valor: 1102, color: GRIS_CLARO },
];

export const ROLES_DECISION = [
  { etiqueta: "Socio/a", valor: 27.9 },
  { etiqueta: "Roles de decisión", valor: 21.2 },
  { etiqueta: "Apoderado/a", valor: 20.9 },
  { etiqueta: "Fiscalización", valor: 19.4 },
];

export const TITULAR_SUPLENTE = [
  { etiqueta: "Admin. Titular", valor: 22.2, color: VINO },
  { etiqueta: "Admin. Suplente", valor: 36.6, color: CARBON_SUAVE },
  { etiqueta: "Gerente Titular", valor: 21.9, color: VINO },
  { etiqueta: "Gerente Suplente", valor: 36.8, color: CARBON_SUAVE },
  { etiqueta: "Director Titular", valor: 15.5, color: VINO },
  { etiqueta: "Director Suplente", valor: 31.9, color: CARBON_SUAVE },
];

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 28.3 },
  { etiqueta: "2018", valor: 27.3 },
  { etiqueta: "2019", valor: 28.0 },
  { etiqueta: "2020", valor: 25.9 },
  { etiqueta: "2021", valor: 26.0 },
  { etiqueta: "2022", valor: 28.7 },
  { etiqueta: "2023", valor: 29.1 },
  { etiqueta: "2024", valor: 27.4 },
  { etiqueta: "2025", valor: 27.7 },
  { etiqueta: "2026*", valor: 29.7 },
];

export const FUNDADORAS_SERIALES = [
  { etiqueta: "Mujeres", valor: 14.4, color: VINO },
  { etiqueta: "Varones", valor: 20.9, color: CARBON_SUAVE },
];

export const TOP_MUJERES = [
  { profesion: "Empleada", sociedades: 26 },
  { profesion: "Empresaria", sociedades: 15 },
  { profesion: "Contador público nacional", sociedades: 11 },
];
