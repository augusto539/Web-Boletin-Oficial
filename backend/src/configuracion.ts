import { type Request, type Response, Router } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { pool } from "./auth.js";

// Cache en memoria: el middleware que bloquea búsqueda avanzada/exploración
// en server.ts corre en CADA request a /graphql, así que no puede pagar una
// consulta a la base por request. Se hidrata al bootear (cargarConfiguracion)
// y se actualiza al toque cuando un admin cambia el valor (PATCH acá abajo);
// no hay múltiples instancias del server compartiendo este proceso, así que
// no hace falta invalidación entre procesos.
let modoSoloAdminCache = false;

export function modoSoloAdminActivo(): boolean {
  return modoSoloAdminCache;
}

export async function cargarConfiguracion(): Promise<void> {
  const { rows } = await pool().query<{ valor: boolean }>(
    "SELECT valor FROM configuraciones WHERE clave = 'modo_solo_admin'",
  );
  modoSoloAdminCache = rows[0]?.valor ?? false;
}

// Público, sin auth: el frontend lo consulta para TODOS los visitantes (no
// solo admins) y decide qué ocultar. El valor en sí no es sensible.
export const configuracionPublicaRouter = Router();
configuracionPublicaRouter.get("/", (_req: Request, res: Response) => {
  res.json({ modoSoloAdmin: modoSoloAdminCache });
});

// Montado bajo /api/admin, ya pasa por requireAdmin() (ver server.ts).
export const configuracionAdminRouter = Router();

configuracionAdminRouter.get("/configuracion", (_req: Request, res: Response) => {
  res.json({ modoSoloAdmin: modoSoloAdminCache });
});

configuracionAdminRouter.patch(
  "/configuracion",
  asyncHandler(async (req: Request, res: Response) => {
    const modoSoloAdmin = req.body?.modoSoloAdmin;
    if (typeof modoSoloAdmin !== "boolean") {
      return res.status(400).json({ error: "Falta el campo modoSoloAdmin (boolean)." });
    }
    await pool().query(
      "UPDATE configuraciones SET valor = $1, actualizado_el = now() WHERE clave = 'modo_solo_admin'",
      [modoSoloAdmin],
    );
    modoSoloAdminCache = modoSoloAdmin;
    return res.json({ modoSoloAdmin: modoSoloAdminCache });
  }),
);
