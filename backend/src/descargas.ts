import { type Request, type Response, Router } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { pool, requireUsuario } from "./auth.js";

// Historial de descargas: mismo criterio que historial.ts (búsquedas) --
// cualquier usuario logueado puede registrar las suyas (llamado
// fire-and-forget desde el frontend después de generar cada archivo). Solo
// un admin puede leerlo (ver GET /api/admin/usuarios/:id/historial-descargas
// en admin.ts).
export const descargasRouter = Router();

const TIPOS_VALIDOS = new Set([
  "sociedad",
  "persona",
  "informe_departamentos",
  "informe_anuario",
  "informe_nicho_cannabis",
  "informe_nicho_enoturismo",
  "informe_nicho_bodegas_boutique",
  "informe_nicho_energia_renovable",
  "informe_nicho_cripto_fintech",
  "informe_nicho_software",
  "informe_nicho_servicios_profesionales",
  "informe_mujeres_fundadoras",
  "informe_actividades_clae",
  "informe_analisis_redes",
]);
const FORMATOS_VALIDOS = new Set(["pdf", "excel"]);

descargasRouter.post(
  "/",
  requireUsuario(),
  asyncHandler(async (req: Request, res: Response) => {
    const tipo = typeof req.body?.tipo === "string" ? req.body.tipo : "";
    const formato = typeof req.body?.formato === "string" ? req.body.formato : "";
    const entidadId = Number.isFinite(req.body?.entidadId) ? Math.trunc(req.body.entidadId) : null;
    const entidadNombre =
      typeof req.body?.entidadNombre === "string" ? req.body.entidadNombre.trim().slice(0, 255) || null : null;

    if (!TIPOS_VALIDOS.has(tipo)) return res.status(400).json({ error: "Tipo de descarga inválido." });
    if (!FORMATOS_VALIDOS.has(formato)) return res.status(400).json({ error: "Formato de descarga inválido." });

    await pool().query(
      "INSERT INTO historial_descargas (usuario_id, tipo, entidad_id, entidad_nombre, formato) VALUES ($1, $2, $3, $4, $5)",
      [req.usuario!.id, tipo, entidadId, entidadNombre, formato],
    );
    return res.status(201).json({ ok: true });
  }),
);
