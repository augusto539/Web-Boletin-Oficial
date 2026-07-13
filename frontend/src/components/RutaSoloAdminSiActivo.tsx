import type { ReactNode } from "react";
import { useAuth } from "../lib/auth";
import { useConfiguracion } from "../lib/configuracion";
import NotFound from "../pages/NotFound";

// Guard para rutas que el "modo solo administradores" (tab Configuración de
// /admin) puede apagar para el público en general: mientras el toggle esté
// activo, solo un admin ve la ruta, cualquier otro visitante ve el mismo 404
// genérico (misma lógica de "no revelar que existe" que RutaAdmin). Con el
// toggle apagado (el default) esto es un pasamanos transparente.
//
// La protección real es el middleware de server.ts que bloquea estas mismas
// operaciones a nivel GraphQL — esto es solo para no dejar la UI accesible.
export function RutaSoloAdminSiActivo({ children }: { children: ReactNode }) {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const { modoSoloAdmin, cargando: cargandoConfig } = useConfiguracion();

  if (cargandoAuth || cargandoConfig) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-20">
        <p className="text-carbon/50">Cargando…</p>
      </main>
    );
  }

  if (modoSoloAdmin && !usuario?.admin) {
    return <NotFound />;
  }

  return <>{children}</>;
}
