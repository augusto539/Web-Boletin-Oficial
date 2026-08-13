// Copia server-side de frontend/src/data/nichoArquitectura.ts, mismo
// criterio que el resto de backend/src/data/*.ts: el backend no importa del
// workspace frontend, así que estos agregados se duplican acá (DEPARTAMENTOS
// como array plano, no Map, para el HTML server-rendered de SEO -- ver
// seo.ts). Ver la nota completa (incluyendo el socio sin personaId por
// nombre ambiguo) en el archivo del frontend.

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

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadArquitecturaCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadArquitecturaCurada[] = [
  {
    "sociedadId": 1957,
    "socios": [
      {
        "nombre": "Nicolás Guerra",
        "personaId": 4369
      }
    ]
  },
  {
    "sociedadId": 2997,
    "socios": [
      {
        "nombre": "Salomon Manuel Escobar Valencia",
        "personaId": 6540
      },
      {
        "nombre": "Sergio Fabian Mastropietro",
        "personaId": 2057
      }
    ]
  },
  {
    "sociedadId": 3178,
    "socios": [
      {
        "nombre": "Alberto Daniel Vargas Quillaguaman",
        "personaId": 6934
      },
      {
        "nombre": "Nicolas Alberto Vargas",
        "personaId": 6935
      }
    ]
  },
  {
    "sociedadId": 3396,
    "socios": [
      {
        "nombre": "Castro Claudio Bernabe",
        "personaId": 6024
      },
      {
        "nombre": "Lopez Gloria Daniela",
        "personaId": 6025
      }
    ]
  },
  {
    "sociedadId": 4009,
    "socios": [
      {
        "nombre": "Edgardo Gargiulo",
        "personaId": 916
      },
      {
        "nombre": "María Gabriela Reche",
        "personaId": 917
      }
    ]
  },
  {
    "sociedadId": 4274,
    "socios": [
      {
        "nombre": "Ariel Fernando Piantini",
        "personaId": 9171
      },
      {
        "nombre": "Mercedes Soler",
        "personaId": 9170
      }
    ]
  },
  {
    "sociedadId": 4497,
    "socios": [
      {
        "nombre": "Elena Alicia Baggio",
        "personaId": 9637
      },
      {
        "nombre": "Fabian Horacio Mason",
        "personaId": 9636
      },
      {
        "nombre": "Maria Emilia Lara",
        "personaId": 9638
      }
    ]
  },
  {
    "sociedadId": 6153,
    "socios": [
      {
        "nombre": "Elio Reinaldo Marcelo Guidarelli",
        "personaId": 12912
      },
      {
        "nombre": "Fabian Horacio Mason",
        "personaId": 9636
      },
      {
        "nombre": "Maria Emilia Lara",
        "personaId": 9638
      }
    ]
  },
  {
    "sociedadId": 6338,
    "socios": [
      {
        "nombre": "Chiara Gabriel Enrique",
        "personaId": 13252
      },
      {
        "nombre": "Tarditto Noelia Del Carmen",
        "personaId": 13253
      }
    ]
  },
  {
    "sociedadId": 6646,
    "socios": [
      {
        "nombre": "Javier Alberto Pérez",
        "personaId": 13855
      },
      {
        "nombre": "Sebastián José Baigorria",
        "personaId": 13856
      }
    ]
  },
  {
    "sociedadId": 7673,
    "socios": [
      {
        "nombre": "Micaela Belén Vicentini",
        "personaId": 15785
      },
      {
        "nombre": "Walter Ezequiel Pereyra",
        "personaId": 15784
      }
    ]
  },
  {
    "sociedadId": 9321,
    "socios": [
      {
        "nombre": "Adrián Marcelo Navarro",
        "personaId": 18865
      },
      {
        "nombre": "Fernando Abraham Moreno Fredes",
        "personaId": 18864
      },
      {
        "nombre": "Juan Gabriel Sanchez"
      },
      {
        "nombre": "Leonardo David Carrizo",
        "personaId": 18866
      },
      {
        "nombre": "Marta Inés Tambutto",
        "personaId": 18860
      },
      {
        "nombre": "Miguel Horacio Liendo",
        "personaId": 8478
      },
      {
        "nombre": "Paulina Liendo",
        "personaId": 18861
      },
      {
        "nombre": "Rocio Celeste Gonzalez",
        "personaId": 18867
      },
      {
        "nombre": "Tomás Liendo",
        "personaId": 7338
      }
    ]
  },
  {
    "sociedadId": 11701,
    "socios": [
      {
        "nombre": "Faisal Nabil Abdala",
        "personaId": 22611
      },
      {
        "nombre": "Vladimir Angileri Di Bernardo",
        "personaId": 22612
      }
    ]
  },
  {
    "sociedadId": 11955,
    "socios": [
      {
        "nombre": "Alejandro Agustín Marasco",
        "personaId": 23043
      },
      {
        "nombre": "Sergio Antonio Martins De Abreu",
        "personaId": 23042
      }
    ]
  },
  {
    "sociedadId": 12730,
    "socios": [
      {
        "nombre": "Patricia Alejandra Fadin",
        "personaId": 24141
      },
      {
        "nombre": "Walter José Prato",
        "personaId": 13154
      }
    ]
  },
  {
    "sociedadId": 12954,
    "socios": [
      {
        "nombre": "Gonzalo Manuel Marcolini",
        "personaId": 24473
      },
      {
        "nombre": "María Cecilia Díaz",
        "personaId": 24474
      },
      {
        "nombre": "Renata Irupe Lede",
        "personaId": 24475
      }
    ]
  },
  {
    "sociedadId": 13858,
    "socios": [
      {
        "nombre": "Juan Manuel Filice",
        "personaId": 19005
      },
      {
        "nombre": "Roberto Santos Piña",
        "personaId": 25754
      }
    ]
  },
  {
    "sociedadId": 13918,
    "socios": [
      {
        "nombre": "Edgardo Sebastian Furiassi",
        "personaId": 25852
      }
    ]
  },
  {
    "sociedadId": 14666,
    "socios": [
      {
        "nombre": "María Eugenia Mora",
        "personaId": 26908
      },
      {
        "nombre": "Tom Hughes",
        "personaId": 26907
      }
    ]
  },
  {
    "sociedadId": 15013,
    "socios": [
      {
        "nombre": "Mariano Alberto Sabas",
        "personaId": 7265
      },
      {
        "nombre": "Pereyra Varona Matías",
        "personaId": 27448
      }
    ]
  },
  {
    "sociedadId": 15069,
    "socios": [
      {
        "nombre": "Maria Agustina Diumenjo",
        "personaId": 27535
      },
      {
        "nombre": "Roxana Lo Giudice",
        "personaId": 27534
      }
    ]
  },
  {
    "sociedadId": 16942,
    "socios": [
      {
        "nombre": "Agustín Quenaya Cayo",
        "personaId": 30130
      },
      {
        "nombre": "Francisca Laime Colque",
        "personaId": 30132
      },
      {
        "nombre": "Rodrigo Agustín Quenaya Laime",
        "personaId": 30131
      },
      {
        "nombre": "Romina Liseth Quenaya Laime",
        "personaId": 30134
      },
      {
        "nombre": "Tania Nancy Quenaya Laime",
        "personaId": 30133
      }
    ]
  },
  {
    "sociedadId": 17033,
    "socios": [
      {
        "nombre": "María José Manzano",
        "personaId": 30269
      },
      {
        "nombre": "Miguel Carlos Manzano",
        "personaId": 30268
      }
    ]
  },
  {
    "sociedadId": 18889,
    "socios": [
      {
        "nombre": "Ignacio Floreano",
        "personaId": 32612
      },
      {
        "nombre": "Maria Jimena Maia Seveso",
        "personaId": 32611
      }
    ]
  },
  {
    "sociedadId": 19202,
    "socios": [
      {
        "nombre": "Leonel Mario Rodrigo Combes Ríos",
        "personaId": 3119
      },
      {
        "nombre": "Rodolfo Nicolas Combes Rios",
        "personaId": 33095
      }
    ]
  },
  {
    "sociedadId": 19225,
    "socios": [
      {
        "nombre": "Andrés Jonathan Torres Castro",
        "personaId": 31488
      },
      {
        "nombre": "Javier Marcelo Cruz",
        "personaId": 33149
      }
    ]
  },
  {
    "sociedadId": 9504,
    "socios": [
      {
        "nombre": "Cristian Alejandro Balastegui",
        "personaId": 19198
      },
      {
        "nombre": "Cristian Danilo Montes",
        "personaId": 19199
      },
      {
        "nombre": "Ignacio Pedro",
        "personaId": 19200
      }
    ]
  }
];
