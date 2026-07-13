import { useState } from "react";
import { createPortal } from "react-dom";
import { CerrarIcon } from "../CerrarIcon";
import { FormLogin } from "./FormLogin";
import { FormRegistro } from "./FormRegistro";

// Gate de sesión in-place: se usa junto con useAccionConSesion() para pedir
// cuenta antes de una acción (ej. descargar) SIN navegar a /registro o
// /login. Es la pieza clave para que la vista de Exploración del grafo no
// pierda su estado (nodos expandidos, posiciones) al pedir registro — como
// el componente de atrás nunca se desmonta, no hay nada que perder ni que
// restaurar.
//
// Se monta con un portal directo a document.body a propósito: quien lo usa
// (ej. DescargarFicha en el header bordó "text-white" de Sociedad/Persona)
// puede tener cualquier color de texto ambiente, y sin portal el modal
// heredaba ese color — título y labels blancos sobre fondo blanco,
// invisibles. Portal = el modal nunca depende del contexto CSS de donde se
// llama.
export function ModalRegistro({
  titulo = "Registrate gratis para descargar",
  onExito,
  onCerrar,
}: {
  titulo?: string;
  onExito: () => void;
  onCerrar: () => void;
}) {
  const [modo, setModo] = useState<"registro" | "login">("registro");

  return createPortal(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/60 px-6 text-carbon backdrop-blur-sm"
      onClick={onCerrar}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute top-6 right-6 cursor-pointer text-xl text-carbon/40 transition-colors hover:text-carbon"
        >
          <CerrarIcon />
        </button>

        <h2 className="pr-8 text-2xl font-bold">
          {modo === "registro" ? titulo : "Iniciá sesión para continuar"}
        </h2>
        <p className="mt-2 text-sm text-carbon/60">
          {modo === "registro"
            ? "Creá tu cuenta gratis y seguimos justo donde estabas."
            : "Ingresá con tu cuenta y seguimos justo donde estabas."}
        </p>

        <div className="mt-6">
          {modo === "registro" ? <FormRegistro onExito={onExito} /> : <FormLogin onExito={onExito} />}
        </div>

        <p className="mt-6 text-center text-sm text-carbon/60">
          {modo === "registro" ? (
            <>
              ¿Ya tenés cuenta?{" "}
              <button
                type="button"
                onClick={() => setModo("login")}
                className="cursor-pointer font-bold text-vino underline-offset-4 hover:underline"
              >
                Iniciá sesión
              </button>
            </>
          ) : (
            <>
              ¿No tenés cuenta?{" "}
              <button
                type="button"
                onClick={() => setModo("registro")}
                className="cursor-pointer font-bold text-vino underline-offset-4 hover:underline"
              >
                Registrate
              </button>
            </>
          )}
        </p>
      </div>
    </div>,
    document.body,
  );
}
