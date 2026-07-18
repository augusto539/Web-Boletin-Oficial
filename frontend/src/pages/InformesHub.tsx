import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FuenteDatos } from "../components/FuenteDatos";
import { Reveal } from "../components/Reveal";
import { obtenerAniosDisponibles } from "../lib/informesApi";

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
          backgroundImage: "radial-gradient(circle, rgba(105,24,36,0.16) 1.5px, transparent 1.5px)",
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
            Estadísticas de sociedades constituidas en Mendoza, con fuente citada en cada dato —
            del mismo Boletín Oficial que alimenta toda la base.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-12 text-2xl font-bold">Estudios</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Link
              to="/informes/departamentos-mas-activos"
              className="block rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-vino">Departamentos más activos</h3>
              <p className="mt-2 text-sm text-carbon/60">
                Ranking de departamentos por cantidad de sociedades constituidas.
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

        <Reveal delay={0.22}>
          <div className="mt-12">
            <FuenteDatos />
          </div>
        </Reveal>
      </div>
    </main>
  );
}
