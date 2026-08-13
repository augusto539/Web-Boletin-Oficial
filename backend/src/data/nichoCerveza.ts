// Copia server-side de frontend/src/data/nichoCerveza.ts, mismo criterio
// que el resto de backend/src/data/*.ts: el backend no importa del
// workspace frontend, así que estos agregados se duplican acá (DEPARTAMENTOS
// como array plano, no Map, para el HTML server-rendered de SEO -- ver
// seo.ts). Ver la nota completa en el archivo del frontend.

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 6 },
  { etiqueta: "2018", valor: 11 },
  { etiqueta: "2019", valor: 9 },
  { etiqueta: "2020", valor: 4 },
  { etiqueta: "2021", valor: 1 },
  { etiqueta: "2022", valor: 1 },
  { etiqueta: "2023", valor: 3 },
  { etiqueta: "2024", valor: 0 },
  { etiqueta: "2025", valor: 0 },
  { etiqueta: "2026*", valor: 0 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 22 },
  { tipo: "S.R.L.", cantidad: 7 },
  { tipo: "S.A.", cantidad: 6 },
  { tipo: "Asociación Civil", cantidad: 1 },
];

export const DEPARTAMENTOS_CERVEZA = [
{ departamento: "Capital", cantidad: 9 },
  { departamento: "Godoy Cruz", cantidad: 8 },
  { departamento: "Guaymallén", cantidad: 5 },
  { departamento: "Rivadavia", cantidad: 3 },
  { departamento: "Las Heras", cantidad: 2 },
  { departamento: "San Rafael", cantidad: 2 },
  { departamento: "San Martín", cantidad: 2 },
  { departamento: "Maipú", cantidad: 2 },
  { departamento: "Junín", cantidad: 1 },
  { departamento: "Luján de Cuyo", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadCervezaCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadCervezaCurada[] = [
  {
    "sociedadId": 65,
    "socios": [
      {
        "nombre": "Alexander Ernesto Atem",
        "personaId": 160
      },
      {
        "nombre": "Diego Alberto Pereyra",
        "personaId": 159
      },
      {
        "nombre": "Ignacio Moyano Sierra",
        "personaId": 162
      },
      {
        "nombre": "Marcelo Sebastián Golman Pallucca",
        "personaId": 161
      }
    ]
  },
  {
    "sociedadId": 269,
    "socios": [
      {
        "nombre": "Ángel Germán Barroso",
        "personaId": 624
      },
      {
        "nombre": "Solana Natali Arroyo Tous",
        "personaId": 625
      }
    ]
  },
  {
    "sociedadId": 289,
    "socios": [
      {
        "nombre": "Jerónimo Magdalena",
        "personaId": 666
      },
      {
        "nombre": "Matthew Donald Ritz",
        "personaId": 665
      }
    ]
  },
  {
    "sociedadId": 378,
    "socios": [
      {
        "nombre": "Andres Gustavo Civit",
        "personaId": 895
      },
      {
        "nombre": "Carlos Jesus Martin Ruiz",
        "personaId": 892
      },
      {
        "nombre": "Carrillo Leandro Agustin",
        "personaId": 893
      },
      {
        "nombre": "Lucas Civit",
        "personaId": 894
      }
    ]
  },
  {
    "sociedadId": 559,
    "socios": [
      {
        "nombre": "Carlos Jesús Campagna",
        "personaId": 1305
      },
      {
        "nombre": "Ignacio Cinelli",
        "personaId": 1304
      },
      {
        "nombre": "Marcelo Fabián Benegas",
        "personaId": 1306
      }
    ]
  },
  {
    "sociedadId": 688,
    "socios": [
      {
        "nombre": "Candela Rez Masud",
        "personaId": 1582
      },
      {
        "nombre": "Emiliano Rez Masud",
        "personaId": 1581
      }
    ]
  },
  {
    "sociedadId": 1138,
    "socios": [
      {
        "nombre": "Alejandro Miguel Galliski Marquez",
        "personaId": 2612
      },
      {
        "nombre": "Jerome Henri Robert Constant",
        "personaId": 2611
      },
      {
        "nombre": "Quentin Florent Julien Pommier",
        "personaId": 2610
      },
      {
        "nombre": "Thibault Roger Charles Lepoutre",
        "personaId": 2613
      }
    ]
  },
  {
    "sociedadId": 1312,
    "socios": [
      {
        "nombre": "Gerardo Arnulphi",
        "personaId": 3010
      }
    ]
  },
  {
    "sociedadId": 1813,
    "socios": [
      {
        "nombre": "Ana Florencia Quagliarella",
        "personaId": 4055
      },
      {
        "nombre": "Lucas Marcelo Giorlando",
        "personaId": 4054
      }
    ]
  },
  {
    "sociedadId": 1866,
    "socios": [
      {
        "nombre": "Ángel Emiliano Gruini La Cruz",
        "personaId": 4172
      },
      {
        "nombre": "Matías Fabián Bismach",
        "personaId": 4171
      },
      {
        "nombre": "Ricardo Céstar Bismach",
        "personaId": 4173
      }
    ]
  },
  {
    "sociedadId": 1902,
    "socios": [
      {
        "nombre": "Juan Carlos Curato",
        "personaId": 4260
      },
      {
        "nombre": "Sergio Alberto Calderon",
        "personaId": 4261
      }
    ]
  },
  {
    "sociedadId": 2013,
    "socios": [
      {
        "nombre": "Alexander Ernesto Atem",
        "personaId": 160
      }
    ]
  },
  {
    "sociedadId": 2027,
    "socios": [
      {
        "nombre": "Diego Orlando Reos",
        "personaId": 4521
      },
      {
        "nombre": "Jesus Bengoechea Fernández-Castaño",
        "personaId": 4522
      }
    ]
  },
  {
    "sociedadId": 2226,
    "socios": [
      {
        "nombre": "Morales Ángel Gonzalo",
        "personaId": 4906
      },
      {
        "nombre": "Riquelme Walter Oscar",
        "personaId": 4905
      }
    ]
  },
  {
    "sociedadId": 2279,
    "socios": [
      {
        "nombre": "Federico Pace",
        "personaId": 4999
      },
      {
        "nombre": "Felipe Andrés Suarez Bidondo",
        "personaId": 5001
      },
      {
        "nombre": "Manuel Ortega Grebenc",
        "personaId": 5000
      },
      {
        "nombre": "Ramiro Sanchez Del Gesso",
        "personaId": 5002
      }
    ]
  },
  {
    "sociedadId": 2376,
    "socios": [
      {
        "nombre": "Federico Pace",
        "personaId": 4999
      },
      {
        "nombre": "Felipe Andrés Suarez Bidondo",
        "personaId": 5001
      },
      {
        "nombre": "Manuel Ortega Grebenc",
        "personaId": 5000
      },
      {
        "nombre": "Ramiro Sanchez Del Gesso",
        "personaId": 5002
      }
    ]
  },
  {
    "sociedadId": 2399,
    "socios": [
      {
        "nombre": "Luis Ramiro Arnulphi",
        "personaId": 2154
      },
      {
        "nombre": "Miguel Angel Chiapetta",
        "personaId": 5255
      }
    ]
  },
  {
    "sociedadId": 2445,
    "socios": [
      {
        "nombre": "Agustin Alvarado",
        "personaId": 5363
      },
      {
        "nombre": "Carlos Fernando Emilio Alvarado",
        "personaId": 5362
      },
      {
        "nombre": "Francisco Javier Appugliese Marrello",
        "personaId": 5365
      },
      {
        "nombre": "Marcela Alejandra Ochoa",
        "personaId": 5364
      }
    ]
  },
  {
    "sociedadId": 2514,
    "socios": [
      {
        "nombre": "Emiliano Facundo Horno",
        "personaId": 5496
      },
      {
        "nombre": "Enrique Alan Jorge Geraige Marianetti",
        "personaId": 5495
      }
    ]
  },
  {
    "sociedadId": 2609,
    "socios": [
      {
        "nombre": "Diego Hernán Del Canto",
        "personaId": 5710
      },
      {
        "nombre": "Eduardo Marcelo Diego Conill",
        "personaId": 5713
      },
      {
        "nombre": "Julieta Conill",
        "personaId": 5715
      },
      {
        "nombre": "Lisandro Conill",
        "personaId": 5716
      },
      {
        "nombre": "María De Las Nieves Funes Campoy",
        "personaId": 5714
      },
      {
        "nombre": "Mario Damián Difrieri",
        "personaId": 5712
      },
      {
        "nombre": "Mauricio Alberto Jorquera",
        "personaId": 5711
      },
      {
        "nombre": "Santiago Conill",
        "personaId": 5717
      }
    ]
  },
  {
    "sociedadId": 2798,
    "socios": [
      {
        "nombre": "Federico Nicolás Lorenzo",
        "personaId": 6127
      },
      {
        "nombre": "Juan Pablo Quevedo Mendoza",
        "personaId": 6125
      },
      {
        "nombre": "Pedro Emiliano Morales Monge",
        "personaId": 6126
      }
    ]
  },
  {
    "sociedadId": 3000,
    "socios": [
      {
        "nombre": "Juan Cruz Pereyra",
        "personaId": 6545
      }
    ]
  },
  {
    "sociedadId": 3384,
    "socios": [
      {
        "nombre": "Franco Nicolás Fernandez Barquiel",
        "personaId": 7348
      },
      {
        "nombre": "Juan Carlos Ro",
        "personaId": 7349
      },
      {
        "nombre": "Mabisemi S.R.L.",
        "sociedadId": 1866
      },
      {
        "nombre": "Matías Fabián Bismach",
        "personaId": 4171
      }
    ]
  },
  {
    "sociedadId": 3824,
    "socios": [
      {
        "nombre": "Juan Cruz Pereyra",
        "personaId": 6545
      }
    ]
  },
  {
    "sociedadId": 3852,
    "socios": [
      {
        "nombre": "Emanuel Sebastián Martinez",
        "personaId": 8290
      },
      {
        "nombre": "Fernando Andres Alba",
        "personaId": 8291
      },
      {
        "nombre": "Lucas Emiliano Lemole Rodríguez",
        "personaId": 8289
      }
    ]
  },
  {
    "sociedadId": 4252,
    "socios": [
      {
        "nombre": "Fausto José Martin",
        "personaId": 9118
      },
      {
        "nombre": "Gabriel Alejandro Martin",
        "personaId": 9117
      }
    ]
  },
  {
    "sociedadId": 4448,
    "socios": [
      {
        "nombre": "Agustin Alejandro Saez",
        "personaId": 7613
      },
      {
        "nombre": "Ignacio Manuel Saez",
        "personaId": 7614
      },
      {
        "nombre": "Rodrigo Miguel Sáez",
        "personaId": 9530
      }
    ]
  },
  {
    "sociedadId": 5265,
    "socios": [
      {
        "nombre": "Cristian Sebastián Picighelli",
        "personaId": 11174
      },
      {
        "nombre": "Jeremías Emanuel Fernández Ortiz",
        "personaId": 11173
      }
    ]
  },
  {
    "sociedadId": 5285,
    "socios": [
      {
        "nombre": "Julio Manuel Petry",
        "personaId": 6640
      },
      {
        "nombre": "Mateo Jose Petry Fernandez",
        "personaId": 11215
      },
      {
        "nombre": "Raquel Fernandez",
        "personaId": 11216
      }
    ]
  },
  {
    "sociedadId": 5728,
    "socios": [
      {
        "nombre": "Agustín Héctor Leiva",
        "personaId": 12090
      },
      {
        "nombre": "Federico Daniel Gambetta",
        "personaId": 12089
      },
      {
        "nombre": "Luciano Martin Ruiz",
        "personaId": 12091
      }
    ]
  },
  {
    "sociedadId": 6479,
    "socios": [
      {
        "nombre": "Alejandra Silvina Martinez",
        "personaId": 11588
      },
      {
        "nombre": "Daniel Alberto Garcia",
        "personaId": 13538
      },
      {
        "nombre": "Lorena Cecilia Martinez",
        "personaId": 13536
      },
      {
        "nombre": "Marcos Raúl Horacio Martinez",
        "personaId": 13535
      },
      {
        "nombre": "Raúl Alberto Martinez",
        "personaId": 13537
      }
    ]
  },
  {
    "sociedadId": 10168,
    "socios": [
      {
        "nombre": "Jose Marcelo Guidolin",
        "personaId": 20409
      },
      {
        "nombre": "Maria Emilia Guidolin",
        "personaId": 20410
      }
    ]
  },
  {
    "sociedadId": 10719,
    "socios": [
      {
        "nombre": "Rodolfo Alejandro Demo",
        "personaId": 21268
      }
    ]
  },
  {
    "sociedadId": 11012,
    "socios": [
      {
        "nombre": "Cecilia Verónica Garcia",
        "personaId": 21680
      }
    ]
  },
  {
    "sociedadId": 11055,
    "socios": [
      {
        "nombre": "Federico German Suter",
        "personaId": 21747
      },
      {
        "nombre": "Juan Bautista San Blas",
        "personaId": 7163
      },
      {
        "nombre": "Juan Carlos Sanz",
        "personaId": 21746
      },
      {
        "nombre": "Solassi Daniel Omar",
        "personaId": 21748
      }
    ]
  },
  {
    "sociedadId": 10677,
    "socios": []
  }
];
