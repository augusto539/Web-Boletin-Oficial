import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoDona } from "../components/GraficoDona";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import { registrarDescarga } from "../lib/descargasApi";
import { dato, fecha } from "../lib/format";
import { type Anuario, obtenerAnuario } from "../lib/informesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

const VINO = "#691824";
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
// Paleta para el donut de tipo societario -- "Otros" (agrupado en el
// backend, ver informes.ts) siempre en gris, el resto rota sobre esta lista.
const PALETA_TIPO_SOCIEDAD = ["#691824", "#4b5259", "#b0473f", "#8a8f93", "#5f7a61"];
const GRIS_OTROS = "#c9c9c9";

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

  const datosMeses = useMemo(
    () =>
      anuario?.meses.map((m) => ({
        etiqueta: MESES[m.mes - 1]!,
        valor: m.cantidad,
        color: VINO,
      })) ?? [],
    [anuario],
  );

  const datosTipoSociedad = useMemo(
    () =>
      anuario?.tipoSociedad.map((t, i) => ({
        etiqueta: t.tipo,
        valor: t.cantidad,
        color: t.tipo === "Otros" ? GRIS_OTROS : PALETA_TIPO_SOCIEDAD[i % PALETA_TIPO_SOCIEDAD.length]!,
      })) ?? [],
    [anuario],
  );

  const mapaDepartamentos = useMemo(
    () => new Map(anuario?.departamentos.map((d) => [d.nombre, d.cantidad]) ?? []),
    [anuario],
  );

  async function descargar() {
    if (!anuario) return;
    setGenerando(true);
    try {
      const { exportarAnuarioPDF } = await import("../lib/exportarInforme");
      await exportarAnuarioPDF(anuario);
      registrarDescarga("informe_anuario", "pdf", anuario.anio, `Anuario ${anuario.anio}`);
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
        <Reveal inmediato>
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

        {anuario && (
          <>
            <Reveal delay={0.2}>
              <div className="mt-10">
                <GraficoBarras
                  titulo="Distribución mensual"
                  subtitulo="Sociedades constituidas por mes"
                  datos={datosMeses}
                  etiquetaUnidad="sociedades"
                />
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-10">
                <MapaMendoza
                  titulo="Distribución territorial"
                  subtitulo="Sociedades constituidas por departamento"
                  valorPorNombre={mapaDepartamentos}
                />
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10">
                <GraficoDona
                  titulo="Tipo de sociedad"
                  subtitulo="Distribución por forma societaria"
                  datos={datosTipoSociedad}
                  etiquetaUnidad="sociedades"
                />
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-lg font-bold">Actividades más frecuentes</h2>
                <p className="mt-1 text-sm text-carbon/60">
                  Top 10 grupos CLAE por cantidad de sociedades constituidas
                </p>
                <ol className="mt-5 space-y-3">
                  {anuario.actividadesTop10.map((a, i) => (
                    <li key={a.grupoClae} className="flex items-baseline gap-3 text-sm">
                      <span className="w-5 shrink-0 font-bold text-vino">{i + 1}</span>
                      <span className="flex-1 text-carbon">{a.grupoClae}</span>
                      <span className="shrink-0 font-bold text-carbon/60">{a.cantidad}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </>
        )}

        <Reveal delay={0.4}>
          <div className="mt-10">
            <FuenteDatos />
          </div>
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
