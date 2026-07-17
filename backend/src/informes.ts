import { Router } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { pool } from "./auth.js";

// Precómputo de /informes (ver docs/pendientes.md). A diferencia del resto
// del schema (que carga el pipeline Python externo), estas dos tablas las
// escribe únicamente este módulo — job diario (ver cron en server.ts) +
// botón manual en el panel admin (POST /api/admin/informes/recalcular en
// admin.ts). Sin funciones SQL nuevas a propósito: es más simple hacer el
// cálculo acá que armar una función SQL compleja para algo que corre una
// vez al día.
//
// La fecha de constitución confiable no es sociedades.fecha_constitucion
// (puede venir NULL) sino el acto real: actos JOIN tipos_acto.nombre =
// 'Constitucion', mismo criterio que estadisticas_ultimo_anio() (ver
// db/migrations/012_estadisticas.sql). Todo filtra sociedades.oculta =
// FALSE (habeas data).

interface DepartamentoActivoRow {
  departamento_id: number;
  cantidad_sociedades: number;
  cantidad_ultimo_anio: number;
}

async function recalcularDepartamentos(): Promise<number> {
  const { rows } = await pool().query<DepartamentoActivoRow>(`
    WITH ventana AS (
      SELECT max(fecha_publicacion) AS hasta, max(fecha_publicacion) - INTERVAL '1 year' AS desde
      FROM actos
    ),
    constituciones AS (
      SELECT a.sociedad_id, a.fecha_publicacion
      FROM actos a
      JOIN tipos_acto ta ON ta.id = a.tipo_acto_id AND ta.nombre = 'Constitucion'
      JOIN sociedades s ON s.id = a.sociedad_id AND s.oculta = FALSE
    )
    SELECT
      dep.id AS departamento_id,
      count(*)::int AS cantidad_sociedades,
      count(*) FILTER (
        WHERE c.fecha_publicacion > v.desde AND c.fecha_publicacion <= v.hasta
      )::int AS cantidad_ultimo_anio
    FROM constituciones c
    JOIN sociedades s ON s.id = c.sociedad_id
    JOIN domicilios d ON d.id = s.domicilio_id
    JOIN localidades loc ON loc.id = d.localidad_id
    JOIN departamentos dep ON dep.id = loc.departamento_id
    CROSS JOIN ventana v
    GROUP BY dep.id
  `);

  for (const r of rows) {
    await pool().query(
      `INSERT INTO informe_departamentos_activos
         (departamento_id, cantidad_sociedades, cantidad_ultimo_anio, actualizado_el)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (departamento_id) DO UPDATE SET
         cantidad_sociedades = EXCLUDED.cantidad_sociedades,
         cantidad_ultimo_anio = EXCLUDED.cantidad_ultimo_anio,
         actualizado_el = now()`,
      [r.departamento_id, r.cantidad_sociedades, r.cantidad_ultimo_anio],
    );
  }
  return rows.length;
}

interface AnuarioAcumulado {
  sociedadesConstituidas: number;
  personasInvolucradas: number;
  grupoClaeMasActivo: string | null;
  departamentoMasActivo: string | null;
  tipoSociedadMasComun: string | null;
}

// "Más frecuente por año" (grupo CLAE / departamento / tipo de sociedad):
// misma técnica en las tres — agrupar por (año, valor), y DISTINCT ON (año)
// ordenado por cantidad DESC se queda con el más frecuente de cada año.
const SQL_MODA_POR_ANIO = (joinExtra: string, columnaValor: string) => `
  SELECT DISTINCT ON (anio) anio, valor FROM (
    SELECT extract(year FROM a.fecha_publicacion)::int AS anio, ${columnaValor} AS valor, count(*) AS cnt
    FROM actos a
    JOIN tipos_acto ta ON ta.id = a.tipo_acto_id AND ta.nombre = 'Constitucion'
    JOIN sociedades s ON s.id = a.sociedad_id AND s.oculta = FALSE
    ${joinExtra}
    GROUP BY anio, valor
  ) x
  ORDER BY anio, cnt DESC, valor
`;

async function recalcularAnuario(): Promise<number> {
  const base = await pool().query<{ anio: number; sociedades_constituidas: number }>(`
    SELECT extract(year FROM a.fecha_publicacion)::int AS anio, count(*)::int AS sociedades_constituidas
    FROM actos a
    JOIN tipos_acto ta ON ta.id = a.tipo_acto_id AND ta.nombre = 'Constitucion'
    JOIN sociedades s ON s.id = a.sociedad_id AND s.oculta = FALSE
    GROUP BY anio
  `);

  const personas = await pool().query<{ anio: number; personas_involucradas: number }>(`
    SELECT extract(year FROM a.fecha_publicacion)::int AS anio, count(DISTINCT vi.persona_id)::int AS personas_involucradas
    FROM actos a
    JOIN tipos_acto ta ON ta.id = a.tipo_acto_id AND ta.nombre = 'Constitucion'
    JOIN sociedades s ON s.id = a.sociedad_id AND s.oculta = FALSE
    JOIN vinculos vi ON vi.acto_alta_id = a.id AND vi.persona_id IS NOT NULL
    GROUP BY anio
  `);

  const grupoClae = await pool().query<{ anio: number; valor: string }>(
    SQL_MODA_POR_ANIO(
      "JOIN sociedad_actividades sa ON sa.sociedad_id = s.id AND sa.orden = 1 JOIN grupos_clae g ON g.codigo = sa.clae_grupo",
      "g.nombre",
    ),
  );
  const departamento = await pool().query<{ anio: number; valor: string }>(
    SQL_MODA_POR_ANIO(
      "JOIN domicilios d ON d.id = s.domicilio_id JOIN localidades loc ON loc.id = d.localidad_id JOIN departamentos dep ON dep.id = loc.departamento_id",
      "dep.nombre",
    ),
  );
  const tipoSociedad = await pool().query<{ anio: number; valor: string }>(
    SQL_MODA_POR_ANIO("JOIN tipos_sociedad ts ON ts.id = s.tipo_sociedad_id", "ts.nombre"),
  );

  const porAnio = new Map<number, AnuarioAcumulado>();
  for (const r of base.rows) {
    porAnio.set(r.anio, {
      sociedadesConstituidas: r.sociedades_constituidas,
      personasInvolucradas: 0,
      grupoClaeMasActivo: null,
      departamentoMasActivo: null,
      tipoSociedadMasComun: null,
    });
  }
  for (const r of personas.rows) {
    const actual = porAnio.get(r.anio);
    if (actual) actual.personasInvolucradas = r.personas_involucradas;
  }
  for (const r of grupoClae.rows) {
    const actual = porAnio.get(r.anio);
    if (actual) actual.grupoClaeMasActivo = r.valor;
  }
  for (const r of departamento.rows) {
    const actual = porAnio.get(r.anio);
    if (actual) actual.departamentoMasActivo = r.valor;
  }
  for (const r of tipoSociedad.rows) {
    const actual = porAnio.get(r.anio);
    if (actual) actual.tipoSociedadMasComun = r.valor;
  }

  for (const [anio, d] of porAnio) {
    await pool().query(
      `INSERT INTO informe_anuario
         (anio, sociedades_constituidas, personas_involucradas, grupo_clae_mas_activo, departamento_mas_activo, tipo_sociedad_mas_comun, actualizado_el)
       VALUES ($1, $2, $3, $4, $5, $6, now())
       ON CONFLICT (anio) DO UPDATE SET
         sociedades_constituidas = EXCLUDED.sociedades_constituidas,
         personas_involucradas = EXCLUDED.personas_involucradas,
         grupo_clae_mas_activo = EXCLUDED.grupo_clae_mas_activo,
         departamento_mas_activo = EXCLUDED.departamento_mas_activo,
         tipo_sociedad_mas_comun = EXCLUDED.tipo_sociedad_mas_comun,
         actualizado_el = now()`,
      [
        anio,
        d.sociedadesConstituidas,
        d.personasInvolucradas,
        d.grupoClaeMasActivo,
        d.departamentoMasActivo,
        d.tipoSociedadMasComun,
      ],
    );
  }
  return porAnio.size;
}

export async function recalcularInformes(): Promise<{ departamentos: number; anios: number }> {
  const departamentos = await recalcularDepartamentos();
  const anios = await recalcularAnuario();
  console.log(`[informes] recalculado: ${departamentos} departamentos, ${anios} años`);
  return { departamentos, anios };
}

// --- Endpoints públicos (sin auth): el frontend los consulta para hidratar
// las páginas de /informes. El HTML servido a crawlers ya viene armado por
// el middleware SEO (ver seo.ts), que lee estas mismas tablas directo. ---
export const informesPublicoRouter = Router();

informesPublicoRouter.get(
  "/departamentos-activos",
  asyncHandler(async (_req, res) => {
    const { rows } = await pool().query<{
      departamento_id: number;
      nombre: string;
      cantidad_sociedades: number;
      cantidad_ultimo_anio: number;
      actualizado_el: string;
    }>(
      `SELECT i.departamento_id, d.nombre, i.cantidad_sociedades, i.cantidad_ultimo_anio, i.actualizado_el
       FROM informe_departamentos_activos i
       JOIN departamentos d ON d.id = i.departamento_id
       ORDER BY i.cantidad_sociedades DESC`,
    );
    return res.json({
      departamentos: rows.map((r) => ({
        departamentoId: r.departamento_id,
        nombre: r.nombre,
        cantidadSociedades: r.cantidad_sociedades,
        cantidadUltimoAnio: r.cantidad_ultimo_anio,
      })),
      actualizadoEl: rows[0]?.actualizado_el ?? null,
    });
  }),
);

// Lista de años disponibles, para que el hub (/informes) arme sus links a
// cada anuario sin tener que adivinar el rango.
informesPublicoRouter.get(
  "/anuarios",
  asyncHandler(async (_req, res) => {
    const { rows } = await pool().query<{ anio: number }>(
      "SELECT anio FROM informe_anuario ORDER BY anio DESC",
    );
    return res.json({ anios: rows.map((r) => r.anio) });
  }),
);

informesPublicoRouter.get(
  "/anuario/:anio",
  asyncHandler(async (req, res) => {
    const anio = Number(req.params.anio);
    if (!Number.isInteger(anio)) return res.status(400).json({ error: "Año inválido." });

    const { rows } = await pool().query<{
      anio: number;
      sociedades_constituidas: number;
      personas_involucradas: number;
      grupo_clae_mas_activo: string | null;
      departamento_mas_activo: string | null;
      tipo_sociedad_mas_comun: string | null;
      actualizado_el: string;
    }>(
      `SELECT anio, sociedades_constituidas, personas_involucradas,
              grupo_clae_mas_activo, departamento_mas_activo, tipo_sociedad_mas_comun, actualizado_el
       FROM informe_anuario WHERE anio = $1`,
      [anio],
    );
    const fila = rows[0];
    if (!fila) return res.status(404).json({ error: "No hay informe para ese año." });

    return res.json({
      anio: fila.anio,
      sociedadesConstituidas: fila.sociedades_constituidas,
      personasInvolucradas: fila.personas_involucradas,
      grupoClaeMasActivo: fila.grupo_clae_mas_activo,
      departamentoMasActivo: fila.departamento_mas_activo,
      tipoSociedadMasComun: fila.tipo_sociedad_mas_comun,
      actualizadoEl: fila.actualizado_el,
    });
  }),
);
