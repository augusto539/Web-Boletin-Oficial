import { useRef, useState } from "react";
import { useAuth } from "./auth";

// Envuelve "ejecutá esto, pero si no hay sesión, pedí cuenta primero" en un
// solo lugar, para no duplicar esa lógica en cada botón de descarga
// (DescargarFicha, GrafoExploracion). Ver ModalRegistro.tsx para el porqué
// de resolverlo con un modal in-place en vez de navegar a /registro.
export function useAccionConSesion() {
  const { usuario } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const accionPendienteRef = useRef<(() => void) | null>(null);

  function ejecutar(accion: () => void) {
    if (usuario) {
      accion();
      return;
    }
    accionPendienteRef.current = accion;
    setModalAbierto(true);
  }

  function alExito() {
    setModalAbierto(false);
    const accion = accionPendienteRef.current;
    accionPendienteRef.current = null;
    // Deja que el modal termine de cerrarse antes de disparar la descarga.
    setTimeout(() => accion?.(), 0);
  }

  function cerrar() {
    accionPendienteRef.current = null;
    setModalAbierto(false);
  }

  return { modalAbierto, ejecutar, alExito, cerrar };
}
