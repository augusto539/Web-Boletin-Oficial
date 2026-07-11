import type { ReactNode } from "react";
import { useAuth } from "../lib/auth";
import NotFound from "../pages/NotFound";

// Guard de /admin: exige sesión con admin=true. El flag admin sale de /me, que
// lo relee de la base en cada carga (no de un claim viejo del token), así que
// es confiable. Igual, la protección real vive en el backend: esto es solo UX
// (todavía no hay endpoints admin que consumir).
//
// A propósito se muestra el mismo 404 genérico tanto si no hay sesión como si
// no es admin, en vez de un "no autorizado": así no se revela desde afuera
// que /admin existe.
export function RutaAdmin({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-20">
        <p className="text-carbon/50">Cargando…</p>
      </main>
    );
  }

  if (!usuario || !usuario.admin) {
    return <NotFound />;
  }

  return <>{children}</>;
}
