import { type Request, type Response, Router } from "express";
import { pool } from "./auth.js";

// Todas las rutas de acá abajo ya pasaron por requireAdmin() (ver server.ts),
// así que req.usuario existe y es admin=true.
export const adminRouter = Router();

adminRouter.get("/estadisticas", async (_req: Request, res: Response) => {
  const { rows } = await pool().query<{ count: string }>("SELECT count(*) FROM usuarios");
  const usuariosRegistrados = Number(rows[0].count);

  // Las notificaciones todavía viven solo en localStorage del navegador de
  // cada usuario (ver frontend/src/pages/Notificaciones.tsx) — no hay tabla
  // en la base para contarlas de verdad. Mock a propósito, documentado en
  // docs/pendientes.md: reemplazar por `SELECT count(*) FROM notificaciones`
  // (o similar) el día que esa página tenga backend real.
  const notificacionesActivas = 100;

  return res.json({ usuariosRegistrados, notificacionesActivas });
});

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

adminRouter.get("/usuarios", async (req: Request, res: Response) => {
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
});

adminRouter.get("/usuarios/:id", async (req: Request, res: Response) => {
  const { rows } = await pool().query<UsuarioAdminRow>(
    "SELECT id, nombre, mail, plan, admin, creado_el FROM usuarios WHERE id = $1",
    [req.params.id],
  );
  const usuario = rows[0];
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
  return res.json({ usuario: usuarioAdminJson(usuario) });
});

// Toggle de admin=true/false. Se bloquea la auto-degradación para que un
// admin no pueda quitarse el permiso por error y quedar afuera del panel.
adminRouter.patch("/usuarios/:id/admin", async (req: Request, res: Response) => {
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
});

adminRouter.get("/usuarios/:id/historial", async (req: Request, res: Response) => {
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
});

adminRouter.get("/leads", async (req: Request, res: Response) => {
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
});
