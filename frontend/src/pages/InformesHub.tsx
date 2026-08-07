import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FuenteDatos } from "../components/FuenteDatos";
import { Reveal } from "../components/Reveal";
import { obtenerAniosDisponibles } from "../lib/informesApi";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

// Informes de nicho: a diferencia de "Estudios" y "Anuarios" (tablas
// precomputadas), estos son contenido estático (texto + cifras ya
// redactados a mano) — ver InformeNichoCannabis.tsx. La lista se actualiza
// a mano acá cada vez que se agrega uno nuevo.
const NICHOS = [
  {
    slug: "cannabis",
    nombre: "Cannabis y Cáñamo en Mendoza",
    descripcion: "Entidades registradas en el Boletín Oficial, 2017–2026.",
  },
  {
    slug: "enoturismo",
    nombre: "Enoturismo en Mendoza",
    descripcion: "El negocio detrás de la Ruta del Vino, 2017–2026.",
  },
  {
    slug: "bodegas-boutique",
    nombre: "Bodegas Boutique en Mendoza",
    descripcion: "La otra vitivinicultura mendocina, 2017–2026.",
  },
  {
    slug: "energia-renovable",
    nombre: "Energía Solar y Eólica en Mendoza",
    descripcion: "Dos olas, un mismo objetivo, 2017–2026.",
  },
  {
    slug: "cripto-fintech",
    nombre: "Cripto y Fintech en Mendoza",
    descripcion: "El termómetro del boom, 2017–2026.",
  },
  {
    slug: "software",
    nombre: "Desarrollo de Software en Mendoza",
    descripcion: "El sector que estuvo ahí desde el primer día, 2017–2026.",
  },
  {
    slug: "servicios-profesionales",
    nombre: "Abogados, Contadores y Escribanos en Mendoza",
    descripcion: "Los profesionales que fabrican empresas, 2017–2026.",
  },
  {
    slug: "arquitectura",
    nombre: "Arquitectura en Mendoza",
    descripcion: "27 estudios y una profesión de asociación media, 2017–2026.",
  },
  {
    slug: "cafe",
    nombre: "Café de Especialidad en Mendoza",
    descripcion:
      "Crecimiento sostenido, sin el boom ni el colapso de la cerveza artesanal, 2017–2026.",
  },
  {
    slug: "cerveza",
    nombre: "Cerveza Artesanal en Mendoza",
    descripcion: "Un boom de tres años que no volvió a repetirse, 2017–2026.",
  },
  {
    slug: "reciclaje",
    nombre: "Reciclaje y Economía Circular en Mendoza",
    descripcion:
      'De la chatarrería al "impacto ambiental" como marca, 2017–2026.',
  },
];

export default function InformesHub() {
  const [anios, setAnios] = useState<number[]>([]);

  useEffect(() => {
    obtenerAniosDisponibles()
      .then((d) => setAnios(d.anios))
      .catch(() => setAnios([]));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-humo px-6 pt-32 pb-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(105,24,36,0.16) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(black, transparent 80%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <h1 className="text-4xl font-bold md:text-5xl">Informes</h1>
          <p className="mt-3 max-w-2xl text-lg text-carbon/60">
            Estadísticas de sociedades constituidas en Mendoza, con fuente
            citada en cada dato — del mismo Boletín Oficial que alimenta toda la
            base.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-12 text-2xl font-bold">Estudios</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Link
              to="/informes/departamentos-mas-activos"
              className="block rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-vino">
                Departamentos más activos
              </h3>
              <p className="mt-2 text-sm text-carbon/60">
                Ranking de departamentos por cantidad de sociedades
                constituidas.
              </p>
            </Link>
            <Link
              to="/informes/mujeres-fundadoras"
              className="block rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-vino">
                Las Mujeres que Fundan Empresas en Mendoza
              </h3>
              <p className="mt-2 text-sm text-carbon/60">
                Una brecha que no se cierra, y que se agranda cuanto más arriba
                se mira.
              </p>
            </Link>
            <Link
              to="/informes/analisis-redes"
              className="block rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-vino">
                El Mapa Oculto de las Sociedades Mendocinas
              </h3>
              <p className="mt-2 text-sm text-carbon/60">
                Análisis de redes: un archipiélago de doce mil islas que se
                conecta por los domicilios, no por las personas.
              </p>
            </Link>
            <Link
              to="/informes/actividades-clae"
              className="block rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-vino">
                Qué hacen realmente las empresas mendocinas
              </h3>
              <p className="mt-2 text-sm text-carbon/60">
                Anatomía del nomenclador CLAE: cajones de sastre, clusters y
                especialización territorial.
              </p>
            </Link>
          </div>
        </Reveal>

        {NICHOS.length > 0 && (
          <Reveal delay={0.12}>
            <h2 className="mt-12 text-2xl font-bold">Nichos sectoriales</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {NICHOS.map((n) => (
                <Link
                  key={n.slug}
                  to={`/informes/nicho-${n.slug}`}
                  className="block rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-vino">{n.nombre}</h3>
                  <p className="mt-2 text-sm text-carbon/60">{n.descripcion}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {anios.length > 0 && (
          <Reveal delay={0.16}>
            <h2 className="mt-12 text-2xl font-bold">Anuarios</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {anios.map((anio) => (
                <Link
                  key={anio}
                  to={`/informes/anuario-${anio}`}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-carbon shadow-sm transition-colors hover:bg-vino hover:text-white"
                >
                  Anuario {anio}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.18}>
          <div className="mt-12">
            <PedirInforme />
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-12">
            <FuenteDatos />
          </div>
        </Reveal>
      </div>
    </main>
  );
}

function PedirInforme() {
  const [texto, setTexto] = useState("");
  const [mail, setMail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "listo" | "error">(
    "idle",
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    try {
      const res = await fetch(`${API}/api/solicitudes-informe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, mail: mail || undefined }),
      });
      if (!res.ok) throw new Error();
      setEstado("listo");
      setTexto("");
      setMail("");
    } catch {
      setEstado("error");
    }
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">¿Qué informe estás buscando?</h2>
      <p className="mt-2 max-w-xl text-carbon/60">
        Si hay un rubro, un dato o una zona de Mendoza que te gustaría ver
        analizado, contanos — estos informes se eligen en buena parte por lo que
        nos piden.
      </p>

      {estado === "listo" ? (
        <p className="mt-6 rounded-2xl bg-humo p-6 font-bold text-carbon">
          Gracias, lo tenemos anotado.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <textarea
            required
            rows={3}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej: un informe sobre logística y transporte en Mendoza"
            className="w-full rounded-2xl border border-carbon/15 px-4 py-3 text-carbon outline-none focus:border-vino"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder="Tu mail (opcional, para avisarte cuando salga)"
              className="w-full flex-1 rounded-full border border-carbon/15 px-5 py-3 text-carbon outline-none focus:border-vino"
            />
            <button
              type="submit"
              disabled={estado === "enviando"}
              className="shrink-0 cursor-pointer rounded-full bg-vino px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-vino-oscuro disabled:cursor-not-allowed disabled:opacity-60"
            >
              {estado === "enviando" ? "Enviando…" : "Pedir informe"}
            </button>
          </div>
        </form>
      )}
      {estado === "error" && (
        <p className="mt-3 text-sm text-carbon/50">
          No pudimos guardar el pedido. Probá de nuevo en un rato.
        </p>
      )}
    </div>
  );
}
