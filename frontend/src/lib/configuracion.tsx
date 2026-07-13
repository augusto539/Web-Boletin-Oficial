import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

interface ConfiguracionContextValue {
  modoSoloAdmin: boolean;
  // true hasta resolver el valor real al cargar la app (evita parpadeos:
  // mostrar y al toque ocultar un botón).
  cargando: boolean;
}

const ConfiguracionContext = createContext<ConfiguracionContextValue | null>(null);

// Público (sin sesión): todos los visitantes necesitan saber si el modo está
// activo para decidir qué ocultar, no solo los admins.
export function ConfiguracionProvider({ children }: { children: ReactNode }) {
  const [modoSoloAdmin, setModoSoloAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/configuracion`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { modoSoloAdmin: false }))
      .then((data) => setModoSoloAdmin(Boolean(data.modoSoloAdmin)))
      .catch(() => setModoSoloAdmin(false))
      .finally(() => setCargando(false));
  }, []);

  return (
    <ConfiguracionContext.Provider value={{ modoSoloAdmin, cargando }}>
      {children}
    </ConfiguracionContext.Provider>
  );
}

export function useConfiguracion(): ConfiguracionContextValue {
  const ctx = useContext(ConfiguracionContext);
  if (!ctx) throw new Error("useConfiguracion debe usarse dentro de <ConfiguracionProvider>");
  return ctx;
}
