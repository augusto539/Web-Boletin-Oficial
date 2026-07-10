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

adminRouter.get("/usuarios", async (req: Request, res: Response) => {
  const limite = Math.min(Number(req.query.limit) || 100, 500);
  const offset = Number(req.query.offset) || 0;

  const [{ rows: totalRows }, { rows }] = await Promise.all([
    pool().query<{ count: string }>("SELECT count(*) FROM usuarios"),
    pool().query<{ id: string; nombre: string; mail: string; creado_el: string }>(
      "SELECT id, nombre, mail, creado_el FROM usuarios ORDER BY creado_el DESC LIMIT $1 OFFSET $2",
      [limite, offset],
    ),
  ]);

  return res.json({
    total: Number(totalRows[0].count),
    usuarios: rows.map((u) => ({ id: u.id, nombre: u.nombre, mail: u.mail, creadoEl: u.creado_el })),
  });
});
