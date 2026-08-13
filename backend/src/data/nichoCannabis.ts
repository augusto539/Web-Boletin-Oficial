// Curaduría del informe "Cannabis y Cáñamo en Mendoza", primero de la serie
// de nichos sectoriales. Guarda SOLO los ids (sociedadId + socios) y lo que
// es criterio editorial propio del informe (nombreGenerico) -- nombre, CUIT,
// capital, publicación, departamento y objeto social se resuelven en vivo
// contra la base (ver informesNicho.ts) para que "oculta" (habeas data) se
// respete automáticamente. Antes esos datos vivían acá hardcodeados; ver
// docs/plan_centralizar_habeas_data.md sobre por qué se sacaron.
//
// Los ids se cruzaron a mano contra la base en su momento (por CUIT donde
// había, por los vínculos reales de la sociedad para los socios).

import type { EntidadCuradaBase, SocioCurado } from "../informesNicho.js";

// Agregados curados a mano (evolución anual, tipo de entidad, mapa por
// departamento): son cifras/resúmenes editoriales, no datos de una entidad
// puntual -- sin sociedadId/personaId, sin riesgo de habeas data, se quedan
// hardcodeados como estaban.
export const EVOLUCION_ANUAL = [
  { etiqueta: "2021", valor: 6 },
  { etiqueta: "2022", valor: 2 },
  { etiqueta: "2023", valor: 3 },
  { etiqueta: "2024", valor: 5 },
  { etiqueta: "2025", valor: 6 },
  { etiqueta: "2026*", valor: 5 },
];

export const TIPO_ENTIDAD = [
  { tipo: "S.A.S.", cantidad: 16 },
  { tipo: "Asociación Civil", cantidad: 4 },
  { tipo: "S.R.L.", cantidad: 3 },
  { tipo: "S.A.", cantidad: 4 },
];

export const DEPARTAMENTOS_CANNABIS = [
  { departamento: "Capital", cantidad: 9 },
  { departamento: "Luján de Cuyo", cantidad: 5 },
  { departamento: "San Rafael", cantidad: 2 },
  { departamento: "San Martín", cantidad: 2 },
  { departamento: "Las Heras", cantidad: 2 },
  { departamento: "Guaymallén", cantidad: 2 },
  { departamento: "Lavalle", cantidad: 1 },
  { departamento: "General Alvear", cantidad: 1 },
  { departamento: "Godoy Cruz", cantidad: 1 },
];

export interface EntidadCannabisCurada extends EntidadCuradaBase {
  socios: SocioCurado[];
  nombreGenerico?: boolean;
}

export const ENTIDADES: EntidadCannabisCurada[] = [
  {
    sociedadId: 6701,
    socios: [
      { nombre: "Alejandro Daniel Romero Funar", personaId: 5335 },
      { nombre: "Mariano Nicolás Ledesma", personaId: 12050 },
    ],
    nombreGenerico: true,
  },
  {
    sociedadId: 6720,
    socios: [
      { nombre: "Kevin Joel García", personaId: 14001 },
      { nombre: "Pablo Daniel Gil", personaId: 14000 },
    ],
    nombreGenerico: true,
  },
  {
    sociedadId: 7420,
    socios: [
      { nombre: "Daniel Eduardo Gaido", personaId: 15317 },
      { nombre: "Fernando Aníbal Saicha", personaId: 15319 },
      { nombre: "Rolando Millenaar", personaId: 15318 },
    ],
  },
  {
    sociedadId: 7712,
    socios: [
      { nombre: "Alfredo Luis Vila Santander", personaId: 4197 },
      { nombre: "Gerardo Daniel Gonzalez Bobillo", personaId: 15860 },
      { nombre: "Guillermo Nelson", personaId: 15859 },
      { nombre: "José Antonio Marquez", personaId: 15861 },
      { nombre: "Norma Beatriz Vázquez", personaId: 4198 },
    ],
    nombreGenerico: true,
  },
  {
    sociedadId: 7734,
    socios: [
      { nombre: "Rodrigo Ezequiel Matamala", personaId: 11904 },
      { nombre: "Thomas Lijtenberg", personaId: 15904 },
    ],
    nombreGenerico: true,
  },
  {
    sociedadId: 7800,
    socios: [
      { nombre: "Chiara Beccaria Gallostra", personaId: 15334 },
      { nombre: "María de Belén Díaz", personaId: 15331 },
      { nombre: "María Pía Gallostra Barri", personaId: 15332 },
    ],
    nombreGenerico: true,
  },
  {
    sociedadId: 9234,
    socios: [
      { nombre: "Juliana Verdaguer", personaId: 18681 },
      { nombre: "Martín Ignacio Santos", personaId: 2986 },
    ],
  },
  {
    sociedadId: 9906,
    socios: [
      { nombre: "Fernando Joaquín Reig", personaId: 19942 },
      { nombre: "Marcos David Bort", personaId: 19944 },
      { nombre: "Oscar Matías Scafetti", personaId: 19943 },
    ],
  },
  {
    sociedadId: 10434,
    socios: [
      { nombre: "Ciciliani Andres", personaId: 20902 },
      { nombre: "De Filippo Alejandro Luis", personaId: 20903 },
      { nombre: "De Filippo Valentin", personaId: 20904 },
    ],
  },
  {
    sociedadId: 10912,
    socios: [
      { nombre: "Carlos David Gordo", personaId: 21538 },
      { nombre: "Paula Daniela Rey Sosa", personaId: 21537 },
    ],
  },
  {
    sociedadId: 12180,
    socios: [
      { nombre: "Emiliano Alberto Bastias", personaId: 23376 },
      { nombre: "Matías Ernesto Oliva", personaId: 10298 },
    ],
    nombreGenerico: true,
  },
  {
    sociedadId: 13938,
    socios: [
      { nombre: "Alejandro Miguel Savina", personaId: 25874 },
      { nombre: "Oscar Matías Scafetti", personaId: 19943 },
      { nombre: "Patricia Gabriela Castro", personaId: 17510 },
    ],
  },
  {
    sociedadId: 14166,
    socios: [
      { nombre: "Leandro Petruzzelli Dziubecki", personaId: 26212 },
      { nombre: "Miguel Vecino", personaId: 26211 },
    ],
  },
  {
    sociedadId: 14838,
    socios: [
      { nombre: "Agustin Nicolas Calvo Demuru", personaId: 27185 },
      { nombre: "Carlos Nicolas Herminio Calvo", personaId: 27184 },
    ],
  },
  {
    sociedadId: 14918,
    socios: [{ nombre: "Edgardo Manuel Valles", personaId: 27304 }],
  },
  {
    sociedadId: 15127,
    socios: [
      { nombre: "Augusto Nevio Antonelli Pol", personaId: 27619 },
      { nombre: "Facundo Osvaldo Sánchez Astrada", personaId: 27621 },
      { nombre: "Ivanna Mariel Chaher", personaId: 27617 },
      { nombre: "Julieta Ruth Noller", personaId: 27623 },
      { nombre: "Mauco Lucas Gil Rosas", personaId: 27622 },
      { nombre: "Santiago Javier Ávila Isol", personaId: 27620 },
      { nombre: "Tomás Horacio Garignani Colombi", personaId: 27618 },
    ],
  },
  {
    sociedadId: 15836,
    socios: [
      { nombre: "Alexis Antonio Parada", personaId: 28613 },
      { nombre: "Augusto Nevio Antonelli Pol", personaId: 27619 },
      { nombre: "Eduardo Hugo Funes", personaId: 6668 },
      { nombre: "Juan Ricardo Millán", personaId: 28615 },
      { nombre: "Julio Manuel Funes", personaId: 6669 },
      { nombre: "Leandro Agustín Sturniolo", personaId: 28614 },
      { nombre: "Tomás Horacio Garignani Colombi", personaId: 27618 },
      { nombre: "Valentín Stradella", personaId: 13371 },
    ],
  },
  {
    sociedadId: 16081,
    socios: [
      { nombre: "Cardozo Camila Lucia", personaId: 20449 },
      { nombre: "Elia Romina Lourdes Ibañez", personaId: 28942 },
      { nombre: "Juan Ignacio Ezequiel Cardozo", personaId: 28943 },
      { nombre: "Nicolas Egberto Pares Buenaventura", personaId: 28944 },
    ],
  },
  {
    sociedadId: 17361,
    socios: [
      { nombre: "Patricia Elibeth Bravo", personaId: 5862 },
      { nombre: "Victoria Florencia Bistolfi", personaId: 11192 },
    ],
  },
  {
    sociedadId: 17470,
    socios: [
      { nombre: "Cereda Agustina Belen", personaId: 30870 },
      { nombre: "Espejo Pablo Emiliano", personaId: 30869 },
      { nombre: "Franco Martin Rufeil", personaId: 30868 },
      { nombre: "Santiago Felipe Llaver", personaId: 29515 },
    ],
  },
  {
    sociedadId: 17646,
    socios: [
      { nombre: "Claudia Vanina Moreno", personaId: 31104 },
      { nombre: "Gustavo Andrés Paez Cabrera", personaId: 21497 },
      { nombre: "Mario Gustavo Paez Ozan", personaId: 21496 },
    ],
  },
  {
    sociedadId: 18077,
    socios: [
      { nombre: "Fernando Adrián Mastrantonio", personaId: 31643 },
      { nombre: "Leandro Eloy Mastrantonio", personaId: 25086 },
      { nombre: "Pablo Daniel Mastrantonio", personaId: 31644 },
    ],
  },
  {
    sociedadId: 18227,
    socios: [],
  },
  {
    sociedadId: 18712,
    socios: [
      { nombre: "Diego Nahuel Herrera", personaId: 28100 },
      { nombre: "Joel Agustín Vargas", personaId: 10481 },
      { nombre: "Juan Andrés Tuninetti", personaId: 32386 },
      { nombre: "Mariana Alejandra Sánchez", personaId: 32387 },
    ],
  },
  {
    sociedadId: 18864,
    socios: [
      { nombre: "Claudia Vanina Moreno", personaId: 31104 },
      { nombre: "Gustavo Andrés Paez Cabrera", personaId: 21497 },
      { nombre: "Hernán García Manzur", personaId: 32581 },
      { nombre: "Mario Gustavo Paez Ozan", personaId: 21496 },
      { nombre: "Sergio Ariel García", personaId: 32580 },
    ],
  },
  {
    sociedadId: 18972,
    socios: [
      { nombre: "Emiliano Luis Miatello", personaId: 32725 },
      { nombre: "Francisco Insua", personaId: 32724 },
      { nombre: "Germán William Aguinaga", personaId: 32721 },
      { nombre: "Joaquín Covas", personaId: 32722 },
      { nombre: "Marco Durany Mechulan", personaId: 32723 },
      { nombre: "Santiago Nicolás Rodríguez", personaId: 32727 },
      { nombre: "Yoel Nicolás Rigo Herrera", personaId: 32726 },
    ],
  },
  {
    sociedadId: 19179,
    socios: [
      { nombre: "Adriano Giantino Poggio", personaId: 33058 },
      { nombre: "Ezequiel Matias Lentz", personaId: 33054 },
      { nombre: "Franco Gaetano Poggio", personaId: 33056 },
      { nombre: "Genaro Poggio", personaId: 33057 },
      { nombre: "Ivo Santino Bistolfi", personaId: 33052 },
      { nombre: "Julio Javier Bistolfi", personaId: 11189 },
      { nombre: "Leonardo Roman Bistolfi", personaId: 11191 },
      { nombre: "María del Pilar Esplandiu", personaId: 33053 },
      { nombre: "María Lujan Bistolfi", personaId: 11193 },
      { nombre: "Simón Salma Agostina", personaId: 33051 },
      { nombre: "Tatiana Magali Olivera", personaId: 33055 },
    ],
  },
];
