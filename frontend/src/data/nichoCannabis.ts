// Contenido del informe "Cannabis y Cáñamo en Mendoza", primero de la serie
// de nichos sectoriales. A diferencia de /informes/departamentos-mas-activos
// y /informes/anuario-*, este informe no sale de una tabla precomputada: el
// texto y las cifras vienen ya redactados/calculados a mano (ver
// docs/pendientes.md sobre el criterio acordado para esta serie) y se
// integran acá como contenido estático, con los mismos componentes de
// gráfico y la misma sección de metodología que el resto de /informes.
//
// sociedadId/personaId: cada entidad y cada socio se cruzó a mano contra la
// base (por CUIT donde había, por los vínculos reales de la sociedad para
// los socios) — ver la sesión donde se agregó este cruce. Enlazan a las
// fichas /sociedad/:id y /persona/:id ya existentes en el sitio.

export interface SocioCannabis {
  nombre: string;
  personaId: number;
}

export interface EntidadCannabis {
  tipo: string;
  nombre: string;
  sociedadId: number;
  cuit: string | null;
  capital: string | null;
  publicacion: string;
  departamento: string | null;
  socios: SocioCannabis[];
  objetoSocial: string;
  nombreGenerico?: boolean;
}

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

export const SOCIOS_REPETIDOS = [
  { nombre: "Mario Gustavo Paez Ozan", veces: 2 },
  { nombre: "Gustavo Andrés Paez Cabrera", veces: 2 },
  { nombre: "Claudia Vanina Moreno", veces: 2 },
  { nombre: "Oscar Matías Scafetti", veces: 2 },
  { nombre: "Tomás Horacio Garignani Colombi", veces: 2 },
  { nombre: "Augusto Nevio Antonelli Pol", veces: 2 },
];

export const ENTIDADES: EntidadCannabis[] = [
  {
    tipo: "S.A.S.",
    nombre: "Cannabafl S.A.S.",
    sociedadId: 6701,
    cuit: null,
    capital: "$60.000",
    publicacion: "19/05/2021",
    departamento: "Capital",
    socios: [
      { nombre: "Alejandro Daniel Romero Funar", personaId: 5335 },
      { nombre: "Mariano Nicolás Ledesma", personaId: 12050 },
    ],
    objetoSocial: "Creación, producción, fabricación, transformación, industrialización, comercialización, importación y exportación de bienes y servicios en actividades agropecuarias, comunicaciones, industrias manufactureras, tecnologías, gastronomía, inmobiliarias, inversoras y otras permitidas.",
    nombreGenerico: true,
  },
  {
    tipo: "S.A.S.",
    nombre: "Thc Soluciones S.A.S.",
    sociedadId: 6720,
    cuit: "30-71739734-3",
    capital: "$43.200",
    publicacion: "20/05/2021",
    departamento: "Capital",
    socios: [
      { nombre: "Kevin Joel García", personaId: 14001 },
      { nombre: "Pablo Daniel Gil", personaId: 14000 },
    ],
    objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales y prestación de servicios relacionados con agropecuarias, comunicaciones, industrias manufactureras, culturales, tecnologías, gastronomía, inmobiliarias, inversoras, petroleras, salud y transporte.",
    nombreGenerico: true,
  },
  {
    tipo: "S.A.S.",
    nombre: "Cannahope S.A.S.",
    sociedadId: 7420,
    cuit: "30-71736785-1",
    capital: "$100.000",
    publicacion: "21/09/2021",
    departamento: "Capital",
    socios: [
      { nombre: "Daniel Eduardo Gaido", personaId: 15317 },
      { nombre: "Fernando Aníbal Saicha", personaId: 15319 },
      { nombre: "Rolando Millenaar", personaId: 15318 },
    ],
    objetoSocial: "Cultivo, producción, industrialización, procesamiento, comercialización y distribución de Cannabis sp y derivados con fines medicinales, terapéuticos y paliativos; importación y exportación de la planta y productos derivados; ejercicio de representaciones fiduciarias, mandatos y fideicomisos vinculados al objeto social.",
  },
  {
    tipo: "S.A.",
    nombre: "Kcbd Corp S.A.",
    sociedadId: 7712,
    cuit: "30-71745025-2",
    capital: "$20.000.000",
    publicacion: "01/11/2021",
    departamento: "Capital",
    socios: [
      { nombre: "Alfredo Luis Vila Santander", personaId: 4197 },
      { nombre: "Gerardo Daniel Gonzalez Bobillo", personaId: 15860 },
      { nombre: "Guillermo Nelson", personaId: 15859 },
      { nombre: "José Antonio Marquez", personaId: 15861 },
      { nombre: "Norma Beatriz Vázquez", personaId: 4198 },
    ],
    objetoSocial: "Cultivo y producción, industrial, comercial, servicios, maquinarias, acopio, transporte, asesoramiento, investigación e inmuebles.",
    nombreGenerico: true,
  },
  {
    tipo: "S.A.S.",
    nombre: "Cannhabilis S.A.S.",
    sociedadId: 7734,
    cuit: null,
    capital: "$60.000",
    publicacion: "03/11/2021",
    departamento: "Luján de Cuyo",
    socios: [
      { nombre: "Rodrigo Ezequiel Matamala", personaId: 11904 },
      { nombre: "Thomas Lijtenberg", personaId: 15904 },
    ],
    objetoSocial: "Comercialización, promoción, organización y realización de ferias y eventos ganaderos y agrícolas, presentación de servicios para sectores ganaderos y agrícolas, y actividad agrícola y ganadera en general.",
    nombreGenerico: true,
  },
  {
    tipo: "S.R.L.",
    nombre: "Cannacuy S.R.L.",
    sociedadId: 7800,
    cuit: "30-71759431-9",
    capital: "$1.000.000",
    publicacion: "11/11/2021",
    departamento: "San Rafael",
    socios: [
      { nombre: "Chiara Beccaria Gallostra", personaId: 15334 },
      { nombre: "María de Belén Díaz", personaId: 15331 },
      { nombre: "María Pía Gallostra Barri", personaId: 15332 },
    ],
    objetoSocial: "Actividades agrícolas.",
    nombreGenerico: true,
  },
  {
    tipo: "S.A.S.",
    nombre: "Cannabis Argentina S.A.S.",
    sociedadId: 9234,
    cuit: null,
    capital: "$100.000",
    publicacion: "21/07/2022",
    departamento: "Capital",
    socios: [
      { nombre: "Juliana Verdaguer", personaId: 18681 },
      { nombre: "Martín Ignacio Santos", personaId: 2986 },
    ],
    objetoSocial: "Cultivo y explotación de cannabis y derivados con fines científicos, medicinales y terapéuticos; producción, industrialización y comercialización; adquisición, elaboración, fabricación, transporte, almacenamiento, distribución, comercialización, importación y exportación de semillas, plantines, esquejes, plantas y recursos necesarios; elaboración de aceites y productos derivados del cannabis; compra, venta, exportación, importación de productos químicos, drogas, medicamentos; fabricación, producción, procesamiento de productos farmacéuticos; servicios de asesoría, administración, planeación, instalación, supervisión, mantenimiento y gestoría; operaciones de importación y exportación de materiales, maquinarias, licencias y diseños relacionados.",
  },
  {
    tipo: "S.A.",
    nombre: "Mendo Hemp Sociedad Anónima",
    sociedadId: 9906,
    cuit: null,
    capital: "$1.000.000",
    publicacion: "27/10/2022",
    departamento: "Luján de Cuyo",
    socios: [
      { nombre: "Fernando Joaquín Reig", personaId: 19942 },
      { nombre: "Marcos David Bort", personaId: 19944 },
      { nombre: "Oscar Matías Scafetti", personaId: 19943 },
    ],
    objetoSocial: "Cultivo de plantas y hierbas con fines científicos, medicinales y terapéuticos; producción, industrialización y comercialización; adquisición, elaboración y transporte de semillas y recursos fitosanitarios; elaboración y comercialización de aceites y productos derivados; servicios de consultoría en cultivos.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Argenetics S.A.S.",
    sociedadId: 10434,
    cuit: "30-71800264-4",
    capital: "$200.000",
    publicacion: "06/01/2023",
    departamento: null,
    socios: [
      { nombre: "Ciciliani Andres", personaId: 20902 },
      { nombre: "De Filippo Alejandro Luis", personaId: 20903 },
      { nombre: "De Filippo Valentin", personaId: 20904 },
    ],
    objetoSocial: "Producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales, incluyendo actividades agropecuarias, vitivinícolas, derivados del cannabis, transporte de carga, servicios de mandataria, desarrollo de tecnologías e investigación.",
  },
  {
    tipo: "S.A.",
    nombre: "Cchw Company Sa",
    sociedadId: 10912,
    cuit: null,
    capital: "$1.200.000",
    publicacion: "31/03/2023",
    departamento: "San Martín",
    socios: [
      { nombre: "Carlos David Gordo", personaId: 21538 },
      { nombre: "Paula Daniela Rey Sosa", personaId: 21537 },
    ],
    objetoSocial: "Creación, producción, intercambio, fabricación, transformación, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales y prestación de servicios relacionados con cultivo de cannabis y cáñamo industrial, comunicaciones, tecnologías, gastronómicas, inmobiliarias, inversoras, petroleras, salud, transporte y consultoría.",
  },
  {
    tipo: "S.A.S.",
    nombre: "The Brothers 420 S.A.S.",
    sociedadId: 12180,
    cuit: "30-71832310-6",
    capital: "$300.000",
    publicacion: "21/09/2023",
    departamento: "Godoy Cruz",
    socios: [
      { nombre: "Emiliano Alberto Bastias", personaId: 23376 },
      { nombre: "Matías Ernesto Oliva", personaId: 10298 },
    ],
    objetoSocial: "Dedicarse, por cuenta propia o ajena, o asociada a terceros, o vinculada mediante contratos asociativos o de colaboración empresaria: comercial, marketing, mandataria, logista, inmobiliaria.",
    nombreGenerico: true,
  },
  {
    tipo: "S.A.S.",
    nombre: "Mapu-Ko S.A.S.",
    sociedadId: 13938,
    cuit: "30-71867013-2",
    capital: "$1.000.000",
    publicacion: "04/06/2024",
    departamento: "Luján de Cuyo",
    socios: [
      { nombre: "Alejandro Miguel Savina", personaId: 25874 },
      { nombre: "Oscar Matías Scafetti", personaId: 19943 },
      { nombre: "Patricia Gabriela Castro", personaId: 17510 },
    ],
    objetoSocial: "Explotación agropecuaria de cultivos de fruticultura, horticultura, apicultura, forestación, cereales y cannabis; producción industrial, almacenamiento, fabricación y comercialización de productos derivados del cannabis con fines científicos, medicinales y terapéuticos; actividades inmobiliarias, constructoras, gastronómicas, hoteleras, turísticas, tecnológicas y de consultoría.",
  },
  {
    tipo: "S.A.",
    nombre: "Cañamos De Argentina",
    sociedadId: 14166,
    cuit: null,
    capital: "$1.000.000",
    publicacion: "10/07/2024",
    departamento: "Capital",
    socios: [
      { nombre: "Leandro Petruzzelli Dziubecki", personaId: 26212 },
      { nombre: "Miguel Vecino", personaId: 26211 },
    ],
    objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, importación y exportación de servicios relacionados con actividades agropecuarias, avícolas, ganaderas, pesqueras, manufactureras, culturales, educativas, gastronómicas, hoteleras, turísticas, inmobiliarias, inversoras, financieras, petroleras, gasíferas, forestales, mineras, energéticas, salud, transporte, producción de granos, verduras, frutas, cáñamo industrial, miel, aceites vegetales, aromáticas y productos agroindustriales.",
  },
  {
    tipo: "S.R.L.",
    nombre: "Origen Del Agro S.R.L.",
    sociedadId: 14838,
    cuit: null,
    capital: "$12.000.000",
    publicacion: "02/10/2024",
    departamento: "San Rafael",
    socios: [
      { nombre: "Agustin Nicolas Calvo Demuru", personaId: 27185 },
      { nombre: "Carlos Nicolas Herminio Calvo", personaId: 27184 },
    ],
    objetoSocial: "Actividades agropecuarias (agrícola, ganadera, apícola, vitivinícola, olivícola, frutícola, hortícola, cannabis medicinal), industriales, comerciales, inmobiliarias y de construcción. Elaboración, fraccionamiento, fabricación, envasado y transformación de productos agropecuarios. Comercialización, importación y exportación de productos vinculados al objeto social. Operaciones inmobiliarias, alquiler y administración de bienes.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Reyes Del Valle Sas",
    sociedadId: 14918,
    cuit: "30-71912397-6",
    capital: "$600.000",
    publicacion: "14/10/2024",
    departamento: "Capital",
    socios: [
      { nombre: "Edgardo Manuel Valles", personaId: 27304 },
    ],
    objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de servicios relacionados con actividades agropecuarias, avícolas, ganaderas, pesqueras, tamberas, vitivinícolas, comunicaciones, espectáculos, editoriales, tecnologías, gastronómicas, hoteleras, turísticas, inmobiliarias, constructoras, inversoras, financieras, fideicomiso, petroleras, gasíferas, forestales, mineras, energéticas, salud, transporte, y producción de granos, verduras, frutas, olivos, hortalizas y cáñamo industrial.",
  },
  {
    tipo: "Asociación Civil",
    nombre: "Asociacion Civil Hyper Leaf",
    sociedadId: 15127,
    cuit: null,
    capital: "$70.000",
    publicacion: "07/11/2024",
    departamento: "Luján de Cuyo",
    socios: [
      { nombre: "Augusto Nevio Antonelli Pol", personaId: 27619 },
      { nombre: "Facundo Osvaldo Sánchez Astrada", personaId: 27621 },
      { nombre: "Ivanna Mariel Chaher", personaId: 27617 },
      { nombre: "Julieta Ruth Noller", personaId: 27623 },
      { nombre: "Mauco Lucas Gil Rosas", personaId: 27622 },
      { nombre: "Santiago Javier Ávila Isol", personaId: 27620 },
      { nombre: "Tomás Horacio Garignani Colombi", personaId: 27618 },
    ],
    objetoSocial: "Promover el acceso a la salud humana integral desde un punto de vista medicinal, terapéutico y/o paliativo del dolor en el marco de los derechos reconocidos por la Ley 27.350, desarrollar acciones de promoción y prevención, investigación científica, capacitación y acceso legal a cannabis medicinal.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Mendocann Producciones S.A.S.",
    sociedadId: 15836,
    cuit: null,
    capital: "$10.000.000",
    publicacion: "26/02/2025",
    departamento: "Luján de Cuyo",
    socios: [
      { nombre: "Alexis Antonio Parada", personaId: 28613 },
      { nombre: "Augusto Nevio Antonelli Pol", personaId: 27619 },
      { nombre: "Eduardo Hugo Funes", personaId: 6668 },
      { nombre: "Juan Ricardo Millán", personaId: 28615 },
      { nombre: "Julio Manuel Funes", personaId: 6669 },
      { nombre: "Leandro Agustín Sturniolo", personaId: 28614 },
      { nombre: "Tomás Horacio Garignani Colombi", personaId: 27618 },
      { nombre: "Valentín Stradella", personaId: 13371 },
    ],
    objetoSocial: "Producción y organización de eventos, entretenimiento y espectáculos. Servicio de eventos, promociones y campañas publicitarias. Desarrollo de tecnología e informática. Actividades inmobiliarias. Participación en licitaciones y concursos. Importación y exportación de productos relacionados.",
  },
  {
    tipo: "S.R.L.",
    nombre: "Pro Cannabis Srl",
    sociedadId: 16081,
    cuit: null,
    capital: "$1.000.000",
    publicacion: "04/04/2025",
    departamento: "Las Heras",
    socios: [
      { nombre: "Cardozo Camila Lucia", personaId: 20449 },
      { nombre: "Elia Romina Lourdes Ibañez", personaId: 28942 },
      { nombre: "Juan Ignacio Ezequiel Cardozo", personaId: 28943 },
      { nombre: "Nicolas Egberto Pares Buenaventura", personaId: 28944 },
    ],
    objetoSocial: "Investigación, cultivo, producción, acopio, desarrollo, transformación, industrialización, adquisición, distribución, transporte, importación, exportación y comercialización de semillas, esporas, esquejes, extractos, fitoderivados, flores, inflorescencias, biomasa y productos de organismos vegetales y fungi.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Scandinavian Cañamos Y Cannabis S.A.S.",
    sociedadId: 17361,
    cuit: "30-71916533-4",
    capital: "$50.000.000",
    publicacion: "25/09/2025",
    departamento: "Guaymallén",
    socios: [
      { nombre: "Patricia Elibeth Bravo", personaId: 5862 },
      { nombre: "Victoria Florencia Bistolfi", personaId: 11192 },
    ],
    objetoSocial: "Cannabis medicinal: compra y venta de semillas, simientes, genotipos, cualquier material vegetal y derivados del cannabis medicinal y del cáñamo industrial, sujetándolas estrictamente a los objetivos y alcances previstos en las Leyes 27.350 y 27.669. Actividades agropecuarias, ganaderas, vitivinícolas, manufactura, culturales, educativas, tecnología, investigación, innovación, software, comerciales, gastronómicas, hoteleras, turísticas, inversoras, financieras, fideicomisos, forestales, energéticas y transporte privado.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Andina Hemp Solution Sas",
    sociedadId: 17470,
    cuit: null,
    capital: "$10.000.000",
    publicacion: "08/10/2025",
    departamento: "San Martín",
    socios: [
      { nombre: "Cereda Agustina Belen", personaId: 30870 },
      { nombre: "Espejo Pablo Emiliano", personaId: 30869 },
      { nombre: "Franco Martin Rufeil", personaId: 30868 },
      { nombre: "Santiago Felipe Llaver", personaId: 29515 },
    ],
    objetoSocial: "Multiplicación y cultivo, industrialización, servicios logísticos, producción de derivados, comercialización y/o distribución de cannabis con fines medicinales o industriales autorizadas por ley.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Cannacorp Internacional S.A.S.",
    sociedadId: 17646,
    cuit: null,
    capital: "$1.000.000",
    publicacion: "29/10/2025",
    departamento: "Guaymallén",
    socios: [
      { nombre: "Claudia Vanina Moreno", personaId: 31104 },
      { nombre: "Gustavo Andrés Paez Cabrera", personaId: 21497 },
      { nombre: "Mario Gustavo Paez Ozan", personaId: 21496 },
    ],
    objetoSocial: "Intercambio, comercialización, intermediación, representación, importación y exportación de bienes y servicios relacionados con adquisición, cultivo, elaboración, producción, distribución, comercialización de material vegetal de Cannabis sativa con fines medicinales e industriales, investigación científica, información, promoción de derechos a la salud, desarrollos tecnológicos y acciones de capacitación profesional.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Genesis Biocann Sas",
    sociedadId: 18077,
    cuit: null,
    capital: "$2.000.000",
    publicacion: "29/12/2025",
    departamento: "Las Heras",
    socios: [
      { nombre: "Fernando Adrián Mastrantonio", personaId: 31643 },
      { nombre: "Leandro Eloy Mastrantonio", personaId: 25086 },
      { nombre: "Pablo Daniel Mastrantonio", personaId: 31644 },
    ],
    objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes y servicios. Desarrollo integral de actividades lícitas vinculadas a la cadena de valor del cannabis medicinal, cáñamo industrial y cáñamo hortícola conforme leyes nacionales y provincales.",
  },
  {
    tipo: "Asociación Civil",
    nombre: "Asociacion Civil Mendocann",
    sociedadId: 18227,
    cuit: "30-71835614-4",
    capital: null,
    publicacion: "23/01/2026",
    departamento: null,
    socios: [],
    objetoSocial: "(sin dato)",
  },
  {
    tipo: "S.A.S.",
    nombre: "Cumbre Verde S.A.S.",
    sociedadId: 18712,
    cuit: null,
    capital: "$3.000.000",
    publicacion: "15/04/2026",
    departamento: "Capital",
    socios: [
      { nombre: "Diego Nahuel Herrera", personaId: 28100 },
      { nombre: "Joel Agustín Vargas", personaId: 10481 },
      { nombre: "Juan Andrés Tuninetti", personaId: 32386 },
      { nombre: "Mariana Alejandra Sánchez", personaId: 32387 },
    ],
    objetoSocial: "Cannabis medicinal y cáñamo industrial, construcción e inmobiliaria, provisión al Estado y contrataciones públicas, gastronomía, hotelería y turismo, así como operaciones bancarias y financieras.",
  },
  {
    tipo: "Asociación Civil",
    nombre: "Terracann Asociacion Civil",
    sociedadId: 18864,
    cuit: null,
    capital: "$2.000.000",
    publicacion: "28/04/2026",
    departamento: "Lavalle",
    socios: [
      { nombre: "Claudia Vanina Moreno", personaId: 31104 },
      { nombre: "Gustavo Andrés Paez Cabrera", personaId: 21497 },
      { nombre: "Hernán García Manzur", personaId: 32581 },
      { nombre: "Mario Gustavo Paez Ozan", personaId: 21496 },
      { nombre: "Sergio Ariel García", personaId: 32580 },
    ],
    objetoSocial: "Desarrollo de actividades de bien común sin fines de lucro orientadas a la promoción, protección y acompañamiento del acceso a la salud de personas que requieran cannabis con fines medicinales, terapéuticos y/o paliativos del dolor, conforme Ley Nacional N° 27.350 y Ley Provincial N° 9617.",
  },
  {
    tipo: "S.A.S.",
    nombre: "Suelo Latente S.A.S.",
    sociedadId: 18972,
    cuit: null,
    capital: "$14.000.000",
    publicacion: "11/05/2026",
    departamento: "Capital",
    socios: [
      { nombre: "Emiliano Luis Miatello", personaId: 32725 },
      { nombre: "Francisco Insua", personaId: 32724 },
      { nombre: "Germán William Aguinaga", personaId: 32721 },
      { nombre: "Joaquín Covas", personaId: 32722 },
      { nombre: "Marco Durany Mechulan", personaId: 32723 },
      { nombre: "Santiago Nicolás Rodríguez", personaId: 32727 },
      { nombre: "Yoel Nicolás Rigo Herrera", personaId: 32726 },
    ],
    objetoSocial: "Agropecuarias, avícolas, ganaderas, pesqueras, tamberas y vitivinícolas; comunicaciones, espectáculos, editoriales y gráficas; culturales y educativas; desarrollo de tecnologías, investigación e innovación y software; inmobiliarias y constructoras; salud y servicios médicos; producción y cultivo de cannabis medicinal y cáñamo; investigación y desarrollo; industrialización y comercialización; servicios conexos logísticos y de asistencia técnica.",
  },
  {
    tipo: "Asociación Civil",
    nombre: "Eirene Cannabica Asociacion Civil",
    sociedadId: 19179,
    cuit: null,
    capital: "$11.000.000",
    publicacion: "04/06/2026",
    departamento: "General Alvear",
    socios: [
      { nombre: "Adriano Giantino Poggio", personaId: 33058 },
      { nombre: "Ezequiel Matias Lentz", personaId: 33054 },
      { nombre: "Franco Gaetano Poggio", personaId: 33056 },
      { nombre: "Genaro Poggio", personaId: 33057 },
      { nombre: "Ivo Santino Bistolfi", personaId: 33052 },
      { nombre: "Julio Javier Bistolfi", personaId: 11189 },
      { nombre: "Leonardo Roman Bistolfi", personaId: 11191 },
      { nombre: "María del Pilar Esplandiu", personaId: 33053 },
      { nombre: "María Lujan Bistolfi", personaId: 11193 },
      { nombre: "Simón Salma Agostina", personaId: 33051 },
      { nombre: "Tatiana Magali Olivera", personaId: 33055 },
    ],
    objetoSocial: "Promover, desarrollar, investigar, asistir, formar y acompañar integralmente a personas, equipos de salud, instituciones y organizaciones en relación con el uso terapéutico, medicinal y/o paliativo del cannabis y sus derivados conforme lo establezca la normativa vigente, garantizando el derecho a la salud integral y el acceso equitativo a tratamientos seguros y eficaces.",
  },
];
