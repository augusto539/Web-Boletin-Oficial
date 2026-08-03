// Copia server-side de frontend/src/data/analisisRedes.ts, mismo criterio que
// el resto de backend/src/data/*.ts: el backend no importa del workspace
// frontend, así que este contenido se duplica acá para el HTML
// server-rendered de SEO (ver seo.ts). Ver la nota completa en el archivo del
// frontend.
//
// Contenido del informe "El mapa oculto de las sociedades mendocinas": mira la
// FORMA del registro societario completo modelado como grafo (62.201 vínculos,
// 19.563 sociedades, 33.694 personas), no un rubro puntual. El ranking de
// betweenness usa las 10 personas del gráfico original (la tabla del documento
// fuente solo listaba 7).

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const VERDE = "#5f7a61";
const TEJA = "#b0473f";

export const ESTRUCTURA_G1 = [
  { concepto: "Nodos (personas + sociedades)", valor: "52.056" },
  { concepto: "Aristas (vínculos, colapsando roles múltiples entre el mismo par)", valor: "42.953" },
  { concepto: "Componentes conexas", valor: "12.004" },
  { concepto: "Componente gigante", valor: "1.618 nodos — 3,1%" },
  { concepto: "Mediana de tamaño de componente", valor: "3 nodos" },
  { concepto: "Componentes de 3 nodos o menos", valor: "7.695 (64%)" },
];

export const ESCENARIOS = [
  { escenario: "A. Solo persona-sociedad", componentes: "12.004", gigante: 3.1, nodos: "1.618" },
  { escenario: "B. + domicilios (normalizador corregido)", componentes: "10.169", gigante: 18.9, nodos: "10.210" },
  { escenario: "C. + domicilios, sin excluir barrios privados ni rutas", componentes: "10.038", gigante: 20.0, nodos: "12.573" },
];

// El escenario C se colorea distinto: no es un resultado, es la advertencia
// metodológica (infla la componente gigante con puentes que no existen).
export const ESCENARIOS_GRAFICO = [
  { etiqueta: "A. Solo persona-sociedad", valor: 3.1, color: CARBON_SUAVE },
  { etiqueta: "B. + domicilios (corregido)", valor: 18.9, color: VINO },
  { etiqueta: "C. + domicilios, sin excluir", valor: 20.0, color: TEJA },
];

export const LEYENDA_ESCENARIOS = [
  { color: VINO, etiqueta: "Medición válida" },
  { color: CARBON_SUAVE, etiqueta: "Sin domicilios" },
  { color: TEJA, etiqueta: "Inflado (no usar)" },
];

export const ANIOS_EVOLUCION = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];

// Gráfico 1 del análisis original. Dos series sobre el mismo eje: la de
// domicilios es la que salta en 2022, la societaria pura nunca despega -- ese
// contraste ES el hallazgo, por eso van juntas y no en dos gráficos.
export const SERIES_EVOLUCION = [
  {
    nombre: "G2 — societario + domicilio",
    color: VINO,
    valores: [1.2, 1.3, 2.5, 2.3, 3.2, 10.2, 12.4, 16.0, 17.5, 18.6],
  },
  {
    nombre: "G1 — societario puro",
    color: CARBON_SUAVE,
    valores: [0.9, 0.8, 0.7, 0.6, 0.8, 1.1, 1.1, 1.8, 3.0, 3.1],
  },
];

// Índice 5 = 2022, el año del quiebre (3,2% → 10,2%).
export const QUIEBRE_2022 = { indice: 5, etiqueta: "2022: quiebre" };

export const EVOLUCION_TABLA = ANIOS_EVOLUCION.map((anio, i) => ({
  anio,
  g1: SERIES_EVOLUCION[1]!.valores[i]!,
  g2: SERIES_EVOLUCION[0]!.valores[i]!,
}));

// Gráfico 2 del análisis original: top 10 por centralidad de intermediación,
// ya filtrado a personas (las sociedades grandes aparecían como "puente" por
// puro artefacto bipartito -- ver la compuerta de validación del informe).
export const BETWEENNESS_TOP10 = [
  { etiqueta: "Gonzalo Agustín Innocenti", etiquetaSecundaria: "ingeniero industrial", valor: 0.368, color: VINO },
  { etiqueta: "Matías Demián Benegas", etiquetaSecundaria: "comerciante", valor: 0.365, color: VINO },
  { etiqueta: "Martín Salassa", etiquetaSecundaria: "emprendedor", valor: 0.364, color: VINO },
  { etiqueta: "Leonardo Jose Andreu", etiquetaSecundaria: "abogado", valor: 0.355, color: VINO },
  { etiqueta: "Mauricio Oscar Moreno", etiquetaSecundaria: "emprendedor", valor: 0.351, color: VINO },
  { etiqueta: "Eugenio Sebastián Oliveri", etiquetaSecundaria: "ingeniero industrial", valor: 0.346, color: VINO },
  { etiqueta: "Francisco Agustín Ortega", etiquetaSecundaria: "contador público", valor: 0.346, color: VINO },
  { etiqueta: "Germán Carlos Griffouliere", etiquetaSecundaria: "empresario", valor: 0.342, color: VINO },
  { etiqueta: "Ignacio Nahuel Yunes Leon", etiquetaSecundaria: "contador", valor: 0.333, color: VINO },
  { etiqueta: "Lara Juan Bautista", etiquetaSecundaria: "ingeniero industrial", valor: 0.326, color: VINO },
];

export const FUNDADORES_EMBARCA = [
  { publico: "Gonzalo Innocenti", enLaBase: "Gonzalo Agustín Innocenti, ingeniero industrial — Socio y Gerente Suplente" },
  { publico: "Valentina Terranova", enLaBase: "Valentina Terranova, emprendedora — Socio y Gerente Titular" },
  { publico: "Belén Fernández", enLaBase: "María Belén Fernández, docente — Socio" },
];

// Gráfico 3 del análisis original: el k-core máximo (=7) del grafo G2. Las 15
// sociedades comparten los mismos 3 directores titulares, los mismos 3
// síndicos titulares y el mismo domicilio. El informe fuente nombra a los
// directores pero no a los síndicos, así que estos van identificados por su
// rol en vez de inventarles un nombre.
const SOCIEDADES_HOLDING = [
  "Allen", "Auquinco", "Butaco", "Calbuco", "Collico", "Kuar", "Kuntur", "Kunuk",
  "Liuco", "Nahuen", "Nauco", "Petrehué", "Trancurá", "Xetiu", "Yelap",
];

const PERSONAS_HOLDING = [
  "Guiñazú Fader",
  "Japaz",
  "Magistocchi",
  "Síndico 1",
  "Síndico 2",
  "Síndico 3",
];

const DOMICILIO_HOLDING = "Patricias Mendocinas 1285";

export const HOLDING_NODOS = [
  ...SOCIEDADES_HOLDING.map((n) => ({ id: `soc-${n}`, etiqueta: n, tipo: "sociedad" as const })),
  ...PERSONAS_HOLDING.map((n) => ({ id: `per-${n}`, etiqueta: n, tipo: "persona" as const })),
  { id: "dom", etiqueta: DOMICILIO_HOLDING, tipo: "domicilio" as const },
];

// Cada sociedad se conecta con las seis personas y con el domicilio: es
// justamente esa repetición sin variación lo que produce un k-core tan denso.
export const HOLDING_ARISTAS = SOCIEDADES_HOLDING.flatMap((s) => [
  ...PERSONAS_HOLDING.map((p) => ({ origen: `soc-${s}`, destino: `per-${p}` })),
  { origen: `soc-${s}`, destino: "dom" },
]);

export const LEYENDA_HOLDING = [
  { color: VINO, etiqueta: 'Sociedad (15 "… Energía S.A.")' },
  { color: VERDE, etiqueta: "Persona (directores / síndicos)" },
  { color: TEJA, etiqueta: "Domicilio compartido" },
];

export const PARES_NICHOS = [
  { etiqueta: "Enoturismo ↔ Bodegas Boutique", valor: 33, color: VINO },
  { etiqueta: "Publicidad/Contenidos ↔ Software", valor: 11, color: VINO },
  { etiqueta: "Cannabis ↔ Publicidad/Contenidos", valor: 8, color: TEJA },
  { etiqueta: "Reciclaje ↔ Domicilios Hub", valor: 7, color: VINO },
];

export const LEYENDA_PARES_NICHOS = [
  { color: VINO, etiqueta: "Cruce genuino" },
  { color: TEJA, etiqueta: "Falso cruce (misma sociedad)" },
];

export { VINO, CARBON_SUAVE, VERDE, TEJA };
