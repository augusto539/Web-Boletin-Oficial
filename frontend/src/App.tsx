import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { RutaAdmin } from "./components/RutaAdmin";
import { RutaSoloAdminSiActivo } from "./components/RutaSoloAdminSiActivo";
import { iniciarAnalytics, trackPageview } from "./lib/analytics";
import { lenis } from "./lib/scroll";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Landing y NotFound van con import estático (arrancan con la app: Landing
// es la ruta de entrada de la enorme mayoría de las visitas, NotFound es el
// catch-all y pesa casi nada). El resto de las páginas se cargan bajo
// demanda: antes estaban todas importadas arriba, así que quien entraba a
// "/" pagaba por bajar el código de los 10 informes de nicho, el panel de
// admin, etc. aunque nunca los visitara.
const Admin = lazy(() => import("./pages/Admin"));
const AdminUsuario = lazy(() => import("./pages/AdminUsuario"));
const BusquedaAvanzada = lazy(() => import("./pages/BusquedaAvanzada"));
const Exploracion = lazy(() => import("./pages/Exploracion"));
const InformeActividadesClae = lazy(
  () => import("./pages/InformeActividadesClae"),
);
const InformeAnalisisRedes = lazy(() => import("./pages/InformeAnalisisRedes"));
const InformeAnuario = lazy(() => import("./pages/InformeAnuario"));
const InformeDepartamentosActivos = lazy(
  () => import("./pages/InformeDepartamentosActivos"),
);
const InformeMujeresFundadoras = lazy(
  () => import("./pages/InformeMujeresFundadoras"),
);
const InformeNichoBodegasBoutique = lazy(
  () => import("./pages/InformeNichoBodegasBoutique"),
);
const InformeNichoCannabis = lazy(() => import("./pages/InformeNichoCannabis"));
const InformeNichoCriptoFintech = lazy(
  () => import("./pages/InformeNichoCriptoFintech"),
);
const InformeNichoEnergiaRenovable = lazy(
  () => import("./pages/InformeNichoEnergiaRenovable"),
);
const InformeNichoArquitectura = lazy(
  () => import("./pages/InformeNichoArquitectura"),
);
const InformeNichoCafe = lazy(() => import("./pages/InformeNichoCafe"));
const InformeNichoCerveza = lazy(() => import("./pages/InformeNichoCerveza"));
const InformeNichoReciclaje = lazy(
  () => import("./pages/InformeNichoReciclaje"),
);
const InformeNichoFideicomisos = lazy(
  () => import("./pages/InformeNichoFideicomisos"),
);
const InformeNichoAgenciasViajes = lazy(
  () => import("./pages/InformeNichoAgenciasViajes"),
);
const InformeNichoSeguridadPrivada = lazy(
  () => import("./pages/InformeNichoSeguridadPrivada"),
);
const InformeNichoEnoturismo = lazy(
  () => import("./pages/InformeNichoEnoturismo"),
);
const InformeNichoServiciosProfesionales = lazy(
  () => import("./pages/InformeNichoServiciosProfesionales"),
);
const InformeNichoSoftware = lazy(() => import("./pages/InformeNichoSoftware"));
const InformesHub = lazy(() => import("./pages/InformesHub"));
const Login = lazy(() => import("./pages/Login"));
const Notificaciones = lazy(() => import("./pages/Notificaciones"));
const OlvideContrasena = lazy(() => import("./pages/OlvideContrasena"));
const Persona = lazy(() => import("./pages/Persona"));
const Privacidad = lazy(() => import("./pages/Privacidad"));
const Registro = lazy(() => import("./pages/Registro"));
const Terminos = lazy(() => import("./pages/Terminos"));
const RestablecerContrasena = lazy(
  () => import("./pages/RestablecerContrasena"),
);
const Sociedad = lazy(() => import("./pages/Sociedad"));

function CargandoRuta() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-carbon/50">Cargando…</p>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    iniciarAnalytics();
  }, []);

  // Al cambiar de página, volver arriba (inmediato, sin animación).
  useEffect(() => {
    lenis.scrollTo(0, { immediate: true });
    trackPageview(pathname);
  }, [pathname]);

  return (
    <>
      <Nav />
      {/* El Footer va DENTRO del Suspense a propósito. Si queda afuera, se
          pinta junto al fallback (que mide ~400px) y después, cuando llega
          el chunk de la ruta y se renderiza el contenido real (varios miles
          de px), el footer se va de golpe hacia abajo. Ese salto era casi
          todo el CLS de las páginas con contenido largo: PageSpeed lo
          atribuía 100% al <footer>, justamente porque es el único elemento
          que existe en los dos frames y cambia de posición. Adentro del
          Suspense el footer no se pinta hasta que el contenido está listo,
          y aparecer por primera vez no cuenta como layout shift. */}
      <Suspense fallback={<CargandoRuta />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
          <Route
            path="/restablecer-contrasena"
            element={<RestablecerContrasena />}
          />
          <Route path="/sociedad/:id" element={<Sociedad />} />
          <Route path="/persona/:id" element={<Persona />} />
          <Route
            path="/busqueda-avanzada"
            element={
              <RutaSoloAdminSiActivo>
                <BusquedaAvanzada />
              </RutaSoloAdminSiActivo>
            }
          />
          <Route
            path="/exploracion"
            element={
              <RutaSoloAdminSiActivo>
                <Exploracion />
              </RutaSoloAdminSiActivo>
            }
          />
          <Route
            path="/exploracion/:tipo/:id"
            element={
              <RutaSoloAdminSiActivo>
                <Exploracion />
              </RutaSoloAdminSiActivo>
            }
          />
          <Route path="/informes" element={<InformesHub />} />
          <Route
            path="/informes/departamentos-mas-activos"
            element={<InformeDepartamentosActivos />}
          />
          <Route
            path="/informes/nicho-cannabis"
            element={<InformeNichoCannabis />}
          />
          <Route
            path="/informes/nicho-enoturismo"
            element={<InformeNichoEnoturismo />}
          />
          <Route
            path="/informes/nicho-bodegas-boutique"
            element={<InformeNichoBodegasBoutique />}
          />
          <Route
            path="/informes/nicho-energia-renovable"
            element={<InformeNichoEnergiaRenovable />}
          />
          <Route
            path="/informes/nicho-cripto-fintech"
            element={<InformeNichoCriptoFintech />}
          />
          <Route
            path="/informes/nicho-software"
            element={<InformeNichoSoftware />}
          />
          <Route
            path="/informes/nicho-servicios-profesionales"
            element={<InformeNichoServiciosProfesionales />}
          />
          <Route
            path="/informes/nicho-arquitectura"
            element={<InformeNichoArquitectura />}
          />
          <Route path="/informes/nicho-cafe" element={<InformeNichoCafe />} />
          <Route
            path="/informes/nicho-cerveza"
            element={<InformeNichoCerveza />}
          />
          <Route
            path="/informes/nicho-reciclaje"
            element={<InformeNichoReciclaje />}
          />
          <Route
            path="/informes/nicho-fideicomisos"
            element={<InformeNichoFideicomisos />}
          />
          <Route
            path="/informes/nicho-agencias-viajes"
            element={<InformeNichoAgenciasViajes />}
          />
          <Route
            path="/informes/nicho-seguridad-privada"
            element={<InformeNichoSeguridadPrivada />}
          />
          <Route
            path="/informes/mujeres-fundadoras"
            element={<InformeMujeresFundadoras />}
          />
          <Route
            path="/informes/actividades-clae"
            element={<InformeActividadesClae />}
          />
          <Route
            path="/informes/analisis-redes"
            element={<InformeAnalisisRedes />}
          />
          <Route path="/informes/:anuarioSlug" element={<InformeAnuario />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route
            path="/admin"
            element={
              <RutaAdmin>
                <Admin />
              </RutaAdmin>
            }
          />
          <Route
            path="/admin/usuarios/:id"
            element={
              <RutaAdmin>
                <AdminUsuario />
              </RutaAdmin>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!pathname.startsWith("/exploracion") && <Footer />}
      </Suspense>
    </>
  );
}
