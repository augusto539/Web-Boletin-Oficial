import { Link } from "react-router-dom";
import { EMAIL_BAJA_DATOS } from "../lib/constantes";

export default function Terminos() {
  return (
    <main className="bg-humo px-6 pt-32 pb-20">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 md:p-14">
        <h1 className="text-4xl font-bold">Términos de uso</h1>
        <p className="mt-2 text-sm text-carbon/50">Última actualización: julio de 2026.</p>

        <div className="mt-10 space-y-8 leading-relaxed text-carbon/80">
          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Qué es INGcome</h2>
            <p>
              INGcome estructura y hace buscable información societaria publicada por el Boletín
              Oficial de Mendoza: constituciones, socios, autoridades y actos de sociedades
              comerciales. Cotejamos esos datos con el padrón público de ARCA (ex AFIP).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Origen y naturaleza de los datos</h2>
            <p>
              Todo lo publicado en el sitio proviene de fuentes oficiales de acceso público: el
              Boletín Oficial de Mendoza y el padrón de ARCA. No generamos ni verificamos ese
              contenido — lo estructuramos y citamos su fuente en cada dato.
            </p>
            <p className="mt-3">
              Los datos pueden estar incompletos, desactualizados o contener errores propios de la
              publicación original o de nuestro proceso de extracción. INGcome no garantiza la
              exactitud, integridad ni actualidad de la información, y no debe usarse como único
              respaldo para decisiones legales, comerciales o financieras sin verificar contra la
              fuente oficial.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Uso permitido</h2>
            <p>
              El sitio es de uso libre durante la beta. No está permitido extraer masivamente el
              contenido del sitio (scraping automatizado) para redistribuirlo o revenderlo, ni usar
              la información publicada para hostigar, discriminar o perjudicar a las personas o
              sociedades mencionadas.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Cuentas y planes</h2>
            <p>
              Crear una cuenta es gratuito durante la beta. Más adelante vamos a ofrecer planes
              pagos con funciones adicionales; si eso pasa, avisamos con anticipación y las
              funciones ya disponibles en el plan gratuito no dejan de estarlo sin aviso previo.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Limitación de responsabilidad</h2>
            <p>
              INGcome se ofrece "tal cual". No respondemos por daños derivados del uso de la
              información publicada, incluyendo decisiones tomadas en base a datos incompletos o
              desactualizados. Si encontrás un dato incorrecto, escribinos a{" "}
              <a href={`mailto:${EMAIL_BAJA_DATOS}`} className="font-bold text-vino underline underline-offset-4">
                {EMAIL_BAJA_DATOS}
              </a>{" "}
              y lo revisamos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Cambios a estos términos</h2>
            <p>
              Podemos actualizar estos términos a medida que el producto cambia. Los cambios
              relevantes se van a anunciar en el sitio.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-carbon">Contacto</h2>
            <p>
              Consultas sobre estos términos:{" "}
              <a href={`mailto:${EMAIL_BAJA_DATOS}`} className="font-bold text-vino underline underline-offset-4">
                {EMAIL_BAJA_DATOS}
              </a>
              . Ver también{" "}
              <Link to="/privacidad" className="font-bold text-vino underline-offset-4 hover:underline">
                Privacidad
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
