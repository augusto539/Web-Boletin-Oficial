import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { scrollToSection } from "../lib/scroll";
import { Logo } from "./Logo";

const SECCIONES = [
  { id: "nosotros", etiqueta: "Nosotros" },
  { id: "faq", etiqueta: "Preguntas frecuentes" },
];

export function Nav() {
  const [conFondo, setConFondo] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { usuario, cargando, logout } = useAuth();

  async function cerrarSesion() {
    await logout();
    navigate("/");
  }

  useEffect(() => {
    const onScroll = () => setConFondo(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function irASeccion(id: string) {
    if (pathname === "/") {
      scrollToSection(`#${id}`);
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  }

  // Sobre el hero bordó la nav es transparente con texto blanco; al scrollear
  // (o fuera de la landing) pasa a blanco con texto oscuro.
  const claro = pathname === "/" && !conFondo;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        claro ? "bg-transparent" : "bg-white/95 shadow-sm backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link to="/" aria-label="INGcome, inicio">
          <Logo claro={claro} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/busqueda-avanzada"
            className={`text-sm transition-opacity hover:opacity-70 ${
              claro ? "text-white" : "text-carbon"
            }`}
          >
            Búsqueda avanzada
          </Link>
          <Link
            to="/notificaciones"
            className={`text-sm transition-opacity hover:opacity-70 ${
              claro ? "text-white" : "text-carbon"
            }`}
          >
            Notificaciones
          </Link>
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              onClick={() => irASeccion(s.id)}
              className={`cursor-pointer text-sm transition-opacity hover:opacity-70 ${
                claro ? "text-white" : "text-carbon"
              }`}
            >
              {s.etiqueta}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {cargando ? null : usuario ? (
            <>
              {usuario.admin && (
                <Link
                  to="/admin"
                  className={`px-2 py-2 text-sm transition-opacity hover:opacity-70 ${
                    claro ? "text-white" : "text-carbon"
                  }`}
                >
                  Admin
                </Link>
              )}
              <span className={`text-sm font-bold ${claro ? "text-white" : "text-carbon"}`}>
                {usuario.nombre}
              </span>
              <button
                onClick={cerrarSesion}
                className={`cursor-pointer rounded-full px-5 py-2 text-sm font-bold transition-transform hover:scale-105 ${
                  claro ? "bg-white text-vino" : "bg-vino text-white"
                }`}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-4 py-2 text-sm transition-opacity hover:opacity-70 ${
                  claro ? "text-white" : "text-carbon"
                }`}
              >
                Ingresar
              </Link>
              <Link
                to="/registro"
                className={`rounded-full px-5 py-2 text-sm font-bold transition-transform hover:scale-105 ${
                  claro ? "bg-white text-vino" : "bg-vino text-white"
                }`}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
