import { Link, useNavigate } from "react-router-dom";
import { FormRegistro } from "../components/auth/FormRegistro";
import { Logo } from "../components/Logo";

export default function Registro() {
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-bold">Crear cuenta</h1>
        <p className="mt-2 text-sm text-carbon/60">
          Registrate para acceder a búsquedas ilimitadas y la red de vínculos completa.
        </p>

        <div className="mt-8">
          <FormRegistro onExito={() => navigate("/")} />
        </div>

        <p className="mt-6 text-center text-sm text-carbon/60">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="font-bold text-vino underline-offset-4 hover:underline">
            Ingresá
          </Link>
        </p>
      </div>
    </main>
  );
}
