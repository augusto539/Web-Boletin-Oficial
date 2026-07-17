import { useEffect, useState } from "react";
import { DescargarIcon } from "../components/DescargarIcon";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import { fecha } from "../lib/format";
import { type DepartamentoActivo, obtenerDepartamentosActivos } from "../lib/informesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeDepartamentosActivos() {
  const [datos, setDatos] = useState<{ departamentos: DepartamentoActivo[]; actualizadoEl: string | null } | null>(
    null,
  );
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  useEffect(() => {
    obtenerDepartamentosActivos()
      .then(setDatos)
      .catch(() => setDatos({ departamentos: [], actualizadoEl: null }));
  }, []);

  async function descargar() {
    if (!datos) return;
    setGenerando(true);
    try {
      const { exportarDepartamentosPDF } = await import("../lib/exportarInforme");
      await exportarDepartamentosPDF(datos.departamentos, datos.actualizadoEl);
    } finally {
      setGenerando(false);
    }
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
              <h1 className="text-4xl font-bold md:text-5xl">Departamentos más activos en Mendoza</h1>
              <p className="mt-3 max-w-2xl text-lg text-carbon/60">
                Ranking de departamentos por cantidad de sociedades constituidas, con la actividad
                del último año.
              </p>
              {datos?.actualizadoEl && (
                <p className="mt-2 text-sm text-carbon/50">Actualizado el {fecha(datos.actualizadoEl)}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => ejecutar(descargar)}
              disabled={!datos || generando}
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
          <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm">
            {!datos ? (
              <p className="p-8 text-center text-sm text-carbon/50">Cargando…</p>
            ) : datos.departamentos.length === 0 ? (
              <p className="p-8 text-center text-sm text-carbon/50">
                Todavía no hay datos suficientes para este informe.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-humo text-xs tracking-wider text-carbon/50 uppercase">
                  <tr>
                    <th className="px-6 py-4">Departamento</th>
                    <th className="px-6 py-4">Sociedades (histórico)</th>
                    <th className="px-6 py-4">Último año</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.departamentos.map((d) => (
                    <tr key={d.departamentoId} className="border-t border-carbon/10">
                      <td className="px-6 py-4 font-bold">{d.nombre}</td>
                      <td className="px-6 py-4">{d.cantidadSociedades}</td>
                      <td className="px-6 py-4">{d.cantidadUltimoAnio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
