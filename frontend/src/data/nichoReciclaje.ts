// Contenido del informe "Reciclaje y economía circular en Mendoza". Metodología
// de cruce (CUIT primero, normalizar_nombre() como fallback, "parece sociedad"
// por regex para decidir si un socio se busca en sociedades o
// personas_fisicas) documentada en detalle en nichoSoftware.ts y
// nichoServiciosProfesionales.ts -- mismo criterio acá. Socios sin link: un
// caso de nombre ambiguo (Jorge Luis Garofalo, dos personas reales en la
// base) y tres socios jurídicos que no están registrados como sociedad en
// el Boletín (Construcciones Electromecánicas Del Oeste S.A. y Tecnologías
// Y Servicios Ambientales S.A., las dos partes de la Unión Transitoria; y
// Recyclart S.A., socio de Gea Gestión Ambiental Mendoza) -- se dejan como
// texto plano, sin link, en vez de asumir un match.

export interface SocioReciclaje {
  nombre: string;
  personaId?: number;
  sociedadId?: number;
}

export interface EntidadReciclaje {
  tipo: string;
  nombre: string;
  sociedadId: number;
  cuit: string | null;
  capital: string | null;
  publicacion: string | null;
  departamento: string | null;
  socios: SocioReciclaje[];
  objetoSocial: string | null;
}

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 27 },
  { tipo: "S.A.", cantidad: 10 },
  { tipo: "S.R.L.", cantidad: 2 },
  { tipo: "Cooperativa", cantidad: 1 },
  { tipo: "Unión Transitoria", cantidad: 1 },
];

const VINO = "#691824";
const CARBON_SUAVE = "#4b5259";
const GRIS_CLARO = "#c9c9c9";
const TEJA = "#b0473f";
const OCRE = "#a6873a";

export const PERFIL_SOCIETARIO_DONA = [
  { etiqueta: "S.A.S.", valor: 27, color: VINO },
  { etiqueta: "S.A.", valor: 10, color: CARBON_SUAVE },
  { etiqueta: "S.R.L.", valor: 2, color: GRIS_CLARO },
  { etiqueta: "Cooperativa", valor: 1, color: TEJA },
  { etiqueta: "Unión Transitoria", valor: 1, color: OCRE },
];

export const OLEADAS = [
  { periodo: "2018-2020", plasticos: 4, metales: 3, ambiental: 10 },
  { periodo: "2021-2023", plasticos: 0, metales: 7, ambiental: 7 },
  { periodo: "2024-2026", plasticos: 1, metales: 0, ambiental: 6 },
];

export const OLEADAS_LEYENDA = [
  { color: VINO, etiqueta: "Plásticos" },
  { color: CARBON_SUAVE, etiqueta: "Chatarra/Metales" },
  { color: TEJA, etiqueta: "Ambiental/consultoría/otros" },
];

// Mismo patrón de barras agrupadas que PANORAMA_POR_ROL en
// mujeresFundadoras.ts: cada período son tres barras (una por subrubro),
// pero solo la del medio lleva el texto del período en el eje X para no
// repetirlo tres veces.
export const OLEADAS_BARRAS = OLEADAS.flatMap((o) => [
  { etiqueta: `${o.periodo} — Plásticos`, etiquetaEje: "", valor: o.plasticos, color: VINO },
  { etiqueta: `${o.periodo} — Chatarra/Metales`, etiquetaEje: o.periodo, valor: o.metales, color: CARBON_SUAVE },
  { etiqueta: `${o.periodo} — Ambiental/consultoría/otros`, etiquetaEje: "", valor: o.ambiental, color: TEJA },
]);

export const TOP_CAPITALES = [
  { etiqueta: "Transformación Estratégica Circular S.A. (2024)", valor: 60000000, color: VINO },
  { etiqueta: "Trigenus S.A. (2023)", valor: 4500000 },
  { etiqueta: "Palcriva Estrategias Integrales S.A.S. (2025)", valor: 3000000 },
  { etiqueta: "Hibrida S.R.L. (2019)", valor: 3500000 },
  { etiqueta: "Norplast S.A.S. (2018)", valor: 2000000 },
  { etiqueta: "Junín Punto Limpio S.A.U. (2021)", valor: 2000000 },
];

export const DEPARTAMENTOS_RECICLAJE = new Map<string, number>([
  ["Capital", 11],
  ["Guaymallén", 10],
  ["Godoy Cruz", 7],
  ["Luján de Cuyo", 4],
  ["Las Heras", 2],
  ["San Rafael", 2],
  ["Junín", 1],
  ["Maipú", 1],
  ["Malargüe", 1],
]);

export const ENTIDADES: EntidadReciclaje[] = [
  { tipo: "S.A.S.", nombre: "Norplast S.A.S.", sociedadId: 1590, cuit: "33-71621220-9", capital: "$2.000.000", publicacion: "11/07/2018", departamento: "Capital", socios: [{ nombre: "Analía Mercado", personaId: 3590 }, { nombre: "Juan Manuel Norton Mercado", personaId: 3591 }, { nombre: "Sofía Norton Mercado", personaId: 3592 }], objetoSocial: "Creación, producción, fabricación, transformación, comercialización, importación y exportación de bienes materiales e inmateriales y prestación de servicios relacionados con plásticos, reciclaje, tecnologías, gastronomía, inmobiliaria, energía y actividades agropecuarias." },
  { tipo: "S.R.L.", nombre: "Tecno Reciclados S.R.L.", sociedadId: 1617, cuit: "33-71792761-9", capital: "$100.000", publicacion: "19/07/2018", departamento: "Godoy Cruz", socios: [{ nombre: "Fernando Nicolás Banchini", personaId: 3644 }, { nombre: "Víctor Santiago Banchini", personaId: 3645 }], objetoSocial: "Comercialización de cartuchos, tonners y similares reciclados; reciclado y recarga de cartuchos; distribución de productos; inversión inmobiliaria; construcción; explotaciones agropecuarias; operaciones financieras; mandato y representación." },
  { tipo: "S.A.S.", nombre: "Omega Technology S.A.S.", sociedadId: 1979, cuit: "30-71785665-8", capital: "$100.000", publicacion: "26/09/2018", departamento: "Capital", socios: [{ nombre: "Maricel Nuri Blanco", personaId: 4419 }, { nombre: "Ricardo Horacio Videla", personaId: 4418 }], objetoSocial: "Servicios relacionados con el tratamiento de residuos peligrosos: tratamiento, recuperación y disposición final de residuos peligrosos, producción y comercialización de productos químicos y biológicos, servicios analíticos y asesorías. También ejercer mandatos lícitos, representación de franquicias, concesiones y sucursales de otras empresas para venta, representación, distribución y comercialización de productos o servicios." },
  { tipo: "S.A.", nombre: "Vld Hierros S.A.", sociedadId: 2218, cuit: null, capital: "$100.000", publicacion: "16/11/2018", departamento: "Luján de Cuyo", socios: [{ nombre: "Gonzalo Luis Perez Cuvit", personaId: 4882 }, { nombre: "Verónica Luján Delponti", personaId: 4881 }], objetoSocial: "Comercialización de materiales reciclables, actividades accesorias, actos jurídicos, adquisiciones, inversiones y actividades bancarias, transporte y distribución, exportación e importación." },
  { tipo: "S.A.", nombre: "Daco Recicladora S.A.", sociedadId: 2640, cuit: null, capital: "$1.600.000", publicacion: "26/02/2019", departamento: "Godoy Cruz", socios: [{ nombre: "Hugo Marcelo La Via", personaId: 5784 }, { nombre: "Julio Dagoberto Sosa", personaId: 5785 }], objetoSocial: "Comercial, importación y exportación, y mandatos, por cuenta propia, de terceros o asociada a terceros, personas físicas o jurídicas, en el país o en el extranjero." },
  { tipo: "S.A.S.", nombre: "Lm Reciclajes Cuyanos S.A.S.", sociedadId: 2922, cuit: null, capital: "$80.000", publicacion: "25/04/2019", departamento: "Guaymallén", socios: [{ nombre: "Lidia Miriam Beatriz Ortiz", personaId: 6377 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales y prestación de servicios. Actividades comerciales, importación-exportación y mandatos lucrativos." },
  { tipo: "S.A.S.", nombre: "Madera Plastica S.A.S.", sociedadId: 2923, cuit: null, capital: "$30.000", publicacion: "25/04/2019", departamento: "Capital", socios: [{ nombre: "Carlos Ernesto Arce", personaId: 6381 }, { nombre: "Leonardo Damian Cano", personaId: 6380 }, { nombre: "Pio Mauricio De Amoriza", personaId: 6379 }], objetoSocial: "Comercialización de productos plásticos mediante reciclado de residuos plásticos, comercialización de insumos para actividad vitivinícola, transformación de materiales plásticos, acopiación y consultoría en reciclado, sustentabilidad e impacto ambiental; importación y exportación de maquinarias e insumos." },
  { tipo: "S.A.S.", nombre: "Ecociclar S.A.S.", sociedadId: 2955, cuit: "30-71649685-2", capital: "$100.000", publicacion: "06/05/2019", departamento: "Capital", socios: [{ nombre: "Alejandro Federico Llopiz", personaId: 6447 }, { nombre: "Sabrina Verónica Herrera Camsen", personaId: 6448 }], objetoSocial: "Recolección, tratamiento, gestión y comercialización de materiales reciclables inertes; construcción; actividades comerciales; inmobiliaria; servicios; actividad fiduciaria." },
  { tipo: "S.A.S.", nombre: "Recicladora Genesis Sas", sociedadId: 3090, cuit: "30-71659826-4", capital: "$480.000", publicacion: "29/05/2019", departamento: "Las Heras", socios: [{ nombre: "Franco Salvador Alderisi", personaId: 6755 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales relacionados con comercialización de materiales ferrosos y no ferrosos, reciclaje y fraccionamiento." },
  { tipo: "S.R.L.", nombre: "Hibrida S.R.L.", sociedadId: 3222, cuit: "30-71650493-6", capital: "$3.500.000", publicacion: "25/06/2019", departamento: "Guaymallén", socios: [{ nombre: "Jorge Luis Garofalo" }, { nombre: "Santiago Jose Corti", personaId: 7011 }], objetoSocial: "Producción y comercialización de abono, compost, fertilizantes y productos agrícolas, avícolas, ganaderos, pesqueros, tamberos y vitivinícolas; importación y exportación." },
  { tipo: "S.A.S.", nombre: "Reciclados Ecologicos Americanos Sas", sociedadId: 3333, cuit: null, capital: "$480.000", publicacion: "16/07/2019", departamento: "Guaymallén", socios: [{ nombre: "Fernando Manuel Muñiz", personaId: 7242 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, comercialización, importación y exportación de bienes y servicios relacionados con comercialización de materiales ferrosos y no ferrosos, reciclaje, montaje y desmontaje de estructuras metálicas, mandatos, fiducia y operaciones financieras." },
  { tipo: "S.A.S.", nombre: "Avsa S.A.S.", sociedadId: 3874, cuit: null, capital: "$50.000", publicacion: "28/10/2019", departamento: "Godoy Cruz", socios: [{ nombre: "Aguirre María Virginia", personaId: 8336 }, { nombre: "Suarez Andrés Ariel", personaId: 8335 }], objetoSocial: "Venta de baterías y reciclajes, creación, producción, intercambio, fabricación, importación y exportación de bienes materiales, recursos naturales, actividades comerciales y mandato." },
  { tipo: "S.A.S.", nombre: "Aconcagua Reciclados Sociedad Por Acciones Simplificada", sociedadId: 4094, cuit: null, capital: "$200.000", publicacion: "06/12/2019", departamento: "Capital", socios: [{ nombre: "Albert Luis Héctor", personaId: 8804 }, { nombre: "Bochaca José Ricardo", personaId: 8803 }], objetoSocial: "Actividades industriales de transformación, manufactura y reciclado de materiales plásticos, aluminio, cartón, hierro y similares; comercialización mayorista y minorista; importación y exportación; y asesoramiento técnico." },
  { tipo: "S.A.", nombre: "Hsfgya Sociedad Anonima", sociedadId: 4518, cuit: "30-71681587-7", capital: "$300.000", publicacion: "11/03/2020", departamento: "Guaymallén", socios: [{ nombre: "Daniel Gustavo Pelleritti", personaId: 9690 }, { nombre: "Mario Fabián Pelleritti", personaId: 9689 }], objetoSocial: "Desarrollo de actividades comerciales, industriales y de licitaciones relacionadas con vidrios, sus derivados, productos y subproductos, incluyendo compra venta, alquiler, leasing, distribución, elaboración, reciclado, fabricación e industrialización." },
  { tipo: "S.A.S.", nombre: "Eco Sol Reciclados Mendoza S.A.S.", sociedadId: 4678, cuit: "30-71685983-1", capital: "$580.000", publicacion: "12/06/2020", departamento: "Maipú", socios: [{ nombre: "Juan Ramón Mirasol", personaId: 10038 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, importación y exportación de bienes y servicios en actividades comerciales, servicios, representaciones, mandatos, importación y exportación." },
  { tipo: "S.A.S.", nombre: "Tecmiplast S.A.S.", sociedadId: 4692, cuit: "30-71684579-2", capital: "$100.000", publicacion: "16/06/2020", departamento: "Guaymallén", socios: [{ nombre: "Gladys Beatriz Romero", personaId: 10070 }, { nombre: "Juan Pablo Izquierdo", personaId: 10069 }], objetoSocial: "Reciclado de residuos plásticos, procesos de triturado y agrumado, intercambio, fabricación, comercialización, importación y exportación de productos referidos a la industria del plástico." },
  { tipo: "S.A.S.", nombre: "Reciclados Diamapel Sociedad Por Acciones Simplificada", sociedadId: 5102, cuit: null, capital: "$200.000", publicacion: "19/08/2020", departamento: "San Rafael", socios: [{ nombre: "Miguel Ángel Bustos", personaId: 10862 }], objetoSocial: "Actividad de reciclado de materiales y productos; servicio de transporte de cargas; comercialización de bienes muebles, maquinarias y productos; mandatos; participación en licitaciones públicas y privadas." },
  { tipo: "S.A.S.", nombre: "Circular Carbon S.A.S.", sociedadId: 5747, cuit: "30-71700987-4", capital: "$300.000", publicacion: "24/11/2020", departamento: "Guaymallén", socios: [{ nombre: "Blejman Gabriel Aníbal", personaId: 12123 }, { nombre: "Cohen Andrés Martin", personaId: 12122 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales, servicios relacionados con actividades agropecuarias, comunicaciones, industrias manufactureras, culturales, tecnológicas, gastronómicas, inmobiliarias, inversoras, petroleras, de salud y transporte." },
  { tipo: "S.A.S.", nombre: "Recicladora Cuyana Sas", sociedadId: 5888, cuit: "30-71708345-4", capital: "$60.000", publicacion: "16/12/2020", departamento: null, socios: [{ nombre: "Jesica Melina Ikaczijk", personaId: 12404 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales y prestación de servicios relacionados con actividades agropecuarias, comunicaciones, culturales, tecnológicas, gastronómicas, inmobiliarias, financieras, petroleras, de salud y transporte." },
  { tipo: "S.A.", nombre: "Junin Punto Limpio Sociedad Anonima Unipersonal", sociedadId: 6366, cuit: "30-67205543-8", capital: "$2.000.000", publicacion: "19/03/2021", departamento: "Junín", socios: [], objetoSocial: "Investigación, desarrollo, proyección y utilización de tecnologías y energías ecológicas, renovables y sustentables; fabricación, industrialización y transformación de materiales y energías alternativas; fabricación e industrialización de tecnologías en telecomunicación; investigación y procesamiento de materiales reciclables; prestación de servicios y mantenimiento de equipos vinculados a energías renovables." },
  { tipo: "S.A.", nombre: "Ferros Vip 1888 S.A.", sociedadId: 6462, cuit: null, capital: "$300.000", publicacion: "08/04/2021", departamento: "Capital", socios: [{ nombre: "Estrada Beatriz Alejandra", personaId: 13511 }, { nombre: "Leguiza Rita Noemi", personaId: 13510 }], objetoSocial: "Recupero, compra, venta, reciclado, recolección de metales, aluminio, hierro, zinc y otros; representaciones y mandatos; servicios logísticos." },
  { tipo: "S.A.", nombre: "Recuper Flethier 42 S.A.", sociedadId: 6465, cuit: null, capital: "$400.000", publicacion: "08/04/2021", departamento: "Guaymallén", socios: [{ nombre: "Alberto Osvaldo Cardozo", personaId: 13514 }, { nombre: "Estrada Beatriz Alejandra", personaId: 13511 }], objetoSocial: "Recupero, compra, venta, reciclado y recolección de metales, aluminio, hierro, zinc y otros; representaciones y mandatos; servicios logísticos." },
  { tipo: "S.A.S.", nombre: "Kp Cartuchos E Insumos S.A.S.", sociedadId: 6772, cuit: "30-71721417-6", capital: "$100.000", publicacion: "03/06/2021", departamento: "Las Heras", socios: [{ nombre: "Piran Salinas Carla Micaela", personaId: 14088 }, { nombre: "Piran Salinas Keila Martina", personaId: 14087 }], objetoSocial: "Venta de cartuchos de tinta y toner para impresoras, insumos de computación, reciclado de toner y cartuchos, servicio y reparación de impresoras láser y chorro de tinta." },
  { tipo: "S.A.S.", nombre: "Hector Osvaldo Berrios S.A.S.", sociedadId: 6932, cuit: "33-71724105-9", capital: "$100.000", publicacion: "06/07/2021", departamento: "Godoy Cruz", socios: [{ nombre: "Alonso Gerardo Berríos", personaId: 14385 }, { nombre: "Carmen Trinidad Chiapero", personaId: 14380 }, { nombre: "Cesar Julián Berríos", personaId: 14384 }, { nombre: "Leandro Agustín Berríos", personaId: 14381 }, { nombre: "María Eugenia Berríos", personaId: 14383 }, { nombre: "Osvaldo Martín Berríos", personaId: 14382 }], objetoSocial: "Compra, clasificación, reciclado, fundición, laminado, reparación y/o refacción de metales ferrosos y no ferrosos, desperdicios y desechos metálicos y no metálicos. Compra venta y reparación de maquinaria, vehículos y repuestos. Importación y exportación de productos relacionados. Compraventa de bienes muebles e inmuebles." },
  { tipo: "S.A.S.", nombre: "Metalnegocios Reciclados Sas", sociedadId: 7769, cuit: null, capital: "$60.000", publicacion: "08/11/2021", departamento: "Godoy Cruz", socios: [{ nombre: "Gonzalo Muñoz", personaId: 15971 }, { nombre: "Mercedes Del Rosario Hidalgo", personaId: 15972 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, importación y exportación de bienes materiales e inmateriales y prestación de servicios relacionados con actividades agropecuarias, comunicaciones, manufactureras, culturales, tecnológicas, gastronómicas, inmobiliarias, inversoras, petroleras, de salud y transporte." },
  { tipo: "U.T.", nombre: "Tecnologías Y Servicios Ambientales S.A. - Construcciones Electromecánicas Del Oeste S.A. - Unión Transitoria", sociedadId: 7797, cuit: null, capital: "$500.000", publicacion: "10/11/2021", departamento: "Capital", socios: [{ nombre: "Construcciones Electromecánicas Del Oeste S.A." }, { nombre: "Tecnologías Y Servicios Ambientales S.A." }], objetoSocial: "Diseño y construcción de tres centros ambientales en los municipios de Tupungato, San Carlos y Tunuyán, Mendoza, incluyendo plantas de transferencia, separación, tratamiento, compostaje y obras complementarias." },
  { tipo: "S.A.", nombre: "Flet Ar Met 22 Sociedad Anónima", sociedadId: 8140, cuit: null, capital: "$800.000", publicacion: "29/12/2021", departamento: "Luján de Cuyo", socios: [{ nombre: "Celeste Marina Cardozo", personaId: 16642 }, { nombre: "Marcos Emanuel Cardozo", personaId: 16643 }], objetoSocial: "Comerciales; compra y venta de residuos metálicos, plásticos o de madera; representaciones y mandatos; licitaciones." },
  { tipo: "S.A.", nombre: "Cejas E Hijos Reciclados S.A.", sociedadId: 9269, cuit: null, capital: "$600.000", publicacion: "27/07/2022", departamento: "Guaymallén", socios: [{ nombre: "Exequiel Daniel Cejas", personaId: 18754 }, { nombre: "Maximiliano Adrian Cejas", personaId: 18755 }], objetoSocial: "Transporte propio y/o de terceros, logística de transporte, compra y venta de artículos reciclados (papeles, plásticos, vidrios, materiales ferrosos y no ferrosos), manufactura e industrialización, instalación de depósitos, ferias y almacenes en Mendoza y territorio argentino." },
  { tipo: "S.A.S.", nombre: "Acopios Oeste Reciclados Sas", sociedadId: 9493, cuit: "30-71777983-1", capital: "$400.000", publicacion: "30/08/2022", departamento: "Capital", socios: [{ nombre: "Albert Luis Héctor", personaId: 8804 }, { nombre: "Bochaca José Ricardo", personaId: 8803 }], objetoSocial: "Actividades industriales de transformación, manufactura, reciclado y acopio de materiales plásticos, aluminio, cartón, hierro, hojalata y chatarra; comercialización mayorista y minorista; asesoramiento técnico y consultoría." },
  { tipo: "S.A.S.", nombre: "Serviclav Sas", sociedadId: 11052, cuit: "30-71811520-1", capital: "$1.000.000", publicacion: "20/04/2023", departamento: "Capital", socios: [{ nombre: "Villalobos Godoy Mauro", personaId: 21742 }], objetoSocial: "Comercialización de material, materias primas y desechos urbanos e industriales para reciclar. Transporte de carga, mercaderías generales, fletes acarreos, mudanzas, caudales, correspondencia, encomiendas, muebles y semoviente, materias primas y elaboradas, alimenticias, equipajes, cargas en general de cualquier tipo, transporte de pasajeros y combustibles." },
  { tipo: "S.A.", nombre: "Trigenus S.A.", sociedadId: 12552, cuit: null, capital: "$4.500.000", publicacion: "09/11/2023", departamento: "Capital", socios: [{ nombre: "Julio Pablo Asnal", personaId: 23904 }, { nombre: "Maria Mercedes Casas", personaId: 23903 }, { nombre: "Paulo Roman Ghiretti", personaId: 23902 }], objetoSocial: "Prestación de servicios de procesamiento de datos, consultoría y asesoramiento relacionado al Triple Impacto y Economía Circular. Servicios industriales, comerciales, agrícolas, financieros, fideicomisos y mandatos." },
  { tipo: "S.A.S.", nombre: "F.L.F Reciclaje S.A.S", sociedadId: 12692, cuit: "30-71840822-5", capital: "$400.000", publicacion: "28/11/2023", departamento: "Guaymallén", socios: [{ nombre: "Ramirez Fernando Mario", personaId: 24088 }, { nombre: "Ramirez Leonel Sebastian", personaId: 24087 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales, y prestación de servicios relacionados con actividades agropecuarias, comunicaciones, industrias manufactureras, culturales, educativas, tecnológicas, gastronómicas, inmobiliarias, inversoras, financieras y petroleras." },
  { tipo: "S.A.S.", nombre: "Vera Reciclado Sas", sociedadId: 12707, cuit: "30-71842818-8", capital: "$500.000", publicacion: "28/11/2023", departamento: null, socios: [{ nombre: "Marcelo Javier Vera", personaId: 24110 }], objetoSocial: "Gestión integral de reciclaje, actividades comerciales, asesoramiento, mandataria, fiduciaria, licitaciones, exportadora e importadora." },
  { tipo: "S.A.S.", nombre: "Ecoquincho Sociedad Por Acciones Simplificadas", sociedadId: 14711, cuit: null, capital: "$1.000.000", publicacion: "17/09/2024", departamento: "San Rafael", socios: [{ nombre: "Cecilia Elizabeth Suarez", personaId: 26971 }, { nombre: "Gustavo Ricardo Alvarez", personaId: 26972 }], objetoSocial: "Comercialización, representación, distribución, fabricación, compra y venta de casas ecológicas y reciclado, quinchos ecológicos, productos, unidades de viviendas ecológicas. Instalaciones, mantenimientos, refacciones, mejoras, remodelaciones. Elaboración de proyectos y asesoramiento técnico. Desarrollo de tecnologías, investigación e innovación. Inmobiliarias, constructoras, inversoras, licitaciones, financieras y fideicomisos." },
  { tipo: "S.A.S.", nombre: "Gea Gestion Ambiental Mendoza", sociedadId: 14788, cuit: null, capital: "$600.000", publicacion: "26/09/2024", departamento: "Luján de Cuyo", socios: [{ nombre: "Cecilia Camila Payeras", personaId: 27092 }, { nombre: "Diego Pérez Cuvit", personaId: 27093 }, { nombre: "María Florencia Benedicto", personaId: 27094 }, { nombre: "Recyclart S.A." }], objetoSocial: "Gestión de residuos comerciales, transporte, consultoría y capacitación de gestión ambiental, importación y exportación." },
  { tipo: "S.A.S.", nombre: "Mmmj Industria Plastica S.A.S.", sociedadId: 15109, cuit: "30-71878526-6", capital: "$600.000", publicacion: "05/11/2024", departamento: "Guaymallén", socios: [{ nombre: "Mariana Lucila Segovia", personaId: 27584 }], objetoSocial: "Actividades de reciclado, industriales, comerciales, asesoramiento, servicio de transporte e inmobiliaria." },
  { tipo: "S.A.", nombre: "Transformacion Estrategica Circular S.A.", sociedadId: 15288, cuit: "30-71911654-6", capital: "$60.000.000", publicacion: "27/11/2024", departamento: "Malargüe", socios: [{ nombre: "Carlos Gustavo Morgani", personaId: 27835 }, { nombre: "Javier Jesús Klita", personaId: 8200 }, { nombre: "Leonardo Raúl Iriarte", personaId: 27834 }], objetoSocial: "Gestión de Residuos, Actividades del Medio Ambiente, Servicios Comerciales, Exportadora e Importadora. Prestación de servicios profesionales químicos y ambientales, remediación ambiental, almacenamiento, recolección, transporte, tratamiento y disposición de residuos, reciclado, reutilización, asesoramiento ambiental, desarrollo de tecnologías, actividades inmobiliarias, inversoras, financieras, petroleras, gasíferas, forestales, mineras, energéticas, transporte, seguridad e higiene laboral, importación y exportación de bienes." },
  { tipo: "S.A.S.", nombre: "FL Group Recycling Companies S.A.S.", sociedadId: 16320, cuit: "30-71898688-1", capital: "$800.000", publicacion: "13/05/2025", departamento: "Godoy Cruz", socios: [{ nombre: "Carla Sofía Adaro", personaId: 29272 }, { nombre: "Fernando Luis Lopez Pesci", personaId: 5396 }], objetoSocial: "Compra y venta de tecnología, servicio de administración, asesoramiento, mantenimiento de tecnologías para la transformación del RSU y su reciclado, importaciones y exportaciones, venta de productos finales reciclados, y prestación de servicios relacionados con salud, comunicaciones, industrias manufactureras, desarrollo de tecnologías, actividades comerciales, inmobiliarias, inversoras, financieras, agropecuarias y transporte privado." },
  { tipo: "S.A.S.", nombre: "Palcriva Estrategias Integrales S.A.S.", sociedadId: 16399, cuit: "30-71899689-5", capital: "$3.000.000", publicacion: "22/05/2025", departamento: "Godoy Cruz", socios: [{ nombre: "Eliana Noelia Sevilla", personaId: 29375 }, { nombre: "Leonardo Valentino Scafi", personaId: 29374 }], objetoSocial: "Prestación de servicios de ingeniería ambiental y ecológica, incluyendo recolección, transporte, tratamiento y disposición de residuos; limpieza urbana; comercialización de artículos relacionados; asesoramiento técnico y consultoría ambiental; mandatos y representación de terceros; importación y exportación; contratación con el Estado; y operaciones inmobiliarias." },
  { tipo: "S.A.S.", nombre: "Valor Tres Consultora Ambiental S.A.S.", sociedadId: 18837, cuit: null, capital: "$900.000", publicacion: "24/04/2026", departamento: "Luján de Cuyo", socios: [{ nombre: "Pablo Alberto Syriani", personaId: 13827 }, { nombre: "Reyes Malena Lucia", personaId: 32546 }], objetoSocial: "Prestación de servicios de asesoramiento técnico, planificación, diseño, implementación y auditoría de sistemas de gestión ambiental, sostenibilidad y responsabilidad social empresaria; formulación, ejecución y monitoreo de proyectos vinculados a cambio climático, huella de carbono, economía circular, gestión de residuos, restauración ecológica-forestal y desarrollo territorial sostenible; asesoramiento e implementación de proyectos de energías renovables, eficiencia energética y transición energética; diseño y ejecución de programas educativos y capacitaciones; desarrollo de herramientas digitales y sistemas de monitoreo ambiental; servicios de seguridad, higiene, salud ocupacional y gestión integrada de riesgos." },
  { tipo: "Cooperativa", nombre: "Economia Popular Y Circular Ltda.", sociedadId: 10598, cuit: null, capital: null, publicacion: null, departamento: "Capital", socios: [], objetoSocial: null },
];
