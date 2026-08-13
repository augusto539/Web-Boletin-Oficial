// Copia server-side de frontend/src/data/nichoCafe.ts, mismo criterio que
// el resto de backend/src/data/*.ts: el backend no importa del workspace
// frontend, así que estos agregados se duplican acá (DEPARTAMENTOS como
// array plano, no Map, para el HTML server-rendered de SEO -- ver seo.ts).
// Ver la nota completa (incluyendo el socio sin personaId por nombre
// ambiguo y el duplicado detectado en el Boletín) en el archivo del
// frontend.

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 2 },
  { etiqueta: "2018", valor: 1 },
  { etiqueta: "2019", valor: 2 },
  { etiqueta: "2020", valor: 4 },
  { etiqueta: "2021", valor: 6 },
  { etiqueta: "2022", valor: 7 },
  { etiqueta: "2023", valor: 6 },
  { etiqueta: "2024", valor: 5 },
  { etiqueta: "2025", valor: 5 },
  { etiqueta: "2026*", valor: 3 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 34 },
  { tipo: "S.A.", cantidad: 5 },
  { tipo: "S.R.L.", cantidad: 3 },
];

export const DEPARTAMENTOS_CAFE = [
{ departamento: "Capital", cantidad: 11 },
  { departamento: "Godoy Cruz", cantidad: 6 },
  { departamento: "Maipú", cantidad: 5 },
  { departamento: "San Rafael", cantidad: 5 },
  { departamento: "Guaymallén", cantidad: 4 },
  { departamento: "Las Heras", cantidad: 3 },
  { departamento: "Luján de Cuyo", cantidad: 3 },
  { departamento: "San Martín", cantidad: 2 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadCafeCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadCafeCurada[] = [
  {
    "sociedadId": 59,
    "socios": [
      {
        "nombre": "Graciela Tomasa Bustamante",
        "personaId": 146
      },
      {
        "nombre": "Jose Luis Suriano",
        "personaId": 145
      }
    ]
  },
  {
    "sociedadId": 538,
    "socios": [
      {
        "nombre": "Carlos Lucas Chava Del Pino",
        "personaId": 1244
      },
      {
        "nombre": "Edgardo Omar Dosio"
      }
    ]
  },
  {
    "sociedadId": 926,
    "socios": [
      {
        "nombre": "Bibiana Alicia Ferreyra",
        "personaId": 2155
      },
      {
        "nombre": "Joaquín Ongay",
        "personaId": 4779
      },
      {
        "nombre": "Luis Ramiro Arnulphi",
        "personaId": 2154
      }
    ]
  },
  {
    "sociedadId": 3288,
    "socios": [
      {
        "nombre": "Francisco Perpetuo Maldonado",
        "personaId": 7155
      }
    ]
  },
  {
    "sociedadId": 3464,
    "socios": [
      {
        "nombre": "Quiroga Ariel David",
        "personaId": 7492
      }
    ]
  },
  {
    "sociedadId": 4417,
    "socios": [
      {
        "nombre": "Carlos Ernesto Rossi",
        "personaId": 9471
      },
      {
        "nombre": "Luisa Ana De La Reta",
        "personaId": 9472
      },
      {
        "nombre": "María Mercedes Rossi",
        "personaId": 1196
      }
    ]
  },
  {
    "sociedadId": 4523,
    "socios": [
      {
        "nombre": "Gaston Emiliano Ortiz",
        "personaId": 9699
      },
      {
        "nombre": "Sergio Fabian Jofré Altieri",
        "personaId": 9700
      }
    ]
  },
  {
    "sociedadId": 4538,
    "socios": [
      {
        "nombre": "Francisca Isabel Ayala",
        "personaId": 9735
      }
    ]
  },
  {
    "sociedadId": 5096,
    "socios": [
      {
        "nombre": "Marilina Elizabeth Fruscella",
        "personaId": 10856
      },
      {
        "nombre": "Michael Bonicelli",
        "personaId": 319
      }
    ]
  },
  {
    "sociedadId": 6419,
    "socios": [
      {
        "nombre": "Bauco Andres Francisco",
        "personaId": 13426
      },
      {
        "nombre": "Bazan Nicolas",
        "personaId": 13424
      },
      {
        "nombre": "Felix Masera",
        "personaId": 13425
      },
      {
        "nombre": "Gonzalez Renzo Favio",
        "personaId": 13427
      },
      {
        "nombre": "Pivetta Maria Emilia",
        "personaId": 13423
      }
    ]
  },
  {
    "sociedadId": 6618,
    "socios": [
      {
        "nombre": "Maria Azul Grau",
        "personaId": 13807
      },
      {
        "nombre": "Maria De Los Ángeles Grau",
        "personaId": 13806
      },
      {
        "nombre": "Maria Luz Grau",
        "personaId": 13805
      }
    ]
  },
  {
    "sociedadId": 6652,
    "socios": [
      {
        "nombre": "Mariano Javier Paolantonio",
        "personaId": 13863
      },
      {
        "nombre": "Rafael Cesar Cortinez",
        "personaId": 13862
      }
    ]
  },
  {
    "sociedadId": 7560,
    "socios": [
      {
        "nombre": "María Cecilia González",
        "personaId": 15554
      }
    ]
  },
  {
    "sociedadId": 7659,
    "socios": [
      {
        "nombre": "Piñeiro Gonzalo Herman",
        "personaId": 15759
      }
    ]
  },
  {
    "sociedadId": 7849,
    "socios": [
      {
        "nombre": "Exequiel Alejandro Rapp",
        "personaId": 16113
      },
      {
        "nombre": "Lilia Laura Guillén",
        "personaId": 16112
      }
    ]
  },
  {
    "sociedadId": 8228,
    "socios": [
      {
        "nombre": "Ivan Agustin Rapp",
        "personaId": 16812
      },
      {
        "nombre": "Luciano Ariel Ramirez",
        "personaId": 16811
      }
    ]
  },
  {
    "sociedadId": 8808,
    "socios": [
      {
        "nombre": "Fernando Guillermo Garcia",
        "personaId": 17895
      },
      {
        "nombre": "Olga Daniela Scalise",
        "personaId": 17894
      }
    ]
  },
  {
    "sociedadId": 9771,
    "socios": [
      {
        "nombre": "Giménez Nahuel Roberto",
        "personaId": 19707
      },
      {
        "nombre": "Lucas Germán Laborde",
        "personaId": 19681
      }
    ]
  },
  {
    "sociedadId": 9830,
    "socios": [
      {
        "nombre": "Estefany Elizabeth Rios",
        "personaId": 1448
      },
      {
        "nombre": "Lucas Germán Laborde",
        "personaId": 19681
      }
    ]
  },
  {
    "sociedadId": 9931,
    "socios": [
      {
        "nombre": "German Ignacio Leyes",
        "personaId": 19980
      },
      {
        "nombre": "José Alberto Esposito",
        "personaId": 18797
      },
      {
        "nombre": "Juan Pablo Esposito",
        "personaId": 18796
      }
    ]
  },
  {
    "sociedadId": 10003,
    "socios": [
      {
        "nombre": "Anabel Denis Simionato",
        "personaId": 20105
      },
      {
        "nombre": "Juan Ignacio Rocha",
        "personaId": 7749
      },
      {
        "nombre": "Mariana Ester Martin",
        "personaId": 15421
      }
    ]
  },
  {
    "sociedadId": 10153,
    "socios": [
      {
        "nombre": "María Mercedes Rossi",
        "personaId": 1196
      }
    ]
  },
  {
    "sociedadId": 10631,
    "socios": [
      {
        "nombre": "Lilia Laura Guillén",
        "personaId": 16112
      },
      {
        "nombre": "Marcos David Guillén",
        "personaId": 21171
      }
    ]
  },
  {
    "sociedadId": 11327,
    "socios": [
      {
        "nombre": "David Angel Carreras",
        "personaId": 22067
      },
      {
        "nombre": "Gisel Natali Díaz",
        "personaId": 12899
      },
      {
        "nombre": "Sheila Luciana Gutierrez",
        "personaId": 22068
      }
    ]
  },
  {
    "sociedadId": 11490,
    "socios": [
      {
        "nombre": "Maria de los Milagros Millione Almeida",
        "personaId": 22351
      }
    ]
  },
  {
    "sociedadId": 12709,
    "socios": [
      {
        "nombre": "Mariana Ester Martin",
        "personaId": 15421
      },
      {
        "nombre": "Virginia Elena Mendoza",
        "personaId": 17451
      }
    ]
  },
  {
    "sociedadId": 12789,
    "socios": [
      {
        "nombre": "Giuliano Eduardo Insegna Koltes",
        "personaId": 24228
      },
      {
        "nombre": "Marcos Santiago Villanueva",
        "personaId": 24229
      }
    ]
  },
  {
    "sociedadId": 12847,
    "socios": [
      {
        "nombre": "Laura Viviana Avila",
        "personaId": 24318
      },
      {
        "nombre": "Roxanna Del Carmen Perez Gonzalez",
        "personaId": 24317
      }
    ]
  },
  {
    "sociedadId": 13661,
    "socios": [
      {
        "nombre": "Guillermo Ariel Funes",
        "personaId": 25471
      },
      {
        "nombre": "Nicolás Martín Canet",
        "personaId": 423
      },
      {
        "nombre": "Rodrigo Quiroga Balmaceda",
        "personaId": 21382
      }
    ]
  },
  {
    "sociedadId": 14132,
    "socios": [
      {
        "nombre": "Walter Fabian Salomon",
        "personaId": 26162
      }
    ]
  },
  {
    "sociedadId": 14432,
    "socios": [
      {
        "nombre": "Ariana Serpa",
        "personaId": 24419
      },
      {
        "nombre": "Fernando Joaquín Trujillo",
        "personaId": 18966
      }
    ]
  },
  {
    "sociedadId": 14597,
    "socios": [
      {
        "nombre": "Carlos Alfredo Baccaro",
        "personaId": 26800
      },
      {
        "nombre": "Rafael Horacio Manzanares",
        "personaId": 20225
      }
    ]
  },
  {
    "sociedadId": 14828,
    "socios": [
      {
        "nombre": "Pamela Maria Palumbo",
        "personaId": 27177
      }
    ]
  },
  {
    "sociedadId": 16287,
    "socios": [
      {
        "nombre": "Antonio Alejandro Durán",
        "personaId": 6250
      },
      {
        "nombre": "Martín Nicolás Durán",
        "personaId": 29217
      },
      {
        "nombre": "Santiago Martín Ulloa",
        "personaId": 29218
      }
    ]
  },
  {
    "sociedadId": 16837,
    "socios": [
      {
        "nombre": "Adrián Herranz Borrachero",
        "personaId": 29966
      },
      {
        "nombre": "Lucas Lopez Fiterman",
        "personaId": 29967
      }
    ]
  },
  {
    "sociedadId": 16908,
    "socios": [
      {
        "nombre": "Nicolás Facundo Rez Masud",
        "personaId": 15558
      },
      {
        "nombre": "Nicolás Girala",
        "personaId": 15557
      },
      {
        "nombre": "Rodrigo Antonio Isgro Alastra",
        "personaId": 30079
      }
    ]
  },
  {
    "sociedadId": 17554,
    "socios": [
      {
        "nombre": "Erica Angelica Lopez",
        "personaId": 30983
      }
    ]
  },
  {
    "sociedadId": 17996,
    "socios": [
      {
        "nombre": "Soledad Vilma Llanos Quispe",
        "personaId": 31526
      }
    ]
  },
  {
    "sociedadId": 18222,
    "socios": [
      {
        "nombre": "Mariana Lorena Herrero",
        "personaId": 31818
      },
      {
        "nombre": "María Natalia Ortega",
        "personaId": 31817
      }
    ]
  },
  {
    "sociedadId": 18426,
    "socios": [
      {
        "nombre": "Marcos David Guillén",
        "personaId": 21171
      },
      {
        "nombre": "Mateo Samuel Guillén",
        "personaId": 32053
      }
    ]
  },
  {
    "sociedadId": 19113,
    "socios": [
      {
        "nombre": "Sergio Jose Bussetti",
        "personaId": 32947
      },
      {
        "nombre": "Silvia Susana Del Carmen Baldi",
        "personaId": 32948
      }
    ]
  },
  {
    "sociedadId": 1210,
    "socios": []
  }
];
