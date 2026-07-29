import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useConfiguracion } from "../lib/configuracion";
import { scrollToSection } from "../lib/scroll";
import { CerrarIcon } from "./CerrarIcon";
import { Logo } from "./Logo";
import { MenuIcon } from "./MenuIcon";

const SECCIONES = [{ id: "faq", etiqueta: "Preguntas frecuentes" }];

export function Nav() {
  const [conFondo, setConFondo] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { usuario, cargando, logout } = useAuth();
  const { modoSoloAdmin } = useConfiguracion();
  const puedeVerBusquedaAvanzada = !modoSoloAdmin || usuario?.admin;

  async function cerrarSesion() {
    setMenuAbierto(false);
    await logout();
    navigate("/");
  }

  useEffect(() => {
    const onScroll = () => setConFondo(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cambiar de página con el menú mobile abierto lo dejaría tapando la
  // página siguiente.
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  function irASeccion(id: string) {
    setMenuAbierto(false);
    if (pathname === "/") {
      scrollToSection(`#${id}`);
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  }

  // Sobre el hero bordó la nav es transparente con texto blanco; al scrollear
  // (o fuera de la landing, o con el menú mobile abierto) pasa a blanco con
  // texto oscuro.
  const claro = pathname === "/" && !conFondo && !menuAbierto;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        claro ? "bg-transparent" : "bg-white/95 shadow-sm backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link to="/" aria-label="INGcome, inicio">
          <Logo claro={claro} className="h-25 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {puedeVerBusquedaAvanzada && (
            <Link
              to="/busqueda-avanzada"
              className={`text-sm transition-opacity hover:opacity-70 ${
                claro ? "text-white" : "text-carbon"
              }`}
            >
              Búsqueda avanzada
            </Link>
          )}
          <Link
            to="/informes"
            className={`text-sm transition-opacity hover:opacity-70 ${
              claro ? "text-white" : "text-carbon"
            }`}
          >
            Informes
          </Link>
          {/* <Link
            to="/notificaciones"
            className={`text-sm transition-opacity hover:opacity-70 ${
              claro ? "text-white" : "text-carbon"
            }`}
          >
            Notificaciones
          </Link> desactivado por ahora */}
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

        <div className="hidden items-center gap-3 md:flex">
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

        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          className={`flex cursor-pointer text-2xl md:hidden ${claro ? "text-white" : "text-carbon"}`}
        >
          {menuAbierto ? <CerrarIcon /> : <MenuIcon />}
        </button>
      </nav>

      {menuAbierto && (
        <div className="border-t border-carbon/10 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col">
            {puedeVerBusquedaAvanzada && (
              <Link
                to="/busqueda-avanzada"
                className="rounded-xl px-3 py-3 text-sm text-carbon hover:bg-humo"
              >
                Búsqueda avanzada
              </Link>
            )}
            <Link to="/informes" className="rounded-xl px-3 py-3 text-sm text-carbon hover:bg-humo">
              Informes
            </Link>
            {SECCIONES.map((s) => (
              <button
                key={s.id}
                onClick={() => irASeccion(s.id)}
                className="cursor-pointer rounded-xl px-3 py-3 text-left text-sm text-carbon hover:bg-humo"
              >
                {s.etiqueta}
              </button>
            ))}
          </div>

          <div className="mt-2 border-t border-carbon/10 pt-3">
            {cargando ? null : usuario ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm font-bold text-carbon">{usuario.nombre}</span>
                  {usuario.admin && (
                    <Link to="/admin" className="text-sm text-vino underline-offset-4 hover:underline">
                      Admin
                    </Link>
                  )}
                </div>
                <button
                  onClick={cerrarSesion}
                  className="cursor-pointer rounded-full bg-vino px-5 py-2.5 text-sm font-bold text-white"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="rounded-xl px-3 py-3 text-sm text-carbon hover:bg-humo">
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  className="rounded-full bg-vino px-5 py-2.5 text-center text-sm font-bold text-white"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
