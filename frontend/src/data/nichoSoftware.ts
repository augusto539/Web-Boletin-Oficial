// Contenido del informe "Desarrollo de software en Mendoza", sexto de la
// serie de nichos sectoriales. Mismo criterio que los cinco anteriores:
// texto y cifras redactados a mano a partir del documento fuente,
// integrados acá como contenido estático.
//
// sociedadId/personaId: las 103 entidades del directorio (agregado al
// documento fuente en una segunda pasada) se cruzaron contra la base por
// CUIT donde había, por nombre normalizado donde no -- las 103 calzaron
// exacto. De los 220 socios/integrantes únicos, 209 resolvieron a persona y
// 2 a sociedad (socio jurídico). Quedaron sin enlazar, a propósito, dos
// grupos de casos (aparecen en el directorio solo como texto, sin
// personaId/sociedadId):
//   - Entidades genuinamente ajenas a esta base: Besitz B.V. y Mieten B.V.
//     (socias holandesas de Uber Eats S.A.S.), Sisu Venture Partners
//     Participaciones Ltda. (matriz chilena) y Aldibs S.A.S. (no existe en
//     la base con ese nombre) -- ninguna tiene ficha propia acá.
//   - Nombres ambiguos: Víctor Abel Quiroga, Daniel Enrique Álvarez, Juan
//     Carlos Rodríguez y Juan Pablo Rodríguez matchean por nombre
//     normalizado contra MÁS DE UNA persona real en la base, sin CUIT/DNI
//     en el documento fuente para desambiguar -- mismo criterio que el
//     resto del pipeline: mejor dejarlo sin vincular que arriesgar
//     enlazar a la persona equivocada.

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

export const DEPARTAMENTOS_SOFTWARE = new Map<string, number>([
  ["Capital", 43],
  ["Godoy Cruz", 20],
  ["Guaymallén", 10],
  ["Luján de Cuyo", 9],
  ["Maipú", 5],
  ["San Rafael", 4],
  ["Rivadavia", 3],
  ["Las Heras", 2],
  ["San Martín", 1],
  ["Junín", 1],
  ["Tunuyán", 1],
]);
