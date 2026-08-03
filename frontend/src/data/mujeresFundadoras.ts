// Contenido del informe "Las mujeres que fundan empresas en Mendoza". A
// diferencia de los informes de nicho sectorial, este no recorta la base por
// rubro sino que mira toda la base (33.694 personas, 62.201 vínculos) a
// través de una sola variable -- género inferido por nombre de pila, ver
// Metodología en la página. Por eso no hay ENTIDADES/sociedadId/personaId
// acá: es agregados puros, sin referencia a sociedades o personas puntuales
// (y el propio pedido de este informe es evitar nombrar personas en el
// ranking de fundadoras, ver TOP_MUJERES más abajo).

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const GRIS_CLARO = "#c9c9c9";

export const PANORAMA = [
  { etiqueta: "Mujeres", valor: 10264, color: VINO },
  { etiqueta: "Varones", valor: 22328, color: CARBON_SUAVE },
  { etiqueta: "No clasificable", valor: 1102, color: GRIS_CLARO },
];

// Comparativo mujeres/hombres por categoría, de a pares (barra de mujeres +
// barra de hombres) para que la brecha se vea directamente en la diferencia
// de altura -- ver LEYENDA_GENERO. "Hombres" es el complemento (100% -
// %mujeres): no hay desagregado de "no clasificable" a este nivel de detalle
// (solo existe para el panorama general, por persona), así que ese ~3% queda
// incluido ahí; se aclara en la página. Solo la barra de mujeres lleva
// etiqueta en el eje X (etiquetaEje) para no duplicar texto por par.
export const ROLES_DECISION = [
  { etiqueta: "Socio/a — Mujeres", etiquetaEje: "Socio/a", valor: 27.9, color: VINO },
  { etiqueta: "Socio/a — Hombres", etiquetaEje: "", valor: 72.1, color: CARBON_SUAVE },
  { etiqueta: "Roles de decisión — Mujeres", etiquetaEje: "Roles de decisión", valor: 21.2, color: VINO },
  { etiqueta: "Roles de decisión — Hombres", etiquetaEje: "", valor: 78.8, color: CARBON_SUAVE },
  { etiqueta: "Apoderado/a — Mujeres", etiquetaEje: "Apoderado/a", valor: 20.9, color: VINO },
  { etiqueta: "Apoderado/a — Hombres", etiquetaEje: "", valor: 79.1, color: CARBON_SUAVE },
  { etiqueta: "Fiscalización — Mujeres", etiquetaEje: "Fiscalización", valor: 19.4, color: VINO },
  { etiqueta: "Fiscalización — Hombres", etiquetaEje: "", valor: 80.6, color: CARBON_SUAVE },
];

export const LEYENDA_GENERO = [
  { color: VINO, etiqueta: "Mujeres" },
  { color: CARBON_SUAVE, etiqueta: "Hombres" },
];

export const TITULAR_SUPLENTE = [
  { etiqueta: "Admin. Titular", valor: 22.2, color: VINO },
  { etiqueta: "Admin. Suplente", valor: 36.6, color: CARBON_SUAVE },
  { etiqueta: "Gerente Titular", valor: 21.9, color: VINO },
  { etiqueta: "Gerente Suplente", valor: 36.8, color: CARBON_SUAVE },
  { etiqueta: "Director Titular", valor: 15.5, color: VINO },
  { etiqueta: "Director Suplente", valor: 31.9, color: CARBON_SUAVE },
];

export const LEYENDA_TITULAR_SUPLENTE = [
  { color: VINO, etiqueta: "Titular" },
  { color: CARBON_SUAVE, etiqueta: "Suplente" },
];

// Mismo criterio de a pares que ROLES_DECISION -- ver LEYENDA_GENERO.
export const EVOLUCION_ANUAL = [
  { etiqueta: "2017 — Mujeres", etiquetaEje: "2017", valor: 28.3, color: VINO },
  { etiqueta: "2017 — Hombres", etiquetaEje: "", valor: 71.7, color: CARBON_SUAVE },
  { etiqueta: "2018 — Mujeres", etiquetaEje: "2018", valor: 27.3, color: VINO },
  { etiqueta: "2018 — Hombres", etiquetaEje: "", valor: 72.7, color: CARBON_SUAVE },
  { etiqueta: "2019 — Mujeres", etiquetaEje: "2019", valor: 28.0, color: VINO },
  { etiqueta: "2019 — Hombres", etiquetaEje: "", valor: 72.0, color: CARBON_SUAVE },
  { etiqueta: "2020 — Mujeres", etiquetaEje: "2020", valor: 25.9, color: VINO },
  { etiqueta: "2020 — Hombres", etiquetaEje: "", valor: 74.1, color: CARBON_SUAVE },
  { etiqueta: "2021 — Mujeres", etiquetaEje: "2021", valor: 26.0, color: VINO },
  { etiqueta: "2021 — Hombres", etiquetaEje: "", valor: 74.0, color: CARBON_SUAVE },
  { etiqueta: "2022 — Mujeres", etiquetaEje: "2022", valor: 28.7, color: VINO },
  { etiqueta: "2022 — Hombres", etiquetaEje: "", valor: 71.3, color: CARBON_SUAVE },
  { etiqueta: "2023 — Mujeres", etiquetaEje: "2023", valor: 29.1, color: VINO },
  { etiqueta: "2023 — Hombres", etiquetaEje: "", valor: 70.9, color: CARBON_SUAVE },
  { etiqueta: "2024 — Mujeres", etiquetaEje: "2024", valor: 27.4, color: VINO },
  { etiqueta: "2024 — Hombres", etiquetaEje: "", valor: 72.6, color: CARBON_SUAVE },
  { etiqueta: "2025 — Mujeres", etiquetaEje: "2025", valor: 27.7, color: VINO },
  { etiqueta: "2025 — Hombres", etiquetaEje: "", valor: 72.3, color: CARBON_SUAVE },
  { etiqueta: "2026* — Mujeres", etiquetaEje: "2026*", valor: 29.7, color: VINO },
  { etiqueta: "2026* — Hombres", etiquetaEje: "", valor: 70.3, color: CARBON_SUAVE },
];

export const FUNDADORAS_SERIALES = [
  { etiqueta: "Mujeres", valor: 14.4, color: VINO },
  { etiqueta: "Varones", valor: 20.9, color: CARBON_SUAVE },
];

// Sin nombre a propósito -- ver punto 4 del pedido: se mantiene la profesión
// declarada y la cantidad de sociedades, se omite la identidad.
export const TOP_MUJERES = [
  { profesion: "Empleada", sociedades: 26 },
  { profesion: "Empresaria", sociedades: 15 },
  { profesion: "Contador público nacional", sociedades: 11 },
];
