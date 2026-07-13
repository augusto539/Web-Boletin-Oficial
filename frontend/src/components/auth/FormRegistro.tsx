import { type FormEvent, useState } from "react";
import { useAuth } from "../../lib/auth";

// Extraído de pages/Registro.tsx para reusar tanto en la página completa
// como en ModalRegistro (gate de descargas) sin duplicar la lógica del
// formulario. onExito reemplaza el navigate("/") fijo que tenía antes: cada
// caller decide qué hacer al terminar (ir a home, cerrar un modal y
// disparar una acción pendiente, etc).
export function FormRegistro({ onExito }: { onExito: () => void }) {
  const { registro } = useAuth();
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await registro(nombre, mail, contrasena);
      onExito();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos crear la cuenta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-bold">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-xl border border-carbon/15 px-4 py-3 outline-none transition-colors focus:border-vino"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="registro-mail" className="mb-1.5 block text-sm font-bold">
          Mail
        </label>
        <input
          id="registro-mail"
          type="email"
          required
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          className="w-full rounded-xl border border-carbon/15 px-4 py-3 outline-none transition-colors focus:border-vino"
          placeholder="tu@mail.com"
        />
      </div>
      <div>
        <label htmlFor="registro-password" className="mb-1.5 block text-sm font-bold">
          Contraseña
        </label>
        <input
          id="registro-password"
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
        {enviando ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
