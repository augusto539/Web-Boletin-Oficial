import { useEffect, useState } from "react";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoLineaDepartamentos } from "../components/GraficoLineaDepartamentos";
import { MapaDepartamentos } from "../components/MapaDepartamentos";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import { fecha } from "../lib/format";
import {
  type DepartamentosActivos,
  type DepartamentosPorAnio,
  obtenerDepartamentosActivos,
  obtenerDepartamentosPorAnio,
} from "../lib/informesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

function porcentaje(parte: number, total: number): string {
  if (total <= 0) return "0";
  return ((parte / total) * 100).toFixed(1);
}

export default function InformeDepartamentosActivos() {
  const [datos, setDatos] = useState<DepartamentosActivos | null>(null);
  const [serie, setSerie] = useState<DepartamentosPorAnio | null>(null);
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  const totalConSinDepartamento = datos
    ? datos.departamentos.reduce((acc, d) => acc + d.cantidadSociedades, 0) + datos.sinDepartamento
    : 0;

  useEffect(() => {
    obtenerDepartamentosActivos()
      .then(setDatos)
      .catch(() => setDatos({ departamentos: [], actualizadoEl: null, sinDepartamento: 0 }));
    obtenerDepartamentosPorAnio()
      .then(setSerie)
      .catch(() => setSerie({ anios: [], departamentos: [] }));
  }, []);

  async function descargar() {
    if (!datos) return;
    setGenerando(true);
    try {
      const { exportarDepartamentosPDF } = await import("../lib/exportarInforme");
      await exportarDepartamentosPDF(datos.departamentos, datos.actualizadoEl, datos.sinDepartamento);
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

        {datos && datos.departamentos.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-10">
              <MapaDepartamentos departamentos={datos.departamentos} />
            </div>
          </Reveal>
        )}

        {serie && serie.departamentos.length > 0 && (
          <Reveal delay={0.15}>
            <div className="mt-10">
              <GraficoLineaDepartamentos datos={serie} />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.2}>
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
          {datos && datos.sinDepartamento > 0 && (
            <p className="mt-3 px-1 text-sm text-carbon/50">
              Además, <strong className="text-carbon/70">{datos.sinDepartamento.toLocaleString("es-AR")}</strong>{" "}
              sociedades ({porcentaje(datos.sinDepartamento, totalConSinDepartamento)}% del total) no tienen un
              departamento asignado en este informe. Ver el motivo en "Fuente y metodología", más abajo.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10">
            <FuenteDatos>
              <p>
                <strong className="text-carbon">Sobre las sociedades sin departamento asignado.</strong>{" "}
                {datos && (
                  <>
                    De las {totalConSinDepartamento.toLocaleString("es-AR")} sociedades activas consideradas en
                    este informe, {datos.sinDepartamento.toLocaleString("es-AR")} (
                    {porcentaje(datos.sinDepartamento, totalConSinDepartamento)}%) no tienen un departamento
                    asignado.{" "}
                  </>
                )}
                Esto ocurre por dos motivos distintos. Primero, hay sociedades cuyo domicilio publicado no
                indica ninguna localidad: en la práctica, muchas veces el domicilio informado es literalmente
                "Provincia de Mendoza" o, más escuetamente, "Mendoza" — sin calle, sin localidad, sin ningún
                dato que permita ubicarlas en un departamento puntual. Segundo, hay domicilios que sí incluyen
                una calle y un número, pero cuya localidad es simplemente "Mendoza" (por ejemplo, "Martínez de
                Rozas 263, Mendoza, Mendoza"), lo que no alcanza para distinguir con certeza entre el
                departamento Capital y el resto del área metropolitana. En ambos casos, el proceso de
                extracción prefiere dejar el departamento sin informar antes que asumir uno de forma incorrecta.
              </p>
              <p>
                A esto se suma un caso menos frecuente: domicilios que sí mencionan un departamento real, pero
                escrito de forma abreviada o no estandarizada — por ejemplo, "G. Cruz" en lugar de "Godoy Cruz",
                o "Mza." en lugar de "Mendoza" — que el proceso de coincidencia automática no siempre reconoce.
                Estas sociedades sí existen y están incluidas en el total de la provincia, pero no aparecen en
                el desglose por departamento ni en el mapa de esta página.
              </p>
            </FuenteDatos>
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
