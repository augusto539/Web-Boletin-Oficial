// Copia server-side de frontend/src/data/nichoArquitectura.ts, mismo
// criterio que el resto de backend/src/data/*.ts: el backend no importa del
// workspace frontend, así que estos agregados se duplican acá (DEPARTAMENTOS
// como array plano, no Map, para el HTML server-rendered de SEO -- ver
// seo.ts). Ver la nota completa (incluyendo el socio sin personaId por
// nombre ambiguo) en el archivo del frontend.

export interface SocioArquitectura {
  nombre: string;
  personaId?: number;
  sociedadId?: number;
}

export interface EntidadArquitectura {
  tipo: string;
  nombre: string;
  sociedadId: number;
  cuit: string | null;
  capital: string | null;
  publicacion: string | null;
  departamento: string | null;
  socios: SocioArquitectura[];
  objetoSocial: string;
}

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

export const ECOSISTEMA_PROFESIONES = [
  { etiqueta: "Ingeniero (todas las especialidades)", valor: 1465 },
  { etiqueta: "Contador/a", valor: 952 },
  { etiqueta: "Abogado/a", valor: 770 },
  { etiqueta: "Arquitecto/a", valor: 464 },
];

export const DEPARTAMENTOS_ARQUITECTURA = [
{ departamento: "Capital", cantidad: 7 },
  { departamento: "Guaymallén", cantidad: 5 },
  { departamento: "Luján de Cuyo", cantidad: 4 },
  { departamento: "San Martín", cantidad: 3 },
  { departamento: "Godoy Cruz", cantidad: 2 },
  { departamento: "General Alvear", cantidad: 2 },
  { departamento: "Tupungato", cantidad: 1 },
  { departamento: "Maipú", cantidad: 1 },
  { departamento: "Rivadavia", cantidad: 1 },
  { departamento: "San Carlos", cantidad: 1 },
];

export const ENTIDADES: EntidadArquitectura[] = [
  { tipo: "S.A.S.", nombre: "Ona - Oficina Nomada De Arquitectura S.A.S.", sociedadId: 1957, cuit: "30-71696724-3", capital: "$80.000", publicacion: "21/09/2018", departamento: "Capital", socios: [{ nombre: "Nicolás Guerra", personaId: 4369 }], objetoSocial: "Construcción de obras públicas y privadas, edificios, viviendas, escuelas, hospitales, puentes, caminos; refacciones, ampliaciones y mejoras; fabricación y comercialización de materiales de construcción; compraventa, urbanización y loteos de inmuebles; comercialización de productos; importación y exportación; participación en sociedades; compra y venta de títulos y valores mobiliarios; servicios de tecnología, ingeniería, energía renovable; arriendo de vehículos y maquinarias; actuación en fideicomisos." },
  { tipo: "S.A.S.", nombre: "Aristides Arquitectura Constructora S.A.S.", sociedadId: 2997, cuit: "30-71658681-9", capital: "$40.000", publicacion: "14/05/2019", departamento: "Capital", socios: [{ nombre: "Salomon Manuel Escobar Valencia", personaId: 6540 }, { nombre: "Sergio Fabian Mastropietro", personaId: 2057 }], objetoSocial: "Actividades inmobiliarias, adquisición, locación, intermediación, loteo, venta, arrendamiento de inmuebles; construcción, edificación, urbanización, rehabilitación de obras de ingeniería y arquitectura; desarrollos inmobiliarios con asistencia técnica; intermediación como corredor inmobiliario." },
  { tipo: "S.A.S.", nombre: "Proyectos Y Arquitectura Santiago S.A.S.", sociedadId: 3178, cuit: "30-71659891-4", capital: "$40.000", publicacion: "13/06/2019", departamento: "Guaymallén", socios: [{ nombre: "Alberto Daniel Vargas Quillaguaman", personaId: 6934 }, { nombre: "Nicolas Alberto Vargas", personaId: 6935 }], objetoSocial: "Comercialización, actividades inmobiliarias, construcciones, importación y exportación de bienes, materias primas y productos diversos." },
  { tipo: "S.A.S.", nombre: "Adinm Arquitectura Diseño Inmobiliario Sas", sociedadId: 3396, cuit: "30-71661316-6", capital: "$40.000", publicacion: "29/07/2019", departamento: "Tupungato", socios: [{ nombre: "Castro Claudio Bernabe", personaId: 6024 }, { nombre: "Lopez Gloria Daniela", personaId: 6025 }], objetoSocial: "Actividades de arquitectura, diseño e inmobiliarias." },
  { tipo: "S.A.", nombre: "G & P – Grupo Proyectar, Arquitectura, Construcción Y Servicios S.A.", sociedadId: 4009, cuit: "33-71675617-9", capital: "$110.000", publicacion: "22/11/2019", departamento: "Capital", socios: [{ nombre: "Edgardo Gargiulo", personaId: 916 }, { nombre: "María Gabriela Reche", personaId: 917 }], objetoSocial: "Actividades constructoras, inmobiliarias, servicios y licitaciones." },
  { tipo: "S.A.S.", nombre: "Piso Arquitectura S.A.S.", sociedadId: 4274, cuit: null, capital: "$50.000", publicacion: "08/01/2020", departamento: "Luján de Cuyo", socios: [{ nombre: "Ariel Fernando Piantini", personaId: 9171 }, { nombre: "Mercedes Soler", personaId: 9170 }], objetoSocial: "Realizar actividades inmobiliaria, constructora, asesoramiento y servicios, mandatos, proveedor del estado y fiduciaria, por cuenta propia o ajena, o asociada a terceros, dentro o fuera del país." },
  { tipo: "S.R.L.", nombre: "Arquitectonica S.R.L.", sociedadId: 4497, cuit: "30-71710724-8", capital: "$300.000", publicacion: "09/03/2020", departamento: "Capital", socios: [{ nombre: "Elena Alicia Baggio", personaId: 9637 }, { nombre: "Fabian Horacio Mason", personaId: 9636 }, { nombre: "Maria Emilia Lara", personaId: 9638 }], objetoSocial: "Constructora." },
  { tipo: "S.R.L.", nombre: "Arquitectonica Sociedad De Responsabilidad Limitada", sociedadId: 6153, cuit: null, capital: "$300.000", publicacion: "10/02/2021", departamento: "Capital", socios: [{ nombre: "Elio Reinaldo Marcelo Guidarelli", personaId: 12912 }, { nombre: "Fabian Horacio Mason", personaId: 9636 }, { nombre: "Maria Emilia Lara", personaId: 9638 }], objetoSocial: "Constructora." },
  { tipo: "S.A.S.", nombre: "Gn+ Arquitectura Y Servicios S.A.S.", sociedadId: 6338, cuit: "30-71715375-4", capital: "$50.000", publicacion: "15/03/2021", departamento: "Rivadavia", socios: [{ nombre: "Chiara Gabriel Enrique", personaId: 13252 }, { nombre: "Tarditto Noelia Del Carmen", personaId: 13253 }], objetoSocial: "Industrial, comercial, importación y exportación de bienes y servicios." },
  { tipo: "S.A.S.", nombre: "De Kubo Arquitectura S.A.S.", sociedadId: 6646, cuit: "30-71717176-0", capital: "$1.000.000", publicacion: "12/05/2021", departamento: "San Martín", socios: [{ nombre: "Javier Alberto Pérez", personaId: 13855 }, { nombre: "Sebastián José Baigorria", personaId: 13856 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes e inmateriales y prestación de servicios relacionados con actividades constructora, transporte y financieras." },
  { tipo: "S.A.S.", nombre: "Büra Estudio De Arquitectura Y Desarrollos Inmobiliarios S.A.S.", sociedadId: 7673, cuit: "30-71752369-1", capital: "$66.000", publicacion: "27/10/2021", departamento: "San Martín", socios: [{ nombre: "Micaela Belén Vicentini", personaId: 15785 }, { nombre: "Walter Ezequiel Pereyra", personaId: 15784 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de toda clase de bienes materiales e inmateriales y prestación de servicios relacionados con actividades agropecuarias, comunicaciones, industrias manufactureras, culturales, tecnológicas, gastronómicas, inmobiliarias, inversoras, petroleras, de salud y transporte." },
  { tipo: "S.A.", nombre: "Liendo Arquitectos S.A.", sociedadId: 9321, cuit: "30-71776505-9", capital: "$100.000", publicacion: "03/08/2022", departamento: "Luján de Cuyo", socios: [{ nombre: "Adrián Marcelo Navarro", personaId: 18865 }, { nombre: "Fernando Abraham Moreno Fredes", personaId: 18864 }, { nombre: "Juan Gabriel Sanchez" }, { nombre: "Leonardo David Carrizo", personaId: 18866 }, { nombre: "Marta Inés Tambutto", personaId: 18860 }, { nombre: "Miguel Horacio Liendo", personaId: 8478 }, { nombre: "Paulina Liendo", personaId: 18861 }, { nombre: "Rocio Celeste Gonzalez", personaId: 18867 }, { nombre: "Tomás Liendo", personaId: 7338 }], objetoSocial: "Construcción, actividades financieras, exportaciones e importaciones, licitaciones." },
  { tipo: "S.R.L.", nombre: "Modulo Arquitectura S.R.L.", sociedadId: 11701, cuit: null, capital: "$450.000", publicacion: "11/07/2023", departamento: "San Martín", socios: [{ nombre: "Faisal Nabil Abdala", personaId: 22611 }, { nombre: "Vladimir Angileri Di Bernardo", personaId: 22612 }], objetoSocial: "Servicios de Arquitectura, Construcciones, Inmobiliarias." },
  { tipo: "S.A.S.", nombre: "Habi Arquitectura Y Diseño S.A.S.", sociedadId: 11955, cuit: "30-71825763-4", capital: "$230.000", publicacion: "23/08/2023", departamento: "Guaymallén", socios: [{ nombre: "Alejandro Agustín Marasco", personaId: 23043 }, { nombre: "Sergio Antonio Martins De Abreu", personaId: 23042 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales y prestación de servicios de asesoramiento integral y consultoría jurídica relacionados con actividades agropecuarias, culturales, educativas, tecnológicas, gastronómicas, hoteleras, turísticas, inmobiliarias, constructoras, inversoras, financieras, petroleras, gasíferas, forestales, mineras, energéticas, de salud y transporte." },
  { tipo: "S.A.S.", nombre: "Rumi Arquitectura Y Ambiente S.A.S.", sociedadId: 12730, cuit: null, capital: "$400.000", publicacion: "30/11/2023", departamento: "Luján de Cuyo", socios: [{ nombre: "Patricia Alejandra Fadin", personaId: 24141 }, { nombre: "Walter José Prato", personaId: 13154 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales en diversos sectores incluyendo agropecuario, comunicaciones, industrias manufactureras, tecnología, gastronomía, inmobiliario, financiero, transporte y salud." },
  { tipo: "S.A.S.", nombre: "Vision Servicios De Arquitectura E Ingenieria S.A.S.", sociedadId: 12954, cuit: null, capital: "$500.000", publicacion: "26/12/2023", departamento: "General Alvear", socios: [{ nombre: "Gonzalo Manuel Marcolini", personaId: 24473 }, { nombre: "María Cecilia Díaz", personaId: 24474 }, { nombre: "Renata Irupe Lede", personaId: 24475 }], objetoSocial: "Realizar por cuenta propia o de terceros o asociada a terceros en cualquier punto del país o del extranjero las siguientes actividades: construcción, agropecuaria, inmobiliaria, comercial, mandataria, financiera, transporte." },
  { tipo: "S.A.S.", nombre: "Filice Piña Arquitectos S.A.S.", sociedadId: 13858, cuit: null, capital: "$1.000.000", publicacion: "24/05/2024", departamento: "Godoy Cruz", socios: [{ nombre: "Juan Manuel Filice", personaId: 19005 }, { nombre: "Roberto Santos Piña", personaId: 25754 }], objetoSocial: "Elaboración y ejecución de proyectos de arquitectura, diseño y construcción, servicio de consultoría y compra y venta de inmuebles." },
  { tipo: "S.A.S.", nombre: "Furiassi Arquitectos S.A.S.", sociedadId: 13918, cuit: "30-71863248-6", capital: "$600.000", publicacion: "31/05/2024", departamento: "Maipú", socios: [{ nombre: "Edgardo Sebastian Furiassi", personaId: 25852 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, acopio, empaque, intermediación, representación, importación y exportación de toda clase de bienes materiales e inmateriales relacionados con actividades comerciales, servicios y construcción." },
  { tipo: "S.A.S.", nombre: "Mora Hughes Arquitectos S.A.S.", sociedadId: 14666, cuit: "30-71879176-2", capital: "$520.000", publicacion: "11/09/2024", departamento: "Capital", socios: [{ nombre: "María Eugenia Mora", personaId: 26908 }, { nombre: "Tom Hughes", personaId: 26907 }], objetoSocial: "Servicios de arquitectura, construcción, operaciones inmobiliarias, importación y exportación de productos relacionados, y actuación como fiduciaria y mandataria en fideicomisos y mandatos civiles y comerciales." },
  { tipo: "S.A.S.", nombre: "MPV Arquitectos S.A.S.", sociedadId: 15013, cuit: "30-71878334-4", capital: "$15.000.000", publicacion: "24/10/2024", departamento: "Capital", socios: [{ nombre: "Mariano Alberto Sabas", personaId: 7265 }, { nombre: "Pereyra Varona Matías", personaId: 27448 }], objetoSocial: "Constructora; Inmobiliaria; Financiera; Servicios; Transporte; Comercial" },
  { tipo: "S.A.S.", nombre: "Rlg Arquitectura S.A.S.", sociedadId: 15069, cuit: "30-71876026-3", capital: "$3.000.000", publicacion: "31/10/2024", departamento: "Godoy Cruz", socios: [{ nombre: "Maria Agustina Diumenjo", personaId: 27535 }, { nombre: "Roxana Lo Giudice", personaId: 27534 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales y prestación de servicios relacionados con actividades agropecuarias, comunicaciones, industrias manufactureras, gastronómicas, inmobiliarias, inversoras, petroleras, de salud y transporte." },
  { tipo: "S.A.S.", nombre: "Desarrollos Ingeniería Arquitectura Quenaya S.A.S.", sociedadId: 16942, cuit: "30-71910430-0", capital: "$10.000.000", publicacion: "05/08/2025", departamento: "Guaymallén", socios: [{ nombre: "Agustín Quenaya Cayo", personaId: 30130 }, { nombre: "Francisca Laime Colque", personaId: 30132 }, { nombre: "Rodrigo Agustín Quenaya Laime", personaId: 30131 }, { nombre: "Romina Liseth Quenaya Laime", personaId: 30134 }, { nombre: "Tania Nancy Quenaya Laime", personaId: 30133 }], objetoSocial: "Inmobiliaria y constructora, agropecuaria, industrial, comercial, forestal, servicios, transporte terrestre, mandataria, licitaciones." },
  { tipo: "S.A.S.", nombre: "María José Conceptos Arquitectónicos S.A.S.", sociedadId: 17033, cuit: "30-71915220-8", capital: "$2.000.000", publicacion: "19/08/2025", departamento: "Guaymallén", socios: [{ nombre: "María José Manzano", personaId: 30269 }, { nombre: "Miguel Carlos Manzano", personaId: 30268 }], objetoSocial: "Compra, venta, permuta de bienes muebles o inmuebles; constitución de fideicomisos; ejercicio de mandatos; importación y exportación de mercaderías; diseño y proyectos de arquitectura; construcción de inmuebles." },
  { tipo: "S.A.S.", nombre: "Segmento Arquitectura S.A.S.", sociedadId: 18889, cuit: "30-71943841-1", capital: "$750.000", publicacion: "04/05/2026", departamento: "Guaymallén", socios: [{ nombre: "Ignacio Floreano", personaId: 32612 }, { nombre: "Maria Jimena Maia Seveso", personaId: 32611 }], objetoSocial: "Actividades agropecuarias, avícolas, ganaderas, pesqueras, tamberas, vitivinícolas, comunicaciones, espectáculos, editoriales, gráficas, industrias manufactureras, culturales, educativas, desarrollo de tecnologías, investigación, innovación, software, comerciales, gastronómicas, hoteleras, turísticas, inmobiliarias, constructoras, inversoras, financieras, fideicomisos, petroleras, gasíferas, forestales, mineras, energéticas, salud y transporte privado." },
  { tipo: "S.A.S.", nombre: "Estudio Arquitectonico Combes S.A.S.", sociedadId: 19202, cuit: null, capital: "$726.000", publicacion: "05/06/2026", departamento: "San Carlos", socios: [{ nombre: "Leonel Mario Rodrigo Combes Ríos", personaId: 3119 }, { nombre: "Rodolfo Nicolas Combes Rios", personaId: 33095 }], objetoSocial: "Actividades agropecuarias, avícolas, ganaderas, pesqueras, tamberas, vitivinícolas; comunicaciones, espectáculos, editoriales; industrias manufactureras; culturales, educativas; desarrollo de tecnologías, investigación, software; comerciales, gastronómicas, hoteleras, turísticas; inmobiliarias, constructoras; inversoras, financieras, fideicomisos; petroleras, gasíferas, forestales, mineras, energéticas; salud; transporte privado." },
  { tipo: "S.A.S.", nombre: "Z Arquitectura Sas", sociedadId: 19225, cuit: null, capital: "$800.000", publicacion: "08/06/2026", departamento: "Luján de Cuyo", socios: [{ nombre: "Andrés Jonathan Torres Castro", personaId: 31488 }, { nombre: "Javier Marcelo Cruz", personaId: 33149 }], objetoSocial: "Creación, producción, intercambio, fabricación, transformación, industrialización, comercialización, intermediación, representación, importación y exportación de bienes materiales e inmateriales y prestación de servicios relacionados con agropecuarias, comunicaciones, industrias manufactureras, deportivas, culturales, tecnologías, gastronómicas, inmobiliarias, inversoras, financieras, petroleras, gasíferas, forestales, mineras, energéticas, salud y transporte." },
  { tipo: "S.A.S.", nombre: "M.V.S. Arquitectura E Ingeniería S.A.S.", sociedadId: 9504, cuit: "30-71734363-4", capital: "$1.500.000", publicacion: null, departamento: "General Alvear", socios: [{ nombre: "Cristian Alejandro Balastegui", personaId: 19198 }, { nombre: "Cristian Danilo Montes", personaId: 19199 }, { nombre: "Ignacio Pedro", personaId: 19200 }], objetoSocial: "Construcción; Agropecuaria; Inmobiliaria; Comercial; Mandataria; Financiera; Transporte." },
];
