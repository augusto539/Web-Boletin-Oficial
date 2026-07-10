import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await login(mail, contrasena);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos iniciar sesión.");
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
        <h1 className="text-3xl font-bold">Ingresar</h1>
        <p className="mt-2 text-sm text-carbon/60">Accedé a tu cuenta de INGcome.</p>

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
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="password" className="block text-sm font-bold">
                Contraseña
              </label>
              <Link
                to="/olvide-contrasena"
                className="text-xs text-carbon/50 underline-offset-4 hover:text-vino hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full rounded-xl border border-carbon/15 px-4 py-3 outline-none transition-colors focus:border-vino"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-vino/10 p-4 text-sm text-vino">{error}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full cursor-pointer rounded-full bg-vino py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-carbon/60">
          ¿No tenés cuenta?{" "}
          <Link to="/registro" className="font-bold text-vino underline-offset-4 hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}
