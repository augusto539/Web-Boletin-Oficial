// Contenido del informe "Bodegas boutique en Mendoza", tercero de la serie
// de nichos sectoriales. Mismo criterio que nichoCannabis.ts y
// nichoEnoturismo.ts: texto y cifras redactados a mano a partir del
// documento fuente, integrados acá como contenido estático.
//
// sociedadId/personaId: cada entidad y cada socio se cruzó a mano contra la
// base (por CUIT donde había, por nombre donde no, y por los vínculos
// reales de la sociedad para los socios) — las 63 entidades del documento
// fuente calzaron exacto contra la base real. Enlazan a las fichas
// /sociedad/:id y /persona/:id.
//
// Nota de corrección: el documento fuente traía una tabla de evolución
// anual con 2020: 8, pero el directorio final de 63 bodegas que el propio
// documento detalla una por una solo tiene 7 publicaciones en 2020 (58 de
// las 63 tienen fecha capturada, 5 no — cifra que sí coincide con el
// directorio). Se corrigió ese único valor (8 → 7) contando directamente
// las fechas de publicación de las 58 entidades con fecha en el
// directorio. El resto de las tablas del documento (tipo societario,
// departamentos, mediana/rango de capital) se verificaron exactas contra
// la base real y no se modificaron.

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 3 },
  { etiqueta: "2018", valor: 6 },
  { etiqueta: "2019", valor: 6 },
  { etiqueta: "2020", valor: 7 },
  { etiqueta: "2021", valor: 7 },
  { etiqueta: "2022", valor: 7 },
  { etiqueta: "2023", valor: 9 },
  { etiqueta: "2024", valor: 6 },
  { etiqueta: "2025", valor: 5 },
  { etiqueta: "2026*", valor: 2 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 33 },
  { tipo: "S.A.", cantidad: 28 },
  { tipo: "S.R.L.", cantidad: 2 },
];

export const DEPARTAMENTOS_BODEGAS = [
  { departamento: "Capital", cantidad: 13 },
  { departamento: "Luján de Cuyo", cantidad: 10 },
  { departamento: "San Martín", cantidad: 6 },
  { departamento: "Guaymallén", cantidad: 6 },
  { departamento: "San Rafael", cantidad: 5 },
  { departamento: "Maipú", cantidad: 5 },
  { departamento: "Junín", cantidad: 3 },
  { departamento: "Tunuyán", cantidad: 3 },
  { departamento: "Las Heras", cantidad: 2 },
  { departamento: "San Carlos", cantidad: 2 },
  { departamento: "Godoy Cruz", cantidad: 2 },
  { departamento: "Tupungato", cantidad: 1 },
  { departamento: "Lavalle", cantidad: 1 },
  { departamento: "Rivadavia", cantidad: 1 },
  { departamento: "Santa Rosa", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadBodegaCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadBodegaCurada[] = [
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
    "sociedadId": 131,
    "socios": [
      {
        "nombre": "Jorge Omar Castillo",
        "personaId": 328
      },
      {
        "nombre": "Natalia Paola Luengo",
        "personaId": 329
      }
    ]
  },
  {
    "sociedadId": 381,
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
    "sociedadId": 1521,
    "socios": [
      {
        "nombre": "Cecilia Marisa Banella",
        "personaId": 3458
      },
      {
        "nombre": "Norma María Bocardo",
        "personaId": 3459
      }
    ]
  },
  {
    "sociedadId": 1736,
    "socios": [
      {
        "nombre": "Gastón Sebastián Bonoldi",
        "personaId": 3885
      },
      {
        "nombre": "María Soledad Salinas",
        "personaId": 3886
      }
    ]
  },
  {
    "sociedadId": 1735,
    "socios": [
      {
        "nombre": "Gastón Sebastián Bonoldi",
        "personaId": 3885
      },
      {
        "nombre": "María Soledad Salinas",
        "personaId": 3886
      }
    ]
  },
  {
    "sociedadId": 2062,
    "socios": [
      {
        "nombre": "Fernando Marcelo Rodriguez Merino",
        "personaId": 4582
      },
      {
        "nombre": "José Miguel Zarhi Troy",
        "personaId": 4583
      }
    ]
  },
  {
    "sociedadId": 2224,
    "socios": [
      {
        "nombre": "Abel Omar Furlan",
        "personaId": 4896
      },
      {
        "nombre": "Amira Raquel Jaliff",
        "personaId": 4900
      },
      {
        "nombre": "Dario Agustin Furlan Jaliff",
        "personaId": 4898
      },
      {
        "nombre": "Marcos Emanuel Furlan Jaliff",
        "personaId": 4897
      },
      {
        "nombre": "Maria Jimena Furlan Jaliff",
        "personaId": 4901
      },
      {
        "nombre": "Pablo Rodrigo Furlan Jaliff",
        "personaId": 4899
      }
    ]
  },
  {
    "sociedadId": 2337,
    "socios": [
      {
        "nombre": "Jesús Damián Bianchetti",
        "personaId": 5147
      },
      {
        "nombre": "Juan Pablo Cánepa",
        "personaId": 5146
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
    "sociedadId": 2683,
    "socios": [
      {
        "nombre": "Estela Ines Perinetti",
        "personaId": 5884
      },
      {
        "nombre": "Facundo Pedro Marquesini",
        "personaId": 5883
      }
    ]
  },
  {
    "sociedadId": 3401,
    "socios": [
      {
        "nombre": "Emilio Javier Corvalán Jofré",
        "personaId": 3949
      },
      {
        "nombre": "Francisco Fraguas",
        "personaId": 7366
      }
    ]
  },
  {
    "sociedadId": 3573,
    "socios": [
      {
        "nombre": "Gabriela Cecilia Lombardi",
        "personaId": 7719
      },
      {
        "nombre": "Matías Ariel Riccitelli",
        "personaId": 7718
      }
    ]
  },
  {
    "sociedadId": 3966,
    "socios": [
      {
        "nombre": "Alejandro Mauricio Rodríguez",
        "personaId": 8533
      },
      {
        "nombre": "César Mauricio Rodríguez",
        "personaId": 8534
      }
    ]
  },
  {
    "sociedadId": 4070,
    "socios": [
      {
        "nombre": "Ana María Trianes",
        "personaId": 8763
      },
      {
        "nombre": "Jose Luis Martinez Perez",
        "personaId": 8762
      },
      {
        "nombre": "María Paula Sastre",
        "personaId": 3397
      },
      {
        "nombre": "Rodrigo Padin",
        "personaId": 3398
      }
    ]
  },
  {
    "sociedadId": 4467,
    "socios": [
      {
        "nombre": "Ibarra Edgardo Yamil",
        "personaId": 9575
      },
      {
        "nombre": "Ibarra Ignacio Gabriel",
        "personaId": 9574
      },
      {
        "nombre": "Ibarra Pablo Javier",
        "personaId": 9573
      }
    ]
  },
  {
    "sociedadId": 4536,
    "socios": [
      {
        "nombre": "Gabriel Ernesto Pereira",
        "personaId": 9732
      },
      {
        "nombre": "Sebastián Matías Pereira",
        "personaId": 10166
      }
    ]
  },
  {
    "sociedadId": 5091,
    "socios": [
      {
        "nombre": "Gabriel Parra",
        "personaId": 10847
      },
      {
        "nombre": "Juan Francisco Mancuso",
        "personaId": 10848
      }
    ]
  },
  {
    "sociedadId": 5352,
    "socios": [
      {
        "nombre": "Casas Edith Elsa",
        "personaId": 11344
      },
      {
        "nombre": "Tejada Luisina Cecilia",
        "personaId": 11345
      },
      {
        "nombre": "Tejada Pablo Ruben",
        "personaId": 11346
      },
      {
        "nombre": "Tejada Roxana Edith",
        "personaId": 11347
      },
      {
        "nombre": "Tejada Ruben Osvaldo",
        "personaId": 11343
      }
    ]
  },
  {
    "sociedadId": 5572,
    "socios": [
      {
        "nombre": "Marcelo Javier Marchiori",
        "personaId": 11789
      }
    ]
  },
  {
    "sociedadId": 5660,
    "socios": [
      {
        "nombre": "Jesusa Hilda Martinez",
        "personaId": 11957
      },
      {
        "nombre": "Juan Evaristo Tejada",
        "personaId": 11956
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
    "sociedadId": 6243,
    "socios": [
      {
        "nombre": "David Ariel Mayo",
        "personaId": 13062
      },
      {
        "nombre": "Sebastián Mayo",
        "personaId": 13063
      },
      {
        "nombre": "Sergio Ariel Montiel",
        "personaId": 13065
      },
      {
        "nombre": "Valeria Fabiana Bonomo",
        "personaId": 13064
      }
    ]
  },
  {
    "sociedadId": 6274,
    "socios": [
      {
        "nombre": "Cristian Sebastián Bonamaizon",
        "personaId": 13127
      },
      {
        "nombre": "Facundo Roberto Bonamaizon",
        "personaId": 13128
      }
    ]
  },
  {
    "sociedadId": 6807,
    "socios": [
      {
        "nombre": "Daniel Eduardo Vila",
        "personaId": 14152
      },
      {
        "nombre": "Pamela Carolina David Gutierrez",
        "personaId": 14151
      }
    ]
  },
  {
    "sociedadId": 7521,
    "socios": [
      {
        "nombre": "Luis Alfredo Perocco",
        "personaId": 5304
      },
      {
        "nombre": "Maria Leticia Nuñez",
        "personaId": 5306
      }
    ]
  },
  {
    "sociedadId": 7934,
    "socios": [
      {
        "nombre": "Aldana Luz Vidal",
        "personaId": 16269
      },
      {
        "nombre": "Danilo Gabriel Vidal",
        "personaId": 16270
      }
    ]
  },
  {
    "sociedadId": 8059,
    "socios": [
      {
        "nombre": "Antonio Damián Roux Sgro",
        "personaId": 14365
      },
      {
        "nombre": "Enrique Rodrigo Roux Sgro",
        "personaId": 14364
      }
    ]
  },
  {
    "sociedadId": 8063,
    "socios": [
      {
        "nombre": "Francisco Jose Michref",
        "personaId": 16498
      },
      {
        "nombre": "Juan Manuel Michref",
        "personaId": 16497
      },
      {
        "nombre": "Maria Eugenia Michref",
        "personaId": 16499
      }
    ]
  },
  {
    "sociedadId": 8188,
    "socios": [
      {
        "nombre": "Luis Manuel Coita Civit",
        "personaId": 16383
      },
      {
        "nombre": "Rios Mario Eduardo",
        "personaId": 16729
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
    "sociedadId": 8750,
    "socios": [
      {
        "nombre": "Adriana Beatriz Venturin",
        "personaId": 17779
      },
      {
        "nombre": "Cecilia Noemi Martini",
        "personaId": 17780
      },
      {
        "nombre": "Elba Alicia Caraballo",
        "personaId": 17769
      },
      {
        "nombre": "Ester Susana Minussi",
        "personaId": 17778
      },
      {
        "nombre": "Graciana Virginia Deolinda Poloni",
        "personaId": 17774
      },
      {
        "nombre": "Griselda Lorena Delfino",
        "personaId": 17776
      },
      {
        "nombre": "María Del Valle Ferron",
        "personaId": 17772
      },
      {
        "nombre": "María Elena Salomon",
        "personaId": 17770
      },
      {
        "nombre": "Natalia Yemina Martin",
        "personaId": 17771
      },
      {
        "nombre": "Olga Karina Trape",
        "personaId": 17773
      },
      {
        "nombre": "Rosa Carmen Bordin",
        "personaId": 17775
      },
      {
        "nombre": "Viviana Del Carmen Lencina",
        "personaId": 17777
      }
    ]
  },
  {
    "sociedadId": 9723,
    "socios": [
      {
        "nombre": "Guadalupe Savina Rubia",
        "personaId": 19625
      },
      {
        "nombre": "Juan Cruz Savina Rubia",
        "personaId": 19624
      }
    ]
  },
  {
    "sociedadId": 9969,
    "socios": [
      {
        "nombre": "Abraham Sharbel Nozar Najle",
        "personaId": 20040
      },
      {
        "nombre": "Jesus Agustin Nozar",
        "personaId": 20044
      },
      {
        "nombre": "Maria Patricia Cirrincione",
        "personaId": 20043
      },
      {
        "nombre": "Miguel Nahir Nozar Najle",
        "personaId": 20041
      },
      {
        "nombre": "Oscar David Nozar",
        "personaId": 20042
      }
    ]
  },
  {
    "sociedadId": 10001,
    "socios": [
      {
        "nombre": "Leandro Daniel Naspi Corradi",
        "personaId": 20101
      },
      {
        "nombre": "María Alejandra Corradi",
        "personaId": 20100
      }
    ]
  },
  {
    "sociedadId": 10227,
    "socios": [
      {
        "nombre": "Alejandro Buran",
        "personaId": 20509
      },
      {
        "nombre": "Diego Matías Manrique",
        "personaId": 17478
      },
      {
        "nombre": "Gabriel Alfredo Yadala",
        "personaId": 20510
      },
      {
        "nombre": "Leonardo Miguel Ravinale",
        "personaId": 20511
      }
    ]
  },
  {
    "sociedadId": 10445,
    "socios": [
      {
        "nombre": "Natalia Belén de la Barrera",
        "personaId": 20913
      },
      {
        "nombre": "Sueños Salvadores SA",
        "sociedadId": 19495
      }
    ]
  },
  {
    "sociedadId": 10626,
    "socios": []
  },
  {
    "sociedadId": 10638,
    "socios": [
      {
        "nombre": "Nicolas Maitsch",
        "personaId": 21181
      }
    ]
  },
  {
    "sociedadId": 10842,
    "socios": [
      {
        "nombre": "Andrea Carolina Pontoni",
        "personaId": 10071
      },
      {
        "nombre": "Nicolás Gastón Ortiz",
        "personaId": 17087
      }
    ]
  },
  {
    "sociedadId": 11438,
    "socios": [
      {
        "nombre": "Armando Sebastián Britos",
        "personaId": 22245
      },
      {
        "nombre": "Patricia Carina Britos",
        "personaId": 22246
      },
      {
        "nombre": "Verónica Noelia Britos",
        "personaId": 5949
      }
    ]
  },
  {
    "sociedadId": 11464,
    "socios": [
      {
        "nombre": "Carlos Alberto Giron",
        "personaId": 22043
      },
      {
        "nombre": "Dante Fabian Arena",
        "personaId": 22292
      }
    ]
  },
  {
    "sociedadId": 11693,
    "socios": [
      {
        "nombre": "Edgardo Martin Carabajal",
        "personaId": 22602
      },
      {
        "nombre": "Hector Javier Mc Queen",
        "personaId": 22603
      }
    ]
  },
  {
    "sociedadId": 12897,
    "socios": [
      {
        "nombre": "Gonzalo Burgos",
        "personaId": 24391
      },
      {
        "nombre": "Ulises Cesar Sabato",
        "personaId": 24390
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
    "sociedadId": 13139,
    "socios": [
      {
        "nombre": "Gabriela Teresita Orozco",
        "personaId": 24741
      }
    ]
  },
  {
    "sociedadId": 13652,
    "socios": [
      {
        "nombre": "Claudio Adrian Socias",
        "personaId": 25458
      },
      {
        "nombre": "Ezequiel Alejandro Gilligan",
        "personaId": 25459
      },
      {
        "nombre": "Santos Miyara",
        "personaId": 25460
      }
    ]
  },
  {
    "sociedadId": 13747,
    "socios": [
      {
        "nombre": "Cristian Alberto Caselles",
        "personaId": 25598
      },
      {
        "nombre": "Valeria María Tassin",
        "personaId": 25597
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
    "sociedadId": 14571,
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
    "sociedadId": 14997,
    "socios": [
      {
        "nombre": "Eliana Gabriela Belleville",
        "personaId": 27428
      },
      {
        "nombre": "Jose Eduardo Sanchez",
        "personaId": 27427
      }
    ]
  },
  {
    "sociedadId": 15580,
    "socios": [
      {
        "nombre": "Jose Lemos",
        "personaId": 28261
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
    "sociedadId": 16195,
    "socios": [
      {
        "nombre": "Fernando Ernesto Amador Morato Ganem",
        "personaId": 29085
      },
      {
        "nombre": "Mónica Guadalupe Gonzalez Nieves",
        "personaId": 29086
      },
      {
        "nombre": "Norma Elizabeth Chanampe",
        "personaId": 31874
      },
      {
        "nombre": "Salvador Antonio Reitano",
        "personaId": 31873
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
    "sociedadId": 18340,
    "socios": [
      {
        "nombre": "Jose Mario Spisso",
        "personaId": 17573
      },
      {
        "nombre": "Lucas Agustin Spisso",
        "personaId": 17576
      },
      {
        "nombre": "Marcos Valentino Spisso",
        "personaId": 31935
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
  },
  {
    "sociedadId": 16727,
    "socios": []
  },
  {
    "sociedadId": 15931,
    "socios": [
      {
        "nombre": "Juliana Álvarez",
        "personaId": 28576
      }
    ]
  },
  {
    "sociedadId": 17281,
    "socios": []
  },
  {
    "sociedadId": 10695,
    "socios": []
  },
  {
    "sociedadId": 679,
    "socios": []
  }
];
