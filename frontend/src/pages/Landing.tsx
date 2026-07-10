import { useQuery } from "@apollo/client/react";
import { motion } from "framer-motion";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CountUp } from "../components/CountUp";
import { GrafoSociedad } from "../components/GrafoSociedad";
import { Reveal } from "../components/Reveal";
import { SearchBox } from "../components/SearchBox";
import { SplitText } from "../components/SplitText";
import { Ticker } from "../components/Ticker";
import { EMAIL_BAJA_DATOS, FUENTES } from "../lib/constantes";
import { fecha } from "../lib/format";
import { ESTADISTICAS_LANDING, type DataEstadisticasLanding } from "../lib/queries";
import { scrollToSection } from "../lib/scroll";

// Sociedad real con red rica (19 vínculos) que usamos como demo en vivo del
// grafo — no es un mock, es el mismo componente que ve cualquier usuario en
// /sociedad/1051.
const SOCIEDAD_DEMO_ID = "1051";
const SOCIEDAD_DEMO_NOMBRE = "Grupo Mdd S.A.S.";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    const destino = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (destino) {
      const timer = setTimeout(() => scrollToSection(`#${destino}`), 120);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <Ticker />
      <NumerosEnVivo />
      <QueEncontras />
      <PorQueAca />
      <ParaQuien />
      <LeadMagnet />
      <DatosPublicos />
      <Faq />
    </>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-vino px-6 pt-24 pb-16 text-white">
      <motion.svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute -right-10 -bottom-10 h-[420px] w-[420px] opacity-10"
        initial={{ opacity: 0, x: -40, y: 40 }}
        animate={{ opacity: 0.1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        aria-hidden="true"
      >
        <path d="M20 80 L70 30 M70 30 H40 M70 30 V60" stroke="white" strokeWidth="7" fill="none" />
      </motion.svg>

      <div className="mx-auto w-full max-w-7xl">
        <motion.p
          className="mb-6 text-sm uppercase tracking-[0.3em] text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Información pública, estructurada
        </motion.p>

        <h1 className="max-w-4xl text-5xl leading-[1.05] font-bold md:text-7xl">
          <SplitText texto="Quién es socio de quién" delay={0.15} />
          <br />
          <SplitText texto="en Mendoza" delay={0.55} className="text-white/60" />
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/80"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          Sociedades, socios, autoridades y actos publicados en el Boletín Oficial de Mendoza
          desde 2017. Cada dato con link a su fuente. Gratis durante la beta.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          <p className="mb-2.5 text-sm font-bold text-white/70">
            Buscá por razón social, nombre o CUIT/DNI
          </p>
          <SearchBox sobreOscuro />
        </motion.div>
      </div>
    </section>
  );
}

function NumerosEnVivo() {
  const { data, loading } = useQuery<DataEstadisticasLanding>(ESTADISTICAS_LANDING);
  const ultimoBoletin = data?.allBoletines.nodes[0]?.fecha;

  return (
    <section id="datos" className="bg-humo px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-5xl">La base, en números</h2>
          <p className="mt-2 text-sm text-carbon/50">
            Datos desde 2017.{" "}
            {ultimoBoletin && `Actualizado al boletín del ${fecha(ultimoBoletin)}.`}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <Reveal delay={0.05}>
            <article className="h-full rounded-3xl bg-white p-8">
              <p className="text-5xl font-bold text-vino">
                {loading ? "…" : <CountUp valor={data?.allSociedades.totalCount ?? 0} />}
              </p>
              <p className="mt-3 text-carbon/70">sociedades registradas</p>
            </article>
          </Reveal>
          <Reveal delay={0.12}>
            <article className="h-full rounded-3xl bg-white p-8">
              <p className="text-5xl font-bold text-vino">
                {loading ? "…" : <CountUp valor={data?.allPersonasFisicas.totalCount ?? 0} />}
              </p>
              <p className="mt-3 text-carbon/70">personas con participación societaria</p>
            </article>
          </Reveal>
          <Reveal delay={0.19}>
            <article className="h-full rounded-3xl bg-white p-8">
              <p className="text-5xl font-bold text-vino">
                {loading ? "…" : <CountUp valor={data?.allActos.totalCount ?? 0} />}
              </p>
              <p className="mt-3 text-carbon/70">actos societarios publicados</p>
            </article>
          </Reveal>
          <Reveal delay={0.26}>
            <article className="flex h-full flex-col justify-center rounded-3xl bg-vino p-8 text-white">
              <p className="text-2xl leading-tight font-bold">
                {ultimoBoletin ? fecha(ultimoBoletin) : "…"}
              </p>
              <p className="mt-3 text-white/70">fecha del último boletín cargado</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const BLOQUES_QUE_ENCONTRAS = [
  {
    titulo: "Ficha completa de sociedad",
    texto: "Socios, autoridades, capital, objeto social y departamento — todo en una página.",
  },
  {
    titulo: "Ficha de persona",
    texto: "Todas las sociedades de las que alguien es o fue socio, en un solo lugar.",
  },
  {
    titulo: "Historial de actos",
    texto: "Constituciones, cesiones, aumentos de capital — cada uno con link al PDF del boletín original.",
  },
];

function QueEncontras() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-5xl">Qué encontrás</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {BLOQUES_QUE_ENCONTRAS.map((b, i) => (
            <Reveal key={b.titulo} delay={i * 0.08}>
              <article className="h-full rounded-3xl bg-humo p-8">
                <h3 className="text-xl font-bold">{b.titulo}</h3>
                <p className="mt-3 leading-relaxed text-carbon/70">{b.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-6 rounded-3xl bg-humo p-8">
            <h3 className="text-xl font-bold">Red de vínculos navegable</h3>
            <p className="mt-3 overflow-x-auto text-nowrap leading-relaxed text-carbon/70">
              Quién es socio de quién, y a través de qué otras empresas. Esta es la red real de{" "}
              <Link
                to={`/sociedad/${SOCIEDAD_DEMO_ID}`}
                className="font-bold text-vino underline-offset-4 hover:underline"
              >
                {SOCIEDAD_DEMO_NOMBRE}
              </Link>{" "}
              — probala, se puede tocar.
            </p>
            <div className="mt-6">
              <GrafoSociedad sociedadId={SOCIEDAD_DEMO_ID} nombre={SOCIEDAD_DEMO_NOMBRE} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mt-8 text-center text-sm font-bold text-carbon/50">
            Cada dato con su fuente citada.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PorQueAca() {
  return (
    <section className="bg-carbon px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-5xl">Por qué acá y no en otro lado</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/80">
            <p>
              Los buscadores nacionales se alimentan de registros nacionales (IGJ, Boletín Oficial
              de la Nación). Pero las sociedades mendocinas publican sus actos en el Boletín
              Oficial de Mendoza.
            </p>
            <p>Nosotros leemos esa fuente, boletín por boletín.</p>
            <p>
              Por eso acá encontrás socios y actos de empresas que en otros lados figuran como una
              cáscara vacía.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const SEGMENTOS = [
  {
    para: "Estudios contables",
    texto: "Verificá la composición societaria de tu cliente o contraparte antes de firmar.",
  },
  {
    para: "Escribanías y abogados",
    texto: "Historial de actos con fuente citada para tu due diligence.",
  },
  {
    para: "Prospección comercial",
    texto: "Encontrá las SAS nuevas de tu rubro apenas se constituyen.",
  },
];

function ParaQuien() {
  return (
    <section className="bg-humo px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-5xl">Para quién</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SEGMENTOS.map((s, i) => (
            <Reveal key={s.para} delay={i * 0.08}>
              <article className="h-full rounded-3xl bg-white p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-vino">{s.para}</p>
                <p className="mt-3 text-lg leading-relaxed text-carbon/80">{s.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadMagnet() {
  const [mail, setMail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "listo" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    try {
      const res = await fetch(`${API}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail }),
      });
      if (!res.ok) throw new Error();
      setEstado("listo");
    } catch {
      setEstado("error");
    }
  }

  return (
    <section className="bg-vino px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-5xl">Radiografía societaria de Mendoza</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80">
            El informe trimestral con lo que se constituye, en qué rubros y en qué departamentos.
            Dejá tu mail y recibilo cuando salga.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {estado === "listo" ? (
            <p className="mt-8 rounded-2xl bg-white/10 p-6 text-lg font-bold">
              Listo, te avisamos cuando salga el próximo informe.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <input
                type="email"
                required
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="tu@mail.com"
                className="w-full rounded-full bg-white px-5 py-3.5 text-carbon outline-none sm:max-w-xs"
              />
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="cursor-pointer rounded-full bg-carbon px-8 py-3.5 text-sm font-bold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {estado === "enviando" ? "Enviando…" : "Quiero el informe"}
              </button>
            </form>
          )}
          {estado === "error" && (
            <p className="mt-3 text-sm text-white/70">
              No pudimos guardar tu mail. Probá de nuevo en un rato.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function DatosPublicos() {
  return (
    <section id="nosotros" className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <h2 className="text-4xl font-bold md:sticky md:top-28 md:text-5xl">
            Datos públicos, <span className="text-vino">manejados en serio</span>
          </h2>
        </Reveal>

        <div className="space-y-6 text-lg leading-relaxed text-carbon/80">
          <Reveal>
            <p>
              Todo lo que se muestra acá proviene de información que la provincia y la nación
              publican de forma libre:
            </p>
            <ul className="mt-4 space-y-2">
              {FUENTES.map((f) => (
                <li key={f.url}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-vino underline-offset-4 hover:underline"
                  >
                    {f.nombre} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="rounded-2xl bg-humo p-6 text-base text-carbon/70">
              Conforme a la Ley 25.326 de Protección de Datos Personales, cualquier persona puede
              solicitar la rectificación o supresión de su información personal escribiendo a{" "}
              <a
                href={`mailto:${EMAIL_BAJA_DATOS}`}
                className="font-bold text-vino underline underline-offset-4"
              >
                {EMAIL_BAJA_DATOS}
              </a>
              .
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base text-carbon/50">
              Más detalle en{" "}
              <Link to="/terminos" className="font-bold text-vino underline-offset-4 hover:underline">
                Términos de uso
              </Link>{" "}
              y{" "}
              <Link
                to="/privacidad"
                className="font-bold text-vino underline-offset-4 hover:underline"
              >
                Privacidad
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const PREGUNTAS = [
  {
    q: "¿De dónde salen los datos?",
    a: "Del Boletín Oficial de Mendoza, publicación por publicación. Cruzamos cada sociedad con el padrón de ARCA (ex AFIP) para verificar su estado.",
  },
  {
    q: "¿Cada cuánto se actualiza?",
    a: "Todos los días, apenas sale un boletín nuevo. Estamos terminando de cargar el historial completo desde 2017; los boletines nuevos ya se cargan a diario.",
  },
  {
    q: "¿Qué período cubre?",
    a: "Desde 2017.",
  },
  {
    q: "¿Es legal?",
    a: "Sí. Toda la información es la que el Boletín Oficial de Mendoza ya publicó — nosotros la estructuramos y citamos la fuente en cada dato.",
  },
  {
    q: "¿Cómo pido la baja de mis datos?",
    a: `Escribiendo a ${EMAIL_BAJA_DATOS}. Conforme a la Ley 25.326, podés pedir la rectificación o supresión de tu información personal.`,
  },
  {
    q: "¿Va a ser pago?",
    a: "La beta es gratis. Va a haber planes pagos más adelante, y avisamos con tiempo antes de cobrar nada.",
  },
];

function Faq() {
  return (
    <section id="faq" className="bg-humo px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-5xl">Preguntas frecuentes</h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {PREGUNTAS.map((p, i) => (
            <Reveal key={p.q} delay={i * 0.05}>
              <details className="group rounded-2xl bg-white p-6">
                <summary className="cursor-pointer list-none font-bold text-carbon">
                  <span className="flex items-center justify-between gap-4">
                    {p.q}
                    <span className="shrink-0 text-vino transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-carbon/70">{p.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
