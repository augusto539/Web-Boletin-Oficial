import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { Client } from "pg";

config({ path: join(dirname(fileURLToPath(import.meta.url)), "..", ".env") });

function normalizar(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase();
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  console.log("Borrando datos de prueba previos...");
  await client.query(`
    TRUNCATE vinculos, actos, sociedad_actividades, sociedades, personas_fisicas,
             escribanos, domicilios, boletines
    RESTART IDENTITY CASCADE
  `);

  console.log("Insertando domicilios...");
  const domicilios = await client.query<{ id: number }>(`
    INSERT INTO domicilios (domicilio_completo, localidad_id) VALUES
      ('San Martín 1234, Ciudad de Mendoza', 1),
      ('Av. Godoy Cruz 567, Godoy Cruz', 2),
      ('Ruta 40 km 12, Chacras de Coria', 4),
      ('Belgrano 890, San Rafael', 6),
      ('Sin domicilio registrado en el aviso', NULL)
    RETURNING id
  `);
  const [domSanMartin, domGodoyCruz, domChacras, domSanRafael, domVacio] = domicilios.rows.map((r) => r.id);

  console.log("Insertando boletines...");
  const boletines = await client.query<{ id: number }>(`
    INSERT INTO boletines (fecha, nro_edicion, id_pdf, url) VALUES
      ('2023-03-14', '32812', 'bo-2023-03-14', 'https://boletinoficial.mendoza.gov.ar/bo/2023-03-14.pdf'),
      ('2023-07-02', '32912', 'bo-2023-07-02', 'https://boletinoficial.mendoza.gov.ar/bo/2023-07-02.pdf'),
      ('2024-01-19', '33078', 'bo-2024-01-19', 'https://boletinoficial.mendoza.gov.ar/bo/2024-01-19.pdf'),
      ('2024-11-05', '33310', 'bo-2024-11-05', 'https://boletinoficial.mendoza.gov.ar/bo/2024-11-05.pdf'),
      ('2025-05-22', '33512', 'bo-2025-05-22', 'https://boletinoficial.mendoza.gov.ar/bo/2025-05-22.pdf'),
      ('2016-02-20', '29104', 'bo-2016-02-20', 'https://boletinoficial.mendoza.gov.ar/bo/2016-02-20.pdf'),
      ('2020-05-25', '31056', 'bo-2020-05-25', 'https://boletinoficial.mendoza.gov.ar/bo/2020-05-25.pdf')
    RETURNING id
  `);
  const [bol1, bol2, bol3, bol4, bol5, bol6, bol7] = boletines.rows.map((r) => r.id);

  console.log("Insertando escribanos...");
  const escribanos = await client.query<{ id: number }>(`
    INSERT INTO escribanos (nombre, registro_notarial) VALUES
      ('Marta Beatriz Fernández', 'Registro Notarial N.º 12'),
      ('Carlos Alberto Suárez', 'Registro Notarial N.º 45')
    RETURNING id
  `);
  const [escFernandez, escSuarez] = escribanos.rows.map((r) => r.id);

  console.log("Insertando personas físicas...");
  const personasData: Array<[string, string | null, string | null, string | null, number | null]> = [
    ["Juan Pablo Gómez", "DNI", "28345123", "Contador Público", domSanMartin],
    ["María Laura Rodríguez", "DNI", "30112456", "Abogada", domGodoyCruz],
    ["Ricardo Andrés Pérez", "DNI", "22987654", null, domChacras],
    ["Ana Lucía Fernández", "DNI", "35678901", "Ingeniera Agrónoma", domSanMartin],
    ["Miguel Ángel Torres", "DNI", "18456789", "Comerciante", domSanRafael],
    ["Sofía Belén Martínez", "DNI", "40123789", null, domVacio],
    ["Diego Sebastián López", "DNI", "27890123", "Arquitecto", domGodoyCruz],
    ["Valentina Ríos", "DNI", "38456123", "Diseñadora Gráfica", domSanMartin],
    ["Carlos Mauricio Ibáñez", "DNI", "32456789", "Empresario", domGodoyCruz],
  ];
  const personas: number[] = [];
  for (const [nombre, tipoDoc, doc, profesion, domicilioId] of personasData) {
    const res = await client.query<{ id: number }>(
      `INSERT INTO personas_fisicas (nombre, nombre_normalizado, tipo_documento, documento, profesion, domicilio_id, oculta)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE) RETURNING id`,
      [nombre, normalizar(nombre), tipoDoc, doc, profesion, domicilioId],
    );
    personas.push(res.rows[0].id);
  }
  const [pGomez, pRodriguez, pPerez, pFernandez, pTorres, pMartinez, pLopez, pRios, pIbanez] = personas;

  // Persona con oculta = true, para verificar que la API/RLS la filtre siempre.
  await client.query(
    `INSERT INTO personas_fisicas (nombre, nombre_normalizado, tipo_documento, documento, domicilio_id, oculta)
     VALUES ($1, $2, 'DNI', '11222333', $3, TRUE)`,
    ["Persona con Pedido de Ocultamiento", normalizar("Persona con Pedido de Ocultamiento"), domSanMartin],
  );

  console.log("Insertando sociedades...");
  const sociedadesData: Array<{
    nombre: string;
    tipo: number;
    cuit: string;
    activa: boolean;
    fecha: string;
    capital: number;
    objeto: string;
    sector: number;
    domicilio: number;
    ganancias: number;
    iva: number;
    oculta?: boolean;
  }> = [
    {
      nombre: "Viñedos del Sur S.A.",
      tipo: 1,
      cuit: "30-71234567-8",
      activa: true,
      fecha: "2018-04-10",
      capital: 500000,
      objeto: "Producción y comercialización de vinos",
      sector: 1,
      domicilio: domSanMartin,
      ganancias: 1,
      iva: 1,
    },
    {
      nombre: "Constructora Andina S.R.L.",
      tipo: 2,
      cuit: "30-70987654-3",
      activa: true,
      fecha: "2015-08-22",
      capital: 800000,
      objeto: "Construcción de edificios residenciales y comerciales",
      sector: 3,
      domicilio: domGodoyCruz,
      ganancias: 1,
      iva: 1,
    },
    {
      nombre: "TecnoMza S.A.S.",
      tipo: 3,
      cuit: "30-71555222-1",
      activa: true,
      fecha: "2022-01-15",
      capital: 100000,
      objeto: "Desarrollo de software y servicios de programación",
      sector: 6,
      domicilio: domChacras,
      ganancias: 4,
      iva: 2,
    },
    {
      nombre: "Distribuidora Cuyo S.R.L.",
      tipo: 2,
      cuit: "30-70456789-2",
      activa: false,
      fecha: "2010-03-01",
      capital: 300000,
      objeto: "Distribución mayorista de alimentos",
      sector: 2,
      domicilio: domSanRafael,
      ganancias: 2,
      iva: 3,
    },
    {
      nombre: "Inversiones del Oeste S.A.",
      tipo: 1,
      cuit: "30-71333444-5",
      activa: true,
      fecha: "2019-11-30",
      capital: 2000000,
      objeto: "Inversión y participación en otras sociedades",
      sector: 5,
      domicilio: domGodoyCruz,
      ganancias: 1,
      iva: 1,
    },
    {
      nombre: "Restó Aconcagua S.A.S.",
      tipo: 3,
      cuit: "30-71666777-9",
      activa: true,
      fecha: "2023-06-05",
      capital: 80000,
      objeto: "Explotación de restaurantes y servicios de gastronomía",
      sector: 8,
      domicilio: domSanMartin,
      ganancias: 4,
      iva: 2,
    },
    {
      // Sociedad de prueba a propósito: reúne en una sola empresa los tres
      // escenarios pedidos para probar el grafo (ver comentarios en vínculos
      // más abajo): socia jurídica, socio compartido con otra empresa, y
      // socio fundador que cede sus cuotas a un socio nuevo.
      nombre: "Grupo Andino Inversiones S.A.",
      tipo: 1,
      cuit: "30-71999888-4",
      activa: true,
      fecha: "2016-02-10",
      capital: 900000,
      objeto: "Inversión y participación en sociedades agroindustriales",
      sector: 4,
      domicilio: domGodoyCruz,
      ganancias: 1,
      iva: 1,
    },
  ];

  const sociedades: number[] = [];
  for (const s of sociedadesData) {
    const res = await client.query<{ id: number }>(
      `INSERT INTO sociedades
        (nombre, nombre_normalizado, cuit, tipo_sociedad_id, activa, empleador, fecha_constitucion,
         capital_inicial, objeto_social, sector_id, domicilio_id, estado_ganancias_id, estado_iva_id, oculta)
       VALUES ($1, $2, $3, $4, $5, TRUE, $6, $7, $8, $9, $10, $11, $12, FALSE)
       RETURNING id`,
      [
        s.nombre,
        normalizar(s.nombre),
        s.cuit,
        s.tipo,
        s.activa,
        s.fecha,
        s.capital,
        s.objeto,
        s.sector,
        s.domicilio,
        s.ganancias,
        s.iva,
      ],
    );
    sociedades.push(res.rows[0].id);
  }
  const [sVinedos, sConstructora, sTecno, sDistribuidora, sInversiones, sResto, sGrupoAndino] = sociedades;

  console.log("Insertando actividades CLAE de sociedades...");
  await client.query(
    `INSERT INTO sociedad_actividades (sociedad_id, actividad_clae_id, principal, fecha_alta) VALUES
      ($1, 1, TRUE, '2018-04-10'),
      ($2, 2, TRUE, '2015-08-22'),
      ($3, 4, TRUE, '2022-01-15'),
      ($3, 5, FALSE, '2023-02-01'),
      ($4, 3, TRUE, '2010-03-01'),
      ($5, 5, TRUE, '2019-11-30'),
      ($6, 7, TRUE, '2023-06-05'),
      ($7, 5, TRUE, '2016-02-10')`,
    [sVinedos, sConstructora, sTecno, sDistribuidora, sInversiones, sResto, sGrupoAndino],
  );

  console.log("Insertando actos...");
  const actos = await client.query<{ id: number }>(
    `INSERT INTO actos (sociedad_id, tipo_acto_id, fecha_acto, fecha_publicacion, boletin_id, descripcion, capital_anterior, capital_nuevo, escribano_id) VALUES
      ($1, 1, '2018-03-20', '2023-03-14', $8, 'Constitución de la sociedad', NULL, 500000, $15),
      ($2, 1, '2015-08-01', '2023-03-14', $8, 'Constitución de la sociedad', NULL, 800000, $16),
      ($2, 2, '2021-05-10', '2023-07-02', $9, 'Aumento de capital social', 800000, 1200000, $16),
      ($3, 1, '2022-01-05', '2024-01-19', $10, 'Constitución de la sociedad', NULL, 100000, NULL),
      ($4, 3, '2023-09-01', '2024-11-05', $11, 'Disolución de la sociedad', NULL, NULL, $15),
      ($5, 1, '2019-11-15', '2024-11-05', $11, 'Constitución de la sociedad', NULL, 2000000, $16),
      ($6, 1, '2023-05-20', '2025-05-22', $12, 'Constitución de la sociedad', NULL, 80000, NULL),
      ($7, 1, '2016-02-10', '2016-02-20', $13, 'Constitución de la sociedad', NULL, 900000, $16),
      ($7, 5, '2020-05-15', '2020-05-25', $14, 'Cesión de cuotas de Diego Sebastián López a Carlos Mauricio Ibáñez', NULL, NULL, $15)
     RETURNING id`,
    [
      sVinedos, sConstructora, sTecno, sDistribuidora, sInversiones, sResto, sGrupoAndino,
      bol1, bol2, bol3, bol4, bol5, bol6, bol7,
      escFernandez, escSuarez,
    ],
  );
  const [
    actoVinedosConst,
    actoConstructoraConst,
    actoConstructoraAumento,
    actoTecnoConst,
    actoDistribuidoraDisolucion,
    actoInversionesConst,
    actoRestoConst,
    actoGrupoAndinoConst,
    actoGrupoAndinoCesion,
  ] = actos.rows.map((r) => r.id);

  console.log("Insertando vínculos (socios, autoridades)...");

  type VinculoPersona = {
    sociedad: number;
    rol: number;
    persona: number;
    porcentaje?: number | null;
    fechaEntrada: string;
    actoAlta: number;
  };

  const vinculosPersona: VinculoPersona[] = [
    // Viñedos del Sur S.A.: dos socios personas físicas, uno también presidente
    { sociedad: sVinedos, rol: 1, persona: pGomez, porcentaje: 60, fechaEntrada: "2018-04-10", actoAlta: actoVinedosConst },
    { sociedad: sVinedos, rol: 1, persona: pRodriguez, porcentaje: 40, fechaEntrada: "2018-04-10", actoAlta: actoVinedosConst },
    { sociedad: sVinedos, rol: 2, persona: pGomez, porcentaje: null, fechaEntrada: "2018-04-10", actoAlta: actoVinedosConst },

    // Constructora Andina S.R.L.: socio con % sin publicar (dato incompleto real)
    { sociedad: sConstructora, rol: 1, persona: pPerez, porcentaje: 50, fechaEntrada: "2015-08-22", actoAlta: actoConstructoraConst },
    { sociedad: sConstructora, rol: 1, persona: pFernandez, porcentaje: null, fechaEntrada: "2015-08-22", actoAlta: actoConstructoraConst },
    { sociedad: sConstructora, rol: 6, persona: pPerez, porcentaje: null, fechaEntrada: "2015-08-22", actoAlta: actoConstructoraConst },

    // TecnoMza S.A.S.: fundadora, también presidenta
    { sociedad: sTecno, rol: 1, persona: pTorres, porcentaje: 70, fechaEntrada: "2022-01-15", actoAlta: actoTecnoConst },
    { sociedad: sTecno, rol: 2, persona: pTorres, porcentaje: null, fechaEntrada: "2022-01-15", actoAlta: actoTecnoConst },

    // Distribuidora Cuyo S.R.L. (disuelta): socio con salida registrada
    { sociedad: sDistribuidora, rol: 1, persona: pMartinez, porcentaje: 100, fechaEntrada: "2010-03-01", actoAlta: actoDistribuidoraDisolucion },

    // Inversiones del Oeste S.A.: socia persona física + director
    { sociedad: sInversiones, rol: 1, persona: pGomez, porcentaje: 55, fechaEntrada: "2019-11-30", actoAlta: actoInversionesConst },
    { sociedad: sInversiones, rol: 4, persona: pLopez, porcentaje: null, fechaEntrada: "2019-11-30", actoAlta: actoInversionesConst },

    // Restó Aconcagua S.A.S.
    { sociedad: sResto, rol: 1, persona: pRios, porcentaje: null, fechaEntrada: "2023-06-05", actoAlta: actoRestoConst },
    { sociedad: sResto, rol: 6, persona: pRios, porcentaje: null, fechaEntrada: "2023-06-05", actoAlta: actoRestoConst },

    // Grupo Andino Inversiones S.A. (sociedad de prueba para el grafo):
    // Juan Pablo Gómez es socio acá Y TAMBIÉN de Viñedos del Sur S.A. más
    // arriba — mismo socio en dos empresas distintas.
    { sociedad: sGrupoAndino, rol: 1, persona: pGomez, porcentaje: 30, fechaEntrada: "2016-02-10", actoAlta: actoGrupoAndinoConst },
    // Diego Sebastián López es socio fundador; más abajo se le cierra el
    // vínculo (fecha_salida/acto_baja) por la cesión de cuotas a Carlos Ibáñez.
    { sociedad: sGrupoAndino, rol: 1, persona: pLopez, porcentaje: 50, fechaEntrada: "2016-02-10", actoAlta: actoGrupoAndinoConst },
    // Carlos Mauricio Ibáñez entra como socio nuevo a partir de la cesión.
    { sociedad: sGrupoAndino, rol: 1, persona: pIbanez, porcentaje: 50, fechaEntrada: "2020-05-15", actoAlta: actoGrupoAndinoCesion },
  ];

  for (const v of vinculosPersona) {
    await client.query(
      `INSERT INTO vinculos (sociedad_id, rol_id, persona_id, porcentaje_participacion, fecha_entrada, acto_alta_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [v.sociedad, v.rol, v.persona, v.porcentaje ?? null, v.fechaEntrada, v.actoAlta],
    );
  }

  // TecnoMza S.A.S. tiene como socia a Inversiones del Oeste S.A. (vínculo sociedad -> sociedad).
  await client.query(
    `INSERT INTO vinculos (sociedad_id, rol_id, sociedad_miembro_id, porcentaje_participacion, fecha_entrada, acto_alta_id)
     VALUES ($1, 1, $2, 30, '2022-01-15', $3)`,
    [sTecno, sInversiones, actoTecnoConst],
  );

  // Inversiones del Oeste S.A. tiene una socia jurídica todavía no cargada en la base (fallback).
  await client.query(
    `INSERT INTO vinculos (sociedad_id, rol_id, nombre_juridico_fallback, cuit_juridico_fallback, porcentaje_participacion, fecha_entrada, acto_alta_id)
     VALUES ($1, 1, 'Holding Cuyano S.A.', '30-70111222-3', 45, '2019-11-30', $2)`,
    [sInversiones, actoInversionesConst],
  );

  // Grupo Andino Inversiones S.A. tiene como socia a Inversiones del Oeste
  // S.A. (vínculo sociedad -> sociedad, escenario de prueba #1).
  await client.query(
    `INSERT INTO vinculos (sociedad_id, rol_id, sociedad_miembro_id, porcentaje_participacion, fecha_entrada, acto_alta_id)
     VALUES ($1, 1, $2, 20, '2016-02-10', $3)`,
    [sGrupoAndino, sInversiones, actoGrupoAndinoConst],
  );

  // La disolución de Distribuidora Cuyo también cierra su vínculo de socio.
  await client.query(
    `UPDATE vinculos SET fecha_salida = '2023-09-01', acto_baja_id = $1
     WHERE sociedad_id = $2 AND persona_id = $3`,
    [actoDistribuidoraDisolucion, sDistribuidora, pMartinez],
  );

  // La cesión de cuotas de Grupo Andino Inversiones cierra el vínculo de
  // Diego Sebastián López como socio fundador (escenario de prueba #3).
  await client.query(
    `UPDATE vinculos SET fecha_salida = '2020-05-15', acto_baja_id = $1
     WHERE sociedad_id = $2 AND persona_id = $3`,
    [actoGrupoAndinoCesion, sGrupoAndino, pLopez],
  );

  await client.end();
  console.log("Seed completo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
