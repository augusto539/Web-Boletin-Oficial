// Contenido del informe "Enoturismo en Mendoza", segundo de la serie de
// nichos sectoriales. Mismo criterio que nichoCannabis.ts: texto y cifras
// redactados a mano a partir del documento fuente, integrados acá como
// contenido estático (ver docs/pendientes.md sobre el criterio acordado
// para esta serie).
//
// sociedadId/personaId: cada entidad y cada socio se cruzó a mano contra la
// base (por CUIT donde había, por los vínculos reales de la sociedad para
// los socios) — las 43 entidades del documento fuente calzaron exacto
// contra la base real. Enlazan a las fichas /sociedad/:id y /persona/:id.
//
// Nota de corrección: el documento fuente traía una tabla de evolución
// anual (2021: 7, 2024: 8, 2025: 9 → total 49) que no coincide con el
// directorio final de 43 empresas que el propio documento define y detalla
// una por una. Se recalculó la serie anual contando directamente las
// fechas de publicación de las 43 entidades del directorio (que sí calzan
// exacto contra CUIT/capital/departamento en la base real), no la tabla
// resumen del documento. Mismo criterio para "26 de 43 en 2023-2025", que
// pasa a ser "22 de 43".

const GRIS_TENUE = "#b9b9b9";
const VINO = "#691824";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 2, color: GRIS_TENUE },
  { etiqueta: "2018", valor: 0, color: GRIS_TENUE },
  { etiqueta: "2019", valor: 5, color: GRIS_TENUE },
  { etiqueta: "2020", valor: 3, color: GRIS_TENUE },
  { etiqueta: "2021", valor: 5, color: GRIS_TENUE },
  { etiqueta: "2022", valor: 2, color: GRIS_TENUE },
  { etiqueta: "2023", valor: 9, color: VINO },
  { etiqueta: "2024", valor: 6, color: VINO },
  { etiqueta: "2025", valor: 7, color: VINO },
  { etiqueta: "2026*", valor: 4, color: VINO },
];

export const LEYENDA_EVOLUCION = [
  { color: GRIS_TENUE, etiqueta: "2017–2022" },
  { color: VINO, etiqueta: "2023–2026: escalón sostenido" },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 36 },
  { tipo: "S.A.", cantidad: 4 },
  { tipo: "S.R.L.", cantidad: 2 },
  { tipo: "Unión Transitoria", cantidad: 1 },
];

export const DEPARTAMENTOS_ENOTURISMO = [
  { departamento: "Capital", cantidad: 17 },
  { departamento: "Luján de Cuyo", cantidad: 5 },
  { departamento: "Maipú", cantidad: 4 },
  { departamento: "Guaymallén", cantidad: 4 },
  { departamento: "Godoy Cruz", cantidad: 3 },
  { departamento: "Tupungato", cantidad: 2 },
  { departamento: "Rivadavia", cantidad: 1 },
  { departamento: "San Carlos", cantidad: 1 },
  { departamento: "San Martín", cantidad: 1 },
  { departamento: "San Rafael", cantidad: 1 },
  { departamento: "Tunuyán", cantidad: 1 },
  { departamento: "Junín", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadEnoturismoCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadEnoturismoCurada[] = [
  {
    "sociedadId": 78,
    "socios": [
      {
        "nombre": "Agustín Julián Roby",
        "personaId": 196
      },
      {
        "nombre": "Andrés José Roby",
        "personaId": 197
      },
      {
        "nombre": "Federico Roby",
        "personaId": 195
      },
      {
        "nombre": "Tomás Roby",
        "personaId": 194
      }
    ]
  },
  {
    "sociedadId": 156,
    "socios": [
      {
        "nombre": "Leticia María Fragapane",
        "personaId": 391
      },
      {
        "nombre": "Víctor Sebastián Weigandt",
        "personaId": 392
      }
    ]
  },
  {
    "sociedadId": 2587,
    "socios": [
      {
        "nombre": "Constanza María Paderne",
        "personaId": 4380
      },
      {
        "nombre": "Delfina Maria Paderne",
        "personaId": 5658
      },
      {
        "nombre": "Felipe José Paderne",
        "personaId": 5659
      },
      {
        "nombre": "Fernando José Paderne",
        "personaId": 4379
      },
      {
        "nombre": "Francisco Evangelista",
        "personaId": 5657
      },
      {
        "nombre": "Raúl Miguel Paderne",
        "personaId": 5656
      }
    ]
  },
  {
    "sociedadId": 2849,
    "socios": [
      {
        "nombre": "Florencia Rosalia Olivares",
        "personaId": 6230
      },
      {
        "nombre": "Orlando Javier Di Marco",
        "personaId": 6231
      }
    ]
  },
  {
    "sociedadId": 3544,
    "socios": [
      {
        "nombre": "Analía Moyano",
        "personaId": 7658
      },
      {
        "nombre": "Humberto Carparelli",
        "personaId": 7657
      },
      {
        "nombre": "Natalia Carparelli",
        "personaId": 7655
      },
      {
        "nombre": "Romina Carparelli",
        "personaId": 7656
      }
    ]
  },
  {
    "sociedadId": 3697,
    "socios": [
      {
        "nombre": "Eduardo Sebastian Salas",
        "personaId": 7966
      }
    ]
  },
  {
    "sociedadId": 3835,
    "socios": [
      {
        "nombre": "Eduardo Emilio Mur Dell Innocenti",
        "personaId": 8257
      },
      {
        "nombre": "Rodolfo Emmanuel Calderaro",
        "personaId": 1363
      }
    ]
  },
  {
    "sociedadId": 4435,
    "socios": [
      {
        "nombre": "Gustavo Adolfo Arnold",
        "personaId": 901
      },
      {
        "nombre": "Marina Beatriz Arnold",
        "personaId": 902
      }
    ]
  },
  {
    "sociedadId": 5245,
    "socios": [
      {
        "nombre": "Luis Daniel Armentano",
        "personaId": 1161
      },
      {
        "nombre": "Nicolás Armentano",
        "personaId": 1162
      }
    ]
  },
  {
    "sociedadId": 5763,
    "socios": [
      {
        "nombre": "Aldo Luis Biondolillo",
        "personaId": 12150
      },
      {
        "nombre": "Alejandro Martin Biondolillo",
        "personaId": 12148
      },
      {
        "nombre": "Dorothy Zingaretti",
        "personaId": 12151
      },
      {
        "nombre": "Enzo Américo Mugnani Aubone",
        "personaId": 12149
      },
      {
        "nombre": "Felito S.A.",
        "sociedadId": 19494
      },
      {
        "nombre": "Leonardo Biondolillo",
        "personaId": 12152
      },
      {
        "nombre": "Mariano Gabriel Biondolillo",
        "personaId": 12153
      }
    ]
  },
  {
    "sociedadId": 6251,
    "socios": [
      {
        "nombre": "Stephen Paul Huse",
        "personaId": 13078
      }
    ]
  },
  {
    "sociedadId": 6361,
    "socios": [
      {
        "nombre": "Eduardo Bernabé Toledo",
        "personaId": 13304
      },
      {
        "nombre": "Luis Miguel Alvarez",
        "personaId": 8072
      }
    ]
  },
  {
    "sociedadId": 6708,
    "socios": [
      {
        "nombre": "Andres Lafarge",
        "personaId": 13977
      },
      {
        "nombre": "Romina Maria Julia Rolon",
        "personaId": 13976
      }
    ]
  },
  {
    "sociedadId": 6731,
    "socios": [
      {
        "nombre": "Da Valle Alberto Oscar",
        "personaId": 14012
      },
      {
        "nombre": "Da Valle Federico Alberto",
        "personaId": 14015
      },
      {
        "nombre": "Da Valle Jerónimo Andrés",
        "personaId": 14014
      },
      {
        "nombre": "Da Valle María Fernanda",
        "personaId": 14013
      }
    ]
  },
  {
    "sociedadId": 7534,
    "socios": [
      {
        "nombre": "Agostina Denise Di Palma",
        "personaId": 15510
      },
      {
        "nombre": "Matias Nicolas Barrios",
        "personaId": 15509
      }
    ]
  },
  {
    "sociedadId": 8251,
    "socios": [
      {
        "nombre": "Marcelo Fabián Gualpa",
        "personaId": 16726
      },
      {
        "nombre": "Roberto Arrigo",
        "personaId": 16853
      }
    ]
  },
  {
    "sociedadId": 9365,
    "socios": [
      {
        "nombre": "Analía Rosa Videla",
        "personaId": 15210
      },
      {
        "nombre": "Pedro Maximiliano Constantini",
        "personaId": 15209
      }
    ]
  },
  {
    "sociedadId": 11258,
    "socios": []
  },
  {
    "sociedadId": 11818,
    "socios": [
      {
        "nombre": "Micaela Beatriz Morales",
        "personaId": 22808
      },
      {
        "nombre": "Zasha Banchero Lo Bello",
        "personaId": 22807
      }
    ]
  },
  {
    "sociedadId": 12052,
    "socios": [
      {
        "nombre": "Jose Luis Martinez Gullotta",
        "personaId": 23180
      }
    ]
  },
  {
    "sociedadId": 12111,
    "socios": [
      {
        "nombre": "Jorge Enrique Cacciaguerra Silva",
        "personaId": 23270
      },
      {
        "nombre": "Jorge Mauricio Cacciaguerra",
        "personaId": 23271
      }
    ]
  },
  {
    "sociedadId": 12198,
    "socios": [
      {
        "nombre": "Guillermo Pablo Souto",
        "personaId": 23417
      }
    ]
  },
  {
    "sociedadId": 12343,
    "socios": [
      {
        "nombre": "Fabio Roque Maio",
        "personaId": 14612
      },
      {
        "nombre": "Santiago Andres Bacigalupo",
        "personaId": 14611
      }
    ]
  },
  {
    "sociedadId": 12544,
    "socios": [
      {
        "nombre": "María Marta Sottano",
        "personaId": 23885
      }
    ]
  },
  {
    "sociedadId": 12649,
    "socios": [
      {
        "nombre": "Francisco Julian De La Reta",
        "personaId": 1354
      },
      {
        "nombre": "Magdalena Toso",
        "personaId": 24048
      }
    ]
  },
  {
    "sociedadId": 12896,
    "socios": [
      {
        "nombre": "Jannik Reichenbach",
        "personaId": 24387
      },
      {
        "nombre": "Jens Reichenbach",
        "personaId": 24386
      },
      {
        "nombre": "Joachim Hofsähs",
        "personaId": 24389
      },
      {
        "nombre": "Jonas Reichenbach",
        "personaId": 24388
      }
    ]
  },
  {
    "sociedadId": 13486,
    "socios": [
      {
        "nombre": "Federico Guillermo Augusto Perales",
        "personaId": 25236
      },
      {
        "nombre": "Javier Enrique Dabat",
        "personaId": 25238
      },
      {
        "nombre": "Josefina Andant",
        "personaId": 25237
      },
      {
        "nombre": "Lara Cecilia Zabalza",
        "personaId": 25239
      }
    ]
  },
  {
    "sociedadId": 13810,
    "socios": [
      {
        "nombre": "Diego Federico Giovanniello",
        "personaId": 25664
      },
      {
        "nombre": "Mariano Di Paola",
        "personaId": 25665
      },
      {
        "nombre": "Rocio Campoy Morist",
        "personaId": 25666
      }
    ]
  },
  {
    "sociedadId": 14010,
    "socios": [
      {
        "nombre": "Natalio Staiti",
        "personaId": 25983
      }
    ]
  },
  {
    "sociedadId": 14138,
    "socios": [
      {
        "nombre": "Malena Laricchia",
        "personaId": 26171
      },
      {
        "nombre": "Nicolas Cruces",
        "personaId": 26170
      }
    ]
  },
  {
    "sociedadId": 14855,
    "socios": [
      {
        "nombre": "Alberto Manuel González del Solar",
        "personaId": 27208
      },
      {
        "nombre": "Fernando Agustín Aldazabal Carrillo",
        "personaId": 27210
      },
      {
        "nombre": "José Cárdenas",
        "personaId": 27207
      },
      {
        "nombre": "Rodrigo Silveyra Perdriel",
        "personaId": 27209
      }
    ]
  },
  {
    "sociedadId": 15033,
    "socios": [
      {
        "nombre": "Jean Etienne Beaune",
        "personaId": 10291
      }
    ]
  },
  {
    "sociedadId": 15592,
    "socios": [
      {
        "nombre": "Facundo Chavarría",
        "personaId": 28281
      },
      {
        "nombre": "Sergio Gustavo Medviginer",
        "personaId": 28282
      }
    ]
  },
  {
    "sociedadId": 16169,
    "socios": [
      {
        "nombre": "Pierina Vidal Valestra",
        "personaId": 29050
      },
      {
        "nombre": "Victoria Vidal Valestra",
        "personaId": 29049
      }
    ]
  },
  {
    "sociedadId": 16859,
    "socios": [
      {
        "nombre": "Hernán Carlos Vega",
        "personaId": 30000
      },
      {
        "nombre": "Nicolás Caggiano Pini",
        "personaId": 29999
      }
    ]
  },
  {
    "sociedadId": 16918,
    "socios": [
      {
        "nombre": "Cristian Daniel Bravo",
        "personaId": 24301
      }
    ]
  },
  {
    "sociedadId": 17104,
    "socios": [
      {
        "nombre": "Alberto Manuel González del Solar",
        "personaId": 27208
      },
      {
        "nombre": "Fernando Agustín Aldazabal Carrillo",
        "personaId": 27210
      },
      {
        "nombre": "José Cárdenas",
        "personaId": 27207
      }
    ]
  },
  {
    "sociedadId": 17380,
    "socios": [
      {
        "nombre": "Rolando Martin Kaiser",
        "personaId": 30722
      }
    ]
  },
  {
    "sociedadId": 17779,
    "socios": [
      {
        "nombre": "Osvaldo Alfonso Pécile",
        "personaId": 31292
      }
    ]
  },
  {
    "sociedadId": 18433,
    "socios": [
      {
        "nombre": "Victoria Natalia Rosano",
        "personaId": 32055
      },
      {
        "nombre": "Yoel Sardinas Ramos",
        "personaId": 32056
      }
    ]
  },
  {
    "sociedadId": 18434,
    "socios": [
      {
        "nombre": "Victoria Natalia Rosano",
        "personaId": 32055
      },
      {
        "nombre": "Yoel Sardinas Ramos",
        "personaId": 32056
      }
    ]
  },
  {
    "sociedadId": 18583,
    "socios": [
      {
        "nombre": "Andrea Sandra Di Silvestre",
        "personaId": 32215
      },
      {
        "nombre": "Daniel Edgardo Álvarez",
        "personaId": 32214
      }
    ]
  },
  {
    "sociedadId": 18966,
    "socios": [
      {
        "nombre": "Raúl Alejandro Cardenas",
        "personaId": 32712
      }
    ]
  }
];
