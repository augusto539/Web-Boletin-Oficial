import type { ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

// Guard de /admin: exige sesión con admin=true. El flag admin sale de /me, que
// lo relee de la base en cada carga (no de un claim viejo del token), así que
// es confiable. Igual, la protección real vive en el backend: esto es solo UX
// (todavía no hay endpoints admin que consumir).
export function RutaAdmin({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-20">
        <p className="text-carbon/50">Cargando…</p>
      </main>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!usuario.admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-20">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold">No autorizado</h1>
          <p className="mt-3 text-carbon/60">
            Esta sección es solo para administradores.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block rounded-full bg-vino px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
