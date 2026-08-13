// Contenido del informe "Energía solar y eólica en Mendoza", cuarto de la
// serie de nichos sectoriales. Mismo criterio que los tres anteriores:
// texto y cifras redactados a mano a partir del documento fuente,
// integrados acá como contenido estático.
//
// sociedadId/personaId: cada entidad y cada socio se cruzó a mano contra la
// base (por CUIT donde había, por nombre donde no, y por los vínculos
// reales de la sociedad para los socios) — las 50 entidades del documento
// fuente calzaron exacto contra la base real. A diferencia de los informes
// anteriores, acá varios socios son personas jurídicas (Dax Energy
// Holdings, Tassaroli S.A., Green S.A., Grupo Energías Globales, etc.), que
// no tienen ficha propia en el sitio — quedan sin link, igual que "Felito
// S.A." en el informe de Bodegas boutique.
//
// A diferencia de Enoturismo y Bodegas boutique, todas las tablas de este
// documento (evolución anual, tipo societario, departamentos, capital)
// calzaron exactas contra el directorio y la base real — no hizo falta
// corregir ningún valor.

const VINO = "#691824";
const GRIS_TENUE = "#b9b9b9";
const VINO_CLARO = "#8a2433";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 18, color: VINO },
  { etiqueta: "2018", valor: 3, color: GRIS_TENUE },
  { etiqueta: "2019", valor: 7, color: GRIS_TENUE },
  { etiqueta: "2020", valor: 1, color: GRIS_TENUE },
  { etiqueta: "2021", valor: 1, color: GRIS_TENUE },
  { etiqueta: "2022", valor: 5, color: GRIS_TENUE },
  { etiqueta: "2023", valor: 0, color: GRIS_TENUE },
  { etiqueta: "2024", valor: 7, color: VINO_CLARO },
  { etiqueta: "2025", valor: 4, color: VINO_CLARO },
  { etiqueta: "2026*", valor: 2, color: VINO_CLARO },
];

export const LEYENDA_EVOLUCION = [
  { color: VINO, etiqueta: "Ola 1: RenovAr (2017)" },
  { color: GRIS_TENUE, etiqueta: "Vacío (2018–2023)" },
  { color: VINO_CLARO, etiqueta: "Ola 2: generación distribuida (2024–2026)" },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.", cantidad: 27 },
  { tipo: "S.A.S.", cantidad: 19 },
  { tipo: "S.R.L.", cantidad: 2 },
  { tipo: "Unión Transitoria", cantidad: 2 },
];

export const DEPARTAMENTOS_ENERGIA = [
  { departamento: "Luján de Cuyo", cantidad: 13 },
  { departamento: "San Rafael", cantidad: 11 },
  { departamento: "Capital", cantidad: 8 },
  { departamento: "Guaymallén", cantidad: 5 },
  { departamento: "Godoy Cruz", cantidad: 4 },
  { departamento: "Rivadavia", cantidad: 2 },
  { departamento: "San Martín", cantidad: 2 },
  { departamento: "Maipú", cantidad: 1 },
  { departamento: "Lavalle", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadEnergiaCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadEnergiaCurada[] = [
  {
    "sociedadId": 4,
    "socios": [
      {
        "nombre": "Dax Energy Argentina Holdings S.p.A.",
        "sociedadId": 19487
      },
      {
        "nombre": "Dax Energy Holdings S.p.A.",
        "sociedadId": 19486
      },
      {
        "nombre": "Fernando Flavio Ferreyra",
        "personaId": 4
      },
      {
        "nombre": "Flavio Arjona",
        "personaId": 6
      },
      {
        "nombre": "Luciano Rodolfo Masnu Lardet",
        "personaId": 3
      },
      {
        "nombre": "Tomás Palastanga",
        "personaId": 5
      }
    ]
  },
  {
    "sociedadId": 5,
    "socios": [
      {
        "nombre": "Dax Energy Argentina Holdings S.p.A",
        "sociedadId": 19487
      },
      {
        "nombre": "Dax Energy Holdings S.p.A",
        "sociedadId": 19486
      },
      {
        "nombre": "Fernando Flavio Ferreyra",
        "personaId": 4
      },
      {
        "nombre": "Flavio Arjona",
        "personaId": 6
      },
      {
        "nombre": "Luciano Rodolfo Masnu Lardet",
        "personaId": 3
      },
      {
        "nombre": "Tomás Palastanga",
        "personaId": 5
      }
    ]
  },
  {
    "sociedadId": 6,
    "socios": [
      {
        "nombre": "Dax Energy Argentina Holdings S.p.A",
        "sociedadId": 19487
      },
      {
        "nombre": "Dax Energy Holdings S.p.A",
        "sociedadId": 19486
      },
      {
        "nombre": "Fernando Flavio Ferreyra",
        "personaId": 4
      },
      {
        "nombre": "Flavio Arjona",
        "personaId": 6
      },
      {
        "nombre": "Luciano Rodolfo Masnu Lardet",
        "personaId": 3
      },
      {
        "nombre": "Tomás Palastanga",
        "personaId": 5
      }
    ]
  },
  {
    "sociedadId": 2,
    "socios": [
      {
        "nombre": "Dax Energy Argentina Holdings S.p.A.",
        "sociedadId": 19487
      },
      {
        "nombre": "Dax Energy Holdings S.p.A.",
        "sociedadId": 19486
      },
      {
        "nombre": "Fernando Flavio Ferreyra",
        "personaId": 4
      },
      {
        "nombre": "Flavio Arjona",
        "personaId": 6
      },
      {
        "nombre": "Luciano Rodolfo Masnu Lardet",
        "personaId": 3
      },
      {
        "nombre": "Tomás Palastanga",
        "personaId": 5
      }
    ]
  },
  {
    "sociedadId": 207,
    "socios": [
      {
        "nombre": "Carlos Alberto Tassaroli",
        "personaId": 451
      },
      {
        "nombre": "Rosalía Beatriz García",
        "personaId": 500
      }
    ]
  },
  {
    "sociedadId": 206,
    "socios": [
      {
        "nombre": "Carlos Alberto Tassaroli",
        "personaId": 451
      },
      {
        "nombre": "Rosalía Beatriz García",
        "personaId": 500
      }
    ]
  },
  {
    "sociedadId": 203,
    "socios": [
      {
        "nombre": "Carlos Alberto Tassaroli",
        "personaId": 451
      },
      {
        "nombre": "Rosalía Beatriz García",
        "personaId": 500
      }
    ]
  },
  {
    "sociedadId": 204,
    "socios": [
      {
        "nombre": "Carlos Alberto Tassaroli",
        "personaId": 451
      },
      {
        "nombre": "Rosalía Beatriz García",
        "personaId": 500
      }
    ]
  },
  {
    "sociedadId": 205,
    "socios": [
      {
        "nombre": "Carlos Alberto Tassaroli",
        "personaId": 451
      },
      {
        "nombre": "Rosalía Beatriz García",
        "personaId": 500
      }
    ]
  },
  {
    "sociedadId": 266,
    "socios": [
      {
        "nombre": "Dax Energy Holdings S.p.A",
        "sociedadId": 19486
      },
      {
        "nombre": "Fernando Flavio Ferreyra",
        "personaId": 4
      },
      {
        "nombre": "Flavio Arjona",
        "personaId": 6
      },
      {
        "nombre": "Luciano Rodolfo Masnu Lardet",
        "personaId": 3
      },
      {
        "nombre": "Tomás Palastanga",
        "personaId": 5
      }
    ]
  },
  {
    "sociedadId": 297,
    "socios": [
      {
        "nombre": "Carlos Alberto Tassaroli",
        "personaId": 451
      },
      {
        "nombre": "Rosalía Beatriz García",
        "personaId": 500
      },
      {
        "nombre": "Tassaroli S.A.",
        "sociedadId": 19488
      }
    ]
  },
  {
    "sociedadId": 389,
    "socios": [
      {
        "nombre": "Francisco Javier Elizondo",
        "personaId": 923
      },
      {
        "nombre": "Maximiliano Llamazares",
        "personaId": 924
      }
    ]
  },
  {
    "sociedadId": 394,
    "socios": [
      {
        "nombre": "Manuel Sánchez Blanco",
        "personaId": 937
      },
      {
        "nombre": "Milca Ruth Mopardo",
        "personaId": 939
      },
      {
        "nombre": "Oscar Ivan Montenegro",
        "personaId": 936
      },
      {
        "nombre": "Walther Antonio Farías",
        "personaId": 938
      }
    ]
  },
  {
    "sociedadId": 502,
    "socios": [
      {
        "nombre": "Dax Energy Holdings S.p.A",
        "sociedadId": 19486
      },
      {
        "nombre": "Fernando Flavio Ferreyra",
        "personaId": 4
      },
      {
        "nombre": "Flavio Arjona",
        "personaId": 6
      },
      {
        "nombre": "Luciano Rodolfo Masnu Lardet",
        "personaId": 3
      },
      {
        "nombre": "Tomás Palastanga",
        "personaId": 5
      }
    ]
  },
  {
    "sociedadId": 503,
    "socios": [
      {
        "nombre": "Dax Energy Argentina Holdings S.p.A",
        "sociedadId": 19487
      },
      {
        "nombre": "Dax Energy Holdings S.p.A",
        "sociedadId": 19486
      },
      {
        "nombre": "Fernando Flavio Ferreyra",
        "personaId": 4
      },
      {
        "nombre": "Flavio Arjona",
        "personaId": 6
      },
      {
        "nombre": "Luciano Rodolfo Masnu Lardet",
        "personaId": 3
      },
      {
        "nombre": "Tomás Palastanga",
        "personaId": 5
      }
    ]
  },
  {
    "sociedadId": 514,
    "socios": [
      {
        "nombre": "Dax Energy Argentina Holdings S.p.A",
        "sociedadId": 19487
      },
      {
        "nombre": "Dax Energy Holdings S.p.A",
        "sociedadId": 19486
      },
      {
        "nombre": "Fernando Flavio Ferreyra",
        "personaId": 4
      },
      {
        "nombre": "Flavio Arjona",
        "personaId": 6
      },
      {
        "nombre": "Luciano Rodolfo Masnu Lardet",
        "personaId": 3
      },
      {
        "nombre": "Tomás Palastanga",
        "personaId": 5
      }
    ]
  },
  {
    "sociedadId": 513,
    "socios": [
      {
        "nombre": "Dax Energy Argentina Holdings S.p.A",
        "sociedadId": 19487
      },
      {
        "nombre": "Dax Energy Holdings S.p.A",
        "sociedadId": 19486
      },
      {
        "nombre": "Fernando Flavio Ferreyra",
        "personaId": 4
      },
      {
        "nombre": "Flavio Arjona",
        "personaId": 6
      },
      {
        "nombre": "Luciano Rodolfo Masnu Lardet",
        "personaId": 3
      },
      {
        "nombre": "Tomás Palastanga",
        "personaId": 5
      }
    ]
  },
  {
    "sociedadId": 525,
    "socios": [
      {
        "nombre": "Carlos Daniel Amprino",
        "personaId": 1221
      },
      {
        "nombre": "Carlos Daniel Roman",
        "personaId": 1220
      },
      {
        "nombre": "Carlos Eduardo Arroyo",
        "personaId": 1219
      },
      {
        "nombre": "Green S.A.",
        "sociedadId": 10544
      }
    ]
  },
  {
    "sociedadId": 1883,
    "socios": [
      {
        "nombre": "Gonzalo Gomez",
        "personaId": 4212
      },
      {
        "nombre": "Julian Gomez",
        "personaId": 4213
      }
    ]
  },
  {
    "sociedadId": 2002,
    "socios": [
      {
        "nombre": "Maria Magdalena Pereto Peralta",
        "personaId": 4463
      },
      {
        "nombre": "Mauro Jose Cunietti",
        "personaId": 4461
      },
      {
        "nombre": "Pablo Jose Perez Reinoso",
        "personaId": 4462
      }
    ]
  },
  {
    "sociedadId": 2206,
    "socios": [
      {
        "nombre": "Estación Terminal Mendoza S.A.",
        "sociedadId": 19490
      },
      {
        "nombre": "Grupo Energías Globales S.A.",
        "sociedadId": 19489
      },
      {
        "nombre": "Juan Franco Badaloni",
        "personaId": 4281
      },
      {
        "nombre": "Juan Ignacio Cucchi",
        "personaId": 4858
      }
    ]
  },
  {
    "sociedadId": 2611,
    "socios": [
      {
        "nombre": "Carlos Eduardo Rojas",
        "personaId": 5720
      },
      {
        "nombre": "Julieta Lucia Rojas",
        "personaId": 5721
      }
    ]
  },
  {
    "sociedadId": 2987,
    "socios": [
      {
        "nombre": "Grupo Energías Globales S.A.",
        "sociedadId": 19489
      },
      {
        "nombre": "Laugero Construcciones S.A.",
        "sociedadId": 19491
      },
      {
        "nombre": "Santiago Laugero",
        "personaId": 4604
      }
    ]
  },
  {
    "sociedadId": 3232,
    "socios": [
      {
        "nombre": "Carlos Osvaldo Juarez",
        "personaId": 7038
      },
      {
        "nombre": "Martin Alejandro Juarez",
        "personaId": 7039
      }
    ]
  },
  {
    "sociedadId": 3317,
    "socios": [
      {
        "nombre": "Carlos Alberto Tassaroli",
        "personaId": 451
      },
      {
        "nombre": "Rosalía Beatriz García",
        "personaId": 500
      },
      {
        "nombre": "Tassaroli Sociedad Anónima",
        "sociedadId": 19488
      }
    ]
  },
  {
    "sociedadId": 3316,
    "socios": [
      {
        "nombre": "Carlos Alberto Tassaroli",
        "personaId": 451
      },
      {
        "nombre": "Rosalía Beatriz García",
        "personaId": 500
      },
      {
        "nombre": "Tassaroli Sociedad Anónima",
        "sociedadId": 19488
      }
    ]
  },
  {
    "sociedadId": 3486,
    "socios": [
      {
        "nombre": "Mónica Patricia Orozco",
        "personaId": 7534
      },
      {
        "nombre": "Pedro Juan Orozco",
        "personaId": 7535
      }
    ]
  },
  {
    "sociedadId": 3819,
    "socios": [
      {
        "nombre": "Emiliano Matías Tejada",
        "personaId": 317
      },
      {
        "nombre": "Facundo Martín Tejada",
        "personaId": 318
      },
      {
        "nombre": "Marcelo Javier Tejada",
        "personaId": 314
      },
      {
        "nombre": "Mariela Fernanda Tejada",
        "personaId": 316
      }
    ]
  },
  {
    "sociedadId": 4730,
    "socios": [
      {
        "nombre": "Juan Pablo Giol",
        "personaId": 10143
      },
      {
        "nombre": "Nicolás Daniel Giorlando",
        "personaId": 10141
      },
      {
        "nombre": "Paula Prado Vargas",
        "personaId": 10142
      }
    ]
  },
  {
    "sociedadId": 6593,
    "socios": [
      {
        "nombre": "Héctor Horacio Marchessi",
        "personaId": 653
      },
      {
        "nombre": "Obras Andinas S.A.",
        "sociedadId": 19492
      },
      {
        "nombre": "Syr Energia Sas",
        "sociedadId": 19493
      }
    ]
  },
  {
    "sociedadId": 8204,
    "socios": [
      {
        "nombre": "Gerardo Vaquer",
        "personaId": 546
      },
      {
        "nombre": "Proyectos Lavalle Sociedad Anonima Con Participacion Estatal Mayoritaria",
        "sociedadId": 397
      },
      {
        "nombre": "Rolando Romera",
        "personaId": 547
      }
    ]
  },
  {
    "sociedadId": 9298,
    "socios": [
      {
        "nombre": "Eduardo Carlos Muñoz Balza",
        "personaId": 18815
      },
      {
        "nombre": "Héctor Luis Diaz",
        "personaId": 18814
      },
      {
        "nombre": "Jurby Figueredo",
        "personaId": 18813
      },
      {
        "nombre": "Jurby Juzayda Figueredo González",
        "personaId": 19064
      }
    ]
  },
  {
    "sociedadId": 9606,
    "socios": [
      {
        "nombre": "Carlos Seijo",
        "personaId": 19402
      },
      {
        "nombre": "Fernando Emilio Begher",
        "personaId": 19400
      },
      {
        "nombre": "Julieta Monti",
        "personaId": 19401
      }
    ]
  },
  {
    "sociedadId": 10044,
    "socios": [
      {
        "nombre": "Alfredo Daniel Pérez Raffaelli",
        "personaId": 20174
      },
      {
        "nombre": "Carlos Alberto Monforte",
        "personaId": 2180
      },
      {
        "nombre": "Enrique Oscar Gómez",
        "personaId": 20175
      },
      {
        "nombre": "Miguel Antonio Cedeño",
        "personaId": 20176
      }
    ]
  },
  {
    "sociedadId": 10263,
    "socios": [
      {
        "nombre": "Lidia Rosa Zingaretti",
        "personaId": 20573
      },
      {
        "nombre": "Luis Agenor Morales Amigo",
        "personaId": 20574
      }
    ]
  },
  {
    "sociedadId": 13372,
    "socios": [
      {
        "nombre": "Diego Elbio Guttilla",
        "personaId": 20465
      },
      {
        "nombre": "Manuel Pithod De Rosas",
        "personaId": 25066
      }
    ]
  },
  {
    "sociedadId": 13672,
    "socios": [
      {
        "nombre": "Pedro Daniel Vitar",
        "personaId": 25485
      }
    ]
  },
  {
    "sociedadId": 13824,
    "socios": [
      {
        "nombre": "Eduardo Adrián Gramblicka",
        "personaId": 10182
      },
      {
        "nombre": "Silvina Mercedes Hauser Gallardo",
        "personaId": 25687
      }
    ]
  },
  {
    "sociedadId": 13835,
    "socios": [
      {
        "nombre": "Diego Logotetti",
        "personaId": 25715
      },
      {
        "nombre": "Miguel Angel Arce",
        "personaId": 25714
      }
    ]
  },
  {
    "sociedadId": 13964,
    "socios": [
      {
        "nombre": "Claudio Marcelo Migliorisi",
        "personaId": 25922
      },
      {
        "nombre": "Maria Laura Carrion",
        "personaId": 25923
      }
    ]
  },
  {
    "sociedadId": 14615,
    "socios": [
      {
        "nombre": "Eduardo Eugenio Piñero",
        "personaId": 25211
      },
      {
        "nombre": "Juan Manuel Alfonsin",
        "personaId": 26829
      },
      {
        "nombre": "Luis Alberto Remaggi Obregon",
        "personaId": 26828
      }
    ]
  },
  {
    "sociedadId": 15020,
    "socios": [
      {
        "nombre": "Farell Bernard Shoeman",
        "personaId": 27456
      },
      {
        "nombre": "Juan Manuel Maldonado",
        "personaId": 27457
      }
    ]
  },
  {
    "sociedadId": 15840,
    "socios": [
      {
        "nombre": "Federico Angel Carrillo Pezza",
        "personaId": 28619
      },
      {
        "nombre": "Maximiliano Martinez",
        "personaId": 28620
      }
    ]
  },
  {
    "sociedadId": 16388,
    "socios": [
      {
        "nombre": "Araya Gustavo Alberto",
        "personaId": 11145
      },
      {
        "nombre": "Eduardo Raúl Araya",
        "personaId": 29364
      }
    ]
  },
  {
    "sociedadId": 16935,
    "socios": [
      {
        "nombre": "Salinas Jaime Alberto",
        "personaId": 30119
      }
    ]
  },
  {
    "sociedadId": 17644,
    "socios": [
      {
        "nombre": "Ignacio Agustín Marasco",
        "personaId": 31098
      },
      {
        "nombre": "Iván Ernesto Manca Guevara",
        "personaId": 31101
      },
      {
        "nombre": "Nicolás Rodriguez Ciz",
        "personaId": 31100
      },
      {
        "nombre": "Pablo Daniel Nasi",
        "personaId": 31099
      }
    ]
  },
  {
    "sociedadId": 18463,
    "socios": [
      {
        "nombre": "Maria Soledad Puga",
        "personaId": 32088
      },
      {
        "nombre": "Maria Victoria Quintero",
        "personaId": 32089
      }
    ]
  },
  {
    "sociedadId": 19348,
    "socios": [
      {
        "nombre": "Mónica Elizabeth Dacortá",
        "personaId": 33364
      },
      {
        "nombre": "Ricardo Daniel Dell'Agnola",
        "personaId": 33363
      }
    ]
  },
  {
    "sociedadId": 93,
    "socios": [
      {
        "nombre": "Antonio Genaro Spoggi",
        "personaId": 234
      },
      {
        "nombre": "Patricia Elena Abdala",
        "personaId": 235
      }
    ]
  },
  {
    "sociedadId": 609,
    "socios": []
  }
];
