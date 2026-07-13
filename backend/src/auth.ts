import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { type CookieOptions, type NextFunction, type Request, type Response, Router } from "express";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { enviarBienvenida, enviarResetContrasena } from "./mail.js";

// Backend de auth: endpoints REST propios (registro/login/refresh/logout/me),
// separados de la API GraphQL de solo lectura. Usa el rol boletin_auth, el
// único con permiso para tocar las tablas usuarios y sesiones.
//
// El pool se crea perezosamente (en el primer request), no al importar el
// módulo: server.ts carga el .env DESPUÉS de importar este archivo, así que si
// leyéramos process.env acá arriba tomaríamos valores vacíos al correr local.
let poolSingleton: Pool | null = null;
export function pool(): Pool {
  if (!poolSingleton) {
    poolSingleton = new Pool({ connectionString: process.env.DATABASE_URL_AUTH });
  }
  return poolSingleton;
}

export function jwtSecret(): string {
  return process.env.JWT_SECRET ?? "dev_jwt_secret_cambiar_en_produccion";
}

// Access token corto: si se roba, la ventana de uso es chica. El refresh token
// (largo, rotado en cada uso) es el que sostiene la sesión.
const ACCESS_TTL = "15m";
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD = 8;
const RESET_TTL_MS = 60 * 60 * 1000; // 1 hora

interface UsuarioRow {
  id: string;
  mail: string;
  contrasena_hash: string;
  nombre: string;
  plan: string;
  admin: boolean;
}

// Lo que devolvemos al frontend / metemos en el JWT: nunca el hash.
export interface UsuarioPublico {
  id: string;
  mail: string;
  nombre: string;
  plan: string;
  admin: boolean;
}

function usuarioPublico(u: UsuarioRow): UsuarioPublico {
  return { id: u.id, mail: u.mail, nombre: u.nombre, plan: u.plan, admin: u.admin };
}

function firmarAccessToken(u: UsuarioPublico): string {
  return jwt.sign(u, jwtSecret(), { subject: u.id, expiresIn: ACCESS_TTL });
}

// El refresh token viaja en crudo al cliente (en la cookie); en la base
// guardamos solo su sha256, así un dump de la tabla no expone tokens usables.
function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

async function crearSesion(usuarioId: string): Promise<string> {
  const raw = randomBytes(32).toString("hex");
  const expira = new Date(Date.now() + REFRESH_TTL_MS);
  await pool().query(
    "INSERT INTO sesiones (usuario_id, token_hash, expira_el) VALUES ($1, $2, $3)",
    [usuarioId, hashToken(raw), expira],
  );
  return raw;
}

const esProd = process.env.NODE_ENV === "production";

// SameSite lax alcanza porque front (5173) y back (5050) comparten dominio
// (localhost): son cross-origin pero same-site. Secure solo en prod, para que
// en dev sobre http las cookies igual se manden.
const cookieBase: CookieOptions = {
  httpOnly: true,
  secure: esProd,
  sameSite: "lax",
};

function setCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("access_token", accessToken, { ...cookieBase, path: "/" });
  // El refresh token solo se manda a /api/auth (refresh y logout), no al resto.
  res.cookie("refresh_token", refreshToken, {
    ...cookieBase,
    path: "/api/auth",
    maxAge: REFRESH_TTL_MS,
  });
}

function clearCookies(res: Response) {
  res.clearCookie("access_token", { ...cookieBase, path: "/" });
  res.clearCookie("refresh_token", { ...cookieBase, path: "/api/auth" });
}

const MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authRouter = Router();

authRouter.post("/registro", async (req: Request, res: Response) => {
  const nombre = typeof req.body?.nombre === "string" ? req.body.nombre.trim() : "";
  const mail = typeof req.body?.mail === "string" ? req.body.mail.trim().toLowerCase() : "";
  const contrasena = typeof req.body?.contrasena === "string" ? req.body.contrasena : "";

  if (!nombre) return res.status(400).json({ error: "Falta el nombre." });
  if (!MAIL_RE.test(mail)) return res.status(400).json({ error: "El mail no es válido." });
  if (contrasena.length < MIN_PASSWORD) {
    return res.status(400).json({ error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` });
  }

  const hash = await bcrypt.hash(contrasena, BCRYPT_ROUNDS);
  try {
    const { rows } = await pool().query<UsuarioRow>(
      `INSERT INTO usuarios (mail, contrasena_hash, nombre)
       VALUES ($1, $2, $3)
       RETURNING id, mail, contrasena_hash, nombre, plan, admin`,
      [mail, hash, nombre],
    );
    const usuario = usuarioPublico(rows[0]);
    const refresh = await crearSesion(usuario.id);
    setCookies(res, firmarAccessToken(usuario), refresh);
    // No se espera (ni bloquea la respuesta): enviarBienvenida nunca lanza,
    // así que si Resend falla el alta de cuenta igual se completa.
    void enviarBienvenida(usuario);
    return res.status(201).json({ usuario });
  } catch (err: unknown) {
    // 23505 = unique_violation (mail ya registrado).
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "23505") {
      return res.status(409).json({ error: "Ya existe una cuenta con ese mail." });
    }
    console.error("Error en registro:", err);
    return res.status(500).json({ error: "No pudimos crear la cuenta." });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const mail = typeof req.body?.mail === "string" ? req.body.mail.trim().toLowerCase() : "";
  const contrasena = typeof req.body?.contrasena === "string" ? req.body.contrasena : "";

  const { rows } = await pool().query<UsuarioRow>(
    "SELECT id, mail, contrasena_hash, nombre, plan, admin FROM usuarios WHERE mail = $1",
    [mail],
  );
  const fila = rows[0];
  // Mensaje genérico a propósito: no revelamos si el mail existe o no.
  const invalido = () => res.status(401).json({ error: "Mail o contraseña incorrectos." });
  if (!fila) return invalido();

  const ok = await bcrypt.compare(contrasena, fila.contrasena_hash);
  if (!ok) return invalido();

  const usuario = usuarioPublico(fila);
  const refresh = await crearSesion(usuario.id);
  setCookies(res, firmarAccessToken(usuario), refresh);
  return res.json({ usuario });
});

authRouter.post("/refresh", async (req: Request, res: Response) => {
  const raw = req.cookies?.refresh_token;
  if (typeof raw !== "string" || !raw) {
    return res.status(401).json({ error: "Sin sesión." });
  }

  const { rows } = await pool().query<{
    id: string;
    usuario_id: string;
    expira_el: string;
    revocada_el: string | null;
  }>("SELECT id, usuario_id, expira_el, revocada_el FROM sesiones WHERE token_hash = $1", [
    hashToken(raw),
  ]);
  const sesion = rows[0];
  if (!sesion) {
    clearCookies(res);
    return res.status(401).json({ error: "Sesión inválida." });
  }

  // Reuso: llegó un refresh token ya rotado/cerrado. Puede ser un token robado;
  // por las dudas cerramos todas las sesiones del usuario.
  if (sesion.revocada_el) {
    await pool().query("UPDATE sesiones SET revocada_el = now() WHERE usuario_id = $1 AND revocada_el IS NULL", [
      sesion.usuario_id,
    ]);
    clearCookies(res);
    return res.status(401).json({ error: "Sesión inválida." });
  }

  if (new Date(sesion.expira_el) < new Date()) {
    clearCookies(res);
    return res.status(401).json({ error: "Sesión expirada." });
  }

  const { rows: urows } = await pool().query<UsuarioRow>(
    "SELECT id, mail, contrasena_hash, nombre, plan, admin FROM usuarios WHERE id = $1",
    [sesion.usuario_id],
  );
  if (!urows[0]) {
    clearCookies(res);
    return res.status(401).json({ error: "Sesión inválida." });
  }

  // Rotación: se invalida el refresh usado y se emite uno nuevo.
  await pool().query("UPDATE sesiones SET revocada_el = now() WHERE id = $1", [sesion.id]);
  const usuario = usuarioPublico(urows[0]);
  const nuevoRefresh = await crearSesion(usuario.id);
  setCookies(res, firmarAccessToken(usuario), nuevoRefresh);
  return res.json({ usuario });
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  const raw = req.cookies?.refresh_token;
  if (typeof raw === "string" && raw) {
    await pool().query("UPDATE sesiones SET revocada_el = now() WHERE token_hash = $1 AND revocada_el IS NULL", [
      hashToken(raw),
    ]);
  }
  clearCookies(res);
  return res.json({ ok: true });
});

authRouter.get("/me", async (req: Request, res: Response) => {
  const token = req.cookies?.access_token;
  if (typeof token !== "string" || !token) {
    return res.status(401).json({ error: "Sin sesión." });
  }
  let sub: string;
  try {
    const payload = jwt.verify(token, jwtSecret()) as { sub?: string };
    if (!payload.sub) throw new Error("sin sub");
    sub = payload.sub;
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }

  // Se relee de la base (no se confía en los claims) para que plan/admin estén
  // siempre frescos, clave para el guard de /admin.
  const { rows } = await pool().query<UsuarioRow>(
    "SELECT id, mail, contrasena_hash, nombre, plan, admin FROM usuarios WHERE id = $1",
    [sub],
  );
  if (!rows[0]) return res.status(401).json({ error: "Sin sesión." });
  return res.json({ usuario: usuarioPublico(rows[0]) });
});

authRouter.post("/olvide-contrasena", async (req: Request, res: Response) => {
  const mail = typeof req.body?.mail === "string" ? req.body.mail.trim().toLowerCase() : "";

  // Mensaje genérico siempre: no se filtra si el mail está registrado o no,
  // ni si el envío del mail funcionó (mismo criterio que /login).
  const mensaje = {
    ok: true,
    mensaje: "Si existe una cuenta con ese mail, te enviamos un link para restablecer la contraseña.",
  };

  if (!MAIL_RE.test(mail)) return res.json(mensaje);

  const { rows } = await pool().query<UsuarioRow>(
    "SELECT id, mail, contrasena_hash, nombre, plan, admin FROM usuarios WHERE mail = $1",
    [mail],
  );
  const fila = rows[0];
  if (fila) {
    const raw = randomBytes(32).toString("hex");
    const expira = new Date(Date.now() + RESET_TTL_MS);
    await pool().query(
      "INSERT INTO resets_contrasena (usuario_id, token_hash, expira_el) VALUES ($1, $2, $3)",
      [fila.id, hashToken(raw), expira],
    );
    const link = `${process.env.FRONTEND_URL ?? "http://localhost:5173"}/restablecer-contrasena?token=${raw}`;
    void enviarResetContrasena(usuarioPublico(fila), link);
  }

  return res.json(mensaje);
});

authRouter.post("/restablecer-contrasena", async (req: Request, res: Response) => {
  const token = typeof req.body?.token === "string" ? req.body.token : "";
  const contrasenaNueva = typeof req.body?.contrasenaNueva === "string" ? req.body.contrasenaNueva : "";

  if (!token) return res.status(400).json({ error: "Falta el token." });
  if (contrasenaNueva.length < MIN_PASSWORD) {
    return res.status(400).json({ error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` });
  }

  const { rows } = await pool().query<{
    id: string;
    usuario_id: string;
    expira_el: string;
    usado_el: string | null;
  }>("SELECT id, usuario_id, expira_el, usado_el FROM resets_contrasena WHERE token_hash = $1", [
    hashToken(token),
  ]);
  const fila = rows[0];
  const invalido = () => res.status(400).json({ error: "El link es inválido o ya venció." });
  if (!fila || fila.usado_el || new Date(fila.expira_el) < new Date()) return invalido();

  const hash = await bcrypt.hash(contrasenaNueva, BCRYPT_ROUNDS);
  await pool().query("UPDATE usuarios SET contrasena_hash = $1 WHERE id = $2", [hash, fila.usuario_id]);
  await pool().query("UPDATE resets_contrasena SET usado_el = now() WHERE id = $1", [fila.id]);
  // Cambio de contraseña: se cierran todas las sesiones activas por seguridad
  // (si alguien más tenía acceso con la contraseña vieja, queda afuera).
  await pool().query(
    "UPDATE sesiones SET revocada_el = now() WHERE usuario_id = $1 AND revocada_el IS NULL",
    [fila.usuario_id],
  );

  return res.json({ ok: true });
});

// Guard para rutas admin (ver admin.ts). Repite la lógica de /me a propósito:
// nunca confía en los claims del JWT para el flag admin, siempre relee la
// base, así una promoción/degradación a admin surte efecto en el próximo
// request, no recién cuando expire el access token.
declare module "express-serve-static-core" {
  interface Request {
    usuario?: UsuarioPublico;
  }
}

// Compartido por requireUsuario() y requireAdmin(): nunca confía en los
// claims del JWT más allá del id (sub), siempre relee la base para que
// plan/admin estén frescos (clave para que una promoción/degradación a admin
// surta efecto en el próximo request, no recién cuando expire el access token).
export async function usuarioDesdeToken(token: unknown): Promise<UsuarioRow | null> {
  if (typeof token !== "string" || !token) return null;
  let sub: string;
  try {
    const payload = jwt.verify(token, jwtSecret()) as { sub?: string };
    if (!payload.sub) throw new Error("sin sub");
    sub = payload.sub;
  } catch {
    return null;
  }

  const { rows } = await pool().query<UsuarioRow>(
    "SELECT id, mail, contrasena_hash, nombre, plan, admin FROM usuarios WHERE id = $1",
    [sub],
  );
  return rows[0] ?? null;
}

// Guard para rutas que solo requieren sesión (cualquier usuario logueado),
// como registrar historial de búsquedas.
export function requireUsuario() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const fila = await usuarioDesdeToken(req.cookies?.access_token);
    if (!fila) return res.status(401).json({ error: "Sin sesión." });
    req.usuario = usuarioPublico(fila);
    next();
  };
}

export function requireAdmin() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const fila = await usuarioDesdeToken(req.cookies?.access_token);
    if (!fila) return res.status(401).json({ error: "Sin sesión." });
    if (!fila.admin) return res.status(403).json({ error: "No autorizado." });

    req.usuario = usuarioPublico(fila);
    next();
  };
}
