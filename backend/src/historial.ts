import { type Request, type Response, Router } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { pool, requireUsuario } from "./auth.js";

// Historial de búsquedas: cualquier usuario logueado puede registrar las
// suyas (llamado fire-and-forget desde el frontend después de cada búsqueda,
// tenga o no resultados). Solo un admin puede leerlo (ver GET
// /api/admin/usuarios/:id/historial en admin.ts).
export const historialRouter = Router();

const TIPOS_VALIDOS = new Set([
  "sociedad_nombre",
  "sociedad_cuit",
  "sociedad_avanzada",
  "persona_avanzada",
]);

historialRouter.post("/", requireUsuario(), asyncHandler(async (req: Request, res: Response) => {
  const tipo = typeof req.body?.tipo === "string" ? req.body.tipo : "";
  const termino = typeof req.body?.termino === "string" ? req.body.termino.trim().slice(0, 300) || null : null;
  const resultados = Number.isFinite(req.body?.resultados)
    ? Math.max(0, Math.trunc(req.body.resultados))
    : 0;

  if (!TIPOS_VALIDOS.has(tipo)) return res.status(400).json({ error: "Tipo de búsqueda inválido." });

  await pool().query(
    "INSERT INTO historial_busquedas (usuario_id, tipo, termino, resultados) VALUES ($1, $2, $3, $4)",
    [req.usuario!.id, tipo, termino, resultados],
  );
  return res.status(201).json({ ok: true });
}));
