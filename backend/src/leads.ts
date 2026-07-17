import { type Request, type Response, Router } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { pool } from "./auth.js";

// Endpoint público (sin auth) para el lead magnet de la landing: solo pide
// el mail, sin cuenta ni password — la fricción mínima es el punto.
export const leadsRouter = Router();

const MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

leadsRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const mail = typeof req.body?.mail === "string" ? req.body.mail.trim().toLowerCase() : "";
    if (!MAIL_RE.test(mail)) {
      return res.status(400).json({ error: "El mail no es válido." });
    }

    await pool().query(
      "INSERT INTO leads_informe (mail) VALUES ($1) ON CONFLICT (mail) DO NOTHING",
      [mail],
    );

    return res.status(201).json({ ok: true });
  }),
);
