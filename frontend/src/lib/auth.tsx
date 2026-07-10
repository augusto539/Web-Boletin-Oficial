import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

// Base del backend de auth (REST). Mismo host que la API GraphQL, distinto
// path (/api/auth). credentials: "include" en todos los fetch para que viajen
// las cookies httpOnly de sesión.
const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

export interface Usuario {
  id: string;
  mail: string;
  nombre: string;
  plan: string;
  admin: boolean;
}

interface AuthContextValue {
  usuario: Usuario | null;
  // true hasta que resolvemos si hay sesión al cargar la app (evita parpadeos
  // y redirecciones prematuras en las rutas protegidas).
  cargando: boolean;
  login: (mail: string, contrasena: string) => Promise<void>;
  registro: (nombre: string, mail: string, contrasena: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function leerError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.error === "string" ? data.error : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar: intenta /me; si el access token expiró (401), prueba un
  // /refresh y reintenta una vez. Si nada funciona, no hay sesión.
  const cargarSesion = useCallback(async () => {
    try {
      let res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
      if (res.status === 401) {
        const ref = await fetch(`${API}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (ref.ok) {
          res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
        }
      }
      if (res.ok) {
        const { usuario } = await res.json();
        setUsuario(usuario);
      } else {
        setUsuario(null);
      }
    } catch {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarSesion();
  }, [cargarSesion]);

  const login = useCallback(async (mail: string, contrasena: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, contrasena }),
    });
    if (!res.ok) throw new Error(await leerError(res, "No pudimos iniciar sesión."));
    const { usuario } = await res.json();
    setUsuario(usuario);
  }, []);

  const registro = useCallback(async (nombre: string, mail: string, contrasena: string) => {
    const res = await fetch(`${API}/api/auth/registro`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, mail, contrasena }),
    });
    if (!res.ok) throw new Error(await leerError(res, "No pudimos crear la cuenta."));
    const { usuario } = await res.json();
    setUsuario(usuario);
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
