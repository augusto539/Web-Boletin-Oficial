import { type Request, type Response, Router } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { pool } from "./auth.js";
import { recalcularInformes } from "./informes.js";

// Todas las rutas de acá abajo ya pasaron por requireAdmin() (ver server.ts),
// así que req.usuario existe y es admin=true.
export const adminRouter = Router();

// Recálculo manual de /informes (además del job diario, ver cron en
// server.ts) — útil justo después de una carga grande de datos del pipeline
// externo, sin esperar al próximo horario del cron.
adminRouter.post(
  "/informes/recalcular",
  asyncHandler(async (_req: Request, res: Response) => {
    const resultado = await recalcularInformes();
    return res.json(resultado);
  }),
);

adminRouter.get(
  "/estadisticas",
  asyncHandler(async (_req: Request, res: Response) => {
    const { rows } = await pool().query<{
      sociedades: string;
      personas: string;
      relaciones: string;
      sociedades_baja: string;
      personas_baja: string;
      ultimo_boletin: string | null;
      usuarios: string;
      leads: string;
      busquedas: string;
    }>(`
    SELECT
      (SELECT count(*) FROM sociedades) AS sociedades,
      (SELECT count(*) FROM personas_fisicas) AS personas,
      (SELECT count(*) FROM vinculos) AS relaciones,
      (SELECT count(*) FROM sociedades WHERE oculta) AS sociedades_baja,
      (SELECT count(*) FROM personas_fisicas WHERE oculta) AS personas_baja,
      (SELECT max(fecha)::text FROM boletines) AS ultimo_boletin,
      (SELECT count(*) FROM usuarios) AS usuarios,
      (SELECT count(*) FROM leads_informe) AS leads,
      (SELECT count(*) FROM historial_busquedas) AS busquedas
  `);
    const r = rows[0];

    return res.json({
      baseDeDatos: {
        sociedades: Number(r.sociedades),
        personas: Number(r.personas),
        relaciones: Number(r.relaciones),
        dadosDeBaja: Number(r.sociedades_baja) + Number(r.personas_baja),
        ultimoBoletin: r.ultimo_boletin,
      },
      usuarios: {
        registrados: Number(r.usuarios),
        leads: Number(r.leads),
        busquedas: Number(r.busquedas),
      },
    });
  }),
);

interface UsuarioAdminRow {
  id: string;
  nombre: string;
  mail: string;
  plan: string;
  admin: boolean;
  creado_el: string;
}

function usuarioAdminJson(u: UsuarioAdminRow) {
  return { id: u.id, nombre: u.nombre, mail: u.mail, plan: u.plan, admin: u.admin, creadoEl: u.creado_el };
}

adminRouter.get(
  "/usuarios",
  asyncHandler(async (req: Request, res: Response) => {
    const limite = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;

    const [{ rows: totalRows }, { rows }] = await Promise.all([
      pool().query<{ count: string }>("SELECT count(*) FROM usuarios"),
      pool().query<UsuarioAdminRow>(
        "SELECT id, nombre, mail, plan, admin, creado_el FROM usuarios ORDER BY creado_el DESC LIMIT $1 OFFSET $2",
        [limite, offset],
      ),
    ]);

    return res.json({
      total: Number(totalRows[0].count),
      usuarios: rows.map(usuarioAdminJson),
    });
  }),
);

adminRouter.get(
  "/usuarios/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { rows } = await pool().query<UsuarioAdminRow>(
      "SELECT id, nombre, mail, plan, admin, creado_el FROM usuarios WHERE id = $1",
      [req.params.id],
    );
    const usuario = rows[0];
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
    return res.json({ usuario: usuarioAdminJson(usuario) });
  }),
);

// Toggle de admin=true/false. Se bloquea la auto-degradación para que un
// admin no pueda quitarse el permiso por error y quedar afuera del panel.
adminRouter.patch(
  "/usuarios/:id/admin",
  asyncHandler(async (req: Request, res: Response) => {
    const nuevoAdmin = req.body?.admin;
    if (typeof nuevoAdmin !== "boolean") {
      return res.status(400).json({ error: "Falta el campo admin (boolean)." });
    }
    if (String(req.usuario?.id) === String(req.params.id) && !nuevoAdmin) {
      return res.status(400).json({ error: "No podés quitarte tu propio permiso de admin." });
    }

    const { rows } = await pool().query<UsuarioAdminRow>(
      "UPDATE usuarios SET admin = $1 WHERE id = $2 RETURNING id, nombre, mail, plan, admin, creado_el",
      [nuevoAdmin, req.params.id],
    );
    const usuario = rows[0];
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
    return res.json({ usuario: usuarioAdminJson(usuario) });
  }),
);

adminRouter.get(
  "/usuarios/:id/historial",
  asyncHandler(async (req: Request, res: Response) => {
    const limite = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;
    const usuarioId = req.params.id;

    const [{ rows: totalRows }, { rows }] = await Promise.all([
      pool().query<{ count: string }>("SELECT count(*) FROM historial_busquedas WHERE usuario_id = $1", [
        usuarioId,
      ]),
      pool().query<{ id: string; tipo: string; termino: string | null; resultados: number; creado_el: string }>(
        `SELECT id, tipo, termino, resultados, creado_el FROM historial_busquedas
       WHERE usuario_id = $1 ORDER BY creado_el DESC LIMIT $2 OFFSET $3`,
        [usuarioId, limite, offset],
      ),
    ]);

    return res.json({
      total: Number(totalRows[0].count),
      historial: rows.map((h) => ({
        id: h.id,
        tipo: h.tipo,
        termino: h.termino,
        resultados: h.resultados,
        creadoEl: h.creado_el,
      })),
    });
  }),
);

adminRouter.get(
  "/leads",
  asyncHandler(async (req: Request, res: Response) => {
    const limite = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;

    const [{ rows: totalRows }, { rows }] = await Promise.all([
      pool().query<{ count: string }>("SELECT count(*) FROM leads_informe"),
      pool().query<{ id: string; mail: string; creado_el: string }>(
        "SELECT id, mail, creado_el FROM leads_informe ORDER BY creado_el DESC LIMIT $1 OFFSET $2",
        [limite, offset],
      ),
    ]);

    return res.json({
      total: Number(totalRows[0].count),
      leads: rows.map((l) => ({ id: l.id, mail: l.mail, creadoEl: l.creado_el })),
    });
  }),
);

// A diferencia de la búsqueda pública (GraphQL vía boletin_api, filtrada por
// RLS a oculta=false), estos dos listados usan boletin_auth para mostrar
// también las sociedades/personas ya ocultas — si no, un admin nunca podría
// encontrarlas de vuelta para desocultarlas.

interface SociedadAdminRow {
  id: string;
  nombre: string;
  cuit: string | null;
  fecha_constitucion: string | null;
  domicilio_electronico: string | null;
  oculta: boolean;
  domicilio_completo: string | null;
  clae_grupo_nombre: string | null;
  clae_descripcion: string | null;
  socios: string | null;
}

adminRouter.get(
  "/sociedades",
  asyncHandler(async (req: Request, res: Response) => {
    const limite = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;

    const [{ rows: totalRows }, { rows }] = await Promise.all([
      pool().query<{ count: string }>("SELECT count(*) FROM sociedades"),
      pool().query<SociedadAdminRow>(
        `WITH socios AS (
         SELECT v.sociedad_id,
                string_agg(DISTINCT COALESCE(pf.nombre, sm.nombre, v.nombre_juridico_fallback), ', ') AS nombres
         FROM vinculos v
         LEFT JOIN personas_fisicas pf ON pf.id = v.persona_id
         LEFT JOIN sociedades sm ON sm.id = v.sociedad_miembro_id
         GROUP BY v.sociedad_id
       ),
       -- "orden = 1" no es único por sociedad en los datos reales (1063
       -- sociedades tienen más de una fila así, típicamente una AC y una BD
       -- vieja de cuando cambió el rubro declarado sin renumerar orden) — un
       -- JOIN directo por orden=1 multiplicaba esas filas y la sociedad
       -- aparecía repetida en el panel con un CLAE distinto cada vez.
       -- DISTINCT ON fuerza una sola fila por sociedad, priorizando la
       -- actividad activa (AC) y de menor orden.
       actividad_principal AS (
         SELECT DISTINCT ON (sa.sociedad_id)
                sa.sociedad_id, sa.clae_codigo, sa.clae_grupo
         FROM sociedad_actividades sa
         ORDER BY sa.sociedad_id, (sa.estado = 'AC') DESC, sa.orden ASC
       )
       SELECT
         s.id, s.nombre, s.cuit, s.fecha_constitucion::text AS fecha_constitucion, s.domicilio_electronico, s.oculta,
         d.domicilio_completo,
         gc.nombre AS clae_grupo_nombre,
         ac.descripcion AS clae_descripcion,
         soc.nombres AS socios
       FROM sociedades s
       LEFT JOIN domicilios d ON d.id = s.domicilio_id
       LEFT JOIN actividad_principal ap ON ap.sociedad_id = s.id
       LEFT JOIN actividades_clae ac ON ac.codigo = ap.clae_codigo
       LEFT JOIN grupos_clae gc ON gc.codigo = ap.clae_grupo
       LEFT JOIN socios soc ON soc.sociedad_id = s.id
       ORDER BY s.nombre
       LIMIT $1 OFFSET $2`,
        [limite, offset],
      ),
    ]);

    return res.json({
      total: Number(totalRows[0].count),
      sociedades: rows.map((s) => ({
        id: s.id,
        nombre: s.nombre,
        cuit: s.cuit,
        fechaConstitucion: s.fecha_constitucion,
        domicilioElectronico: s.domicilio_electronico,
        oculta: s.oculta,
        domicilioCompleto: s.domicilio_completo,
        claeGrupoNombre: s.clae_grupo_nombre,
        claeDescripcion: s.clae_descripcion,
        socios: s.socios,
      })),
    });
  }),
);

adminRouter.patch(
  "/sociedades/:id/oculta",
  asyncHandler(async (req: Request, res: Response) => {
    const oculta = req.body?.oculta;
    if (typeof oculta !== "boolean") {
      return res.status(400).json({ error: "Falta el campo oculta (boolean)." });
    }
    const { rows } = await pool().query<{ id: string; oculta: boolean }>(
      "UPDATE sociedades SET oculta = $1 WHERE id = $2 RETURNING id, oculta",
      [oculta, req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Sociedad no encontrada." });
    return res.json({ sociedad: rows[0] });
  }),
);

interface PersonaAdminRow {
  id: string;
  nombre: string;
  documento: string | null;
  cuit: string | null;
  profesion: string | null;
  fecha_nacimiento: string | null;
  domicilio_electronico: string | null;
  oculta: boolean;
  domicilio_completo: string | null;
}

adminRouter.get(
  "/personas",
  asyncHandler(async (req: Request, res: Response) => {
    const limite = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;

    const [{ rows: totalRows }, { rows }] = await Promise.all([
      pool().query<{ count: string }>("SELECT count(*) FROM personas_fisicas"),
      pool().query<PersonaAdminRow>(
        `SELECT
         p.id, p.nombre, p.documento, p.cuit, p.profesion,
         p.fecha_nacimiento::text AS fecha_nacimiento,
         p.domicilio_electronico, p.oculta,
         d.domicilio_completo
       FROM personas_fisicas p
       LEFT JOIN domicilios d ON d.id = p.domicilio_id
       ORDER BY p.nombre
       LIMIT $1 OFFSET $2`,
        [limite, offset],
      ),
    ]);

    return res.json({
      total: Number(totalRows[0].count),
      personas: rows.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        documento: p.documento,
        cuit: p.cuit,
        profesion: p.profesion,
        fechaNacimiento: p.fecha_nacimiento,
        domicilioElectronico: p.domicilio_electronico,
        oculta: p.oculta,
        domicilioCompleto: p.domicilio_completo,
      })),
    });
  }),
);

adminRouter.patch(
  "/personas/:id/oculta",
  asyncHandler(async (req: Request, res: Response) => {
    const oculta = req.body?.oculta;
    if (typeof oculta !== "boolean") {
      return res.status(400).json({ error: "Falta el campo oculta (boolean)." });
    }
    const { rows } = await pool().query<{ id: string; oculta: boolean }>(
      "UPDATE personas_fisicas SET oculta = $1 WHERE id = $2 RETURNING id, oculta",
      [oculta, req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Persona no encontrada." });
    return res.json({ persona: rows[0] });
  }),
);

// Socios jurídicos: sociedades citadas como socias de otras (en el mismo
// acto de constitución/modificación) que el pipeline no pudo resolver a una
// fila propia — quedan en vinculos.nombre_juridico_fallback/
// cuit_juridico_fallback (ver 036_socios_juridicos.sql). Estos dos
// endpoints "promueven" ese fallback a una sociedad real (mínima) y
// repuntan sociedad_miembro_id, con lo que dejan de ser texto suelto y
// pasan a ser nodos reales del grafo y fichas linkeables.

interface SocioJuridicoDetalle {
  vinculoId: number;
  sociedadId: number;
  sociedadNombre: string;
}

interface SocioJuridicoRow {
  clave: string;
  nombre_sugerido: string;
  cuit_sugerido: string | null;
  citas: string;
  detalle: SocioJuridicoDetalle[];
}

adminRouter.get(
  "/socios-juridicos",
  asyncHandler(async (_req: Request, res: Response) => {
    // Agrupa por CUIT (sin puntuación) cuando hay, y si no por nombre
    // normalizado sin puntos finales — así "Dax Energy Holdings S.p.A" y
    // "...S.p.A." (mismo CUIT, distinto texto) caen en el mismo grupo. No
    // es perfecto para el caso de una misma empresa citada a veces con CUIT
    // y a veces sin (quedan en dos grupos separados), pero el POST de abajo
    // resuelve ese caso solo: al vincular el segundo grupo, el dedupe por
    // nombre_normalizado encuentra la sociedad que ya creó el primero.
    const { rows } = await pool().query<SocioJuridicoRow>(`
      WITH fallback AS (
        SELECT
          v.id AS vinculo_id,
          v.sociedad_id,
          s.nombre AS sociedad_nombre,
          v.nombre_juridico_fallback,
          v.cuit_juridico_fallback,
          COALESCE(
            NULLIF(regexp_replace(v.cuit_juridico_fallback, '\\D', '', 'g'), ''),
            normalizar_nombre(v.nombre_juridico_fallback)
          ) AS clave
        FROM vinculos v
        JOIN sociedades s ON s.id = v.sociedad_id
        WHERE v.nombre_juridico_fallback IS NOT NULL
      )
      SELECT
        clave,
        (array_agg(nombre_juridico_fallback ORDER BY length(nombre_juridico_fallback) DESC))[1] AS nombre_sugerido,
        (array_agg(cuit_juridico_fallback) FILTER (WHERE cuit_juridico_fallback IS NOT NULL))[1] AS cuit_sugerido,
        count(*) AS citas,
        json_agg(
          json_build_object('vinculoId', vinculo_id, 'sociedadId', sociedad_id::text, 'sociedadNombre', sociedad_nombre)
          ORDER BY sociedad_nombre
        ) AS detalle
      FROM fallback
      GROUP BY clave
      ORDER BY citas DESC, nombre_sugerido
    `);

    return res.json({
      grupos: rows.map((r) => ({
        clave: r.clave,
        nombreSugerido: r.nombre_sugerido,
        cuitSugerido: r.cuit_sugerido,
        citas: Number(r.citas),
        detalle: r.detalle,
      })),
    });
  }),
);

adminRouter.post(
  "/socios-juridicos/vincular",
  asyncHandler(async (req: Request, res: Response) => {
    const nombre = req.body?.nombre;
    const cuit = req.body?.cuit;
    const vinculoIds = req.body?.vinculoIds;

    if (typeof nombre !== "string" || !nombre.trim()) {
      return res.status(400).json({ error: "Falta el campo nombre." });
    }
    if (!Array.isArray(vinculoIds) || vinculoIds.length === 0 || !vinculoIds.every((id) => Number.isInteger(id))) {
      return res.status(400).json({ error: "Falta vinculoIds (array de números)." });
    }
    const cuitLimpio = typeof cuit === "string" && cuit.trim() ? cuit.trim() : null;

    let sociedadId: number | null = null;

    if (cuitLimpio) {
      const { rows } = await pool().query<{ id: number }>("SELECT id FROM sociedades WHERE cuit = $1 LIMIT 1", [
        cuitLimpio,
      ]);
      sociedadId = rows[0]?.id ?? null;
    }
    if (!sociedadId) {
      const { rows } = await pool().query<{ id: number }>(
        "SELECT id FROM sociedades WHERE nombre_normalizado = normalizar_nombre($1) LIMIT 1",
        [nombre],
      );
      sociedadId = rows[0]?.id ?? null;
    }
    if (!sociedadId) {
      const { rows } = await pool().query<{ id: number }>(
        "INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES ($1, normalizar_nombre($1), $2) RETURNING id",
        [nombre, cuitLimpio],
      );
      sociedadId = rows[0].id;
    }

    await pool().query(
      `UPDATE vinculos
       SET sociedad_miembro_id = $1, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
       WHERE id = ANY($2)`,
      [sociedadId, vinculoIds],
    );

    return res.json({ sociedadId, nombre });
  }),
);
