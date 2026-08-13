// Contenido del informe "Agencias de viajes en Mendoza". Metodología de
// cruce documentada en frontend/src/data/nichoAgenciasViajes.ts -- mismo
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
  { etiqueta: "2017", valor: 3 },
  { etiqueta: "2018", valor: 3 },
  { etiqueta: "2019", valor: 14 },
  { etiqueta: "2020", valor: 8 },
  { etiqueta: "2021", valor: 16 },
  { etiqueta: "2022", valor: 21 },
  { etiqueta: "2023", valor: 40 },
  { etiqueta: "2024", valor: 29 },
  { etiqueta: "2025", valor: 27 },
  { etiqueta: "2026*", valor: 5 },
];

export const TIPO_CLAE = [
  { tipo: "Minorista", cantidad: 143 },
  { tipo: "Mayorista", cantidad: 25 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 149 },
  { tipo: "S.A.", cantidad: 13 },
  { tipo: "S.R.L.", cantidad: 6 },
];

export const DEPARTAMENTOS_AGENCIAS_VIAJES = [
  { departamento: "Capital", cantidad: 56 },
  { departamento: "Luján de Cuyo", cantidad: 26 },
  { departamento: "Guaymallén", cantidad: 25 },
  { departamento: "Maipú", cantidad: 23 },
  { departamento: "Godoy Cruz", cantidad: 13 },
  { departamento: "Las Heras", cantidad: 6 },
  { departamento: "San Martín", cantidad: 5 },
  { departamento: "Tunuyán", cantidad: 4 },
  { departamento: "Rivadavia", cantidad: 2 },
  { departamento: "San Rafael", cantidad: 2 },
  { departamento: "General Alvear", cantidad: 1 },
];

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

export interface EntidadAgenciasViajesCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
}

export const ENTIDADES: EntidadAgenciasViajesCurada[] = [
  {
    "sociedadId": 219,
    "socios": [
      { "nombre": "Carolina Cecilia Matta", "personaId": 530 },
      { "nombre": "Ricardo Gabriel Cantaloube", "personaId": 529 }
    ]
  },
  {
    "sociedadId": 469,
    "socios": [
      { "nombre": "German Lucas Keim Coll", "personaId": 1120 },
      { "nombre": "Juan Claverol", "personaId": 1118 },
      { "nombre": "Ramiro De Los Rios", "personaId": 1119 }
    ]
  },
  {
    "sociedadId": 523,
    "socios": [
      { "nombre": "Martín Carballo", "personaId": 1216 },
      { "nombre": "Mercedes María Carballo", "personaId": 1215 }
    ]
  },
  {
    "sociedadId": 948,
    "socios": [
      { "nombre": "Mónica Amelia Carballar", "personaId": 2200 },
      { "nombre": "Verónica Mariela Moyano", "personaId": 2201 }
    ]
  },
  {
    "sociedadId": 2008,
    "socios": [
      { "nombre": "José Rafael Burgos Castro", "personaId": 4480 },
      { "nombre": "María Luz Puldain", "personaId": 4479 }
    ]
  },
  {
    "sociedadId": 2015,
    "socios": [
      { "nombre": "María Victoria Recalde", "personaId": 4493 },
      { "nombre": "Román Isaac Kowenski", "personaId": 4494 }
    ]
  },
  {
    "sociedadId": 2436,
    "socios": [
      { "nombre": "Eleonora Cobos Daract", "personaId": 5341 },
      { "nombre": "María Paula Colonnese", "personaId": 5340 }
    ]
  },
  {
    "sociedadId": 2489,
    "socios": [
      { "nombre": "Damián Horacio Almeida", "personaId": 5446 },
      { "nombre": "Lautaro Molineiro", "personaId": 5445 },
      { "nombre": "Leonardo Humberto Sarcinella", "personaId": 5444 }
    ]
  },
  {
    "sociedadId": 2504,
    "socios": [
      { "nombre": "Mario Miguel Lucero", "personaId": 5476 }
    ]
  },
  {
    "sociedadId": 2554,
    "socios": [
      { "nombre": "Manuel Alberto Quiroga", "personaId": 5574 },
      { "nombre": "Roberto Gustavo Adolfo Guembe", "personaId": 5573 }
    ]
  },
  {
    "sociedadId": 2703,
    "socios": [
      { "nombre": "Emiliano Facundo Moyano Riveros", "personaId": 5926 },
      { "nombre": "Juan Manuel Mercado", "personaId": 5924 },
      { "nombre": "Matias Ramiro Militelo", "personaId": 5925 }
    ]
  },
  {
    "sociedadId": 2881,
    "socios": [
      { "nombre": "Daniel Humberto Carrion", "personaId": 5886 },
      { "nombre": "Walter David Vallejos", "personaId": 5887 }
    ]
  },
  {
    "sociedadId": 3175,
    "socios": [
      { "nombre": "Arias Sanchez Lady Laura", "personaId": 6928 },
      { "nombre": "Arrieta Isaias Abel", "personaId": 6926 },
      { "nombre": "Quitllet Vera Marina Coral", "personaId": 6929 },
      { "nombre": "Vera Rodrigo Alberto", "personaId": 6927 }
    ]
  },
  {
    "sociedadId": 3193,
    "socios": [
      { "nombre": "Lucia Ivana Romero", "personaId": 6959 },
      { "nombre": "Mariana Lujan Ortiz Galiotti", "personaId": 6958 }
    ]
  },
  {
    "sociedadId": 3479,
    "socios": [
      { "nombre": "Pablo Roberto Sacchi", "personaId": 7517 }
    ]
  },
  {
    "sociedadId": 3765,
    "socios": [
      { "nombre": "Ana María Fernández", "personaId": 8108 },
      { "nombre": "Chiara Amejeiras", "personaId": 8109 }
    ]
  },
  {
    "sociedadId": 4008,
    "socios": [
      { "nombre": "Fernanda Jael Pizarro", "personaId": 7058 }
    ]
  },
  {
    "sociedadId": 4014,
    "socios": [
      { "nombre": "Federico Alejandro Bravo", "personaId": 8639 },
      { "nombre": "Yamila Adnrea Cuartero", "personaId": 8638 }
    ]
  },
  {
    "sociedadId": 4081,
    "socios": [
      { "nombre": "Nidia Marisol Arce", "personaId": 8783 },
      { "nombre": "Sergio Luis Quiroga", "personaId": 8299 }
    ]
  },
  {
    "sociedadId": 4108,
    "socios": [
      { "nombre": "Mauricio Andrés Masnú", "personaId": 8827 }
    ]
  },
  {
    "sociedadId": 4445,
    "socios": [
      { "nombre": "Emiliano Jesús Gonzalez Ganum", "personaId": 9524 },
      { "nombre": "Mariam Fátima Ganum", "personaId": 9525 }
    ]
  },
  {
    "sociedadId": 4713,
    "socios": [
      { "nombre": "Sofía Ruiz Cavanagh", "personaId": 10114 }
    ]
  },
  {
    "sociedadId": 5129,
    "socios": [
      { "nombre": "Silvana Valeria Battaglia", "personaId": 10744 }
    ]
  },
  {
    "sociedadId": 5283,
    "socios": [
      { "nombre": "Leonardo Guillermo Varo", "personaId": 11212 }
    ]
  },
  {
    "sociedadId": 5415,
    "socios": [
      { "nombre": "Gustavo Alberto Sanchez", "personaId": 9942 },
      { "nombre": "Nélida Ester Digregorio", "personaId": 9941 }
    ]
  },
  {
    "sociedadId": 5606,
    "socios": [
      { "nombre": "Cristian Norman Paez", "personaId": 11860 },
      { "nombre": "Maria Gabriela Mandón", "personaId": 11859 }
    ]
  },
  {
    "sociedadId": 5718,
    "socios": [
      { "nombre": "Ana Dora Rivero", "personaId": 12078 },
      { "nombre": "Miguel Angel Ferre", "personaId": 413 }
    ]
  },
  {
    "sociedadId": 5964,
    "socios": [
      { "nombre": "Aldana Bellmann", "personaId": 12545 },
      { "nombre": "María Florencia Saguir", "personaId": 12544 }
    ]
  },
  {
    "sociedadId": 6061,
    "socios": [
      { "nombre": "José Emilio Casas", "personaId": 12755 },
      { "nombre": "Osvaldo Daniel Carbajal", "personaId": 12754 }
    ]
  },
  {
    "sociedadId": 6105,
    "socios": [
      { "nombre": "Franco Humberto Cadile", "personaId": 5448 },
      { "nombre": "Salamanca Luis Rolando", "personaId": 8282 }
    ]
  },
  {
    "sociedadId": 6261,
    "socios": [
      { "nombre": "Francisco Carlos Martin", "personaId": 13103 }
    ]
  },
  {
    "sociedadId": 6266,
    "socios": [
      { "nombre": "Bazan Facundo David", "personaId": 13119 },
      { "nombre": "Gonzalez Gabriel Alejandro", "personaId": 13121 },
      { "nombre": "Rossini German Ernesto", "personaId": 13120 }
    ]
  },
  {
    "sociedadId": 6268,
    "socios": [
      { "nombre": "Cristian Sebastian Lucero", "personaId": 8620 },
      { "nombre": "Elida Evelin Fullana", "personaId": 8621 }
    ]
  },
  {
    "sociedadId": 6773,
    "socios": [
      { "nombre": "Nélida Ester Digregorio", "personaId": 9941 }
    ]
  },
  {
    "sociedadId": 7312,
    "socios": [
      { "nombre": "Mauricio Adrian Ponces", "personaId": 15110 }
    ]
  },
  {
    "sociedadId": 7438,
    "socios": [
      { "nombre": "Guillermo Gustavo Piñol", "personaId": 15354 },
      { "nombre": "Juan Carlos Sagas", "personaId": 15353 }
    ]
  },
  {
    "sociedadId": 7441,
    "socios": [
      { "nombre": "Federico Andres Sosa Souto", "personaId": 13779 },
      { "nombre": "Santiago Jose Ale", "personaId": 15358 }
    ]
  },
  {
    "sociedadId": 7466,
    "socios": [
      { "nombre": "Gimenes Esteban Adriel", "personaId": 15396 },
      { "nombre": "Gimenes Pablo Ariel", "personaId": 15395 }
    ]
  },
  {
    "sociedadId": 7561,
    "socios": [
      { "nombre": "Javier Francisco Fernandez", "personaId": 15556 }
    ]
  },
  {
    "sociedadId": 7729,
    "socios": [
      { "nombre": "Belén Lourdes Pereyra", "personaId": 15892 },
      { "nombre": "Javier Horacio Pereyra", "personaId": 15891 },
      { "nombre": "Sofia Del Valle Pereyra", "personaId": 15893 }
    ]
  },
  {
    "sociedadId": 7938,
    "socios": [
      { "nombre": "Marcelo Andres Cabutti", "personaId": 16278 },
      { "nombre": "Matías Agustín Catam", "personaId": 16277 }
    ]
  },
  {
    "sociedadId": 7949,
    "socios": [
      { "nombre": "Gustavo Alberto Sanchez", "personaId": 9942 },
      { "nombre": "Maria Leticia Sanchez", "personaId": 16301 }
    ]
  },
  {
    "sociedadId": 8135,
    "socios": [
      { "nombre": "Darío José Rosas", "personaId": 16634 }
    ]
  },
  {
    "sociedadId": 8163,
    "socios": [
      { "nombre": "María Emilia Borras", "personaId": 16681 },
      { "nombre": "Martín Diego Saal", "personaId": 11632 }
    ]
  },
  {
    "sociedadId": 8533,
    "socios": [
      { "nombre": "Alcaino Alexis Sebastian", "personaId": 12147 },
      { "nombre": "Oscar Fabián Tasteri", "personaId": 17385 },
      { "nombre": "Roberto Luis Justribo", "personaId": 17384 }
    ]
  },
  {
    "sociedadId": 8574,
    "socios": [
      { "nombre": "Camargo Ernesto Fidel", "personaId": 17455 }
    ]
  },
  {
    "sociedadId": 8759,
    "socios": [
      { "nombre": "Florencia Dibattista Morón", "personaId": 17790 }
    ]
  },
  {
    "sociedadId": 8990,
    "socios": [
      { "nombre": "Alejandro Adolfo Montiel Zamorano", "personaId": 18235 },
      { "nombre": "Leandro Javier Medina", "personaId": 9731 },
      { "nombre": "Marcos Exequiel Martinez Donadio", "personaId": 18236 }
    ]
  },
  {
    "sociedadId": 9046,
    "socios": [
      { "nombre": "Adriano Barbosa", "personaId": 7553 },
      { "nombre": "Maria Elena Vignolio", "personaId": 7552 },
      { "nombre": "Nicolás Agustín Galli", "personaId": 18351 }
    ]
  },
  {
    "sociedadId": 9171,
    "socios": [
      { "nombre": "Carlos Maria Piccione", "personaId": 18573 },
      { "nombre": "Luis Pablo Sance", "personaId": 557 },
      { "nombre": "Manuel Alejandro Vigil", "personaId": 5559 },
      { "nombre": "Maximiliano Mastrangelo", "personaId": 12107 }
    ]
  },
  {
    "sociedadId": 9304,
    "socios": [
      { "nombre": "Fausto Ariel Gramajo", "personaId": 18828 },
      { "nombre": "Sebastián Leonardo Rojas", "personaId": 18829 }
    ]
  },
  {
    "sociedadId": 9391,
    "socios": [
      { "nombre": "Marcelo Horacio Díaz", "personaId": 18996 },
      { "nombre": "María Soledad Echegaray", "personaId": 18995 }
    ]
  },
  {
    "sociedadId": 9407,
    "socios": [
      { "nombre": "Juan Jesús Ramón Guerra", "personaId": 19021 },
      { "nombre": "Mariela Rivero", "personaId": 19020 }
    ]
  },
  {
    "sociedadId": 9533,
    "socios": [
      { "nombre": "Pablo Nicolas Estevez", "personaId": 7126 }
    ]
  },
  {
    "sociedadId": 9553,
    "socios": [
      { "nombre": "Cristian Alejandro De Benedectis Abaurre", "personaId": 7542 },
      { "nombre": "Daniel Ricardo Aldegheri", "personaId": 12514 }
    ]
  },
  {
    "sociedadId": 9592,
    "socios": [
      { "nombre": "Florencia Rosalia Olivares", "personaId": 6230 },
      { "nombre": "Gallego Samanta", "personaId": 19375 },
      { "nombre": "Vicino Gisela", "personaId": 19374 }
    ]
  },
  {
    "sociedadId": 9623,
    "socios": [
      { "nombre": "Mariela Paola Mengoni", "personaId": 14634 },
      { "nombre": "Sergio Daniel Navarro", "personaId": 19441 }
    ]
  },
  {
    "sociedadId": 9718,
    "socios": [
      { "nombre": "Meliaco Federica", "personaId": 19617 },
      { "nombre": "Pognat Christophe Francois", "personaId": 19616 }
    ]
  },
  {
    "sociedadId": 9740,
    "socios": [
      { "nombre": "Noelia Beatriz Castaño", "personaId": 12224 },
      { "nombre": "Raúl Mariano Alderete", "personaId": 12223 }
    ]
  },
  {
    "sociedadId": 9796,
    "socios": [
      { "nombre": "Maria Ines Aparicio", "personaId": 19752 },
      { "nombre": "Vicente Daniel Rinaudo", "personaId": 19753 }
    ]
  },
  {
    "sociedadId": 9960,
    "socios": [
      { "nombre": "Franco Humberto Cadile", "personaId": 5448 }
    ]
  },
  {
    "sociedadId": 9979,
    "socios": [
      { "nombre": "Aves Mabel Irene", "personaId": 20062 },
      { "nombre": "Penissi Lorena Mabel", "personaId": 20061 }
    ]
  },
  {
    "sociedadId": 10007,
    "socios": [
      { "nombre": "Ana Paula Romera", "personaId": 20113 },
      { "nombre": "Antonella Quistapace", "personaId": 20116 },
      { "nombre": "Fernando Martin Rodríguez", "personaId": 20111 },
      { "nombre": "Karen Gisel Linna", "personaId": 20115 },
      { "nombre": "Lourdes Jazmín Romera", "personaId": 20114 },
      { "nombre": "Yago Díaz Spinello", "personaId": 20112 }
    ]
  },
  {
    "sociedadId": 10286,
    "socios": [
      { "nombre": "Maria Laura Valles", "personaId": 20621 }
    ]
  },
  {
    "sociedadId": 10347,
    "socios": [
      { "nombre": "Alejandro Adolfo Montiel Zamorano", "personaId": 18235 },
      { "nombre": "Marcos Exequiel Martinez Donadio", "personaId": 18236 }
    ]
  },
  {
    "sociedadId": 10470,
    "socios": [
      { "nombre": "Ernesto Santiago Vargas", "personaId": 20950 },
      { "nombre": "William Omar Domingo Brito Liendo", "personaId": 20949 }
    ]
  },
  {
    "sociedadId": 10622,
    "socios": [
      { "nombre": "Laura Sofía Schilan Suortino", "personaId": 21159 }
    ]
  },
  {
    "sociedadId": 10938,
    "socios": [
      { "nombre": "Santiago Bernal", "personaId": 21571 },
      { "nombre": "Yisela Verónica Ramírez", "personaId": 21572 }
    ]
  },
  {
    "sociedadId": 10951,
    "socios": [
      { "nombre": "Fragapane Guillermo Hugo", "personaId": 21596 },
      { "nombre": "Navarro Carina Magdalena", "personaId": 21597 }
    ]
  },
  {
    "sociedadId": 11028,
    "socios": [
      { "nombre": "María Eugenia Ambrosi", "personaId": 21700 },
      { "nombre": "Sabina Gimenez", "personaId": 21701 }
    ]
  },
  {
    "sociedadId": 11200,
    "socios": [
      { "nombre": "Gabriela García", "personaId": 8870 }
    ]
  },
  {
    "sociedadId": 11238,
    "socios": [
      { "nombre": "Fernando Exequiel Ferrer Valencia", "personaId": 21227 },
      { "nombre": "Nicolas Furtado Flores", "personaId": 21944 }
    ]
  },
  {
    "sociedadId": 11243,
    "socios": [
      { "nombre": "Martin Lopez", "personaId": 9337 },
      { "nombre": "Silvio Andrés Pizarro", "personaId": 21950 }
    ]
  },
  {
    "sociedadId": 11306,
    "socios": [
      { "nombre": "Claudia Daniela Moreno", "personaId": 22041 },
      { "nombre": "Noelia Vanina Alvarez", "personaId": 22042 },
      { "nombre": "Sebastián Elias Matar", "personaId": 22040 }
    ]
  },
  {
    "sociedadId": 11345,
    "socios": [
      { "nombre": "Villalobos Fernando Andrés", "personaId": 22102 },
      { "nombre": "Zuqui María Paula", "personaId": 22101 }
    ]
  },
  {
    "sociedadId": 11340,
    "socios": [
      { "nombre": "Mauco Quiros Benedetto", "personaId": 22097 },
      { "nombre": "Suyai Quiros Benedetto", "personaId": 22096 }
    ]
  },
  {
    "sociedadId": 11395,
    "socios": [
      { "nombre": "Cofré Yésica Valeria", "personaId": 22171 },
      { "nombre": "Guarnieri Verónica Lorena", "personaId": 22170 }
    ]
  },
  {
    "sociedadId": 11462,
    "socios": [
      { "nombre": "Lucas Maximiliano Alvarado", "personaId": 22287 },
      { "nombre": "Sofía Ayelén Pellizzón Cangialosi", "personaId": 22286 }
    ]
  },
  {
    "sociedadId": 11478,
    "socios": [
      { "nombre": "Carlos Matías Ortiz", "personaId": 22329 },
      { "nombre": "Rocío Pilar Ortiz", "personaId": 22330 }
    ]
  },
  {
    "sociedadId": 11486,
    "socios": [
      { "nombre": "Gustavo Alberto Campini", "personaId": 22344 },
      { "nombre": "Sofía Ruiz Cavanagh", "personaId": 10114 }
    ]
  },
  {
    "sociedadId": 11497,
    "socios": [
      { "nombre": "Fabrizio Augusto Sarmiento", "personaId": 22363 },
      { "nombre": "Sergio Gabriel Carrizo Ocampo", "personaId": 22362 }
    ]
  },
  {
    "sociedadId": 11614,
    "socios": [
      { "nombre": "Juan Ignacio Mateo", "personaId": 22505 },
      { "nombre": "Lucia Milagros Mateo", "personaId": 22507 },
      { "nombre": "Tomas Francisco Pereyra Mateo", "personaId": 22506 }
    ]
  },
  {
    "sociedadId": 11751,
    "socios": [
      { "nombre": "Navarro Susana Edith", "personaId": 22681 }
    ]
  },
  {
    "sociedadId": 11756,
    "socios": [
      { "nombre": "Verónica Noemí Soto", "personaId": 22693 }
    ]
  },
  {
    "sociedadId": 11797,
    "socios": [
      { "nombre": "Leandro Cesar Herrera", "personaId": 8405 },
      { "nombre": "Natalia Soledad Posa", "personaId": 22774 }
    ]
  },
  {
    "sociedadId": 11818,
    "socios": [
      { "nombre": "Micaela Beatriz Morales", "personaId": 22808 },
      { "nombre": "Zasha Banchero Lo Bello", "personaId": 22807 }
    ]
  },
  {
    "sociedadId": 11932,
    "socios": [
      { "nombre": "Carolina Victoria Dittadi", "personaId": 22989 }
    ]
  },
  {
    "sociedadId": 11962,
    "socios": [
      { "nombre": "Carolina Verónica Pinto", "personaId": 23052 },
      { "nombre": "María Soledad Porras", "personaId": 23051 }
    ]
  },
  {
    "sociedadId": 11984,
    "socios": [
      { "nombre": "Laura Lisi Calderón", "personaId": 23100 }
    ]
  },
  {
    "sociedadId": 12004,
    "socios": [
      { "nombre": "Cecilia Ines Vega", "personaId": 23123 }
    ]
  },
  {
    "sociedadId": 12006,
    "socios": [
      { "nombre": "Darío Sebastián Doiz De Motos", "personaId": 23125 },
      { "nombre": "Fabrizio Damián Cacciavillani Magni", "personaId": 23126 },
      { "nombre": "German Abel Giusepponi Marnetti", "personaId": 23127 },
      { "nombre": "Miguel José Catalano", "personaId": 23128 }
    ]
  },
  {
    "sociedadId": 12111,
    "socios": [
      { "nombre": "Jorge Enrique Cacciaguerra Silva", "personaId": 23270 },
      { "nombre": "Jorge Mauricio Cacciaguerra", "personaId": 23271 }
    ]
  },
  {
    "sociedadId": 12405,
    "socios": [
      { "nombre": "Cintia Lorena Zeverini", "personaId": 23707 }
    ]
  },
  {
    "sociedadId": 12492,
    "socios": [
      { "nombre": "Maria Milagros Bonetto", "personaId": 23799 }
    ]
  },
  {
    "sociedadId": 12503,
    "socios": [
      { "nombre": "Sergio Edgardo Fuentes", "personaId": 23824 }
    ]
  },
  {
    "sociedadId": 12561,
    "socios": [
      { "nombre": "Carletto Bailac Romina Paz", "personaId": 23916 },
      { "nombre": "Mathus Vanina Mabel", "personaId": 23915 }
    ]
  },
  {
    "sociedadId": 12594,
    "socios": [
      { "nombre": "Maximiliano Gabriel Amico Jaurena", "personaId": 2027 }
    ]
  },
  {
    "sociedadId": 12618,
    "socios": [
      { "nombre": "Andrés Pedro Perinetti", "personaId": 23999 },
      { "nombre": "Gerardo Mario Tisera", "personaId": 23998 },
      { "nombre": "María Soledad Andrade", "personaId": 23997 }
    ]
  },
  {
    "sociedadId": 12649,
    "socios": [
      { "nombre": "Francisco Julian De La Reta", "personaId": 1354 },
      { "nombre": "Magdalena Toso", "personaId": 24048 }
    ]
  },
  {
    "sociedadId": 12696,
    "socios": [
      { "nombre": "Ariadna Haydee Mazutti", "personaId": 24094 },
      { "nombre": "Cristian Damián Gil", "personaId": 24095 }
    ]
  },
  {
    "sociedadId": 12725,
    "socios": [
      { "nombre": "Carla Maria Fernanda Ahumada Virrueta", "personaId": 24131 },
      { "nombre": "Leandro Ariel Faramiñan", "personaId": 24130 }
    ]
  },
  {
    "sociedadId": 12741,
    "socios": [
      { "nombre": "Sergio Fabian Jofré Altieri", "personaId": 9700 },
      { "nombre": "Yamila Celeste Valdivieso", "personaId": 24158 }
    ]
  },
  {
    "sociedadId": 12917,
    "socios": [
      { "nombre": "Cristian Daniel Castinelli", "personaId": 1682 },
      { "nombre": "Denis Vladimir Witkowski", "personaId": 24414 }
    ]
  },
  {
    "sociedadId": 12986,
    "socios": [
      { "nombre": "Janet Mantovani", "personaId": 24501 },
      { "nombre": "Juan Manuel Mercado", "personaId": 5924 }
    ]
  },
  {
    "sociedadId": 13006,
    "socios": [
      { "nombre": "Celeste Amanda Conrrad", "personaId": 24531 },
      { "nombre": "Martin Eugenio Serra", "personaId": 24530 }
    ]
  },
  {
    "sociedadId": 13070,
    "socios": [
      { "nombre": "Oscar Martin Butti", "personaId": 24645 },
      { "nombre": "Pamela Belén Enrique", "personaId": 24646 }
    ]
  },
  {
    "sociedadId": 13082,
    "socios": [
      { "nombre": "Bernardo Jorge Oliver", "personaId": 24660 },
      { "nombre": "Guillermo Camilo De Haro", "personaId": 24661 }
    ]
  },
  {
    "sociedadId": 13163,
    "socios": [
      { "nombre": "Javier Alejandro Eppens", "personaId": 24768 },
      { "nombre": "Maria Viviana Eppens", "personaId": 24769 }
    ]
  },
  {
    "sociedadId": 13322,
    "socios": [
      { "nombre": "Sebastián Elias Matar", "personaId": 22040 }
    ]
  },
  {
    "sociedadId": 13485,
    "socios": [
      { "nombre": "Ortubia Pedro Alejandro", "personaId": 25235 }
    ]
  },
  {
    "sociedadId": 13580,
    "socios": [
      { "nombre": "Boris Rivas", "personaId": 13290 }
    ]
  },
  {
    "sociedadId": 13586,
    "socios": [
      { "nombre": "Gonzalo Francisco Orozco Cicero", "personaId": 14238 }
    ]
  },
  {
    "sociedadId": 13621,
    "socios": [
      { "nombre": "Eric Tomás Lizarde Díaz", "personaId": 25412 },
      { "nombre": "Ornella Valeria Lucia Spadavecchia", "personaId": 25411 }
    ]
  },
  {
    "sociedadId": 13648,
    "socios": [
      { "nombre": "Aldunate Matias Damian", "personaId": 25448 },
      { "nombre": "Gil Daniel Ernesto", "personaId": 25449 },
      { "nombre": "Gil Strachwitz Antonella Lucia", "personaId": 25450 },
      { "nombre": "Gil Strachwitz Vanina Yael", "personaId": 25451 },
      { "nombre": "Gomez Walter Sebastian", "personaId": 25447 },
      { "nombre": "Strachwitz Maria Ester", "personaId": 25452 }
    ]
  },
  {
    "sociedadId": 13684,
    "socios": [
      { "nombre": "Sonia Beatriz Montenegro", "personaId": 25501 }
    ]
  },
  {
    "sociedadId": 14138,
    "socios": [
      { "nombre": "Malena Laricchia", "personaId": 26171 },
      { "nombre": "Nicolas Cruces", "personaId": 26170 }
    ]
  },
  {
    "sociedadId": 14208,
    "socios": [
      { "nombre": "Bruno Raina Prieto", "personaId": 19794 },
      { "nombre": "Felipe Andrés Suarez Bidondo", "personaId": 5001 }
    ]
  },
  {
    "sociedadId": 14257,
    "socios": [
      { "nombre": "Fernando Daniel Pescara", "personaId": 26347 }
    ]
  },
  {
    "sociedadId": 14396,
    "socios": [
      { "nombre": "Bruno Alejandro Lamacchia", "personaId": 26539 },
      { "nombre": "Nicolás Martín Lamacchia", "personaId": 26538 }
    ]
  },
  {
    "sociedadId": 14805,
    "socios": [
      { "nombre": "Ana Dora Rivero", "personaId": 12078 },
      { "nombre": "Miguel Angel Ferre", "personaId": 413 }
    ]
  },
  {
    "sociedadId": 14809,
    "socios": [
      { "nombre": "Enzo Alejandro Mattolini", "personaId": 27122 },
      { "nombre": "Noelia Cristina Ferrer", "personaId": 27123 }
    ]
  },
  {
    "sociedadId": 14907,
    "socios": [
      { "nombre": "Carolina Edith Gismondi", "personaId": 27289 },
      { "nombre": "Roxana Vanina Stagnoli", "personaId": 27288 }
    ]
  },
  {
    "sociedadId": 14950,
    "socios": [
      { "nombre": "Florencia Carolina Castillo Ianardi", "personaId": 27352 },
      { "nombre": "Nicolas Ezequiel Gaia", "personaId": 27351 }
    ]
  },
  {
    "sociedadId": 14961,
    "socios": [
      { "nombre": "Daiana Emilce Piquer Furlanetto", "personaId": 27368 },
      { "nombre": "Rita Maria Cecilia Alonso", "personaId": 27369 }
    ]
  },
  {
    "sociedadId": 15005,
    "socios": [
      { "nombre": "Leonardo Pablo Tetilla", "personaId": 27437 },
      { "nombre": "Sebastián Ángel Tetilla", "personaId": 27436 }
    ]
  },
  {
    "sociedadId": 15024,
    "socios": [
      { "nombre": "Matías Ezequiel Muñoz", "personaId": 27461 },
      { "nombre": "Viviana Beatriz Amarfil", "personaId": 27462 }
    ]
  },
  {
    "sociedadId": 15195,
    "socios": [
      { "nombre": "Cynthia Lorena Andreola", "personaId": 27707 },
      { "nombre": "Federico Sebastian Andreola", "personaId": 27706 },
      { "nombre": "Maria de los Angeles Andreola", "personaId": 27708 }
    ]
  },
  {
    "sociedadId": 15225,
    "socios": [
      { "nombre": "Meza Franco Valentin", "personaId": 27747 },
      { "nombre": "Meza Juan Ignacio", "personaId": 27745 },
      { "nombre": "Vargas Maria Alejandra", "personaId": 27746 }
    ]
  },
  {
    "sociedadId": 15307,
    "socios": [
      { "nombre": "Jonathan Josué Bisacco", "personaId": 13411 }
    ]
  },
  {
    "sociedadId": 15381,
    "socios": [
      { "nombre": "Ana Noelia Bartolini", "personaId": 3614 },
      { "nombre": "Emilio Facundo Celen", "personaId": 27974 }
    ]
  },
  {
    "sociedadId": 15430,
    "socios": [
      { "nombre": "María Candela Merlino", "personaId": 28050 },
      { "nombre": "Román Pablo Alberto Martinez", "personaId": 28051 }
    ]
  },
  {
    "sociedadId": 15519,
    "socios": [
      { "nombre": "Agustin Laudecina Pagliarulo", "personaId": 28178 },
      { "nombre": "Gaston Emanuel Benavides", "personaId": 28179 }
    ]
  },
  {
    "sociedadId": 15537,
    "socios": [
      { "nombre": "Adriana Beatriz Gómez", "personaId": 28199 },
      { "nombre": "Tatiana Nessier Quiroz", "personaId": 28200 }
    ]
  },
  {
    "sociedadId": 15548,
    "socios": [
      { "nombre": "Magni Suayter Carlos Franco", "personaId": 28217 },
      { "nombre": "Porro Walter Damián", "personaId": 28218 },
      { "nombre": "Re Arnaldo Alan", "personaId": 28219 }
    ]
  },
  {
    "sociedadId": 15562,
    "socios": [
      { "nombre": "Cristian Darío Centurión", "personaId": 7679 },
      { "nombre": "Marcelo Gonzalez Wollermann", "personaId": 28236 }
    ]
  },
  {
    "sociedadId": 15578,
    "socios": [
      { "nombre": "Juan Pablo Medez", "personaId": 28258 },
      { "nombre": "Maria Laura Toro", "personaId": 28259 }
    ]
  },
  {
    "sociedadId": 15604,
    "socios": [
      { "nombre": "Lucia Ayelen Castro Amicone", "personaId": 22249 }
    ]
  },
  {
    "sociedadId": 15698,
    "socios": [
      { "nombre": "Alejandro Nicolas Capella", "personaId": 19476 },
      { "nombre": "Jorge Raúl Morichetti", "personaId": 2747 },
      { "nombre": "Lucas Gabriel Bonasera Sigona", "personaId": 28420 }
    ]
  },
  {
    "sociedadId": 15751,
    "socios": [
      { "nombre": "Eduardo Conterno", "personaId": 28494 },
      { "nombre": "Gonzalez Tutera Rodrigo Sebastian", "personaId": 31459 },
      { "nombre": "Gonzalo Rafael Martin Fernandez", "personaId": 28496 },
      { "nombre": "Victor Daniel La Motta", "personaId": 24453 },
      { "nombre": "Yam Andres Conterno Tironi", "personaId": 28495 }
    ]
  },
  {
    "sociedadId": 15890,
    "socios": [
      { "nombre": "Jose Francisco Tamola", "personaId": 28699 },
      { "nombre": "Maria Paula Romero Juri", "personaId": 28700 },
      { "nombre": "Santiago Jose Ale", "personaId": 15358 }
    ]
  },
  {
    "sociedadId": 16069,
    "socios": [
      { "nombre": "Martin Lopez", "personaId": 9337 },
      { "nombre": "Nicolas Furtado Flores", "personaId": 21944 }
    ]
  },
  {
    "sociedadId": 16133,
    "socios": [
      { "nombre": "Guillermo Andrés Lagos", "personaId": 26187 }
    ]
  },
  {
    "sociedadId": 16175,
    "socios": [
      { "nombre": "Alejandra Susana Echegaray", "personaId": 29057 },
      { "nombre": "Fernando Alfredo Carmona", "personaId": 29056 },
      { "nombre": "Nahuel Fernando Carmona", "personaId": 29058 }
    ]
  },
  {
    "sociedadId": 16202,
    "socios": [
      { "nombre": "Jose Raul Herrera Arenas", "personaId": 29095 },
      { "nombre": "Maria Paz Figueroa Gonzalez", "personaId": 29096 }
    ]
  },
  {
    "sociedadId": 16346,
    "socios": [
      { "nombre": "José Gabriel Pascual Ferri", "personaId": 29310 },
      { "nombre": "Luis Alejandro Morales", "personaId": 29311 }
    ]
  },
  {
    "sociedadId": 16348,
    "socios": [
      { "nombre": "Juan Luis Victorino Amestoy", "personaId": 29313 },
      { "nombre": "Lucas Federico Amestoy", "personaId": 29314 }
    ]
  },
  {
    "sociedadId": 16418,
    "socios": [
      { "nombre": "Federico Antonio Lombardo", "personaId": 29401 },
      { "nombre": "Natalia Sidoti", "personaId": 29400 }
    ]
  },
  {
    "sociedadId": 16521,
    "socios": [
      { "nombre": "Cecilia Betiana Carreño", "personaId": 29557 },
      { "nombre": "Grette Raquel Stuhldreher Videla", "personaId": 29558 }
    ]
  },
  {
    "sociedadId": 16568,
    "socios": [
      { "nombre": "Cristian Alejandro De Benedectis Abaurre", "personaId": 7542 },
      { "nombre": "Cristian Leonel Deliberto", "personaId": 29613 }
    ]
  },
  {
    "sociedadId": 16737,
    "socios": [
      { "nombre": "Maria Fernanda Lourdes Pivetta", "personaId": 1553 },
      { "nombre": "Matias Bonanno", "personaId": 28985 },
      { "nombre": "Renzo Valentino Pivetta", "personaId": 29831 }
    ]
  },
  {
    "sociedadId": 16752,
    "socios": [
      { "nombre": "Ivan Fabricio Navarro", "personaId": 29851 },
      { "nombre": "Juan Gonzalo Dalmau", "personaId": 29852 }
    ]
  },
  {
    "sociedadId": 16959,
    "socios": [
      { "nombre": "Ariel David Guzman", "personaId": 30172 },
      { "nombre": "Hugo Alejandro Oropel", "personaId": 30173 }
    ]
  },
  {
    "sociedadId": 17220,
    "socios": [
      { "nombre": "Mayra Ada Huentemil Sanhueza", "personaId": 30522 },
      { "nombre": "Nelida Liliana Heflíng", "personaId": 30521 }
    ]
  },
  {
    "sociedadId": 17239,
    "socios": [
      { "nombre": "Facundo Nahuel Calero", "personaId": 27516 },
      { "nombre": "Juan Pablo Calero", "personaId": 27515 },
      { "nombre": "Maga Victoria Vallejo", "personaId": 30550 },
      { "nombre": "Pablo Francisco Vallejo", "personaId": 30549 },
      { "nombre": "Romina Gabriela Calero", "personaId": 27513 }
    ]
  },
  {
    "sociedadId": 17258,
    "socios": [
      { "nombre": "Maria Florencia Mafferra Herrera", "personaId": 30580 },
      { "nombre": "Omar Rodrigo Horen", "personaId": 30581 }
    ]
  },
  {
    "sociedadId": 17334,
    "socios": [
      { "nombre": "Estefania Gabriela Sosa Sarmiento", "personaId": 30666 }
    ]
  },
  {
    "sociedadId": 17414,
    "socios": [
      { "nombre": "Arnol Fabian Perez Lozano", "personaId": 30782 },
      { "nombre": "Maximiliano Ruiz Diaz", "personaId": 30781 },
      { "nombre": "Monica Elizabeth Di Leo", "personaId": 35664 }
    ]
  },
  {
    "sociedadId": 17437,
    "socios": [
      { "nombre": "María Soledad Lorenzo", "personaId": 30818 }
    ]
  },
  {
    "sociedadId": 17444,
    "socios": [
      { "nombre": "Cinthia Ivanna Oniduka", "personaId": 30828 },
      { "nombre": "Gabriela Noelia Sosa Lobos", "personaId": 30829 }
    ]
  },
  {
    "sociedadId": 17461,
    "socios": [
      { "nombre": "German Guardia", "personaId": 30853 },
      { "nombre": "Jairo Rolando Busto", "personaId": 30850 },
      { "nombre": "Jose Hernan Chicon", "personaId": 30849 },
      { "nombre": "Norberto Santiago Rondinini", "personaId": 30852 },
      { "nombre": "Romina Paola Buschiazzo", "personaId": 30851 }
    ]
  },
  {
    "sociedadId": 17744,
    "socios": [
      { "nombre": "Juan Ignacio Degregorio", "personaId": 31241 },
      { "nombre": "Lucas Agustin Degregorio", "personaId": 31240 }
    ]
  },
  {
    "sociedadId": 18177,
    "socios": [
      { "nombre": "Leandro Emanuel Prieto", "personaId": 31757 },
      { "nombre": "Maria Sol Ruffolo", "personaId": 31758 }
    ]
  },
  {
    "sociedadId": 18255,
    "socios": [
      { "nombre": "Adolfo Isidro Mario Diaz", "personaId": 31844 }
    ]
  },
  {
    "sociedadId": 18595,
    "socios": [
      { "nombre": "Matias Ramiro Militelo", "personaId": 5925 },
      { "nombre": "Militelo Ricardo Alejandro", "personaId": 32218 }
    ]
  },
  {
    "sociedadId": 18771,
    "socios": [
      { "nombre": "Ana Guerrero", "personaId": 32468 },
      { "nombre": "Manuel Andres Ortiz Stuhldreher", "personaId": 32469 }
    ]
  },
  {
    "sociedadId": 18832,
    "socios": [
      { "nombre": "Canizzo Dario José", "personaId": 32534 },
      { "nombre": "Santiago Roxana Hebe", "personaId": 32535 }
    ]
  },
  {
    "sociedadId": 12169,
    "socios": [
    ]
  },
  {
    "sociedadId": 14587,
    "socios": [
      { "nombre": "Maria Noelia Alderete", "personaId": 26188 },
      { "nombre": "Nicolás Matías Mas Pastran", "personaId": 21872 }
    ]
  }
];
