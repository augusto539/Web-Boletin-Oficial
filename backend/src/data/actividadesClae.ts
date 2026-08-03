// Copia server-side de frontend/src/data/actividadesClae.ts, mismo criterio
// que el resto de backend/src/data/*.ts: el backend no importa del workspace
// frontend, así que este contenido se duplica acá para el HTML
// server-rendered de SEO (ver seo.ts). Son los mismos arrays planos, sin
// ENTIDADES/sociedadId -- ver la nota completa en el archivo del frontend.
//
// Contenido del informe "Qué hacen realmente las empresas mendocinas:
// anatomía del nomenclador CLAE": la variable de corte es la clasificación
// CLAE de ARCA (25.583 asignaciones sobre 11.918 sociedades), no un rubro.

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const VERDE = "#5f7a61";
const TEJA = "#b0473f";

export const RESIDUALES = [
  { etiqueta: "Categorías n.c.p. (residuales)", valor: 10819, color: VINO },
  { etiqueta: "Categorías específicas", valor: 14764, color: CARBON_SUAVE },
];

// Las 10 actividades más declaradas. `ncp` marca las residuales ("no
// clasificado en otra parte") -- son 7 de 10, y colorearlas aparte es lo que
// hace visible de un vistazo el hallazgo principal del informe.
export const TOP_ACTIVIDADES = [
  { codigo: "829900", actividad: "Servicios empresariales n.c.p.", asignaciones: 672, ncp: true },
  { codigo: "492290", actividad: "Servicio de transporte automotor de cargas n.c.p.", asignaciones: 657, ncp: true },
  { codigo: "561019", actividad: "Expendio de comidas y bebidas con servicio de mesa n.c.p.", asignaciones: 475, ncp: true },
  { codigo: "410011", actividad: "Construcción, reforma y reparación de edificios residenciales", asignaciones: 459, ncp: false },
  { codigo: "702099", actividad: "Asesoramiento, dirección y gestión empresarial n.c.p.", asignaciones: 445, ncp: true },
  { codigo: "12110", actividad: "Cultivo de vid para vinificar", asignaciones: 443, ncp: false },
  { codigo: "681098", actividad: "Servicios inmobiliarios con bienes urbanos propios n.c.p.", asignaciones: 413, ncp: true },
  { codigo: "869090", actividad: "Servicios relacionados con la salud humana n.c.p.", asignaciones: 376, ncp: true },
  { codigo: "410021", actividad: "Construcción de edificios no residenciales", asignaciones: 330, ncp: false },
  { codigo: "11329", actividad: "Cultivo de bulbos, brotes, raíces y hortalizas n.c.p.", asignaciones: 316, ncp: true },
];

export const LEYENDA_NCP = [
  { color: VINO, etiqueta: "Residual (n.c.p.)" },
  { color: CARBON_SUAVE, etiqueta: "Específica" },
];

// Curva de acumulación: cuántos códigos distintos hacen falta para cubrir
// cada porcentaje del total de asignaciones.
export const COLA_LARGA = [
  { etiqueta: "10", valor: 17.9 },
  { etiqueta: "25", valor: 31.0 },
  { etiqueta: "50", valor: 45.6 },
  { etiqueta: "100", valor: 62.2 },
  { etiqueta: "200", valor: 78.0 },
  { etiqueta: "400", valor: 92.5 },
];

export const BAJAS_SITUACION = [
  { situacion: "Ninguna actividad de baja", sociedades: 10404 },
  { situacion: "Algunas actividades de baja", sociedades: 1514 },
  { situacion: "Todas las actividades de baja", sociedades: 0 },
];

export const DIVERSIFICACION = [
  { rango: "1", sociedades: 5650, pctBaja: 0.0 },
  { rango: "2-3", sociedades: 4622, pctBaja: 8.9 },
  { rango: "4-6", sociedades: 1320, pctBaja: 13.6 },
  { rango: "7 o más", sociedades: 326, pctBaja: 24.7 },
];

export const DIVERSIFICACION_GRAFICO = DIVERSIFICACION.map((d) => ({
  etiqueta: d.rango,
  valor: d.pctBaja,
  color: VINO,
}));

// Las dos tablas del informe (mayor y menor tasa de baja) fusionadas en una
// sola serie ordenada: el contraste entre extremos es el punto, y en un solo
// gráfico se lee de una vez en lugar de comparar dos tablas separadas.
export const TASA_BAJA = [
  { actividad: "Servicios personales n.c.p.", n: 297, pctBaja: 27.3, alta: true },
  { actividad: "Servicios de financiación y actividades financieras n.c.p.", n: 45, pctBaja: 26.7, alta: true },
  { actividad: "Servicios auxiliares a la intermediación financiera n.c.p.", n: 40, pctBaja: 25.0, alta: true },
  { actividad: "Venta al por mayor de fiambres y quesos", n: 51, pctBaja: 21.6, alta: true },
  { actividad: "Venta al por menor de materiales y productos de limpieza", n: 63, pctBaja: 17.5, alta: true },
  { actividad: "Servicios de consultores en informática", n: 213, pctBaja: 2.3, alta: false },
  { actividad: "Servicios de asociaciones n.c.p.", n: 137, pctBaja: 1.5, alta: false },
  { actividad: "Cultivo de vid para vinificar", n: 443, pctBaja: 1.4, alta: false },
  { actividad: "Venta al por menor de pan y productos de panadería", n: 101, pctBaja: 0.0, alta: false },
  { actividad: "Matanza de ganado bovino", n: 48, pctBaja: 0.0, alta: false },
];

export const LEYENDA_TASA_BAJA = [
  { color: TEJA, etiqueta: "Más se abandonan" },
  { color: VERDE, etiqueta: "Casi nunca se abandonan" },
];

export const TASA_BAJA_GRAFICO = TASA_BAJA.map((t) => ({
  etiqueta: t.actividad,
  valor: t.pctBaja,
  color: t.alta ? TEJA : VERDE,
}));

export const CLUSTERS = [
  { nombre: "Construcción", actividades: 178, asignaciones: 4293, nucleo: "Edificios residenciales y no residenciales, ferretería, materiales, ingeniería civil, arquitectura" },
  { nombre: "Vitivinícola y agro", actividades: 156, asignaciones: 3833, nucleo: "Cultivo de vid, elaboración de vinos, venta mayorista de vino, hortalizas, apoyo agrícola" },
  { nombre: "Gastronomía y alimentos", actividades: 144, asignaciones: 4890, nucleo: "Expendio de comidas, restaurantes, fast food, carnicerías, almacenes" },
  { nombre: "Servicios empresariales, inmobiliarios y software", actividades: 141, asignaciones: 4717, nucleo: "Servicios empresariales n.c.p., gestión empresarial, inmobiliario, consultoría informática, publicidad" },
  { nombre: "Transporte y logística", actividades: 118, asignaciones: 2410, nucleo: "Transporte de cargas, logística, alquiler de maquinaria, movimiento de suelos, apoyo minero" },
  { nombre: "Salud", actividades: 100, asignaciones: 1658, nucleo: "Servicios de salud humana, asociaciones, farmacias, cosmética, consulta médica" },
  { nombre: "Indumentaria y deportes", actividades: 57, asignaciones: 957, nucleo: "Prendas de vestir, venta por internet, indumentaria deportiva, calzado" },
  { nombre: "Automotor", actividades: 40, asignaciones: 1037, nucleo: "Repuestos, mecánica integral, venta de usados, cubiertas, combustible, chapa y pintura" },
  { nombre: "Seguridad y limpieza", actividades: 40, asignaciones: 891, nucleo: "Seguridad e investigación, limpieza de edificios, productos de limpieza" },
  { nombre: "Turismo", actividades: 20, asignaciones: 872, nucleo: "Agencias de viaje minoristas y mayoristas, transporte de pasajeros, turismo aventura" },
];

export const PARES_COOCURRENCIA = [
  { etiqueta: "Elaboración de vinos + Cultivo de vid", valor: 153, color: VINO },
  { etiqueta: "Construcción residencial + no residencial", valor: 139, color: VINO },
  { etiqueta: "Agencias de viaje minoristas + mayoristas", valor: 104, color: VINO },
  { etiqueta: "Elaboración de vinos + Venta mayorista de vino", valor: 77, color: VINO },
  { etiqueta: "Cultivo de hortalizas + Venta mayorista y empaque", valor: 63, color: VINO },
];

export const LOCALIZACION = [
  { etiqueta: "General Alvear — Cría de animales", valor: 11.26, casos: 20, color: VINO },
  { etiqueta: "Tupungato — Servicios de apoyo agrícolas", valor: 10.95, casos: 97, color: VINO },
  { etiqueta: "Tunuyán — Servicios de apoyo agrícolas", valor: 6.24, casos: 44, color: VINO },
  { etiqueta: "Tunuyán — Cultivos temporales", valor: 4.75, casos: 55, color: VINO },
  { etiqueta: "Tupungato — Cultivos temporales", valor: 4.39, casos: 64, color: VINO },
  { etiqueta: "San Carlos — Cultivos temporales", valor: 4.22, casos: 28, color: VINO },
  { etiqueta: "Rivadavia — Cultivos perennes", valor: 3.44, casos: 25, color: VINO },
  { etiqueta: "Rivadavia — Elaboración de bebidas", valor: 3.42, casos: 15, color: VINO },
  { etiqueta: "San Martín — Elaboración de bebidas", valor: 3.07, casos: 52, color: VINO },
  { etiqueta: "Capital — Servicios jurídicos", valor: 2.55, casos: 24, color: CARBON_SUAVE },
  { etiqueta: "San Rafael — Servicios de alojamiento", valor: 2.48, casos: 33, color: CARBON_SUAVE },
  { etiqueta: "Las Heras — Producción y procesamiento de carne", valor: 2.34, casos: 21, color: CARBON_SUAVE },
];

export const LEYENDA_LOCALIZACION = [
  { color: VINO, etiqueta: "Agropecuario / industrial" },
  { color: CARBON_SUAVE, etiqueta: "Servicios" },
];

// Línea de base global: 54,4% de las asignaciones son del período reciente.
// Una actividad por encima crece, por debajo se apaga -- de ahí la línea de
// referencia en el gráfico, sin la cual los porcentajes no significan nada.
export const LINEA_BASE_RECIENTE = 54.4;

export const EVOLUCION_ACTIVIDADES = [
  { etiqueta: "Elaboración de comidas preparadas para reventa", valor: 76.7, previo: 10, reciente: 33, sube: true },
  { etiqueta: "Servicios de enseñanza n.c.p.", valor: 75.0, previo: 12, reciente: 36, sube: true },
  { etiqueta: "Venta minorista de productos veterinarios y mascotas", valor: 72.7, previo: 12, reciente: 32, sube: true },
  { etiqueta: "Agencias de viaje mayoristas", valor: 72.6, previo: 32, reciente: 85, sube: true },
  { etiqueta: "Agencias de viaje minoristas", valor: 71.6, previo: 64, reciente: 161, sube: true },
  { etiqueta: "Servicios relacionados con la construcción", valor: 71.1, previo: 57, reciente: 140, sube: true },
  { etiqueta: "Servicios complementarios de apoyo turístico", valor: 69.7, previo: 46, reciente: 106, sube: true },
  { etiqueta: "Servicios de apoyo para la minería", valor: 68.1, previo: 22, reciente: 47, sube: true },
  { etiqueta: "Elaboración de vinos", valor: 44.9, previo: 157, reciente: 128, sube: false },
  { etiqueta: "Servicios de contratistas de mano de obra agrícola", valor: 41.2, previo: 50, reciente: 35, sube: false },
  { etiqueta: "Impresión, excepto diarios y revistas", valor: 40.9, previo: 26, reciente: 18, sube: false },
  { etiqueta: "Venta mayorista en comisión de productos agropecuarios", valor: 40.0, previo: 27, reciente: 18, sube: false },
  { etiqueta: "Matanza de ganado bovino", valor: 31.9, previo: 32, reciente: 15, sube: false },
  { etiqueta: "Generación de energía n.c.p.", valor: 25.6, previo: 32, reciente: 11, sube: false },
];

export const EVOLUCION_GRAFICO = EVOLUCION_ACTIVIDADES.map((e) => ({
  etiqueta: e.etiqueta,
  valor: e.valor,
  color: e.sube ? VERDE : TEJA,
}));

export const LEYENDA_EVOLUCION = [
  { color: VERDE, etiqueta: "En ascenso" },
  { color: TEJA, etiqueta: "En descenso" },
];

export const NICHOS_COBERTURA = [
  { nicho: "Cannabis", sociedades: 24, cobertura: 29.2, codigo: "Cultivo de especias y plantas aromáticas y medicinales (1 caso)" },
  { nicho: "Cripto / Fintech", sociedades: 14, cobertura: 50.0, codigo: "Servicios auxiliares a la intermediación financiera n.c.p. (1 caso)" },
  { nicho: "Reciclaje / Economía circular", sociedades: 41, cobertura: 51.2, codigo: "Recolección y tratamiento de residuos (3 casos)" },
  { nicho: "Servicios profesionales", sociedades: 46, cobertura: 58.7, codigo: "Servicios jurídicos (14 casos)" },
  { nicho: "Publicidad y contenidos", sociedades: 163, cobertura: 60.1, codigo: "Servicios de publicidad n.c.p. (35 casos)" },
  { nicho: "Energía solar y eólica", sociedades: 50, cobertura: 62.0, codigo: "Generación de energía n.c.p. (14 casos)" },
  { nicho: "Desarrollo de software", sociedades: 103, cobertura: 66.0, codigo: "Consultores en informática y programas (19 casos)" },
  { nicho: "Bodegas boutique", sociedades: 63, cobertura: 66.7, codigo: "Elaboración de vinos (15 casos)" },
  { nicho: "Cerveza artesanal", sociedades: 36, cobertura: 66.7, codigo: "Elaboración de cerveza, bebidas malteadas y malta (10 casos)" },
  { nicho: "Arquitectura", sociedades: 27, cobertura: 70.4, codigo: "Arquitectura e ingeniería y asesoramiento técnico (9 casos)" },
  { nicho: "Café de especialidad", sociedades: 42, cobertura: 73.8, codigo: "Expendio de comidas y bebidas con servicio de mesa (12 casos)" },
];

export const NICHOS_GRAFICO = NICHOS_COBERTURA.map((n) => ({
  etiqueta: n.nicho,
  valor: n.cobertura,
  // Debajo del 55% el nomenclador básicamente no ve el rubro: es el umbral
  // que separa los nichos que justificaron un informe propio del resto.
  color: n.cobertura < 55 ? TEJA : VERDE,
}));

export const LEYENDA_NICHOS = [
  { color: TEJA, etiqueta: "CLAE casi no lo ve (<55%)" },
  { color: VERDE, etiqueta: "CLAE lo mapea bien" },
];

export const GRUPOS_VACIOS = [
  { grupo: "031", actividad: "Pesca y servicios de apoyo" },
  { grupo: "051 / 052", actividad: "Extracción de carbón y de lignito" },
  { grupo: "062", actividad: "Extracción de gas natural" },
  { grupo: "017", actividad: "Caza y repoblación de animales de caza" },
  { grupo: "203", actividad: "Fabricación de fibras manufacturadas" },
  { grupo: "252", actividad: "Fabricación de armas y municiones" },
  { grupo: "263", actividad: "Equipos de comunicaciones y transmisores de radio y TV" },
  { grupo: "268", actividad: "Soportes ópticos y magnéticos" },
  { grupo: "273", actividad: "Hilos y cables aislados" },
  { grupo: "302", actividad: "Locomotoras y material rodante ferroviario" },
  { grupo: "322", actividad: "Instrumentos de música" },
  { grupo: "352", actividad: "Distribución de gas por tuberías" },
  { grupo: "491 / 493", actividad: "Transporte ferroviario y por tuberías" },
  { grupo: "652 / 653", actividad: "Reaseguros y fondos de pensiones" },
  { grupo: "843", actividad: "Seguridad social obligatoria" },
  { grupo: "182", actividad: "Reproducción de grabaciones" },
];

export const COBERTURA_ANUAL = [
  { anio: "2017", sociedades: 766, conClae: 374, cobertura: 48.8 },
  { anio: "2018", sociedades: 1502, conClae: 781, cobertura: 52.0 },
  { anio: "2019", sociedades: 1818, conClae: 1117, cobertura: 61.4 },
  { anio: "2020", sociedades: 1731, conClae: 1113, cobertura: 64.3 },
  { anio: "2021", sociedades: 2143, conClae: 1413, cobertura: 65.9 },
  { anio: "2022", sociedades: 2189, conClae: 1456, cobertura: 66.5 },
  { anio: "2023", sociedades: 2383, conClae: 1608, cobertura: 67.5 },
  { anio: "2024", sociedades: 2418, conClae: 1609, cobertura: 66.5 },
  { anio: "2025", sociedades: 2329, conClae: 1577, cobertura: 67.7 },
  { anio: "2026*", sociedades: 1396, conClae: 459, cobertura: 32.9 },
];

export const COBERTURA_ANUAL_GRAFICO = COBERTURA_ANUAL.map((c) => ({
  etiqueta: c.anio,
  valor: c.cobertura,
}));

export const TOP_ACTIVIDADES_GRAFICO = TOP_ACTIVIDADES.map((a) => ({
  etiqueta: a.actividad,
  valor: a.asignaciones,
  color: a.ncp ? VINO : CARBON_SUAVE,
}));

export { VINO, CARBON_SUAVE, VERDE, TEJA };
