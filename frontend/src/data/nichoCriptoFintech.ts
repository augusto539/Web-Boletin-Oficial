// Contenido del informe "Cripto y fintech en Mendoza", quinto de la serie de
// nichos sectoriales. Mismo criterio que los cuatro anteriores: texto y
// cifras redactados a mano a partir del documento fuente, integrados acá
// como contenido estático.
//
// sociedadId/personaId: las 14 entidades y sus socios se cruzaron a mano
// contra la base (por CUIT donde había, por nombre normalizado donde no) —
// las 14 calzaron exacto. A diferencia del informe de Energía renovable,
// acá ningún socio es persona jurídica: los 32 socios/integrantes del
// directorio son todos personas físicas con ficha propia.
//
// Todas las tablas del documento fuente (evolución anual, tipo societario,
// departamentos, capital) calzaron exactas contra el directorio y la base
// real — no hizo falta corregir ningún valor.

export interface SocioCripto {
  nombre: string;
  personaId?: number;
  sociedadId?: number;
}

export interface EntidadCripto {
  tipo: string;
  nombre: string;
  sociedadId: number;
  cuit: string | null;
  capital: string | null;
  publicacion: string | null;
  departamento: string | null;
  socios: SocioCripto[];
  objetoSocial: string;
}

const VINO = "#691824";
const GRIS_TENUE = "#b9b9b9";
const VINO_CLARO = "#8a2433";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2020", valor: 3, color: VINO },
  { etiqueta: "2021", valor: 4, color: VINO },
  { etiqueta: "2022", valor: 2, color: VINO },
  { etiqueta: "2023", valor: 0, color: GRIS_TENUE },
  { etiqueta: "2024", valor: 1, color: VINO_CLARO },
  { etiqueta: "2025", valor: 3, color: VINO_CLARO },
  { etiqueta: "2026*", valor: 1, color: VINO_CLARO },
];

export const LEYENDA_EVOLUCION = [
  { color: VINO, etiqueta: "Boom 2020–2021 y resaca (2022)" },
  { color: GRIS_TENUE, etiqueta: "Crypto winter (2023)" },
  { color: VINO_CLARO, etiqueta: "Recuperación / ETF (2024–2026)" },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.", cantidad: 6 },
  { tipo: "S.A.S.", cantidad: 6 },
  { tipo: "S.R.L.", cantidad: 2 },
];

export const DEPARTAMENTOS_CRIPTO = new Map<string, number>([
  ["Capital", 8],
  ["Godoy Cruz", 3],
  ["San Rafael", 2],
  ["Luján de Cuyo", 1],
]);

export const ENTIDADES: EntidadCripto[] = [
  {
    tipo: "S.A.S.",
    nombre: "Bitmonedero S.A.S.",
    sociedadId: 4440,
    cuit: "30-71684158-4",
    capital: "$40.000",
    publicacion: "26/02/2020",
    departamento: "San Rafael",
    socios: [
      { nombre: "Daniel Ricardo Rodríguez", personaId: 9513 },
      { nombre: "Gustavo Germán Gómez", personaId: 9514 },
    ],
    objetoSocial:
      "Servicios informáticos para compraventa, resguardo, depósito, retiro y envío de criptomonedas y dinero digital; constructora; comercial; actividades agropecuarias; actividades financieras.",
  },
  {
    tipo: "S.A.",
    nombre: "Pmsa Capitales S.A.",
    sociedadId: 5497,
    cuit: "30-71695025-1",
    capital: "$100.000",
    publicacion: "15/10/2020",
    departamento: "Godoy Cruz",
    socios: [
      { nombre: "Cesar Armando Perez", personaId: 11631 },
      { nombre: "Lemis Asenjo Vasquez", personaId: 11633 },
      { nombre: "Manuel Manzur", personaId: 11630 },
      { nombre: "Martín Diego Saal", personaId: 11632 },
    ],
    objetoSocial:
      "Actividades comerciales de bienes informáticos, tokens y activos digitales; servicios de intermediación, pagos y operaciones financieras; mandataria de cobranzas y transferencias; inversora en participaciones y valores mobiliarios.",
  },
  {
    tipo: "S.A.",
    nombre: "Bc Digital S.A.",
    sociedadId: 5575,
    cuit: null,
    capital: "$400.000",
    publicacion: "29/10/2020",
    departamento: "Capital",
    socios: [
      { nombre: "Agustín Eduardo Frúgoli", personaId: 11797 },
      { nombre: "Gonzalo Pérez Cuesta Ortega", personaId: 11795 },
      { nombre: "Jonathan Ary Karzovnik", personaId: 1003 },
      { nombre: "Jorge Ernesto Pérez Cuesta", personaId: 11796 },
      { nombre: "Jorge Ignacio Pérez Cuesta Toso", personaId: 11798 },
      { nombre: "Luis Emilio Abrego", personaId: 11799 },
    ],
    objetoSocial:
      "Actividades de inversión de fondos en la República Argentina y exterior; plataforma electrónica de pago y fintech; billetera virtual; servicios de computación y procesamiento de datos; tarjetas de crédito/débito; préstamos y créditos; recaudación de tributos; operaciones con títulos públicos y privados; comercialización de seguros; consultoría tecnológica; fiduciaria (excepto fideicomisos financieros); mandatos lícitos; licitaciones.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Vdg S.A.S.",
    sociedadId: 6882,
    cuit: "30-71750585-5",
    capital: "$200.000",
    publicacion: "25/06/2021",
    departamento: "Capital",
    socios: [
      { nombre: "Diego Martin Navarro", personaId: 14290 },
      { nombre: "Valentín Fuentes Garcia", personaId: 4210 },
    ],
    objetoSocial:
      "Desarrollo, importación, exportación, venta, marketing y comercialización de servicios de software de cadena de bloques; consultoría en tecnología de información; capacitación en cadena de bloques y criptoactivos; minería de criptomonedas; inversión en negocios relacionados con monedas virtuales.",
  },
  {
    tipo: "S.R.L.",
    nombre: "Bull Investment S.R.L.",
    sociedadId: 7207,
    cuit: null,
    capital: "$800.000",
    publicacion: "18/08/2021",
    departamento: "Capital",
    socios: [
      { nombre: "Balladores Agustin Nicolas", personaId: 14923 },
      { nombre: "Carlos Mauro Llopiz", personaId: 8648 },
      { nombre: "Giorgis Bruno Dario", personaId: 14924 },
      { nombre: "Rodrigo Daniel Rivero", personaId: 3248 },
    ],
    objetoSocial:
      "Gestión de cobranzas, compra, venta e intermediación de servicios y bienes electrónicos e informáticos; procesamiento e intercambio electrónico de datos, tokens y bienes digitales; generación de criptomonedas; inversión y gestión de negocios relacionados con monedas virtuales.",
  },
  {
    tipo: "S.A.",
    nombre: "Dos 56 Sa",
    sociedadId: 7308,
    cuit: null,
    capital: "$1.000.000",
    publicacion: "01/09/2021",
    departamento: "Capital",
    socios: [
      { nombre: "Agustina Marchessi", personaId: 15102 },
      { nombre: "Alberto Francisco Conti", personaId: 15100 },
      { nombre: "Eugenio Marchessi", personaId: 15101 },
      { nombre: "Héctor Horacio Marchessi", personaId: 653 },
    ],
    objetoSocial:
      "Compra, venta, alquiler, distribución, fabricación, importación, exportación de software y sistemas informáticos; intermediación de servicios digitales, criptomonedas; inversiones en bienes muebles e inmuebles; minería de criptomonedas; desarrollo de equipos de computación.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Cryptofx Sas",
    sociedadId: 7717,
    cuit: null,
    capital: "$102.000",
    publicacion: "02/11/2021",
    departamento: "San Rafael",
    socios: [
      { nombre: "Álvaro Izquierdo", personaId: 15868 },
      { nombre: "Lautaro Francisco Corazza Becerra", personaId: 15867 },
      { nombre: "Lautaro Ramiro Bianchi Riveros", personaId: 15865 },
      { nombre: "Mariano Nicanor Izquierdo", personaId: 15869 },
      { nombre: "Nicolás Gimenez Lifona", personaId: 15864 },
      { nombre: "Valentín Albornoz", personaId: 15866 },
    ],
    objetoSocial:
      "Generación de criptomonedas mediante minería informática, inversión, gestión, intermediación, compraventa y explotación de negocio relacionado con monedas virtuales o criptomonedas.",
  },
  {
    tipo: "S.A.",
    nombre: "Uvank Sociedad Anonima",
    sociedadId: 8719,
    cuit: null,
    capital: "$1.500.000",
    publicacion: "27/04/2022",
    departamento: "Capital",
    socios: [
      { nombre: "Fernando Ariel Porreta", personaId: 393 },
      { nombre: "Fernando Gabriel Jauregui Gomez", personaId: 17722 },
      { nombre: "Luca Porretta", personaId: 10628 },
    ],
    objetoSocial:
      "Actividades de inversión de fondos; servicios de pagos y billetera virtual; transferencias electrónicas; servicios de computación y software; importación y exportación; operación de tarjetas de crédito/débito; agrupación de pagos; préstamos y créditos; recaudación de tributos; operaciones financieras; comercialización de seguros; publicidad digital; consultoría tecnológica; desarrollo de inteligencia artificial; actuación como fiduciaria y mandataria; licitaciones; administración de cajeros automáticos; sistemas de compensación electrónica.",
  },
  {
    tipo: "S.R.L.",
    nombre: "Orien Sam S.R.L.",
    sociedadId: 8855,
    cuit: "30-71767811-3",
    capital: "$150.000",
    publicacion: "19/05/2022",
    departamento: "Godoy Cruz",
    socios: [
      { nombre: "Chaves Lorkovic Melina Paola", personaId: 17974 },
      { nombre: "Fernandez Diego Jose", personaId: 17975 },
    ],
    objetoSocial:
      "Servicios financieros de criptomonedas (trading y minería); hotelería; marketing; transporte, hospedaje y excursiones turísticas.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Simple Payments Sas",
    sociedadId: 15438,
    cuit: "30-71887963-5",
    capital: "$70.000",
    publicacion: "17/12/2024",
    departamento: "Capital",
    socios: [
      { nombre: "Guillermo Javier Kozub", personaId: 28062 },
      { nombre: "Mariano Daniel Gurrieri", personaId: 10231 },
      { nombre: "Romina Soledad Cuevas", personaId: 28061 },
    ],
    objetoSocial:
      "Desarrollo de tecnologías, investigación e innovación y software; pagos y cobranzas en general; desarrollo, implementación y comercialización de sistemas o medios de pago; servicios de provisión de pagos (PSP) y actividades relacionadas con transferencias electrónicas.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Arbitrading Mdz Sas",
    sociedadId: 16301,
    cuit: "30-71901382-8",
    capital: "$24.000.000",
    publicacion: "09/05/2025",
    departamento: "Godoy Cruz",
    socios: [
      { nombre: "Pablo Andrés Cocucci", personaId: 29243 },
      { nombre: "Pablo Antonio Cocucci", personaId: 3347 },
    ],
    objetoSocial:
      "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales y prestación de servicios relacionados con actividades comerciales, informáticas, mandatos y representaciones, inmobiliarias, financieras, fideicomisos, servicios con activos virtuales, consultoría y auditoría.",
  },
  {
    tipo: "S.A.",
    nombre: "Tokenhaus Sociedad Anonima",
    sociedadId: 16387,
    cuit: null,
    capital: "$2.000.000",
    publicacion: "21/05/2025",
    departamento: "Luján de Cuyo",
    socios: [
      { nombre: "Alvaro Oyonarte", personaId: 29363 },
      { nombre: "Jorge Luis Oyonarte", personaId: 15441 },
    ],
    objetoSocial:
      "Agropecuaria; Industrial; Inmobiliarias; Transporte Fiduciaria; Mandataria; Inversiones Financieras; Inversiones Inmobiliarias; Tecnología Blockchain; Consultoría y Asesoramiento; Participación en Sociedades; Comercial.",
  },
  {
    tipo: "S.A.",
    nombre: "SDM S.A.",
    sociedadId: 17237,
    cuit: null,
    capital: "$30.000.000",
    publicacion: "12/09/2025",
    departamento: "Capital",
    socios: [
      { nombre: "Pablo Miguel Morales", personaId: 30546 },
      { nombre: "Sergio Dante Marroquín", personaId: 30545 },
    ],
    objetoSocial:
      "Servicio de comercio electrónico y su consultoría. Desarrollo, comercialización y custodia de productos software, web 2, web 3, activos digitales o virtuales. Publicidad, marketing y comercialización de marca. Construcción y desarrollo inmobiliario: adquisición, venta, permuta, arrendamiento, administración y explotación de bienes inmuebles. Construcción, refacción, remodelación, ampliación y demolición de edificaciones.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Evio Access S.A.S.",
    sociedadId: 18402,
    cuit: "30-71937380-8",
    capital: "$1.200.000",
    publicacion: "19/02/2026",
    departamento: "Capital",
    socios: [
      { nombre: "Agustín Brizuela Sturzenegger", personaId: 32018 },
      { nombre: "German Hidalgo Yanzon", personaId: 17592 },
      { nombre: "Guillermo Federico Baker", personaId: 32019 },
    ],
    objetoSocial:
      "Explotación de plataformas web, gestión de medios de pagos electrónicos, servicios de desarrollo, comercialización de bienes y servicios a través de plataformas digitales, servicios inmobiliarios, inversora, financiera y fideicomisos.",
  },
];
