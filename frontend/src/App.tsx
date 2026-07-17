import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { RutaAdmin } from "./components/RutaAdmin";
import { RutaSoloAdminSiActivo } from "./components/RutaSoloAdminSiActivo";
import { iniciarAnalytics, trackPageview } from "./lib/analytics";
import { lenis } from "./lib/scroll";
import Admin from "./pages/Admin";
import AdminUsuario from "./pages/AdminUsuario";
import BusquedaAvanzada from "./pages/BusquedaAvanzada";
import Exploracion from "./pages/Exploracion";
import InformeAnuario from "./pages/InformeAnuario";
import InformeDepartamentosActivos from "./pages/InformeDepartamentosActivos";
import InformesHub from "./pages/InformesHub";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
// import Notificaciones from "./pages/Notificaciones"; // desactivado por ahora
import OlvideContrasena from "./pages/OlvideContrasena";
import Persona from "./pages/Persona";
import Privacidad from "./pages/Privacidad";
import Registro from "./pages/Registro";
import Terminos from "./pages/Terminos";
import RestablecerContrasena from "./pages/RestablecerContrasena";
import Sociedad from "./pages/Sociedad";

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
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
        <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
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
        <Route path="/informes/departamentos-mas-activos" element={<InformeDepartamentosActivos />} />
        <Route path="/informes/:anuarioSlug" element={<InformeAnuario />} />
        {/* <Route path="/notificaciones" element={<Notificaciones />} /> desactivado por ahora */}
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
    </>
  );
}
