// Contenido del informe "Seguridad privada en Mendoza". Metodología de
// cruce documentada en frontend/src/data/nichoSeguridadPrivada.ts -- mismo
// criterio acá. Duplicado del server-side para el middleware de SEO
// (seo.ts) -- mismo criterio que el resto de los nichoX.ts en
// backend/src/data/. DEPARTAMENTOS va como array plano acá (no Map, que no
// es JSON-serializable tal cual para el render de texto plano del SEO).
//
// ENTIDADES acá es solo la lista "curada" (sociedadId + socios con sus ids)
// -- nombre/cuit/capital/tipo/departamento/objetoSocial se resuelven EN VIVO
// contra la base (ver informesNicho.ts / resolverEntidades), así que una
// sociedad o persona dada de baja desaparece sola del informe.

export const EVOLUCION_ANUAL = [
  { etiqueta: "2017", valor: 7 },
  { etiqueta: "2018", valor: 9 },
  { etiqueta: "2019", valor: 15 },
  { etiqueta: "2020", valor: 13 },
  { etiqueta: "2021", valor: 13 },
  { etiqueta: "2022", valor: 16 },
  { etiqueta: "2023", valor: 13 },
  { etiqueta: "2024", valor: 21 },
  { etiqueta: "2025", valor: 21 },
  { etiqueta: "2026*", valor: 3 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 109 },
  { tipo: "S.A.", cantidad: 17 },
  { tipo: "S.R.L.", cantidad: 10 },
];

export const DEPARTAMENTOS_SEGURIDAD_PRIVADA = [
  { departamento: "Capital", cantidad: 32 },
  { departamento: "Guaymallén", cantidad: 32 },
  { departamento: "Godoy Cruz", cantidad: 19 },
  { departamento: "San Martín", cantidad: 9 },
  { departamento: "Las Heras", cantidad: 8 },
  { departamento: "Maipú", cantidad: 6 },
  { departamento: "Luján de Cuyo", cantidad: 6 },
  { departamento: "Junín", cantidad: 6 },
  { departamento: "San Rafael", cantidad: 5 },
  { departamento: "Tunuyán", cantidad: 3 },
  { departamento: "General Alvear", cantidad: 2 },
  { departamento: "Tupungato", cantidad: 1 },
  { departamento: "Lavalle", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadSeguridadPrivadaCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadSeguridadPrivadaCurada[] = [
  {
    "sociedadId": 1,
    "socios": [
      { "nombre": "Evangelina Belen Llanes", "personaId": 1 },
      { "nombre": "Javier Omar Zapata", "personaId": 2 }
    ]
  },
  {
    "sociedadId": 183,
    "socios": [
      { "nombre": "Gabriel Gustavo Pérez", "personaId": 453 },
      { "nombre": "Isabel Margarita Cofre Escobar", "personaId": 454 }
    ]
  },
  {
    "sociedadId": 403,
    "socios": [
      { "nombre": "Muñoz Marcelo Daniel", "personaId": 959 },
      { "nombre": "Verónica Vanesa Gómez", "personaId": 960 }
    ]
  },
  {
    "sociedadId": 531,
    "socios": [
      { "nombre": "Edgar Juan Antonio Passerini", "personaId": 1232 },
      { "nombre": "Sergio Alejandro Passerini", "personaId": 1231 }
    ]
  },
  {
    "sociedadId": 772,
    "socios": [
      { "nombre": "Mariela Alejandra Martínez", "personaId": 1767 }
    ]
  },
  {
    "sociedadId": 811,
    "socios": [
      { "nombre": "Gerardo Ramon Rosi", "personaId": 1866 },
      { "nombre": "Javier Antonio Mesas", "personaId": 1865 },
      { "nombre": "Jorge Eduardo Barzola", "personaId": 561 },
      { "nombre": "Martin Nicolas Tassin", "personaId": 1864 }
    ]
  },
  {
    "sociedadId": 843,
    "socios": [
      { "nombre": "Facundo Roberto Torres Garay", "personaId": 1951 },
      { "nombre": "Gabriel Augusto Garay", "personaId": 1950 }
    ]
  },
  {
    "sociedadId": 881,
    "socios": [
      { "nombre": "Luis Leonardo Meizenq", "personaId": 2047 },
      { "nombre": "Marcelo Alejandro Meizenq", "personaId": 2046 }
    ]
  },
  {
    "sociedadId": 899,
    "socios": [
      { "nombre": "Bonifacio Camila", "personaId": 2091 },
      { "nombre": "Cueto Elisa Verónica", "personaId": 2090 },
      { "nombre": "Paez Miguel Angel", "personaId": 2089 }
    ]
  },
  {
    "sociedadId": 949,
    "socios": [
      { "nombre": "Natalia Paola Cortes", "personaId": 1989 }
    ]
  },
  {
    "sociedadId": 951,
    "socios": [
      { "nombre": "Epifanio Mario Giamportone", "personaId": 2205 },
      { "nombre": "Hernán Humberto Alaniz", "personaId": 2204 }
    ]
  },
  {
    "sociedadId": 993,
    "socios": [
      { "nombre": "Andrea Daiana Vidal", "personaId": 2282 },
      { "nombre": "Diego Julio Oswald", "personaId": 2283 },
      { "nombre": "Jaquelina Yanina Arebalo", "personaId": 2281 }
    ]
  },
  {
    "sociedadId": 1163,
    "socios": [
      { "nombre": "Santiago Dora Formica", "personaId": 2670 }
    ]
  },
  {
    "sociedadId": 1678,
    "socios": [
      { "nombre": "Liliana Haydee Butti", "personaId": 3777 },
      { "nombre": "Rodrigo Nicolás Silva Butti", "personaId": 3776 },
      { "nombre": "Rogelio Ortiz Morel", "personaId": 3775 }
    ]
  },
  {
    "sociedadId": 1812,
    "socios": [
      { "nombre": "José Elías Isaías Malah", "personaId": 207 },
      { "nombre": "Paulo Marcelo Andreoni", "personaId": 4052 }
    ]
  },
  {
    "sociedadId": 2223,
    "socios": [
      { "nombre": "Jung Leopoldo Guillermo", "personaId": 4894 },
      { "nombre": "Polimeni Adriana Florencia", "personaId": 4895 }
    ]
  },
  {
    "sociedadId": 2496,
    "socios": [
      { "nombre": "Mary Esther Olivencia", "personaId": 5458 }
    ]
  },
  {
    "sociedadId": 2582,
    "socios": [
      { "nombre": "Carlos Víctor Guzman", "personaId": 5645 },
      { "nombre": "Héctor Mauricio Casteran", "personaId": 5646 },
      { "nombre": "Juan Facundo Llavar", "personaId": 5643 },
      { "nombre": "Mariano Enrique Fader", "personaId": 5644 },
      { "nombre": "Orlando Estanislao Altamirano", "personaId": 2162 }
    ]
  },
  {
    "sociedadId": 2823,
    "socios": [
      { "nombre": "Alberto Orlando Lucero", "personaId": 6178 }
    ]
  },
  {
    "sociedadId": 2978,
    "socios": [
      { "nombre": "Hernan Dario Martinez", "personaId": 6495 },
      { "nombre": "Pedro Roberto Martinez", "personaId": 6494 }
    ]
  },
  {
    "sociedadId": 3062,
    "socios": [
      { "nombre": "Cristian Guillermo Cervan", "personaId": 6697 }
    ]
  },
  {
    "sociedadId": 3112,
    "socios": [
      { "nombre": "Gustavo Mauricio Zalazar", "personaId": 6796 }
    ]
  },
  {
    "sociedadId": 3263,
    "socios": [
      { "nombre": "Jorge Gonzalo Solis Arce", "personaId": 7108 },
      { "nombre": "Ruben Jorge Antonio Zambrini Paponet", "personaId": 7109 }
    ]
  },
  {
    "sociedadId": 3311,
    "socios": [
      { "nombre": "Pablo Andrés Brasili", "personaId": 7202 },
      { "nombre": "Virginia Andrea Murcia", "personaId": 7203 }
    ]
  },
  {
    "sociedadId": 3548,
    "socios": [
      { "nombre": "Florinda Norma Miranda", "personaId": 7664 },
      { "nombre": "Marcia Johanna Borcia Correa", "personaId": 7665 }
    ]
  },
  {
    "sociedadId": 3733,
    "socios": [
      { "nombre": "Daniela Vanina Nicolay", "personaId": 8667 },
      { "nombre": "Verna Francisco Luis", "personaId": 8038 }
    ]
  },
  {
    "sociedadId": 3742,
    "socios": [
      { "nombre": "Barahona Gerardo Mariano Ariel", "personaId": 8051 },
      { "nombre": "Barahona Roberto Daniel", "personaId": 8052 }
    ]
  },
  {
    "sociedadId": 3802,
    "socios": [
      { "nombre": "Baigorria Alicia Eva", "personaId": 8185 },
      { "nombre": "Saavedra Jesus Alexander", "personaId": 8187 },
      { "nombre": "Saavedra Walter Hector", "personaId": 8186 }
    ]
  },
  {
    "sociedadId": 3861,
    "socios": [
      { "nombre": "Claudio Oscar Garcia", "personaId": 8311 },
      { "nombre": "Mauricio Ariel Manuele", "personaId": 8310 }
    ]
  },
  {
    "sociedadId": 3896,
    "socios": [
      { "nombre": "Cynthia Iris Van Megroot", "personaId": 8377 },
      { "nombre": "Fortuny Matias Jorge", "personaId": 3359 }
    ]
  },
  {
    "sociedadId": 3937,
    "socios": [
      { "nombre": "Eduardo Hugo Olaiz", "personaId": 8475 }
    ]
  },
  {
    "sociedadId": 4298,
    "socios": [
      { "nombre": "Gonzáles Manrique Alan José Fernando", "personaId": 9220 },
      { "nombre": "Ibáñez Acebey Alejandro Alfredo", "personaId": 9221 }
    ]
  },
  {
    "sociedadId": 4329,
    "socios": [
      { "nombre": "Jesica Elizabeth Fontemachi", "personaId": 9279 }
    ]
  },
  {
    "sociedadId": 4539,
    "socios": [
      { "nombre": "Hernán Humberto Alaniz", "personaId": 2204 }
    ]
  },
  {
    "sociedadId": 4679,
    "socios": [
      { "nombre": "Luis Emilio Mujica", "personaId": 4131 },
      { "nombre": "Marcelo Alejandro Meizenq", "personaId": 2046 },
      { "nombre": "Marcelo Javier Gnappa", "personaId": 10040 }
    ]
  },
  {
    "sociedadId": 5039,
    "socios": [
      { "nombre": "Malmod Carlos Marcelo", "personaId": 10733 },
      { "nombre": "Mendez Federico Eduardo", "personaId": 10734 }
    ]
  },
  {
    "sociedadId": 5236,
    "socios": [
      { "nombre": "Lorena Belén Lescano", "personaId": 11118 },
      { "nombre": "Pablo Andrés Juliani", "personaId": 11119 }
    ]
  },
  {
    "sociedadId": 5263,
    "socios": [
      { "nombre": "Norma Sonia Villegas", "personaId": 11168 },
      { "nombre": "Victor Cirilo Quintana", "personaId": 11169 }
    ]
  },
  {
    "sociedadId": 5376,
    "socios": [
      { "nombre": "Guillermo Jesus Vizcaino", "personaId": 9294 }
    ]
  },
  {
    "sociedadId": 5383,
    "socios": [
      { "nombre": "Andrés Emanuel Mendez", "personaId": 11402 }
    ]
  },
  {
    "sociedadId": 5418,
    "socios": [
      { "nombre": "Stella Maris Diaz", "personaId": 11470 }
    ]
  },
  {
    "sociedadId": 5466,
    "socios": [
      { "nombre": "Diego Gabriel Agüero Andino", "personaId": 11566 }
    ]
  },
  {
    "sociedadId": 5628,
    "socios": [
      { "nombre": "Beatriz Alejandra Baudissone", "personaId": 11902 },
      { "nombre": "German Eduardo Bertone", "personaId": 11901 }
    ]
  },
  {
    "sociedadId": 5741,
    "socios": [
      { "nombre": "Fernando Javier Jorquera", "personaId": 1470 },
      { "nombre": "Maximiliano Esteban Merlo", "personaId": 12113 },
      { "nombre": "Nelly Liliana Calatayud", "personaId": 12114 },
      { "nombre": "Sebastian Eduardo Romboli", "personaId": 8238 }
    ]
  },
  {
    "sociedadId": 6352,
    "socios": [
      { "nombre": "Juan Pablo Scattarregia", "personaId": 13280 }
    ]
  },
  {
    "sociedadId": 6450,
    "socios": [
      { "nombre": "Luis Adrian Costilla", "personaId": 13284 },
      { "nombre": "Luis Ariel Romero", "personaId": 13283 }
    ]
  },
  {
    "sociedadId": 6645,
    "socios": [
      { "nombre": "Raul Ernesto Jesus Santana", "personaId": 13854 }
    ]
  },
  {
    "sociedadId": 6820,
    "socios": [
      { "nombre": "Antonio Rubén Santaella", "personaId": 14178 },
      { "nombre": "Carlos Ivan Calomarde Giarratana", "personaId": 14177 }
    ]
  },
  {
    "sociedadId": 6912,
    "socios": [
      { "nombre": "Ángel Leandro Sevilla", "personaId": 14347 },
      { "nombre": "Lucas Miguel Sevilla", "personaId": 14346 }
    ]
  },
  {
    "sociedadId": 6934,
    "socios": [
      { "nombre": "Felix Omar Gimenez", "personaId": 14388 }
    ]
  },
  {
    "sociedadId": 7243,
    "socios": [
      { "nombre": "Dante Héctor Tello", "personaId": 14987 },
      { "nombre": "María Gabriela Tello", "personaId": 14986 }
    ]
  },
  {
    "sociedadId": 7405,
    "socios": [
      { "nombre": "Antonella Belén Heredia", "personaId": 15286 },
      { "nombre": "Pablo Armando Silva", "personaId": 15285 }
    ]
  },
  {
    "sociedadId": 7601,
    "socios": [
      { "nombre": "Leonardo Rubén Darío Riquelme", "personaId": 15630 }
    ]
  },
  {
    "sociedadId": 7666,
    "socios": [
      { "nombre": "Cristian Andrés Rivero", "personaId": 15773 }
    ]
  },
  {
    "sociedadId": 7679,
    "socios": [
      { "nombre": "Mauricio Matias Ricci", "personaId": 15328 }
    ]
  },
  {
    "sociedadId": 8031,
    "socios": [
      { "nombre": "López Luis Guillermo", "personaId": 16443 },
      { "nombre": "Martínez Florencia Macarena", "personaId": 16442 }
    ]
  },
  {
    "sociedadId": 8072,
    "socios": [
      { "nombre": "Gustavo Alejandro Hurtado", "personaId": 16519 }
    ]
  },
  {
    "sociedadId": 8610,
    "socios": [
      { "nombre": "Carla Alejandra Romero", "personaId": 17517 }
    ]
  },
  {
    "sociedadId": 8671,
    "socios": [
      { "nombre": "Agüero Domingo Hugo", "personaId": 17642 },
      { "nombre": "Vildozo Maria Elizabeth", "personaId": 17641 }
    ]
  },
  {
    "sociedadId": 8771,
    "socios": [
      { "nombre": "Pablo Luis Ezequiel Oliva", "personaId": 17818 },
      { "nombre": "Paola Andrea Gonzalez", "personaId": 17819 }
    ]
  },
  {
    "sociedadId": 8801,
    "socios": [
      { "nombre": "Carlos Gabriel Acosta", "personaId": 17884 },
      { "nombre": "Javier Andrés Muñoz", "personaId": 17883 }
    ]
  },
  {
    "sociedadId": 9039,
    "socios": [
      { "nombre": "Ariel Gustavo Amarfil", "personaId": 18339 },
      { "nombre": "Diego Fernando Amarfil", "personaId": 18338 }
    ]
  },
  {
    "sociedadId": 9293,
    "socios": [
      { "nombre": "Roberto Cayetano Reniero", "personaId": 18804 }
    ]
  },
  {
    "sociedadId": 9360,
    "socios": [
      { "nombre": "Miguel Ángel Freire", "personaId": 18936 }
    ]
  },
  {
    "sociedadId": 9414,
    "socios": [
      { "nombre": "Pablo Ramón Quiroga", "personaId": 19030 }
    ]
  },
  {
    "sociedadId": 9415,
    "socios": [
      { "nombre": "Bettina Inés Formica", "personaId": 19032 },
      { "nombre": "Santiago Dora Formica", "personaId": 2670 }
    ]
  },
  {
    "sociedadId": 9657,
    "socios": [
      { "nombre": "Cristian Ruben Albarracin Villablanca", "personaId": 19503 }
    ]
  },
  {
    "sociedadId": 9812,
    "socios": [
      { "nombre": "Luana Anahi Veron", "personaId": 19771 },
      { "nombre": "Vanesa Paola Avalos", "personaId": 19770 }
    ]
  },
  {
    "sociedadId": 9821,
    "socios": [
      { "nombre": "Máximo Isidro Rafael Peña", "personaId": 19785 }
    ]
  },
  {
    "sociedadId": 9941,
    "socios": [
      { "nombre": "Andrea Alejandra Munives", "personaId": 19990 },
      { "nombre": "Jose Omar Agüero", "personaId": 19989 }
    ]
  },
  {
    "sociedadId": 9948,
    "socios": [
      { "nombre": "Ariel Héctor Pizarro", "personaId": 20000 },
      { "nombre": "Luz Florencia Pizarro Orellano", "personaId": 20001 }
    ]
  },
  {
    "sociedadId": 10084,
    "socios": [
      { "nombre": "Eliana Evelin Peralta", "personaId": 20241 },
      { "nombre": "Manuel Hugo Lagos", "personaId": 20240 },
      { "nombre": "Valentina Lagos", "personaId": 20242 }
    ]
  },
  {
    "sociedadId": 10372,
    "socios": [
      { "nombre": "Agustina Aldana Lescano", "personaId": 20808 },
      { "nombre": "Juan Pablo Antón Guardabrazo", "personaId": 20807 }
    ]
  },
  {
    "sociedadId": 10499,
    "socios": [
      { "nombre": "Cristian Andrés Resta", "personaId": 20991 },
      { "nombre": "Héctor Bernabé Delgado", "personaId": 20992 }
    ]
  },
  {
    "sociedadId": 10630,
    "socios": [
      { "nombre": "Escudero Sergio Victor", "personaId": 21169 },
      { "nombre": "Orozco Rocio Macarena", "personaId": 21170 }
    ]
  },
  {
    "sociedadId": 10948,
    "socios": [
      { "nombre": "Ferreyra Carlos Armando", "personaId": 21589 },
      { "nombre": "Ferreyra Carlos Daniel", "personaId": 21591 },
      { "nombre": "Ferreyra Gustavo Javier", "personaId": 21590 }
    ]
  },
  {
    "sociedadId": 11159,
    "socios": [
      { "nombre": "Lorena Belén Lescano", "personaId": 11118 },
      { "nombre": "Pablo Andrés Juliani", "personaId": 11119 }
    ]
  },
  {
    "sociedadId": 11259,
    "socios": [
      { "nombre": "Cintia Daiana Ibañez", "personaId": 21969 },
      { "nombre": "Diego David Ibañez", "personaId": 10775 }
    ]
  },
  {
    "sociedadId": 11267,
    "socios": [
      { "nombre": "Gonzalez Moraga Alejandra Cintia", "personaId": 21979 },
      { "nombre": "Nieto Adrian Alejandro", "personaId": 33944 }
    ]
  },
  {
    "sociedadId": 11509,
    "socios": [
      { "nombre": "Javier Alejandro Villegas", "personaId": 1906 },
      { "nombre": "Jose Miguel Peña", "personaId": 1907 }
    ]
  },
  {
    "sociedadId": 11912,
    "socios": [
      { "nombre": "Victoria Lorena Gofre Castro", "personaId": 22956 },
      { "nombre": "Yanina Mabel Gonzalez Finello", "personaId": 22955 }
    ]
  },
  {
    "sociedadId": 12206,
    "socios": [
      { "nombre": "Laura Emilia Munafo", "personaId": 23427 },
      { "nombre": "Marta Elizabeth Heredia", "personaId": 23426 }
    ]
  },
  {
    "sociedadId": 12252,
    "socios": [
      { "nombre": "Scatragli Daniel Dario", "personaId": 23492 }
    ]
  },
  {
    "sociedadId": 12303,
    "socios": [
      { "nombre": "Roxana Ines Cautela", "personaId": 23587 },
      { "nombre": "Victor Gustavo Americo Atencio", "personaId": 23586 }
    ]
  },
  {
    "sociedadId": 12538,
    "socios": [
      { "nombre": "Arturo José Barrionuevo", "personaId": 23877 }
    ]
  },
  {
    "sociedadId": 12913,
    "socios": [
      { "nombre": "Fabricio Ariel Llantén", "personaId": 24410 }
    ]
  },
  {
    "sociedadId": 13232,
    "socios": [
      { "nombre": "Cornejo Rodrigo Sebastián", "personaId": 24871 },
      { "nombre": "Gonzales Manrique Jean German", "personaId": 24870 }
    ]
  },
  {
    "sociedadId": 13238,
    "socios": [
      { "nombre": "Fabricio Nathaniel Tonioni", "personaId": 24879 }
    ]
  },
  {
    "sociedadId": 13376,
    "socios": [
      { "nombre": "Pedro Alberto Ibañez", "personaId": 25070 }
    ]
  },
  {
    "sociedadId": 13680,
    "socios": [
      { "nombre": "Andrea Daiana Vidal", "personaId": 2282 }
    ]
  },
  {
    "sociedadId": 13803,
    "socios": [
      { "nombre": "Daisi Janet Jara Espinosa", "personaId": 25649 }
    ]
  },
  {
    "sociedadId": 13968,
    "socios": [
      { "nombre": "Franco Ariel Salinas", "personaId": 25926 },
      { "nombre": "Marcos Agustín Salinas", "personaId": 25927 }
    ]
  },
  {
    "sociedadId": 14117,
    "socios": [
      { "nombre": "Pablo Ariel García", "personaId": 26140 }
    ]
  },
  {
    "sociedadId": 14327,
    "socios": [
      { "nombre": "Alejandro Antonio Simi", "personaId": 26458 }
    ]
  },
  {
    "sociedadId": 14451,
    "socios": [
      { "nombre": "Marcelo Enrique Dapas", "personaId": 26614 },
      { "nombre": "Victoria Lorena Gofre Castro", "personaId": 22956 }
    ]
  },
  {
    "sociedadId": 14462,
    "socios": [
      { "nombre": "Ornella Malen Carrizo Nuñez", "personaId": 25118 }
    ]
  },
  {
    "sociedadId": 14517,
    "socios": [
      { "nombre": "Carro Cristian Federico", "personaId": 26702 }
    ]
  },
  {
    "sociedadId": 14581,
    "socios": [
      { "nombre": "Manuel Vazquez Bunge", "personaId": 3803 },
      { "nombre": "Pablo Fabian Vaca Guzman", "personaId": 26779 }
    ]
  },
  {
    "sociedadId": 14654,
    "socios": [
      { "nombre": "Beatriz Susana Del Valle Márquez", "personaId": 26890 },
      { "nombre": "Diego Sebastián Freire", "personaId": 26893 },
      { "nombre": "Héctor Leonardo Martino", "personaId": 26892 },
      { "nombre": "Nilda Ester Flamant", "personaId": 26891 }
    ]
  },
  {
    "sociedadId": 14694,
    "socios": [
      { "nombre": "Maria Elizabeth Alvarez", "personaId": 26952 },
      { "nombre": "Pedro Osvaldo Constanzo", "personaId": 26951 }
    ]
  },
  {
    "sociedadId": 15096,
    "socios": [
      { "nombre": "Brenda Estefanía Fontao", "personaId": 27569 },
      { "nombre": "Fontao Marcos Joel", "personaId": 27568 },
      { "nombre": "Martín Rodrigo Lovaglio", "personaId": 1016 }
    ]
  },
  {
    "sociedadId": 15182,
    "socios": [
      { "nombre": "Macarena Peña Coletto", "personaId": 27695 },
      { "nombre": "Miguel Antonio Peña Coletto", "personaId": 27694 }
    ]
  },
  {
    "sociedadId": 15260,
    "socios": [
      { "nombre": "Carina Cecilia Rodríguez", "personaId": 27785 },
      { "nombre": "Felix Aurelio Avellaneda Flores", "personaId": 27784 },
      { "nombre": "Juan Ignacio Avellaneda Rodríguez", "personaId": 27786 }
    ]
  },
  {
    "sociedadId": 15287,
    "socios": [
      { "nombre": "Lucero Fernández Tobías David", "personaId": 27833 },
      { "nombre": "Lucero Ricardo David", "personaId": 27832 }
    ]
  },
  {
    "sociedadId": 15378,
    "socios": [
      { "nombre": "Salomoni Elias William", "personaId": 27971 }
    ]
  },
  {
    "sociedadId": 15410,
    "socios": [
      { "nombre": "Andrés Horacio Mengual", "personaId": 28024 },
      { "nombre": "Jorge Alberto García", "personaId": 28023 }
    ]
  },
  {
    "sociedadId": 15456,
    "socios": [
      { "nombre": "Lorena Belén Lescano", "personaId": 11118 },
      { "nombre": "Pablo Andrés Juliani", "personaId": 11119 }
    ]
  },
  {
    "sociedadId": 15640,
    "socios": [
      { "nombre": "José Javier Moyano", "personaId": 28331 },
      { "nombre": "Julio Eduardo Bonsangue", "personaId": 28332 }
    ]
  },
  {
    "sociedadId": 15705,
    "socios": [
      { "nombre": "Mario Emanuel Manzano", "personaId": 28433 },
      { "nombre": "Mario Gabriel Manzano", "personaId": 28431 },
      { "nombre": "Rubén Emanuel Manzano", "personaId": 28432 }
    ]
  },
  {
    "sociedadId": 15725,
    "socios": [
      { "nombre": "Alicia Lertora", "personaId": 28459 },
      { "nombre": "Claudio Marcelo Zapata", "personaId": 28460 }
    ]
  },
  {
    "sociedadId": 15960,
    "socios": [
      { "nombre": "Jonathan Dante Mendez", "personaId": 28869 }
    ]
  },
  {
    "sociedadId": 16043,
    "socios": [
      { "nombre": "Guzmán Maldonado Leandro Ariel", "personaId": 28891 },
      { "nombre": "Guzmán Marcelo Eduardo", "personaId": 28890 }
    ]
  },
  {
    "sociedadId": 16180,
    "socios": [
      { "nombre": "Cristian Dario Figueroa", "personaId": 29063 }
    ]
  },
  {
    "sociedadId": 16383,
    "socios": [
      { "nombre": "Cristian Leonardo Masella", "personaId": 29355 },
      { "nombre": "Néstor Adrián Masella", "personaId": 29357 },
      { "nombre": "Victor Gerardo Masella", "personaId": 29356 }
    ]
  },
  {
    "sociedadId": 16881,
    "socios": [
      { "nombre": "Antonia Del Carmen Valdez", "personaId": 30033 },
      { "nombre": "Javier Andrés Muñoz", "personaId": 17883 }
    ]
  },
  {
    "sociedadId": 16974,
    "socios": [
      { "nombre": "Juan Antonio Alejandro Gonzalez", "personaId": 30193 }
    ]
  },
  {
    "sociedadId": 17056,
    "socios": [
      { "nombre": "Carlos Jonathan Raguza", "personaId": 30305 }
    ]
  },
  {
    "sociedadId": 17080,
    "socios": [
      { "nombre": "Luciano Daniel Gimenez", "personaId": 30339 }
    ]
  },
  {
    "sociedadId": 17089,
    "socios": [
      { "nombre": "Débora Yanet Biluron Cabrera", "personaId": 30352 },
      { "nombre": "Juan Francisco Moyano", "personaId": 30351 }
    ]
  },
  {
    "sociedadId": 17107,
    "socios": [
      { "nombre": "Gastón Nicolás Ruiz Magno", "personaId": 30380 },
      { "nombre": "Luciano Martin Ruiz Magno", "personaId": 30381 },
      { "nombre": "Roberto Patricio Morales García", "personaId": 30382 }
    ]
  },
  {
    "sociedadId": 17199,
    "socios": [
      { "nombre": "Miguel Ramón Montaña", "personaId": 30495 },
      { "nombre": "Miguel Walter Montaña", "personaId": 30494 }
    ]
  },
  {
    "sociedadId": 17306,
    "socios": [
      { "nombre": "Gonzalez Rodolfo Andres", "personaId": 30631 }
    ]
  },
  {
    "sociedadId": 17331,
    "socios": [
      { "nombre": "Isaías Fermín Miño", "personaId": 30661 }
    ]
  },
  {
    "sociedadId": 17755,
    "socios": [
      { "nombre": "Deolinda Rosario Muñoz", "personaId": 20535 }
    ]
  },
  {
    "sociedadId": 17860,
    "socios": [
      { "nombre": "Luis Alberto Brizuela Gonzalez", "personaId": 31373 }
    ]
  },
  {
    "sociedadId": 17926,
    "socios": [
      { "nombre": "Déborah Andrea Ochoa", "personaId": 28825 }
    ]
  },
  {
    "sociedadId": 17938,
    "socios": [
      { "nombre": "Fernanda Mariel Hurtado", "personaId": 20476 }
    ]
  },
  {
    "sociedadId": 17976,
    "socios": [
      { "nombre": "Ayelén Nahir Chavez", "personaId": 31509 },
      { "nombre": "Barrera Jorge Ángel", "personaId": 31511 },
      { "nombre": "Chavez Oscar Eusebio", "personaId": 31510 }
    ]
  },
  {
    "sociedadId": 18276,
    "socios": [
      { "nombre": "Marta Elizabeth Heredia", "personaId": 23426 }
    ]
  },
  {
    "sociedadId": 18829,
    "socios": [
      { "nombre": "Gisella Vanesa Obredor", "personaId": 32532 }
    ]
  },
  {
    "sociedadId": 18849,
    "socios": [
      { "nombre": "Carlos Antonio Moreno", "personaId": 32569 },
      { "nombre": "Silvia Gabriela Barrios", "personaId": 32568 }
    ]
  },
  {
    "sociedadId": 1500,
    "socios": [
      { "nombre": "Anahi Tatiana Ibáñez", "personaId": 3404 },
      { "nombre": "Analía Haydee Saccaro", "personaId": 3403 }
    ]
  },
  {
    "sociedadId": 1815,
    "socios": [
      { "nombre": "Claudio Marcelo Gutierrez", "personaId": 2298 },
      { "nombre": "Luis Dimas Gutierrez", "personaId": 2299 }
    ]
  },
  {
    "sociedadId": 1827,
    "socios": [
      { "nombre": "Alfredo Emanuel Funes Escudero", "personaId": 4087 },
      { "nombre": "Daiana Soledad Funes Escudero", "personaId": 4086 }
    ]
  },
  {
    "sociedadId": 11079,
    "socios": [
    ]
  },
  {
    "sociedadId": 15611,
    "socios": [
      { "nombre": "Juan Sebastian Zalazar", "personaId": 27970 }
    ]
  }
];
