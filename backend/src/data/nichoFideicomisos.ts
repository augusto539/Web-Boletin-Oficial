// Contenido del informe "Servicios de fideicomisos en Mendoza". Metodología
// de cruce (CUIT primero, normalizar_nombre() como fallback, "parece
// sociedad" por regex para decidir si un socio se busca en sociedades o
// personas_fisicas) documentada en detalle en nichoSoftware.ts y
// nichoServiciosProfesionales.ts -- mismo criterio acá. Las 63 sociedades
// resolvieron por CUIT/nombre sin ambigüedad, y los 140 socios/integrantes
// resolvieron 100% (desambiguando tocayos por vínculo real con la sociedad
// del caso, no solo por nombre).
// Duplicado del server-side para el middleware de SEO (seo.ts) -- mismo
// criterio que el resto de los nichoX.ts en backend/src/data/.
// DEPARTAMENTOS va como array plano acá (no Map, que no es JSON-serializable
// tal cual para el render de texto plano del SEO).

export const EVOLUCION_ANUAL = [
  { etiqueta: "2018", valor: 10 },
  { etiqueta: "2019", valor: 6 },
  { etiqueta: "2020", valor: 7 },
  { etiqueta: "2021", valor: 4 },
  { etiqueta: "2022", valor: 6 },
  { etiqueta: "2023", valor: 7 },
  { etiqueta: "2024", valor: 8 },
  { etiqueta: "2025", valor: 13 },
  { etiqueta: "2026*", valor: 2 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 56 },
  { tipo: "S.A.", cantidad: 7 },
];

export const DEPARTAMENTOS_FIDEICOMISOS = [
  { departamento: "Capital", cantidad: 19 },
  { departamento: "Luján de Cuyo", cantidad: 14 },
  { departamento: "Godoy Cruz", cantidad: 11 },
  { departamento: "Guaymallén", cantidad: 5 },
  { departamento: "San Rafael", cantidad: 4 },
  { departamento: "Maipú", cantidad: 4 },
  { departamento: "Las Heras", cantidad: 2 },
  { departamento: "Lavalle", cantidad: 1 },
  { departamento: "General Alvear", cantidad: 1 },
  { departamento: "Tunuyán", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadFideicomisosCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadFideicomisosCurada[] = [
  {
    "sociedadId": 925,
    "socios": [
      {
        "nombre": "Gerardo Javier Tirenti",
        "personaId": 2153
      },
      {
        "nombre": "Walter Damián Tirenti",
        "personaId": 2152
      }
    ]
  },
  {
    "sociedadId": 992,
    "socios": [
      {
        "nombre": "Daniel Horacio Salas",
        "personaId": 2279
      },
      {
        "nombre": "Mariana Elena Romairone",
        "personaId": 2280
      }
    ]
  },
  {
    "sociedadId": 1358,
    "socios": [
      {
        "nombre": "Gimena Fernanda Uriza",
        "personaId": 3105
      },
      {
        "nombre": "Mauro Ivo Maltoni",
        "personaId": 3104
      }
    ]
  },
  {
    "sociedadId": 1369,
    "socios": [
      {
        "nombre": "Bernardo José Sottile",
        "personaId": 3124
      },
      {
        "nombre": "Carlos Fabián Bajach",
        "personaId": 3123
      },
      {
        "nombre": "Franco Gabriel Pérez Magnelli",
        "personaId": 3122
      }
    ]
  },
  {
    "sociedadId": 1375,
    "socios": [
      {
        "nombre": "Martin Ignacio Odoriz",
        "personaId": 3135
      },
      {
        "nombre": "Silvia Pilar Baez",
        "personaId": 3136
      }
    ]
  },
  {
    "sociedadId": 1726,
    "socios": [
      {
        "nombre": "Agustin Nebro Tibaldi",
        "personaId": 3869
      },
      {
        "nombre": "Modolo Luis Adrian",
        "personaId": 3868
      }
    ]
  },
  {
    "sociedadId": 1744,
    "socios": [
      {
        "nombre": "Adriana Huerta",
        "personaId": 3903
      },
      {
        "nombre": "Luis Baldini Pescarmona",
        "personaId": 3902
      }
    ]
  },
  {
    "sociedadId": 1769,
    "socios": [
      {
        "nombre": "Elsa Virginia Trabaloni",
        "personaId": 3951
      },
      {
        "nombre": "Franco Giorgio Torelli",
        "personaId": 3950
      }
    ]
  },
  {
    "sociedadId": 1874,
    "socios": [
      {
        "nombre": "Guido Hernán Scalabrelli",
        "personaId": 4189
      },
      {
        "nombre": "Nicolás Javier Fernandez Barud",
        "personaId": 4190
      }
    ]
  },
  {
    "sociedadId": 2346,
    "socios": [
      {
        "nombre": "Carlos Antonio Diaz",
        "personaId": 5162
      },
      {
        "nombre": "Sergio Ariel Diaz",
        "personaId": 5161
      }
    ]
  },
  {
    "sociedadId": 2455,
    "socios": [
      {
        "nombre": "Alejandro Martín Mazzoni",
        "personaId": 5387
      }
    ]
  },
  {
    "sociedadId": 2738,
    "socios": [
      {
        "nombre": "Marta Isabel Antonicelli",
        "personaId": 5993
      }
    ]
  },
  {
    "sociedadId": 2958,
    "socios": [
      {
        "nombre": "Adriana Paula Blesa",
        "personaId": 6454
      },
      {
        "nombre": "Leandro Esteban Echavarria",
        "personaId": 6453
      }
    ]
  },
  {
    "sociedadId": 3315,
    "socios": [
      {
        "nombre": "Iván Alejandro Tkaczek Delgado",
        "personaId": 7216
      },
      {
        "nombre": "Nicolas David Tkaczek Delgado",
        "personaId": 7032
      },
      {
        "nombre": "Sergio Agustín Tkaczek Delgado",
        "personaId": 7031
      },
      {
        "nombre": "Tobías Santiago Tkaczek Delgado",
        "personaId": 7217
      }
    ]
  },
  {
    "sociedadId": 3476,
    "socios": [
      {
        "nombre": "Germán Luís Monteverdi",
        "personaId": 1326
      },
      {
        "nombre": "María Jimena Rodríguez",
        "personaId": 7515
      }
    ]
  },
  {
    "sociedadId": 3893,
    "socios": [
      {
        "nombre": "Pedro Ricardo Martínez",
        "personaId": 7756
      },
      {
        "nombre": "Virginia María Orallo",
        "personaId": 7757
      }
    ]
  },
  {
    "sociedadId": 4586,
    "socios": [
      {
        "nombre": "Carla Beatriz Ferrari Galdame",
        "personaId": 9840
      },
      {
        "nombre": "Guillermo Federico Simone",
        "personaId": 9841
      },
      {
        "nombre": "Osvaldo José Nasazzi Ruano",
        "personaId": 9839
      }
    ]
  },
  {
    "sociedadId": 5073,
    "socios": [
      {
        "nombre": "Jose Mario Althabe",
        "personaId": 10812
      },
      {
        "nombre": "María Inés Moreno",
        "personaId": 10813
      }
    ]
  },
  {
    "sociedadId": 5273,
    "socios": [
      {
        "nombre": "Ivo Santino Bistolfi",
        "personaId": 11190
      },
      {
        "nombre": "Julio Javier Bistolfi",
        "personaId": 11189
      },
      {
        "nombre": "Leonardo Roman Bistolfi",
        "personaId": 11191
      },
      {
        "nombre": "María Lujan Bistolfi",
        "personaId": 11193
      },
      {
        "nombre": "Victoria Florencia Bistolfi",
        "personaId": 11192
      }
    ]
  },
  {
    "sociedadId": 5304,
    "socios": [
      {
        "nombre": "Daniel Alejandro Magdalena",
        "personaId": 11253
      },
      {
        "nombre": "Federico Diego Magdalena",
        "personaId": 11254
      }
    ]
  },
  {
    "sociedadId": 5316,
    "socios": [
      {
        "nombre": "Cayetano Alessandrello",
        "personaId": 11267
      },
      {
        "nombre": "Leonilda Ester Davicino",
        "personaId": 11268
      }
    ]
  },
  {
    "sociedadId": 5761,
    "socios": [
      {
        "nombre": "José Luis Saldaña Beccari",
        "personaId": 3909
      },
      {
        "nombre": "Juan Manuel Saldaña Beccari",
        "personaId": 12145
      },
      {
        "nombre": "Leonardo Jose Andreu",
        "personaId": 1970
      },
      {
        "nombre": "Luis Eduardo Andreu",
        "personaId": 2843
      },
      {
        "nombre": "Nicolás Armentano",
        "personaId": 1162
      },
      {
        "nombre": "Raul Fabian Andreu",
        "personaId": 2844
      }
    ]
  },
  {
    "sociedadId": 5818,
    "socios": [
      {
        "nombre": "Tania Noelia Bayarri",
        "personaId": 12273
      }
    ]
  },
  {
    "sociedadId": 6634,
    "socios": [
      {
        "nombre": "Fernando Javier Roggerone",
        "personaId": 7602
      },
      {
        "nombre": "María Soledad Martínez Granero",
        "personaId": 13836
      }
    ]
  },
  {
    "sociedadId": 7335,
    "socios": [
      {
        "nombre": "Lorenzo Rodríguez Diego Gabriel",
        "personaId": 15151
      },
      {
        "nombre": "Lorenzo Rodríguez Florencia Estefanía",
        "personaId": 15152
      },
      {
        "nombre": "Lorenzo Rodríguez Marisol Agostina",
        "personaId": 15153
      }
    ]
  },
  {
    "sociedadId": 7375,
    "socios": [
      {
        "nombre": "Cristian Abel Colque",
        "personaId": 15214
      },
      {
        "nombre": "José Luis Colque",
        "personaId": 15215
      }
    ]
  },
  {
    "sociedadId": 7590,
    "socios": [
      {
        "nombre": "Renedo Marcela Adriana",
        "personaId": 15611
      }
    ]
  },
  {
    "sociedadId": 8484,
    "socios": [
      {
        "nombre": "Guillermo Gonzalez",
        "personaId": 17292
      },
      {
        "nombre": "María Agustina Martel Lopez",
        "personaId": 17291
      },
      {
        "nombre": "Pablo Agustín Capella",
        "personaId": 17290
      }
    ]
  },
  {
    "sociedadId": 8780,
    "socios": [
      {
        "nombre": "Guido Alvaro Di Cesare",
        "personaId": 5381
      }
    ]
  },
  {
    "sociedadId": 9056,
    "socios": [
      {
        "nombre": "Cecilia Anabel Fredes",
        "personaId": 18370
      },
      {
        "nombre": "Eric Lionel Barriga Maldonado",
        "personaId": 18369
      }
    ]
  },
  {
    "sociedadId": 9420,
    "socios": [
      {
        "nombre": "Omar Alcides Leboeuf",
        "personaId": 8563
      }
    ]
  },
  {
    "sociedadId": 9763,
    "socios": [
      {
        "nombre": "Daiana Szejpiacki",
        "personaId": 19694
      },
      {
        "nombre": "Pablo Ezequiel Zarate Alfieri",
        "personaId": 19679
      }
    ]
  },
  {
    "sociedadId": 10355,
    "socios": [
      {
        "nombre": "Marcela Inés Lledo",
        "personaId": 20777
      },
      {
        "nombre": "Sergio Marcos Breitman",
        "personaId": 20776
      }
    ]
  },
  {
    "sociedadId": 10714,
    "socios": [
      {
        "nombre": "Agustin Alberto Perlino",
        "personaId": 21260
      },
      {
        "nombre": "Ana Ines Perlino",
        "personaId": 21262
      },
      {
        "nombre": "Maria Victoria Perlino",
        "personaId": 21261
      }
    ]
  },
  {
    "sociedadId": 10989,
    "socios": [
      {
        "nombre": "María Mercedes Gomez",
        "personaId": 21651
      },
      {
        "nombre": "Sergio Alejandro Roby",
        "personaId": 21650
      }
    ]
  },
  {
    "sociedadId": 11147,
    "socios": [
      {
        "nombre": "Roberto Tomás Barrozo Ahumada",
        "personaId": 21878
      }
    ]
  },
  {
    "sociedadId": 11800,
    "socios": [
      {
        "nombre": "Danilo Martin Stevanato",
        "personaId": 22778
      },
      {
        "nombre": "Mauro Ezequiel Dominguez",
        "personaId": 22779
      }
    ]
  },
  {
    "sociedadId": 11872,
    "socios": [
      {
        "nombre": "Sierra Alejandro Walter",
        "personaId": 14467
      }
    ]
  },
  {
    "sociedadId": 12642,
    "socios": [
      {
        "nombre": "Julieta Ailen Massara Diaz",
        "personaId": 1087
      },
      {
        "nombre": "Lucas Damián Massara Diaz",
        "personaId": 1086
      }
    ]
  },
  {
    "sociedadId": 12878,
    "socios": [
      {
        "nombre": "Bruno Leonardo Bendinelli Fernández",
        "personaId": 24359
      },
      {
        "nombre": "Leonardo Fabian Bendinelli",
        "personaId": 707
      },
      {
        "nombre": "Mauro Leandro Bendinelli Fernández",
        "personaId": 24357
      },
      {
        "nombre": "Roxana Carina Fernandez",
        "personaId": 7856
      },
      {
        "nombre": "Tania Micaela Bendinelli Fernández",
        "personaId": 24358
      }
    ]
  },
  {
    "sociedadId": 13118,
    "socios": [
      {
        "nombre": "Griselda Verónica Paola Araya",
        "personaId": 10629
      },
      {
        "nombre": "Julia Porretta",
        "personaId": 24713
      },
      {
        "nombre": "Luca Porretta",
        "personaId": 10628
      },
      {
        "nombre": "Valentina Porretta",
        "personaId": 24712
      }
    ]
  },
  {
    "sociedadId": 13937,
    "socios": [
      {
        "nombre": "Camila Yacopini",
        "personaId": 25873
      }
    ]
  },
  {
    "sociedadId": 14231,
    "socios": [
      {
        "nombre": "Pablo Andrés Lucero",
        "personaId": 21661
      }
    ]
  },
  {
    "sociedadId": 14595,
    "socios": [
      {
        "nombre": "Cardena Paula Noemi",
        "personaId": 12985
      },
      {
        "nombre": "Pollicino Aldo Nicolas",
        "personaId": 12984
      }
    ]
  },
  {
    "sociedadId": 14602,
    "socios": [
      {
        "nombre": "Alejandro Fabián Dabin",
        "personaId": 10383
      },
      {
        "nombre": "Andrés Emilio Benenati",
        "personaId": 26806
      },
      {
        "nombre": "Facundo Dabin Barbero",
        "personaId": 26808
      },
      {
        "nombre": "Fernando Miroti",
        "personaId": 26807
      }
    ]
  },
  {
    "sociedadId": 14816,
    "socios": [
      {
        "nombre": "Matías Fernando Cantón",
        "personaId": 3466
      }
    ]
  },
  {
    "sociedadId": 14911,
    "socios": [
      {
        "nombre": "Gustavo Javier Rodriguez",
        "personaId": 16540
      },
      {
        "nombre": "José Adrián Troyano",
        "personaId": 24436
      }
    ]
  },
  {
    "sociedadId": 15271,
    "socios": [
      {
        "nombre": "Cristina Elizabeth Copa",
        "personaId": 27806
      },
      {
        "nombre": "Emiliano Ángel Vargas",
        "personaId": 27807
      },
      {
        "nombre": "Marcos Carlos Puebla",
        "personaId": 27809
      },
      {
        "nombre": "Miguel Ángel Ruiz",
        "personaId": 27808
      }
    ]
  },
  {
    "sociedadId": 15589,
    "socios": [
      {
        "nombre": "Lautaro Lisandro Rinaudo",
        "personaId": 15761
      },
      {
        "nombre": "Martin Maximiliano Barisio",
        "personaId": 26083
      }
    ]
  },
  {
    "sociedadId": 15763,
    "socios": [
      {
        "nombre": "Gabriela Alejandra Ojeda",
        "personaId": 2163
      },
      {
        "nombre": "Orlando Estanislao Altamirano",
        "personaId": 2162
      }
    ]
  },
  {
    "sociedadId": 15902,
    "socios": [
      {
        "nombre": "Ciro Humberto Ferrer",
        "personaId": 28721
      },
      {
        "nombre": "Lilia Micaela Dubini",
        "personaId": 28722
      }
    ]
  },
  {
    "sociedadId": 16145,
    "socios": [
      {
        "nombre": "Laura Cecilia Lampa",
        "personaId": 28997
      }
    ]
  },
  {
    "sociedadId": 16231,
    "socios": [
      {
        "nombre": "Franchetti Aldo",
        "personaId": 15074
      },
      {
        "nombre": "Franchetti Marcelo",
        "personaId": 15073
      }
    ]
  },
  {
    "sociedadId": 16432,
    "socios": [
      {
        "nombre": "Estanislao Puelles",
        "personaId": 29420
      }
    ]
  },
  {
    "sociedadId": 16685,
    "socios": [
      {
        "nombre": "Gustavo César Bernardi",
        "personaId": 29793
      },
      {
        "nombre": "Sergio Ariel Bernardi",
        "personaId": 29795
      }
    ]
  },
  {
    "sociedadId": 16953,
    "socios": [
      {
        "nombre": "Javier Hernán Capomaggi",
        "personaId": 30168
      },
      {
        "nombre": "Lorena Lourdes Benedetti",
        "personaId": 30169
      }
    ]
  },
  {
    "sociedadId": 17261,
    "socios": [
      {
        "nombre": "Fernando Buscema",
        "personaId": 4832
      },
      {
        "nombre": "María Rosana Mesa",
        "personaId": 30584
      }
    ]
  },
  {
    "sociedadId": 17409,
    "socios": [
      {
        "nombre": "Lucia Mabel Villanova",
        "personaId": 30771
      },
      {
        "nombre": "Mario Jorge Peña",
        "personaId": 30770
      }
    ]
  },
  {
    "sociedadId": 17515,
    "socios": [
      {
        "nombre": "Alicia Ostropolsky",
        "personaId": 30943
      },
      {
        "nombre": "Andres Marcelo Ostropolsky",
        "personaId": 2733
      },
      {
        "nombre": "Cecilia Perla Ostropolsky",
        "personaId": 24055
      },
      {
        "nombre": "Claudia Ruth Ostropolsky",
        "personaId": 30942
      },
      {
        "nombre": "Irene Paula Ostropolsky",
        "personaId": 30944
      }
    ]
  },
  {
    "sociedadId": 17975,
    "socios": [
      {
        "nombre": "Maria Isabel Zareba",
        "personaId": 31507
      },
      {
        "nombre": "Pablo Andres Calabro",
        "personaId": 31508
      }
    ]
  },
  {
    "sociedadId": 17991,
    "socios": [
      {
        "nombre": "Maria Cecilia Torrent",
        "personaId": 8147
      },
      {
        "nombre": "Mauricio Raul Raffa",
        "personaId": 8146
      }
    ]
  },
  {
    "sociedadId": 18470,
    "socios": [
      {
        "nombre": "Agustin David Ferrari Moreno",
        "personaId": 25466
      },
      {
        "nombre": "Franco Matías Di Santo",
        "personaId": 32097
      },
      {
        "nombre": "Labanca Diego Miguel",
        "personaId": 18323
      }
    ]
  },
  {
    "sociedadId": 18805,
    "socios": [
      {
        "nombre": "Diego Ricardo Sottano",
        "personaId": 32503
      },
      {
        "nombre": "Pablo Marcelo Sottano",
        "personaId": 32504
      }
    ]
  }
];
