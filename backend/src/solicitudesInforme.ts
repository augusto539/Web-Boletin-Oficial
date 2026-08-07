import { type Request, type Response, Router } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { pool } from "./auth.js";

// Endpoint público (sin auth) para "¿Qué informe estás buscando?" en
// /informes: cualquiera puede pedir un informe nuevo, con o sin mail de
// contacto. Mismo criterio que leadsRouter.
export const solicitudesInformeRouter = Router();

const MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

solicitudesInformeRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const texto = typeof req.body?.texto === "string" ? req.body.texto.trim().slice(0, 1000) : "";
    const mailCrudo = typeof req.body?.mail === "string" ? req.body.mail.trim().toLowerCase() : "";

    if (!texto) {
      return res.status(400).json({ error: "Contanos qué informe estás buscando." });
    }
    if (mailCrudo && !MAIL_RE.test(mailCrudo)) {
      return res.status(400).json({ error: "El mail no es válido." });
    }

    await pool().query("INSERT INTO solicitudes_informe (texto, mail) VALUES ($1, $2)", [
      texto,
      mailCrudo || null,
    ]);

    return res.status(201).json({ ok: true });
  }),
);
