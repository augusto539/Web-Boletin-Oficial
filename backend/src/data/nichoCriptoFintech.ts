// Contenido del informe "Cripto y fintech en Mendoza", quinto de la serie de
// nichos sectoriales. Mismo criterio que los cuatro anteriores: texto y
// cifras redactados a mano a partir del documento fuente, integrados acá
// como contenido estático.
//
// sociedadId/personaId: las 14 entidades y sus socios se cruzaron a mano
// contra la base (por CUIT donde había, por nombre normalizado donde no) —
// las 14 calzaron exacto. A diferencia del informe de Energía renovable,
// acá ningún socio es persona jurídica: los 32 socios/integrantes del
// directorio son todos personas físicas con ficha propia.
//
// Todas las tablas del documento fuente (evolución anual, tipo societario,
// departamentos, capital) calzaron exactas contra el directorio y la base
// real — no hizo falta corregir ningún valor.

const VINO = "#691824";
const GRIS_TENUE = "#b9b9b9";
const VINO_CLARO = "#8a2433";

export const EVOLUCION_ANUAL = [
  { etiqueta: "2020", valor: 3, color: VINO },
  { etiqueta: "2021", valor: 4, color: VINO },
  { etiqueta: "2022", valor: 2, color: VINO },
  { etiqueta: "2023", valor: 0, color: GRIS_TENUE },
  { etiqueta: "2024", valor: 1, color: VINO_CLARO },
  { etiqueta: "2025", valor: 3, color: VINO_CLARO },
  { etiqueta: "2026*", valor: 1, color: VINO_CLARO },
];

export const LEYENDA_EVOLUCION = [
  { color: VINO, etiqueta: "Boom 2020–2021 y resaca (2022)" },
  { color: GRIS_TENUE, etiqueta: "Crypto winter (2023)" },
  { color: VINO_CLARO, etiqueta: "Recuperación / ETF (2024–2026)" },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.", cantidad: 6 },
  { tipo: "S.A.S.", cantidad: 6 },
  { tipo: "S.R.L.", cantidad: 2 },
];

export const DEPARTAMENTOS_CRIPTO = [
  { departamento: "Capital", cantidad: 8 },
  { departamento: "Godoy Cruz", cantidad: 3 },
  { departamento: "San Rafael", cantidad: 2 },
  { departamento: "Luján de Cuyo", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadCriptoCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadCriptoCurada[] = [
  {
    "sociedadId": 4440,
    "socios": [
      {
        "nombre": "Daniel Ricardo Rodríguez",
        "personaId": 9513
      },
      {
        "nombre": "Gustavo Germán Gómez",
        "personaId": 9514
      }
    ]
  },
  {
    "sociedadId": 5497,
    "socios": [
      {
        "nombre": "Cesar Armando Perez",
        "personaId": 11631
      },
      {
        "nombre": "Lemis Asenjo Vasquez",
        "personaId": 11633
      },
      {
        "nombre": "Manuel Manzur",
        "personaId": 11630
      },
      {
        "nombre": "Martín Diego Saal",
        "personaId": 11632
      }
    ]
  },
  {
    "sociedadId": 5575,
    "socios": [
      {
        "nombre": "Agustín Eduardo Frúgoli",
        "personaId": 11797
      },
      {
        "nombre": "Gonzalo Pérez Cuesta Ortega",
        "personaId": 11795
      },
      {
        "nombre": "Jonathan Ary Karzovnik",
        "personaId": 1003
      },
      {
        "nombre": "Jorge Ernesto Pérez Cuesta",
        "personaId": 11796
      },
      {
        "nombre": "Jorge Ignacio Pérez Cuesta Toso",
        "personaId": 11798
      },
      {
        "nombre": "Luis Emilio Abrego",
        "personaId": 11799
      }
    ]
  },
  {
    "sociedadId": 6882,
    "socios": [
      {
        "nombre": "Diego Martin Navarro",
        "personaId": 14290
      },
      {
        "nombre": "Valentín Fuentes Garcia",
        "personaId": 4210
      }
    ]
  },
  {
    "sociedadId": 7207,
    "socios": [
      {
        "nombre": "Balladores Agustin Nicolas",
        "personaId": 14923
      },
      {
        "nombre": "Carlos Mauro Llopiz",
        "personaId": 8648
      },
      {
        "nombre": "Giorgis Bruno Dario",
        "personaId": 14924
      },
      {
        "nombre": "Rodrigo Daniel Rivero",
        "personaId": 3248
      }
    ]
  },
  {
    "sociedadId": 7308,
    "socios": [
      {
        "nombre": "Agustina Marchessi",
        "personaId": 15102
      },
      {
        "nombre": "Alberto Francisco Conti",
        "personaId": 15100
      },
      {
        "nombre": "Eugenio Marchessi",
        "personaId": 15101
      },
      {
        "nombre": "Héctor Horacio Marchessi",
        "personaId": 653
      }
    ]
  },
  {
    "sociedadId": 7717,
    "socios": [
      {
        "nombre": "Álvaro Izquierdo",
        "personaId": 15868
      },
      {
        "nombre": "Lautaro Francisco Corazza Becerra",
        "personaId": 15867
      },
      {
        "nombre": "Lautaro Ramiro Bianchi Riveros",
        "personaId": 15865
      },
      {
        "nombre": "Mariano Nicanor Izquierdo",
        "personaId": 15869
      },
      {
        "nombre": "Nicolás Gimenez Lifona",
        "personaId": 15864
      },
      {
        "nombre": "Valentín Albornoz",
        "personaId": 15866
      }
    ]
  },
  {
    "sociedadId": 8719,
    "socios": [
      {
        "nombre": "Fernando Ariel Porreta",
        "personaId": 393
      },
      {
        "nombre": "Fernando Gabriel Jauregui Gomez",
        "personaId": 17722
      },
      {
        "nombre": "Luca Porretta",
        "personaId": 10628
      }
    ]
  },
  {
    "sociedadId": 8855,
    "socios": [
      {
        "nombre": "Chaves Lorkovic Melina Paola",
        "personaId": 17974
      },
      {
        "nombre": "Fernandez Diego Jose",
        "personaId": 17975
      }
    ]
  },
  {
    "sociedadId": 15438,
    "socios": [
      {
        "nombre": "Guillermo Javier Kozub",
        "personaId": 28062
      },
      {
        "nombre": "Mariano Daniel Gurrieri",
        "personaId": 10231
      },
      {
        "nombre": "Romina Soledad Cuevas",
        "personaId": 28061
      }
    ]
  },
  {
    "sociedadId": 16301,
    "socios": [
      {
        "nombre": "Pablo Andrés Cocucci",
        "personaId": 29243
      },
      {
        "nombre": "Pablo Antonio Cocucci",
        "personaId": 3347
      }
    ]
  },
  {
    "sociedadId": 16387,
    "socios": [
      {
        "nombre": "Alvaro Oyonarte",
        "personaId": 29363
      },
      {
        "nombre": "Jorge Luis Oyonarte",
        "personaId": 15441
      }
    ]
  },
  {
    "sociedadId": 17237,
    "socios": [
      {
        "nombre": "Pablo Miguel Morales",
        "personaId": 30546
      },
      {
        "nombre": "Sergio Dante Marroquín",
        "personaId": 30545
      }
    ]
  },
  {
    "sociedadId": 18402,
    "socios": [
      {
        "nombre": "Agustín Brizuela Sturzenegger",
        "personaId": 32018
      },
      {
        "nombre": "German Hidalgo Yanzon",
        "personaId": 17592
      },
      {
        "nombre": "Guillermo Federico Baker",
        "personaId": 32019
      }
    ]
  }
];
