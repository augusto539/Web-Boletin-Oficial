// Copia server-side de frontend/src/data/nichoSoftware.ts, mismo criterio
// que el resto de backend/src/data/*.ts: el backend no importa del
// workspace frontend, así que estos agregados se duplican acá en forma de
// array plano (en vez del Map que usa MapaMendoza) para el HTML
// server-rendered de SEO (ver seo.ts). ENTIDADES y el detalle de qué socios
// quedaron sin sociedadId/personaId (entidades ajenas a la base, nombres
// ambiguos) -- ver la nota completa en el archivo del frontend.

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 7 },
  { etiqueta: "2018", valor: 21 },
  { etiqueta: "2019", valor: 14 },
  { etiqueta: "2020", valor: 11 },
  { etiqueta: "2021", valor: 17 },
  { etiqueta: "2022", valor: 9 },
  { etiqueta: "2023", valor: 9 },
  { etiqueta: "2024", valor: 3 },
  { etiqueta: "2025", valor: 9 },
  { etiqueta: "2026*", valor: 3 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 80 },
  { tipo: "S.A.", cantidad: 19 },
  { tipo: "S.R.L.", cantidad: 4 },
];

export const DEPARTAMENTOS_SOFTWARE = [
  { departamento: "Capital", cantidad: 43 },
  { departamento: "Godoy Cruz", cantidad: 20 },
  { departamento: "Guaymallén", cantidad: 10 },
  { departamento: "Luján de Cuyo", cantidad: 9 },
  { departamento: "Maipú", cantidad: 5 },
  { departamento: "San Rafael", cantidad: 4 },
  { departamento: "Rivadavia", cantidad: 3 },
  { departamento: "Las Heras", cantidad: 2 },
  { departamento: "San Martín", cantidad: 1 },
  { departamento: "Junín", cantidad: 1 },
  { departamento: "Tunuyán", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadSoftwareCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadSoftwareCurada[] = [
  {
    "sociedadId": 14,
    "socios": [
      {
        "nombre": "Araujo Aristiaran Roberto Adriel",
        "personaId": 27
      },
      {
        "nombre": "Gimenez German",
        "personaId": 26
      }
    ]
  },
  {
    "sociedadId": 72,
    "socios": [
      {
        "nombre": "Eduardo José Noello",
        "personaId": 178
      },
      {
        "nombre": "Estela Ines Gallardo",
        "personaId": 364
      },
      {
        "nombre": "Mónica Elizabeth Cerdan",
        "personaId": 179
      }
    ]
  },
  {
    "sociedadId": 290,
    "socios": [
      {
        "nombre": "Antonio Alvarez Abril",
        "personaId": 669
      },
      {
        "nombre": "Gabriel Federico Alvarez Juri",
        "personaId": 670
      },
      {
        "nombre": "Higinio Alberto Facchini",
        "personaId": 668
      },
      {
        "nombre": "Santiago Cristobal Perez",
        "personaId": 667
      }
    ]
  },
  {
    "sociedadId": 470,
    "socios": [
      {
        "nombre": "Gerónimo Guevara March",
        "personaId": 1122
      },
      {
        "nombre": "Sebastián Enrique Torres Gomez Omil",
        "personaId": 1121
      }
    ]
  },
  {
    "sociedadId": 820,
    "socios": [
      {
        "nombre": "Gerónimo Guevara March",
        "personaId": 1122
      },
      {
        "nombre": "Gustavo Martin Nudo",
        "personaId": 1889
      }
    ]
  },
  {
    "sociedadId": 838,
    "socios": [
      {
        "nombre": "Guillermo Alejandro Willink Moyano",
        "personaId": 1940
      },
      {
        "nombre": "Pedro Cubillos",
        "personaId": 1941
      }
    ]
  },
  {
    "sociedadId": 845,
    "socios": [
      {
        "nombre": "Agustín César Ruiz",
        "personaId": 1960
      },
      {
        "nombre": "Diego Gabriel César",
        "personaId": 1959
      },
      {
        "nombre": "Juan Sebastian Arbona",
        "personaId": 1961
      },
      {
        "nombre": "Pablo Enrique Bicego",
        "personaId": 1958
      }
    ]
  },
  {
    "sociedadId": 887,
    "socios": [
      {
        "nombre": "Jorge Rafael Lanzani",
        "personaId": 2061
      },
      {
        "nombre": "Nicolás Rafael Anitori",
        "personaId": 2062
      }
    ]
  },
  {
    "sociedadId": 977,
    "socios": [
      {
        "nombre": "Daniel Derli Copado Perez",
        "personaId": 2240
      },
      {
        "nombre": "Domingo Arístides Parisot",
        "personaId": 2241
      }
    ]
  },
  {
    "sociedadId": 1123,
    "socios": [
      {
        "nombre": "Debora Analia Carricondo",
        "personaId": 2450
      },
      {
        "nombre": "Estela Ines Gallardo",
        "personaId": 364
      },
      {
        "nombre": "Maria Ines Otero",
        "personaId": 2584
      }
    ]
  },
  {
    "sociedadId": 1211,
    "socios": [
      {
        "nombre": "Andres Diego Manresa",
        "personaId": 2782
      },
      {
        "nombre": "Arturo Agustin Yaciofano Chesi",
        "personaId": 2781
      },
      {
        "nombre": "Gonzalo Moya",
        "personaId": 241
      }
    ]
  },
  {
    "sociedadId": 1289,
    "socios": [
      {
        "nombre": "Jaime Alberto Aguiló Iztueta",
        "personaId": 2962
      },
      {
        "nombre": "Rodolfo Alejandro Giro",
        "personaId": 2963
      }
    ]
  },
  {
    "sociedadId": 1518,
    "socios": [
      {
        "nombre": "Diego Raúl Saso",
        "personaId": 3450
      },
      {
        "nombre": "Héctor Alberto Ocaranza",
        "personaId": 3451
      },
      {
        "nombre": "Jaime Alberto Aguiló Iztueta",
        "personaId": 2962
      },
      {
        "nombre": "Sebastián Ricardo Simondi",
        "personaId": 3449
      }
    ]
  },
  {
    "sociedadId": 1519,
    "socios": [
      {
        "nombre": "Agustín Fernandez Iuvaro",
        "personaId": 3454
      },
      {
        "nombre": "Alejandro Rose",
        "personaId": 3453
      },
      {
        "nombre": "Víctor Juan Fernandez",
        "personaId": 3455
      }
    ]
  },
  {
    "sociedadId": 1528,
    "socios": [
      {
        "nombre": "Alex Waisman",
        "personaId": 3476
      },
      {
        "nombre": "Esteban Eduardo Castellanos",
        "personaId": 3478
      },
      {
        "nombre": "Julio Argentino Irrazabal",
        "personaId": 3477
      }
    ]
  },
  {
    "sociedadId": 1533,
    "socios": [
      {
        "nombre": "Marcos Gabriel Trentacoste",
        "personaId": 3485
      },
      {
        "nombre": "Romina Vanesa Arena",
        "personaId": 3486
      }
    ]
  },
  {
    "sociedadId": 1578,
    "socios": [
      {
        "nombre": "Diego Raúl Saso",
        "personaId": 3450
      },
      {
        "nombre": "Elisa Luciana Toujas",
        "personaId": 3569
      }
    ]
  },
  {
    "sociedadId": 1624,
    "socios": [
      {
        "nombre": "Claudio Adrián Marrero",
        "personaId": 3659
      },
      {
        "nombre": "Juan Francisco Ciullini Iaccarino",
        "personaId": 3658
      }
    ]
  },
  {
    "sociedadId": 1640,
    "socios": [
      {
        "nombre": "Mariano Jesús Tassi",
        "personaId": 3692
      },
      {
        "nombre": "Maximiliano Elian Neza",
        "personaId": 3693
      }
    ]
  },
  {
    "sociedadId": 1954,
    "socios": [
      {
        "nombre": "Domenico Cirasino",
        "personaId": 4370
      },
      {
        "nombre": "Nicolás Guerra",
        "personaId": 4369
      }
    ]
  },
  {
    "sociedadId": 1980,
    "socios": [
      {
        "nombre": "Alejandro Hernan Navarro",
        "personaId": 4420
      },
      {
        "nombre": "Cristian Edgardo Navarro Manresa",
        "personaId": 4421
      }
    ]
  },
  {
    "sociedadId": 2103,
    "socios": [
      {
        "nombre": "Besitz B.V."
      },
      {
        "nombre": "Mieten B.V."
      }
    ]
  },
  {
    "sociedadId": 2147,
    "socios": [
      {
        "nombre": "José Miguel Rodríguez",
        "personaId": 4739
      }
    ]
  },
  {
    "sociedadId": 2283,
    "socios": [
      {
        "nombre": "Jose Luis Bustos Lopez",
        "personaId": 5018
      },
      {
        "nombre": "Sergio Exequiel Mansilla",
        "personaId": 5017
      }
    ]
  },
  {
    "sociedadId": 2382,
    "socios": [
      {
        "nombre": "Cristian David Rossi",
        "personaId": 5229
      },
      {
        "nombre": "Ricardo José Agüero",
        "personaId": 5230
      }
    ]
  },
  {
    "sociedadId": 2389,
    "socios": [
      {
        "nombre": "Martín Salassa",
        "personaId": 2266
      },
      {
        "nombre": "Matías Demián Benegas",
        "personaId": 788
      },
      {
        "nombre": "Víctor Abel Quiroga"
      }
    ]
  },
  {
    "sociedadId": 2394,
    "socios": [
      {
        "nombre": "Gustavo Maximiliano Molina Lema",
        "personaId": 5247
      },
      {
        "nombre": "Ruben Dario Luna Ferrer",
        "personaId": 5246
      }
    ]
  },
  {
    "sociedadId": 2410,
    "socios": [
      {
        "nombre": "Carlos Alberto García",
        "personaId": 5273
      },
      {
        "nombre": "Francisco José Guillermet Velazquez",
        "personaId": 5275
      },
      {
        "nombre": "Valeria Alejandra Avellaneda",
        "personaId": 5274
      }
    ]
  },
  {
    "sociedadId": 2604,
    "socios": [
      {
        "nombre": "Walter Roberto Grenon",
        "personaId": 5700
      }
    ]
  },
  {
    "sociedadId": 2608,
    "socios": [
      {
        "nombre": "Ignacio Alejandro Boulin Victoria",
        "personaId": 5709
      },
      {
        "nombre": "Lucas Emmanuel Gómez",
        "personaId": 5708
      }
    ]
  },
  {
    "sociedadId": 2648,
    "socios": [
      {
        "nombre": "Jorge Dario Segura",
        "personaId": 5801
      },
      {
        "nombre": "Mario Centeno",
        "personaId": 5799
      },
      {
        "nombre": "Pablo Sebastián Castellarín",
        "personaId": 5800
      },
      {
        "nombre": "Raul Adrian Lopez",
        "personaId": 5802
      }
    ]
  },
  {
    "sociedadId": 2759,
    "socios": [
      {
        "nombre": "Antero Norberto Lloret Zalazar",
        "personaId": 6035
      },
      {
        "nombre": "Marisabel Yanina Vazquez",
        "personaId": 6036
      }
    ]
  },
  {
    "sociedadId": 3080,
    "socios": [
      {
        "nombre": "Diego Andres Correa Tello",
        "personaId": 6734
      },
      {
        "nombre": "Di Sparti Román",
        "personaId": 6736
      },
      {
        "nombre": "Gabriel Darío Galdeano",
        "personaId": 6733
      },
      {
        "nombre": "Norberto Daniel Martinez Coll",
        "personaId": 6735
      }
    ]
  },
  {
    "sociedadId": 3134,
    "socios": [
      {
        "nombre": "Germán Alejandro Limina",
        "personaId": 6838
      },
      {
        "nombre": "Pablo Daniel Palma",
        "personaId": 6836
      },
      {
        "nombre": "Pedro Lisandro Brest",
        "personaId": 6837
      }
    ]
  },
  {
    "sociedadId": 3233,
    "socios": [
      {
        "nombre": "Adrian Amadeo Cesar Tagarot",
        "personaId": 7041
      },
      {
        "nombre": "Manuel Francisco Marco",
        "personaId": 7040
      }
    ]
  },
  {
    "sociedadId": 3234,
    "socios": [
      {
        "nombre": "Alec Manuel Juliao Kobylanski",
        "personaId": 7042
      },
      {
        "nombre": "Francisco Voena Bernal",
        "personaId": 7044
      },
      {
        "nombre": "Jan Victor Juliao Kobylanski",
        "personaId": 7045
      },
      {
        "nombre": "Joaquín Berardi",
        "personaId": 7046
      },
      {
        "nombre": "Manuel Shi",
        "personaId": 7043
      }
    ]
  },
  {
    "sociedadId": 3251,
    "socios": [
      {
        "nombre": "Rodolfo Alejandro Giro",
        "personaId": 2963
      }
    ]
  },
  {
    "sociedadId": 3313,
    "socios": [
      {
        "nombre": "Sebastián Gabriel Carrillo",
        "personaId": 7212
      }
    ]
  },
  {
    "sociedadId": 3528,
    "socios": [
      {
        "nombre": "Adriana Paola Sánchez",
        "personaId": 7623
      },
      {
        "nombre": "Sergio Daniel Battalemi",
        "personaId": 7624
      }
    ]
  },
  {
    "sociedadId": 3538,
    "socios": [
      {
        "nombre": "Gonzalo Yañez",
        "personaId": 3468
      },
      {
        "nombre": "Mariano Gabriel Gioia",
        "personaId": 7642
      },
      {
        "nombre": "Sebastián Yañez",
        "personaId": 7641
      },
      {
        "nombre": "Stefan Bernhard Riedmann",
        "personaId": 7643
      }
    ]
  },
  {
    "sociedadId": 3658,
    "socios": [
      {
        "nombre": "Ariel Emilio Saenz",
        "personaId": 7881
      },
      {
        "nombre": "Nestor Diego Marin",
        "personaId": 7880
      }
    ]
  },
  {
    "sociedadId": 3773,
    "socios": [
      {
        "nombre": "Alejandro Cavallero",
        "personaId": 8121
      },
      {
        "nombre": "Carlos Mariano Soler",
        "personaId": 7305
      },
      {
        "nombre": "Diego Navarro",
        "personaId": 8123
      },
      {
        "nombre": "Montemar Compañía Financiera S.A.",
        "sociedadId": 16117
      },
      {
        "nombre": "Ramiro José Soler",
        "personaId": 8122
      }
    ]
  },
  {
    "sociedadId": 4271,
    "socios": [
      {
        "nombre": "Franco Agustín Ingrassia Carretero",
        "personaId": 9164
      },
      {
        "nombre": "Juan Pablo Ingrassia Carretero",
        "personaId": 9162
      },
      {
        "nombre": "Marco Javier Ingrassia Carretero",
        "personaId": 9163
      },
      {
        "nombre": "Miguel Ángel Ingrassia",
        "personaId": 9160
      },
      {
        "nombre": "Mirta Gabriela Carretero",
        "personaId": 9161
      }
    ]
  },
  {
    "sociedadId": 4427,
    "socios": [
      {
        "nombre": "Francisco Luis Innocenti",
        "personaId": 9489
      }
    ]
  },
  {
    "sociedadId": 4465,
    "socios": [
      {
        "nombre": "Adrián Miguel Cammarota",
        "personaId": 9568
      },
      {
        "nombre": "David Hernández Catala",
        "personaId": 9567
      },
      {
        "nombre": "Facundo Matías Rodríguez Quintana",
        "personaId": 9569
      },
      {
        "nombre": "María Laura Jalaf",
        "personaId": 9570
      }
    ]
  },
  {
    "sociedadId": 4480,
    "socios": [
      {
        "nombre": "Emiliano Luis Verdu Marty",
        "personaId": 9603
      },
      {
        "nombre": "Nelson Gastón Pérez",
        "personaId": 9602
      }
    ]
  },
  {
    "sociedadId": 4786,
    "socios": [
      {
        "nombre": "Alonso Rodrigo Marcelo",
        "personaId": 10246
      }
    ]
  },
  {
    "sociedadId": 4795,
    "socios": [
      {
        "nombre": "Hernán Gabriel Denk",
        "personaId": 10261
      }
    ]
  },
  {
    "sociedadId": 4998,
    "socios": [
      {
        "nombre": "Matias Nicolás Sansone",
        "personaId": 9241
      },
      {
        "nombre": "Rodrigo Daniel Persia",
        "personaId": 10649
      }
    ]
  },
  {
    "sociedadId": 5213,
    "socios": [
      {
        "nombre": "Ezequiel Aloisi",
        "personaId": 11066
      },
      {
        "nombre": "Román Clavero",
        "personaId": 11067
      }
    ]
  },
  {
    "sociedadId": 5312,
    "socios": [
      {
        "nombre": "Bruno Calcagno",
        "personaId": 11265
      }
    ]
  },
  {
    "sociedadId": 5516,
    "socios": [
      {
        "nombre": "Miguel Ernesto Ariel Gonzalez",
        "personaId": 11667
      }
    ]
  },
  {
    "sociedadId": 5681,
    "socios": [
      {
        "nombre": "Eugenio Sebastián Oliveri",
        "personaId": 12016
      },
      {
        "nombre": "Matías Demián Benegas",
        "personaId": 788
      }
    ]
  },
  {
    "sociedadId": 6160,
    "socios": [
      {
        "nombre": "Nilda Liliana Di Cesare",
        "personaId": 12924
      },
      {
        "nombre": "Pablo Javier Pereira",
        "personaId": 12923
      }
    ]
  },
  {
    "sociedadId": 6217,
    "socios": [
      {
        "nombre": "Fernando Jose Perez",
        "personaId": 13022
      },
      {
        "nombre": "Jorge Emanuel Miguez",
        "personaId": 13023
      }
    ]
  },
  {
    "sociedadId": 6292,
    "socios": [
      {
        "nombre": "Nilda Liliana Di Cesare",
        "personaId": 12924
      },
      {
        "nombre": "Pablo Javier Pereira",
        "personaId": 12923
      }
    ]
  },
  {
    "sociedadId": 6428,
    "socios": [
      {
        "nombre": "Aldibs S.A.S."
      },
      {
        "nombre": "Dora Gimenez",
        "personaId": 14174
      },
      {
        "nombre": "Luciano Rafael Renna Muñoz",
        "personaId": 7841
      },
      {
        "nombre": "Matías Roberto Martínez",
        "personaId": 13444
      },
      {
        "nombre": "Matias Roberto Martínez Capó",
        "personaId": 4033
      },
      {
        "nombre": "Pablo Andres Martin Castañeda",
        "personaId": 7842
      },
      {
        "nombre": "Rafael Alejandro Renna",
        "personaId": 13731
      }
    ]
  },
  {
    "sociedadId": 6620,
    "socios": [
      {
        "nombre": "Castillo Andrea Verónica",
        "personaId": 13811
      },
      {
        "nombre": "Morán Jose Ubaldo",
        "personaId": 13810
      }
    ]
  },
  {
    "sociedadId": 6661,
    "socios": [
      {
        "nombre": "Hector Martín Maturano",
        "personaId": 13874
      },
      {
        "nombre": "José Manuel Perez Castillo",
        "personaId": 13875
      },
      {
        "nombre": "Matías Exequiel Navarrete",
        "personaId": 13876
      },
      {
        "nombre": "Mauricio Javier Tagua",
        "personaId": 13877
      }
    ]
  },
  {
    "sociedadId": 6691,
    "socios": [
      {
        "nombre": "Eduardo Martin Difonso",
        "personaId": 13945
      },
      {
        "nombre": "Jose Ignacio Mirchak Baronian",
        "personaId": 13944
      },
      {
        "nombre": "Juan Ignacio Alvarez Lescano",
        "personaId": 13943
      }
    ]
  },
  {
    "sociedadId": 6692,
    "socios": [
      {
        "nombre": "Daniel Enrique Álvarez"
      },
      {
        "nombre": "Francisco Atilio Oga",
        "personaId": 13947
      }
    ]
  },
  {
    "sociedadId": 6790,
    "socios": [
      {
        "nombre": "Eliana Hebe Lanzani",
        "personaId": 6045
      },
      {
        "nombre": "Jorge Rafael Lanzani",
        "personaId": 2061
      },
      {
        "nombre": "Nicolás Rafael Anitori",
        "personaId": 2062
      }
    ]
  },
  {
    "sociedadId": 6796,
    "socios": [
      {
        "nombre": "Cristian Ruppert",
        "personaId": 14128
      },
      {
        "nombre": "Gabriel Arias",
        "personaId": 14127
      },
      {
        "nombre": "Maria Emilce Villanueva",
        "personaId": 14129
      }
    ]
  },
  {
    "sociedadId": 6824,
    "socios": [
      {
        "nombre": "Santiago Jorge Bayeta",
        "personaId": 14184
      }
    ]
  },
  {
    "sociedadId": 6971,
    "socios": [
      {
        "nombre": "Pablo Javier Pereira",
        "personaId": 12923
      },
      {
        "nombre": "Raúl Jerónimo Vargas",
        "personaId": 14077
      }
    ]
  },
  {
    "sociedadId": 7071,
    "socios": [
      {
        "nombre": "Laura Nahir Adid",
        "personaId": 14642
      },
      {
        "nombre": "María Florencia Fourcade",
        "personaId": 14643
      }
    ]
  },
  {
    "sociedadId": 7588,
    "socios": [
      {
        "nombre": "David Esteban Nogara",
        "personaId": 15608
      },
      {
        "nombre": "Jorge David Viani",
        "personaId": 15609
      }
    ]
  },
  {
    "sociedadId": 7615,
    "socios": [
      {
        "nombre": "Alfredo Vicente Trentacoste",
        "personaId": 8245
      },
      {
        "nombre": "Sergio Gustavo García",
        "personaId": 15654
      }
    ]
  },
  {
    "sociedadId": 7884,
    "socios": [
      {
        "nombre": "Gino Manuel Cornejo",
        "personaId": 16187
      },
      {
        "nombre": "Santiago Mas Fuchs",
        "personaId": 7391
      }
    ]
  },
  {
    "sociedadId": 8065,
    "socios": [
      {
        "nombre": "Pedro Luis Badosa",
        "personaId": 16501
      }
    ]
  },
  {
    "sociedadId": 8450,
    "socios": [
      {
        "nombre": "Andrés Francisco Puebla",
        "personaId": 17231
      },
      {
        "nombre": "Carlos Fabricio Portillo Pontoriero",
        "personaId": 17230
      },
      {
        "nombre": "Mariela Belén Rivas",
        "personaId": 17229
      }
    ]
  },
  {
    "sociedadId": 8660,
    "socios": [
      {
        "nombre": "Daniel Enrique Álvarez"
      },
      {
        "nombre": "Dichiara Andrea Amalia",
        "personaId": 17629
      },
      {
        "nombre": "Luconi María Eugenia",
        "personaId": 17630
      }
    ]
  },
  {
    "sociedadId": 8766,
    "socios": [
      {
        "nombre": "Sebastian Emilio Rios",
        "personaId": 17805
      }
    ]
  },
  {
    "sociedadId": 9110,
    "socios": [
      {
        "nombre": "Fernando Eliseo Nogara",
        "personaId": 18463
      },
      {
        "nombre": "Lucas Antonio Muñoz",
        "personaId": 5516
      }
    ]
  },
  {
    "sociedadId": 9117,
    "socios": [
      {
        "nombre": "Sabrina Constanza Noel Pacheco",
        "personaId": 18480
      }
    ]
  },
  {
    "sociedadId": 9545,
    "socios": [
      {
        "nombre": "Leandro Bernardi",
        "personaId": 19268
      },
      {
        "nombre": "Ornella Bernardi",
        "personaId": 19269
      }
    ]
  },
  {
    "sociedadId": 9559,
    "socios": [
      {
        "nombre": "Andrea Macarena Calise Villagran",
        "personaId": 19303
      },
      {
        "nombre": "Florencia Romina Calise Villagran",
        "personaId": 19304
      }
    ]
  },
  {
    "sociedadId": 9616,
    "socios": [
      {
        "nombre": "Roberto Fernando Bascuñan",
        "personaId": 19423
      }
    ]
  },
  {
    "sociedadId": 10055,
    "socios": [
      {
        "nombre": "Joel Antonio Martin",
        "personaId": 20189
      },
      {
        "nombre": "Jorge Fernando Pesce",
        "personaId": 20190
      }
    ]
  },
  {
    "sociedadId": 11454,
    "socios": [
      {
        "nombre": "Agustín Ramón Freixas Fillol",
        "personaId": 22272
      },
      {
        "nombre": "Juan Martin Molinari",
        "personaId": 20625
      }
    ]
  },
  {
    "sociedadId": 11733,
    "socios": [
      {
        "nombre": "Miriam Elizabeth Terraza",
        "personaId": 22654
      },
      {
        "nombre": "Orlando Francisco Aguero",
        "personaId": 22653
      }
    ]
  },
  {
    "sociedadId": 11799,
    "socios": [
      {
        "nombre": "Magdalena Egües",
        "personaId": 22775
      },
      {
        "nombre": "Martina Del Carmen Such",
        "personaId": 22776
      },
      {
        "nombre": "Nicolás Guerra",
        "personaId": 4369
      }
    ]
  },
  {
    "sociedadId": 12286,
    "socios": [
      {
        "nombre": "Carlos Antonio Pedrosa",
        "personaId": 23544
      },
      {
        "nombre": "Rodrigo Javier Rodriguez",
        "personaId": 23545
      }
    ]
  },
  {
    "sociedadId": 12302,
    "socios": [
      {
        "nombre": "Agustín Gutiérrez",
        "personaId": 23585
      }
    ]
  },
  {
    "sociedadId": 12769,
    "socios": [
      {
        "nombre": "Lucas Mariano Dominguez Grassetto",
        "personaId": 24203
      },
      {
        "nombre": "Mauricio Nicolas Moncada",
        "personaId": 24202
      }
    ]
  },
  {
    "sociedadId": 12845,
    "socios": [
      {
        "nombre": "Flavio Máximo Sanfilippo",
        "personaId": 21769
      },
      {
        "nombre": "Georgina Natalia Riveros",
        "personaId": 24314
      },
      {
        "nombre": "Hernan Fontana Baccarelli",
        "personaId": 1091
      },
      {
        "nombre": "Ornella Bernardi",
        "personaId": 19269
      }
    ]
  },
  {
    "sociedadId": 13029,
    "socios": [
      {
        "nombre": "Andrés Abel Pravata",
        "personaId": 23987
      },
      {
        "nombre": "Juan Cruz Luffi",
        "personaId": 24572
      }
    ]
  },
  {
    "sociedadId": 13565,
    "socios": [
      {
        "nombre": "Juan Andrés Rodríguez",
        "personaId": 25334
      },
      {
        "nombre": "Juan Carlos Rodríguez"
      },
      {
        "nombre": "Juan Fernando Rodríguez",
        "personaId": 25335
      },
      {
        "nombre": "Juan Pablo Rodríguez"
      }
    ]
  },
  {
    "sociedadId": 13619,
    "socios": [
      {
        "nombre": "Andres Hernan Rayes",
        "personaId": 25409
      },
      {
        "nombre": "Emilio Ramón Clavero",
        "personaId": 25410
      }
    ]
  },
  {
    "sociedadId": 14452,
    "socios": [
      {
        "nombre": "Marcos Gabriel Trentacoste",
        "personaId": 3485
      },
      {
        "nombre": "Victor Manuel Belaunde",
        "personaId": 26615
      }
    ]
  },
  {
    "sociedadId": 16647,
    "socios": []
  },
  {
    "sociedadId": 16661,
    "socios": [
      {
        "nombre": "Harvey José Barreto Hernández",
        "personaId": 29752
      },
      {
        "nombre": "José Alejandro Barreto Barrios",
        "personaId": 29751
      }
    ]
  },
  {
    "sociedadId": 16938,
    "socios": [
      {
        "nombre": "Andrés Eduardo González Vera",
        "personaId": 30125
      },
      {
        "nombre": "Huentala Ventures S.A.S.",
        "sociedadId": 14849
      },
      {
        "nombre": "Leonel David Camsen",
        "personaId": 2175
      },
      {
        "nombre": "Santiago Javier Ponte",
        "personaId": 30126
      }
    ]
  },
  {
    "sociedadId": 17144,
    "socios": [
      {
        "nombre": "Daniel Fino Villamil",
        "personaId": 30414
      },
      {
        "nombre": "Iván Ignacio Boroni",
        "personaId": 30415
      },
      {
        "nombre": "Martín Ignacio Lana Bengut",
        "personaId": 30413
      },
      {
        "nombre": "Walter Washington Camus",
        "personaId": 30416
      }
    ]
  },
  {
    "sociedadId": 17145,
    "socios": [
      {
        "nombre": "Osvaldo Luis Campodónico",
        "personaId": 21005
      }
    ]
  },
  {
    "sociedadId": 17195,
    "socios": [
      {
        "nombre": "Deborah Eliana Diaz Valverde",
        "personaId": 10534
      },
      {
        "nombre": "Ivan Vicente Diaz",
        "personaId": 10532
      }
    ]
  },
  {
    "sociedadId": 17240,
    "socios": [
      {
        "nombre": "Guillermina Velazquez García",
        "personaId": 30552
      },
      {
        "nombre": "Luis Emilio Gonzalez Zárate",
        "personaId": 30551
      }
    ]
  },
  {
    "sociedadId": 17429,
    "socios": [
      {
        "nombre": "María Belén Giunchi",
        "personaId": 30806
      },
      {
        "nombre": "Paola Alicia Zambudio",
        "personaId": 30805
      }
    ]
  },
  {
    "sociedadId": 17699,
    "socios": [
      {
        "nombre": "Francisco Merenda Strologo",
        "personaId": 31187
      }
    ]
  },
  {
    "sociedadId": 18487,
    "socios": [
      {
        "nombre": "Sisu Venture Partners Participaciones Ltda."
      }
    ]
  },
  {
    "sociedadId": 18855,
    "socios": [
      {
        "nombre": "Dario Javier Videla",
        "personaId": 32407
      },
      {
        "nombre": "Lucas Mariano Dominguez Grassetto",
        "personaId": 24203
      }
    ]
  },
  {
    "sociedadId": 19213,
    "socios": [
      {
        "nombre": "Santiago Irigoyen",
        "personaId": 33118
      }
    ]
  },
  {
    "sociedadId": 11766,
    "socios": []
  }
];
