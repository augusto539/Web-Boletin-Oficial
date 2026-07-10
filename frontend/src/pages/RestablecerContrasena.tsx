import { type FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Logo } from "../components/Logo";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

export default function RestablecerContrasena() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const res = await fetch(`${API}/api/auth/restablecer-contrasena`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, contrasenaNueva: contrasena }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No pudimos restablecer la contraseña.");
      setListo(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos restablecer la contraseña.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-20 pb-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-carbon/5">
        <Link to="/" className="mb-8 block w-fit">
          <Logo />
        </Link>
        <h1 className="text-3xl font-bold">Elegir nueva contraseña</h1>

        {!token ? (
          <p className="mt-8 rounded-xl bg-vino/10 p-4 text-sm text-vino">
            Este link no es válido. Pedí uno nuevo desde{" "}
            <Link to="/olvide-contrasena" className="font-bold underline-offset-4 hover:underline">
              recuperar contraseña
            </Link>
            .
          </p>
        ) : listo ? (
          <>
            <p className="mt-2 mb-8 text-sm text-carbon/60">
              Listo, ya podés ingresar con tu contraseña nueva.
            </p>
            <Link
              to="/login"
              className="block w-full cursor-pointer rounded-full bg-vino py-3.5 text-center text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Ingresar
            </Link>
          </>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-bold">
                Contraseña nueva
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full rounded-xl border border-carbon/15 px-4 py-3 outline-none transition-colors focus:border-vino"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            {error && <p className="rounded-xl bg-vino/10 p-4 text-sm text-vino">{error}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="w-full cursor-pointer rounded-full bg-vino py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
