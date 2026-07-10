import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { RutaAdmin } from "./components/RutaAdmin";
import { lenis } from "./lib/scroll";
import Admin from "./pages/Admin";
import BusquedaAvanzada from "./pages/BusquedaAvanzada";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Notificaciones from "./pages/Notificaciones";
import OlvideContrasena from "./pages/OlvideContrasena";
import Persona from "./pages/Persona";
import Privacidad from "./pages/Privacidad";
import Registro from "./pages/Registro";
import Terminos from "./pages/Terminos";
import RestablecerContrasena from "./pages/RestablecerContrasena";
import Sociedad from "./pages/Sociedad";

export default function App() {
  const { pathname } = useLocation();

  // Al cambiar de página, volver arriba (inmediato, sin animación).
  useEffect(() => {
    lenis.scrollTo(0, { immediate: true });
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
        <Route path="/busqueda-avanzada" element={<BusquedaAvanzada />} />
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
      </Routes>
      <Footer />
    </>
  );
}
