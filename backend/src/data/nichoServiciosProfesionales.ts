// Copia server-side de frontend/src/data/nichoServiciosProfesionales.ts,
// mismo criterio que el resto de backend/src/data/*.ts: el backend no
// importa del workspace frontend, así que estos agregados se duplican acá
// (DEPARTAMENTOS como array plano, no Map, para el HTML server-rendered de
// SEO -- ver seo.ts). Ver la nota completa (incluyendo los 2 socios sin
// personaId por nombre ambiguo) en el archivo del frontend.

export const ESPECIALIDAD_ESTUDIOS = [
  { etiqueta: "Jurídico", valor: 25 },
  { etiqueta: "Contable", valor: 11 },
  { etiqueta: "Jurídico-contable", valor: 9 },
  { etiqueta: "Gestoría y trámites", valor: 1 },
  { etiqueta: "Notarial", valor: 0 },
];

export const EVOLUCION_ANUAL = [
  { etiqueta: "2018", valor: 5 },
  { etiqueta: "2019", valor: 11 },
  { etiqueta: "2020", valor: 5 },
  { etiqueta: "2021", valor: 4 },
  { etiqueta: "2022", valor: 6 },
  { etiqueta: "2023", valor: 8 },
  { etiqueta: "2024", valor: 4 },
  { etiqueta: "2025", valor: 3 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 36 },
  { tipo: "S.R.L.", cantidad: 6 },
  { tipo: "S.A.", cantidad: 4 },
];

export const DEPARTAMENTOS_SERVICIOS_PROFESIONALES = [
{ departamento: "Capital", cantidad: 34 },
  { departamento: "Luján de Cuyo", cantidad: 3 },
  { departamento: "Godoy Cruz", cantidad: 2 },
  { departamento: "San Martín", cantidad: 2 },
  { departamento: "General Alvear", cantidad: 1 },
  { departamento: "Guaymallén", cantidad: 1 },
  { departamento: "Maipú", cantidad: 1 },
  { departamento: "San Rafael", cantidad: 1 },
];

export const PROFESIONES_ECOSISTEMA = [
  { profesion: "Contador/a", personas: 1136, sociedades: 1639 },
  { profesion: "Abogado/a", personas: 821, sociedades: 1028 },
  { profesion: "Escribano/a", personas: 66, sociedades: null },
];

export const RANKING_PROFESIONES_LIBERALES = [
  { etiqueta: "Ingeniero/a", valor: 1485 },
  { etiqueta: "Contador/a", valor: 1135 },
  { etiqueta: "Médico/a", valor: 983 },
  { etiqueta: "Abogado/a", valor: 821 },
  { etiqueta: "Arquitecto/a", valor: 482 },
  { etiqueta: "Escribano/a", valor: 66 },
];

export const ESCRIBANOS_TOP = [
  { etiqueta: "Paulo Ariel Crescitelli", valor: 43 },
  { etiqueta: "Oscar Eduardo Rinland", valor: 36 },
  { etiqueta: "María Claudia Palomo", valor: 36 },
  { etiqueta: "José Rogelio Gantuz", valor: 21 },
  { etiqueta: "Octavio Paulo Barolo", valor: 19 },
  { etiqueta: "Carlos Alberto Vanella", valor: 19 },
  { etiqueta: "Leonardo G. Giunta Larrañaga", valor: 18 },
  { etiqueta: "Emanuel Sebastián Paz", valor: 17 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadServiciosProfesionalesCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
  categoria?: "Jurídico" | "Jurídico-contable" | "Contable" | "Gestoría y trámites";
}

export const ENTIDADES: EntidadServiciosProfesionalesCurada[] = [
  {
    "sociedadId": 1414,
    "socios": [
      {
        "nombre": "Enrique Daniel Gross",
        "personaId": 3214
      },
      {
        "nombre": "Guillermo Enzo Neyra",
        "personaId": 3215
      },
      {
        "nombre": "Pablo Marcelo Corvalan Nanclares",
        "personaId": 3213
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 1429,
    "socios": [
      {
        "nombre": "Cesar Augusto Vazquez",
        "personaId": 3255
      },
      {
        "nombre": "Juan Manuel Cáceres",
        "personaId": 3254
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 2238,
    "socios": [
      {
        "nombre": "María Florencia Abaurre",
        "personaId": 4931
      },
      {
        "nombre": "Oscar Gustavo Martinez",
        "personaId": 4932
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 2495,
    "socios": [
      {
        "nombre": "Guillermo Enzo Neyra",
        "personaId": 3215
      },
      {
        "nombre": "Marcelo Gustavo Dupetit",
        "personaId": 5457
      },
      {
        "nombre": "Pablo Marcelo Corvalan Nanclares",
        "personaId": 3213
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 2661,
    "socios": [
      {
        "nombre": "Antonio Eduardo Logrippo",
        "personaId": 5836
      },
      {
        "nombre": "Juan Pablo Vallone",
        "personaId": 5835
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 2820,
    "socios": [
      {
        "nombre": "María Leonor Etchelouz",
        "personaId": 6172
      },
      {
        "nombre": "María Veronica Lima",
        "personaId": 6173
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 2879,
    "socios": [
      {
        "nombre": "Ignacio Osvaldo Coll",
        "personaId": 6299
      },
      {
        "nombre": "María Belén Coll",
        "personaId": 6300
      },
      {
        "nombre": "Osvaldo Walter Coll",
        "personaId": 6298
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 3298,
    "socios": [
      {
        "nombre": "Cintia Patricia Modolo",
        "personaId": 7176
      },
      {
        "nombre": "Pablo Jorge Chesi",
        "personaId": 6462
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 3360,
    "socios": [
      {
        "nombre": "Diego Boulin",
        "personaId": 7293
      },
      {
        "nombre": "Juan Boulin",
        "personaId": 7299
      },
      {
        "nombre": "Juan Pablo Vallone",
        "personaId": 5835
      },
      {
        "nombre": "Leandro Ismael Vallone",
        "personaId": 7296
      },
      {
        "nombre": "Luis Benegas",
        "personaId": 7295
      },
      {
        "nombre": "Marcos Sebastian Vallone",
        "personaId": 7297
      },
      {
        "nombre": "Maria Elina Benegas",
        "personaId": 7294
      },
      {
        "nombre": "Santiago Boulin",
        "personaId": 7298
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 3603,
    "socios": [
      {
        "nombre": "Federico Martín Pagano",
        "personaId": 7558
      },
      {
        "nombre": "María José Sánchez Baca",
        "personaId": 7780
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 3605,
    "socios": [
      {
        "nombre": "Ezequiel Ibañez",
        "personaId": 7783
      },
      {
        "nombre": "María Pilar Varas",
        "personaId": 7784
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 5754,
    "socios": [
      {
        "nombre": "Marcela Beatriz Bravo",
        "personaId": 12137
      },
      {
        "nombre": "María Del Pilar Figueroa",
        "personaId": 12138
      },
      {
        "nombre": "Rogelio Eduardo Javier Figueroa",
        "personaId": 12136
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 6730,
    "socios": [
      {
        "nombre": "Juan Ignacio Petra",
        "personaId": 10032
      },
      {
        "nombre": "Mathias Emiliano Molina",
        "personaId": 7351
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 7528,
    "socios": [
      {
        "nombre": "Jorge Ramiro Leal",
        "personaId": 15502
      },
      {
        "nombre": "Marina Benita Picallo",
        "personaId": 4693
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 7732,
    "socios": [
      {
        "nombre": "Carlos Federico Vinassa",
        "personaId": 15899
      },
      {
        "nombre": "Leonardo Martín Saumell",
        "personaId": 15900
      },
      {
        "nombre": "Sebastián Parisi",
        "personaId": 15901
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 8691,
    "socios": [
      {
        "nombre": "Antonio Eduardo Logrippo",
        "personaId": 5836
      },
      {
        "nombre": "Julio Cesar Tarquini",
        "personaId": 17678
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 8985,
    "socios": [
      {
        "nombre": "Diego Julián Fernandez Azzolina",
        "personaId": 16245
      },
      {
        "nombre": "Mauro Andrés Pozzebon",
        "personaId": 16246
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 9647,
    "socios": [
      {
        "nombre": "Leandro Ismael Vallone",
        "personaId": 7296
      },
      {
        "nombre": "Marcos Sebastian Vallone",
        "personaId": 7297
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 10126,
    "socios": [
      {
        "nombre": "Lorena Paola Cicilotto",
        "personaId": 20311
      },
      {
        "nombre": "María Virginia Gatica",
        "personaId": 20312
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 10526,
    "socios": [
      {
        "nombre": "Carina Fedra Egea",
        "personaId": 21027
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 10967,
    "socios": [
      {
        "nombre": "Octavio Nicolás Billi",
        "personaId": 21622
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 12563,
    "socios": [
      {
        "nombre": "Raúl Javier Rodríguez",
        "personaId": 22840
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 13425,
    "socios": [
      {
        "nombre": "Carlos Alfredo Aguinaga",
        "personaId": 25141
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 15355,
    "socios": [
      {
        "nombre": "María Evangelina Barroso",
        "personaId": 27934
      },
      {
        "nombre": "María Julia Bertinatto",
        "personaId": 27935
      },
      {
        "nombre": "Mariano Germán Gimenez",
        "personaId": 2457
      },
      {
        "nombre": "Pamela Carolina Ramiro",
        "personaId": 27936
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 16267,
    "socios": [
      {
        "nombre": "María Lourdes Garcia Sarmiento",
        "personaId": 29191
      },
      {
        "nombre": "Pablo Nicolás Garcia Sarmiento",
        "personaId": 29189
      },
      {
        "nombre": "Rafael Eduardo Garcia Sarmiento",
        "personaId": 29190
      }
    ],
    "categoria": "Jurídico"
  },
  {
    "sociedadId": 1191,
    "socios": [
      {
        "nombre": "Embarca Aceleradora De Startups Sas",
        "sociedadId": 656
      },
      {
        "nombre": "Matías Alejandro Díaz Telli",
        "personaId": 2727
      },
      {
        "nombre": "Matías Germán Rodriguez",
        "personaId": 2730
      },
      {
        "nombre": "Pablo Antonio Saitta"
      },
      {
        "nombre": "Sebastián Andrés Echevarría",
        "personaId": 2729
      }
    ],
    "categoria": "Jurídico-contable"
  },
  {
    "sociedadId": 5086,
    "socios": [
      {
        "nombre": "Leandro Gabriel Sánchez Ariza",
        "personaId": 10841
      },
      {
        "nombre": "Matías Alejandro Díaz Telli",
        "personaId": 2727
      }
    ],
    "categoria": "Jurídico-contable"
  },
  {
    "sociedadId": 5397,
    "socios": [
      {
        "nombre": "Juan Nicolás López Romera",
        "personaId": 11430
      },
      {
        "nombre": "Marcelo Javier López Romera",
        "personaId": 11431
      }
    ],
    "categoria": "Jurídico-contable"
  },
  {
    "sociedadId": 8490,
    "socios": [
      {
        "nombre": "Martín José Sleiman",
        "personaId": 17299
      },
      {
        "nombre": "Maximiliano Adrián Clerici",
        "personaId": 17298
      }
    ],
    "categoria": "Jurídico-contable"
  },
  {
    "sociedadId": 12175,
    "socios": [
      {
        "nombre": "Carlos Edgardo Delú",
        "personaId": 4518
      },
      {
        "nombre": "Mercau Jorge Rodrigo",
        "personaId": 23368
      }
    ],
    "categoria": "Jurídico-contable"
  },
  {
    "sociedadId": 12444,
    "socios": [
      {
        "nombre": "Gimenez Tamara Alejandra",
        "personaId": 23749
      },
      {
        "nombre": "Luciano Jesus Basilici",
        "personaId": 23750
      }
    ],
    "categoria": "Jurídico-contable"
  },
  {
    "sociedadId": 13447,
    "socios": [
      {
        "nombre": "Iriarte David",
        "personaId": 15290
      },
      {
        "nombre": "Pablo Agustín Capella",
        "personaId": 17290
      }
    ],
    "categoria": "Jurídico-contable"
  },
  {
    "sociedadId": 15541,
    "socios": [
      {
        "nombre": "Gianinetto Barón, Emiliano Ruben",
        "personaId": 28205
      },
      {
        "nombre": "Sleiman, Samira Alejandra",
        "personaId": 28206
      }
    ],
    "categoria": "Jurídico-contable"
  },
  {
    "sociedadId": 17841,
    "socios": [
      {
        "nombre": "Federico Villarreal Granata",
        "personaId": 31346
      },
      {
        "nombre": "Rodrigo Villarreal Granata",
        "personaId": 28850
      }
    ],
    "categoria": "Jurídico-contable"
  },
  {
    "sociedadId": 2136,
    "socios": [
      {
        "nombre": "Gabriel Edgardo Torre",
        "personaId": 4296
      },
      {
        "nombre": "Maria Fernanda Flores",
        "personaId": 4297
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 2848,
    "socios": [
      {
        "nombre": "Horacio Ernesto Susso",
        "personaId": 6227
      },
      {
        "nombre": "Jorge Enrique Susso",
        "personaId": 6228
      },
      {
        "nombre": "Maria Florencia Susso",
        "personaId": 6229
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 3984,
    "socios": [
      {
        "nombre": "Carlos Alejandro Aznar",
        "personaId": 8572
      },
      {
        "nombre": "Gonzalo Foix",
        "personaId": 8570
      },
      {
        "nombre": "Graciela Betina Aznar",
        "personaId": 8571
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 4485,
    "socios": [
      {
        "nombre": "Carlos Alejandro Aznar",
        "personaId": 8572
      },
      {
        "nombre": "Gonzalo Foix",
        "personaId": 8570
      },
      {
        "nombre": "Graciela Betina Aznar",
        "personaId": 8571
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 5471,
    "socios": [
      {
        "nombre": "Laura Beatriz Odorico",
        "personaId": 11576
      },
      {
        "nombre": "María Laura Castro",
        "personaId": 11571
      },
      {
        "nombre": "Patricia Soledad Araujo",
        "personaId": 11575
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 7047,
    "socios": [
      {
        "nombre": "Carina Alicia Molina"
      },
      {
        "nombre": "Sergio Andrés Pérez",
        "personaId": 6259
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 8714,
    "socios": [
      {
        "nombre": "Franco Gabriel Molina",
        "personaId": 14526
      },
      {
        "nombre": "Juan Manuel Molina",
        "personaId": 14525
      },
      {
        "nombre": "Julio Abelardo Blotta",
        "personaId": 17711
      },
      {
        "nombre": "Rosana Vanina Cruciani",
        "personaId": 17710
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 10984,
    "socios": [
      {
        "nombre": "Alejandro Miguel Codina",
        "personaId": 21643
      },
      {
        "nombre": "Miguel Codina",
        "personaId": 21644
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 11645,
    "socios": [
      {
        "nombre": "Laura Del Carmen Barroso",
        "personaId": 22549
      },
      {
        "nombre": "Martín Darío Malmod",
        "personaId": 22548
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 13000,
    "socios": [
      {
        "nombre": "Ivan David Menacho",
        "personaId": 2802
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 16226,
    "socios": [
      {
        "nombre": "Macarena Alonso",
        "personaId": 14671
      },
      {
        "nombre": "Matías Agustín Szymanski",
        "personaId": 9436
      }
    ],
    "categoria": "Contable"
  },
  {
    "sociedadId": 3745,
    "socios": [
      {
        "nombre": "Emmanuel Miguel Orsi Bertolo",
        "personaId": 8059
      },
      {
        "nombre": "Liliana Amelia Bertolo",
        "personaId": 8057
      },
      {
        "nombre": "Miguel Antonio Orsi",
        "personaId": 8058
      }
    ],
    "categoria": "Gestoría y trámites"
  }
];
