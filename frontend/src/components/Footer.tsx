import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { EMAIL_BAJA_DATOS, FUENTES } from "../lib/constantes";

export function Footer() {
  return (
    <footer className="bg-carbon text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <Logo claro />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Información societaria de Mendoza, estructurada a partir de fuentes públicas.
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <Link to="/terminos" className="text-white/60 underline-offset-4 hover:underline">
              Términos
            </Link>
            <Link to="/privacidad" className="text-white/60 underline-offset-4 hover:underline">
              Privacidad
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-white/40">
            Fuentes de información
          </h3>
          <ul className="space-y-2 text-sm">
            {FUENTES.map((f) => (
              <li key={f.url}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 underline-offset-4 hover:underline"
                >
                  {f.nombre} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-white/40">
            Protección de datos
          </h3>
          <p className="text-sm leading-relaxed text-white/60">
            Conforme a la Ley 25.326 de Protección de Datos Personales, podés solicitar la baja de
            tu información personal escribiendo a{" "}
            <a href={`mailto:${EMAIL_BAJA_DATOS}`} className="text-white/90 underline underline-offset-4">
              {EMAIL_BAJA_DATOS}
            </a>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/40">
        <p>INGcome Consultora — Hecho en Mendoza con datos públicos.</p>
        <p className="mt-1">
          Sitio independiente. No afiliado al Gobierno de Mendoza ni al Boletín Oficial.
        </p>
      </div>
    </footer>
  );
}
