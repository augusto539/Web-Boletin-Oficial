import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";

// Extraído de pages/Login.tsx — mismo criterio que FormRegistro.tsx.
export function FormLogin({ onExito }: { onExito: () => void }) {
  const { login } = useAuth();
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
      onExito();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos iniciar sesión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div>
        <label htmlFor="login-mail" className="mb-1.5 block text-sm font-bold">
          Mail
        </label>
        <input
          id="login-mail"
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
          <label htmlFor="login-password" className="block text-sm font-bold">
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
          id="login-password"
          type="password"
          required
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full rounded-xl border border-carbon/15 px-4 py-3 outline-none transition-colors focus:border-vino"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="rounded-xl bg-vino/10 p-4 text-sm text-vino">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="w-full cursor-pointer rounded-full bg-vino py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
