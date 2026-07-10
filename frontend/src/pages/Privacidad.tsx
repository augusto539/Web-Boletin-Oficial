import { Link } from "react-router-dom";
import { EMAIL_BAJA_DATOS } from "../lib/constantes";

export default function Privacidad() {
  return (
    <main className="bg-humo px-6 pt-32 pb-20">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 md:p-14">
        <h1 className="text-4xl font-bold">Privacidad</h1>
        <p className="mt-2 text-sm text-carbon/50">Última actualización: julio de 2026.</p>

        <div className="mt-10 space-y-8 leading-relaxed text-carbon/80">
          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Qué datos manejamos</h2>
            <p>Distinguimos dos tipos de datos, con tratamiento distinto:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Datos de sociedades y personas físicas</strong>: nombre, CUIT/DNI,
                domicilio y participaciones societarias publicadas por el Boletín Oficial de
                Mendoza. Son datos ya públicos por su propia naturaleza — el Boletín los publicó
                primero, nosotros los estructuramos.
              </li>
              <li>
                <strong>Datos de cuenta</strong>: si te registrás, guardamos tu nombre y mail (la
                contraseña se guarda hasheada, nunca en texto plano). Si dejás tu mail para el
                informe trimestral, lo guardamos solo para ese envío.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Para qué usamos cada dato</h2>
            <p>
              Los datos de sociedades y personas se usan para el propósito del sitio: búsqueda,
              fichas y red de vínculos. Tu mail de cuenta se usa para el login y, si programás una
              notificación, para avisarte. El mail del informe trimestral se usa solo para mandarte
              ese informe cuando sale.
            </p>
            <p className="mt-3">No vendemos ni compartimos tu mail con terceros.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Sesión y cookies</h2>
            <p>
              Usamos dos cookies técnicas para mantener tu sesión iniciada (un token de acceso
              corto y uno de renovación). No usamos cookies de rastreo ni de publicidad.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">
              Tus derechos sobre datos personales publicados
            </h2>
            <p>
              Conforme a la Ley 25.326 de Protección de Datos Personales, si tu nombre o el de tu
              sociedad aparece en el sitio, tenés derecho a acceder, rectificar, actualizar o pedir
              la supresión de esa información. Podés ejercerlo escribiendo a{" "}
              <a href={`mailto:${EMAIL_BAJA_DATOS}`} className="font-bold text-vino underline underline-offset-4">
                {EMAIL_BAJA_DATOS}
              </a>
              . Respondemos y damos de baja el dato de nuestra base en un plazo razonable — el dato
              original publicado por el Boletín Oficial no depende de nosotros y sigue existiendo
              en esa fuente.
            </p>
            <p className="mt-3 text-sm text-carbon/50">
              La Agencia de Acceso a la Información Pública (AAIP) es la autoridad de control en
              materia de protección de datos personales y el organismo ante el cual podés
              presentar una queja si considerás que no dimos curso a tu pedido.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Cuánto tiempo guardamos los datos</h2>
            <p>
              Los datos de cuenta se guardan mientras la cuenta exista. Los mails del informe
              trimestral, hasta que pidas la baja. Los datos de sociedades/personas se actualizan
              siguiendo al Boletín Oficial (altas, bajas y modificaciones societarias).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Contacto</h2>
            <p>
              Cualquier consulta sobre esta política:{" "}
              <a href={`mailto:${EMAIL_BAJA_DATOS}`} className="font-bold text-vino underline underline-offset-4">
                {EMAIL_BAJA_DATOS}
              </a>
              . Ver también{" "}
              <Link to="/terminos" className="font-bold text-vino underline-offset-4 hover:underline">
                Términos de uso
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
