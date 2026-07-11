import { Link } from "react-router-dom";
import { SearchBox } from "../components/SearchBox";

// 404 genérico: también se usa para /admin cuando quien entra no está
// logueado o no es admin — a propósito no distinguimos "no autorizado" de
// "no existe", para no revelar que la ruta existe.
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-18">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-vino">Error 404</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Página no encontrada</h1>
        <p className="mt-3 mb-8 text-carbon/60">
          La página que buscás no existe o el enlace está vencido. Probá buscando una sociedad o
          persona:
        </p>
        <SearchBox mostrarAvanzada={false} />
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
