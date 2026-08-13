// Copia server-side de frontend/src/data/nichoReciclaje.ts, mismo criterio
// que el resto de backend/src/data/*.ts: el backend no importa del
// workspace frontend, así que estos agregados se duplican acá (DEPARTAMENTOS
// como array plano, no Map, para el HTML server-rendered de SEO -- ver
// seo.ts). Ver la nota completa en el archivo del frontend.

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 27 },
  { tipo: "S.A.", cantidad: 10 },
  { tipo: "S.R.L.", cantidad: 2 },
  { tipo: "Cooperativa", cantidad: 1 },
  { tipo: "Unión Transitoria", cantidad: 1 },
];

export const OLEADAS = [
  { periodo: "2018-2020", plasticos: 4, metales: 3, ambiental: 10 },
  { periodo: "2021-2023", plasticos: 0, metales: 7, ambiental: 7 },
  { periodo: "2024-2026", plasticos: 1, metales: 0, ambiental: 6 },
];

export const TOP_CAPITALES = [
  { etiqueta: "Transformación Estratégica Circular S.A. (2024)", valor: 60000000 },
  { etiqueta: "Trigenus S.A. (2023)", valor: 4500000 },
  { etiqueta: "Palcriva Estrategias Integrales S.A.S. (2025)", valor: 3000000 },
  { etiqueta: "Hibrida S.R.L. (2019)", valor: 3500000 },
  { etiqueta: "Norplast S.A.S. (2018)", valor: 2000000 },
  { etiqueta: "Junín Punto Limpio S.A.U. (2021)", valor: 2000000 },
];

export const DEPARTAMENTOS_RECICLAJE = [
{ departamento: "Capital", cantidad: 11 },
  { departamento: "Guaymallén", cantidad: 10 },
  { departamento: "Godoy Cruz", cantidad: 7 },
  { departamento: "Luján de Cuyo", cantidad: 4 },
  { departamento: "Las Heras", cantidad: 2 },
  { departamento: "San Rafael", cantidad: 2 },
  { departamento: "Junín", cantidad: 1 },
  { departamento: "Maipú", cantidad: 1 },
  { departamento: "Malargüe", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadReciclajeCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadReciclajeCurada[] = [
  {
    "sociedadId": 1590,
    "socios": [
      {
        "nombre": "Analía Mercado",
        "personaId": 3590
      },
      {
        "nombre": "Juan Manuel Norton Mercado",
        "personaId": 3591
      },
      {
        "nombre": "Sofía Norton Mercado",
        "personaId": 3592
      }
    ]
  },
  {
    "sociedadId": 1617,
    "socios": [
      {
        "nombre": "Fernando Nicolás Banchini",
        "personaId": 3644
      },
      {
        "nombre": "Víctor Santiago Banchini",
        "personaId": 3645
      }
    ]
  },
  {
    "sociedadId": 1979,
    "socios": [
      {
        "nombre": "Maricel Nuri Blanco",
        "personaId": 4419
      },
      {
        "nombre": "Ricardo Horacio Videla",
        "personaId": 4418
      }
    ]
  },
  {
    "sociedadId": 2218,
    "socios": [
      {
        "nombre": "Gonzalo Luis Perez Cuvit",
        "personaId": 4882
      },
      {
        "nombre": "Verónica Luján Delponti",
        "personaId": 4881
      }
    ]
  },
  {
    "sociedadId": 2640,
    "socios": [
      {
        "nombre": "Hugo Marcelo La Via",
        "personaId": 5784
      },
      {
        "nombre": "Julio Dagoberto Sosa",
        "personaId": 5785
      }
    ]
  },
  {
    "sociedadId": 2922,
    "socios": [
      {
        "nombre": "Lidia Miriam Beatriz Ortiz",
        "personaId": 6377
      }
    ]
  },
  {
    "sociedadId": 2923,
    "socios": [
      {
        "nombre": "Carlos Ernesto Arce",
        "personaId": 6381
      },
      {
        "nombre": "Leonardo Damian Cano",
        "personaId": 6380
      },
      {
        "nombre": "Pio Mauricio De Amoriza",
        "personaId": 6379
      }
    ]
  },
  {
    "sociedadId": 2955,
    "socios": [
      {
        "nombre": "Alejandro Federico Llopiz",
        "personaId": 6447
      },
      {
        "nombre": "Sabrina Verónica Herrera Camsen",
        "personaId": 6448
      }
    ]
  },
  {
    "sociedadId": 3090,
    "socios": [
      {
        "nombre": "Franco Salvador Alderisi",
        "personaId": 6755
      }
    ]
  },
  {
    "sociedadId": 3222,
    "socios": [
      {
        "nombre": "Jorge Luis Garofalo"
      },
      {
        "nombre": "Santiago Jose Corti",
        "personaId": 7011
      }
    ]
  },
  {
    "sociedadId": 3333,
    "socios": [
      {
        "nombre": "Fernando Manuel Muñiz",
        "personaId": 7242
      }
    ]
  },
  {
    "sociedadId": 3874,
    "socios": [
      {
        "nombre": "Aguirre María Virginia",
        "personaId": 8336
      },
      {
        "nombre": "Suarez Andrés Ariel",
        "personaId": 8335
      }
    ]
  },
  {
    "sociedadId": 4094,
    "socios": [
      {
        "nombre": "Albert Luis Héctor",
        "personaId": 8804
      },
      {
        "nombre": "Bochaca José Ricardo",
        "personaId": 8803
      }
    ]
  },
  {
    "sociedadId": 4518,
    "socios": [
      {
        "nombre": "Daniel Gustavo Pelleritti",
        "personaId": 9690
      },
      {
        "nombre": "Mario Fabián Pelleritti",
        "personaId": 9689
      }
    ]
  },
  {
    "sociedadId": 4678,
    "socios": [
      {
        "nombre": "Juan Ramón Mirasol",
        "personaId": 10038
      }
    ]
  },
  {
    "sociedadId": 4692,
    "socios": [
      {
        "nombre": "Gladys Beatriz Romero",
        "personaId": 10070
      },
      {
        "nombre": "Juan Pablo Izquierdo",
        "personaId": 10069
      }
    ]
  },
  {
    "sociedadId": 5102,
    "socios": [
      {
        "nombre": "Miguel Ángel Bustos",
        "personaId": 10862
      }
    ]
  },
  {
    "sociedadId": 5747,
    "socios": [
      {
        "nombre": "Blejman Gabriel Aníbal",
        "personaId": 12123
      },
      {
        "nombre": "Cohen Andrés Martin",
        "personaId": 12122
      }
    ]
  },
  {
    "sociedadId": 5888,
    "socios": [
      {
        "nombre": "Jesica Melina Ikaczijk",
        "personaId": 12404
      }
    ]
  },
  {
    "sociedadId": 6366,
    "socios": []
  },
  {
    "sociedadId": 6462,
    "socios": [
      {
        "nombre": "Estrada Beatriz Alejandra",
        "personaId": 13511
      },
      {
        "nombre": "Leguiza Rita Noemi",
        "personaId": 13510
      }
    ]
  },
  {
    "sociedadId": 6465,
    "socios": [
      {
        "nombre": "Alberto Osvaldo Cardozo",
        "personaId": 13514
      },
      {
        "nombre": "Estrada Beatriz Alejandra",
        "personaId": 13511
      }
    ]
  },
  {
    "sociedadId": 6772,
    "socios": [
      {
        "nombre": "Piran Salinas Carla Micaela",
        "personaId": 14088
      },
      {
        "nombre": "Piran Salinas Keila Martina",
        "personaId": 14087
      }
    ]
  },
  {
    "sociedadId": 6932,
    "socios": [
      {
        "nombre": "Alonso Gerardo Berríos",
        "personaId": 14385
      },
      {
        "nombre": "Carmen Trinidad Chiapero",
        "personaId": 14380
      },
      {
        "nombre": "Cesar Julián Berríos",
        "personaId": 14384
      },
      {
        "nombre": "Leandro Agustín Berríos",
        "personaId": 14381
      },
      {
        "nombre": "María Eugenia Berríos",
        "personaId": 14383
      },
      {
        "nombre": "Osvaldo Martín Berríos",
        "personaId": 14382
      }
    ]
  },
  {
    "sociedadId": 7769,
    "socios": [
      {
        "nombre": "Gonzalo Muñoz",
        "personaId": 15971
      },
      {
        "nombre": "Mercedes Del Rosario Hidalgo",
        "personaId": 15972
      }
    ]
  },
  {
    "sociedadId": 7797,
    "socios": [
      {
        "nombre": "Construcciones Electromecánicas Del Oeste S.A."
      },
      {
        "nombre": "Tecnologías Y Servicios Ambientales S.A."
      }
    ]
  },
  {
    "sociedadId": 8140,
    "socios": [
      {
        "nombre": "Celeste Marina Cardozo",
        "personaId": 16642
      },
      {
        "nombre": "Marcos Emanuel Cardozo",
        "personaId": 16643
      }
    ]
  },
  {
    "sociedadId": 9269,
    "socios": [
      {
        "nombre": "Exequiel Daniel Cejas",
        "personaId": 18754
      },
      {
        "nombre": "Maximiliano Adrian Cejas",
        "personaId": 18755
      }
    ]
  },
  {
    "sociedadId": 9493,
    "socios": [
      {
        "nombre": "Albert Luis Héctor",
        "personaId": 8804
      },
      {
        "nombre": "Bochaca José Ricardo",
        "personaId": 8803
      }
    ]
  },
  {
    "sociedadId": 11052,
    "socios": [
      {
        "nombre": "Villalobos Godoy Mauro",
        "personaId": 21742
      }
    ]
  },
  {
    "sociedadId": 12552,
    "socios": [
      {
        "nombre": "Julio Pablo Asnal",
        "personaId": 23904
      },
      {
        "nombre": "Maria Mercedes Casas",
        "personaId": 23903
      },
      {
        "nombre": "Paulo Roman Ghiretti",
        "personaId": 23902
      }
    ]
  },
  {
    "sociedadId": 12692,
    "socios": [
      {
        "nombre": "Ramirez Fernando Mario",
        "personaId": 24088
      },
      {
        "nombre": "Ramirez Leonel Sebastian",
        "personaId": 24087
      }
    ]
  },
  {
    "sociedadId": 12707,
    "socios": [
      {
        "nombre": "Marcelo Javier Vera",
        "personaId": 24110
      }
    ]
  },
  {
    "sociedadId": 14711,
    "socios": [
      {
        "nombre": "Cecilia Elizabeth Suarez",
        "personaId": 26971
      },
      {
        "nombre": "Gustavo Ricardo Alvarez",
        "personaId": 26972
      }
    ]
  },
  {
    "sociedadId": 14788,
    "socios": [
      {
        "nombre": "Cecilia Camila Payeras",
        "personaId": 27092
      },
      {
        "nombre": "Diego Pérez Cuvit",
        "personaId": 27093
      },
      {
        "nombre": "María Florencia Benedicto",
        "personaId": 27094
      },
      {
        "nombre": "Recyclart S.A."
      }
    ]
  },
  {
    "sociedadId": 15109,
    "socios": [
      {
        "nombre": "Mariana Lucila Segovia",
        "personaId": 27584
      }
    ]
  },
  {
    "sociedadId": 15288,
    "socios": [
      {
        "nombre": "Carlos Gustavo Morgani",
        "personaId": 27835
      },
      {
        "nombre": "Javier Jesús Klita",
        "personaId": 8200
      },
      {
        "nombre": "Leonardo Raúl Iriarte",
        "personaId": 27834
      }
    ]
  },
  {
    "sociedadId": 16320,
    "socios": [
      {
        "nombre": "Carla Sofía Adaro",
        "personaId": 29272
      },
      {
        "nombre": "Fernando Luis Lopez Pesci",
        "personaId": 5396
      }
    ]
  },
  {
    "sociedadId": 16399,
    "socios": [
      {
        "nombre": "Eliana Noelia Sevilla",
        "personaId": 29375
      },
      {
        "nombre": "Leonardo Valentino Scafi",
        "personaId": 29374
      }
    ]
  },
  {
    "sociedadId": 18837,
    "socios": [
      {
        "nombre": "Pablo Alberto Syriani",
        "personaId": 13827
      },
      {
        "nombre": "Reyes Malena Lucia",
        "personaId": 32546
      }
    ]
  },
  {
    "sociedadId": 10598,
    "socios": []
  }
];
