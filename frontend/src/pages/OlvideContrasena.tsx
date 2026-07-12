import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

export default function OlvideContrasena() {
  const [mail, setMail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await fetch(`${API}/api/auth/olvide-contrasena`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail }),
      });
      const data = await res.json();
      // La respuesta es siempre el mismo mensaje genérico exista o no la
      // cuenta, a propósito: no queremos filtrar qué mails están registrados.
      setMensaje(data.mensaje ?? "Si existe una cuenta con ese mail, te enviamos un link.");
    } catch {
      setMensaje("No pudimos procesar el pedido. Probá de nuevo en un rato.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-humo px-6 pt-20 pb-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(105,24,36,0.16) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(black, transparent 80%)",
        }}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-carbon/5">
        <Link to="/" className="mb-8 block w-fit">
          <Logo variante="imagotipo" className="h-5 w-auto" />
        </Link>
        <h1 className="text-3xl font-bold">Recuperar contraseña</h1>
        <p className="mt-2 text-sm text-carbon/60">
          Ingresá tu mail y te enviamos un link para elegir una contraseña nueva.
        </p>

        {mensaje ? (
          <p className="mt-8 rounded-xl bg-humo p-4 text-sm text-carbon/70">{mensaje}</p>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-bold">
                Mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                className="w-full rounded-xl border border-carbon/15 px-4 py-3 outline-none transition-colors focus:border-vino"
                placeholder="tu@mail.com"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full cursor-pointer rounded-full bg-vino py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? "Enviando…" : "Enviar link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-carbon/60">
          <Link to="/login" className="font-bold text-vino underline-offset-4 hover:underline">
            Volver a ingresar
          </Link>
        </p>
      </div>
    </main>
  );
}
