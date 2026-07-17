import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import { dato, fecha } from "../lib/format";
import { type Anuario, obtenerAnuario } from "../lib/informesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">{etiqueta}</p>
      <p className="mt-1 text-2xl font-bold text-vino">{valor}</p>
    </div>
  );
}

export default function InformeAnuario() {
  const { anuarioSlug } = useParams<{ anuarioSlug: string }>();
  // La ruta es un segmento único ("/informes/:anuarioSlug"): react-router no
  // matchea segmentos compuestos como "anuario-:anio" contra "anuario-2026",
  // así que el año se extrae acá en vez de en el path de la ruta.
  const anio = anuarioSlug?.match(/^anuario-(\d+)$/)?.[1];
  const [anuario, setAnuario] = useState<Anuario | null | undefined>(undefined);
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  useEffect(() => {
    if (!anio) {
      setAnuario(null);
      return;
    }
    setAnuario(undefined);
    obtenerAnuario(Number(anio))
      .then(setAnuario)
      .catch(() => setAnuario(null));
  }, [anio]);

  async function descargar() {
    if (!anuario) return;
    setGenerando(true);
    try {
      const { exportarAnuarioPDF } = await import("../lib/exportarInforme");
      await exportarAnuarioPDF(anuario);
    } finally {
      setGenerando(false);
    }
  }

  if (anuario === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-18">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-4xl font-bold">No encontramos ese anuario</h1>
          <p className="mt-3 text-carbon/60">Todavía no hay un informe anual para {anio}.</p>
        </div>
      </main>
    );
  }

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
      <div className="relative mx-auto max-w-4xl">
        <Reveal>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">
                Anuario {anio}: sociedades constituidas en Mendoza
              </h1>
              {anuario && (
                <p className="mt-2 text-sm text-carbon/50">Actualizado el {fecha(anuario.actualizadoEl)}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => ejecutar(descargar)}
              disabled={!anuario || generando}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-vino px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-vino-oscuro disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generando ? (
                "Generando…"
              ) : (
                <>
                  <DescargarIcon /> Descargar PDF
                </>
              )}
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {!anuario ? (
            <p className="mt-10 text-center text-sm text-carbon/50">Cargando…</p>
          ) : (
            <div className="mt-10 grid gap-6 rounded-3xl bg-white p-8 shadow-sm sm:grid-cols-2">
              <Dato etiqueta="Sociedades constituidas" valor={String(anuario.sociedadesConstituidas)} />
              <Dato etiqueta="Personas involucradas" valor={String(anuario.personasInvolucradas)} />
              <Dato etiqueta="Actividad más común" valor={dato(anuario.grupoClaeMasActivo)} />
              <Dato etiqueta="Departamento más activo" valor={dato(anuario.departamentoMasActivo)} />
              <Dato etiqueta="Tipo de sociedad más común" valor={dato(anuario.tipoSociedadMasComun)} />
            </div>
          )}
        </Reveal>
      </div>

      {modalAbierto && (
        <ModalRegistro
          titulo="Registrate gratis para descargar"
          onExito={alExito}
          onCerrar={cerrar}
        />
      )}
    </main>
  );
}
