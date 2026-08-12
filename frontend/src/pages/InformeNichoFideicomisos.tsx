import { useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoDona } from "../components/GraficoDona";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  DEPARTAMENTOS_FIDEICOMISOS,
  ENTIDADES,
  EVOLUCION_ANUAL,
  PERFIL_SOCIETARIO_DONA,
} from "../data/nichoFideicomisos";
import { registrarDescarga } from "../lib/descargasApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoFideicomisos() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarNichoFideicomisosPDF } = await import("../lib/exportarInforme");
      await exportarNichoFideicomisosPDF();
      registrarDescarga("informe_nicho_fideicomisos", "pdf", null, "Servicios de Fideicomisos en Mendoza");
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
        <Reveal inmediato>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-vino uppercase">
                Informe de datos · Nichos sectoriales
              </p>
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                Servicios de fideicomisos en Mendoza
              </h1>
              <p className="mt-2 text-lg text-carbon/60">
                El vehículo financiero del boom inmobiliario, no un servicio patrimonial genérico
              </p>
            </div>
            <button
              type="button"
              onClick={() => ejecutar(descargar)}
              disabled={generando}
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
          <p className="mt-4 max-w-2xl text-lg text-carbon/70">
            63 sociedades identificadas vía el código CLAE "Servicios de fideicomisos" — el universo
            más chico de la serie, pero el más nítido en su identidad real: pese al nombre oficial,
            en Mendoza esta figura es casi por completo el vehículo legal del "fideicomiso al costo"
            inmobiliario.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Agosto de 2026 · Duodécimo de la serie de nichos sectoriales · Fuente: Boletín Oficial de
            la Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">63 sociedades de servicios de fideicomisos</strong>{" "}
                identificadas vía el código CLAE 643001, declarado como actividad principal — el
                universo más chico de los tres nichos basados en CLAE de esta serie, y el único sin
                ningún año en cero desde que arranca el relevamiento.
              </li>
              <li>
                <strong className="text-carbon">
                  No es un servicio patrimonial genérico: es el vehículo del "fideicomiso al costo"
                  inmobiliario.
                </strong>{" "}
                El 79&nbsp;% (50 de 63) declara explícitamente actividad inmobiliaria, constructora
                o de desarrollo urbano en su objeto social — un fiduciario administra los aportes de
                inversores particulares para construir y luego distribuir unidades o rentabilidad,
                no la administración de fideicomisos financieros o testamentarios en sentido amplio.
              </li>
              <li>
                <strong className="text-carbon">Arranca fuerte desde el primer año con datos</strong>{" "}
                (10 sociedades en 2018) y <strong className="text-carbon">2025 es el pico de toda
                la serie</strong> (13) — sin la curva de despegue gradual que muestran otros nichos
                de esta tanda.
              </li>
              <li>
                <strong className="text-carbon">Ningún fundador se repite</strong> entre las 63
                sociedades — el único de los tres nichos CLAE de esta serie sin una sola cadena de
                socios compartidos. Cada proyecto fiduciario parece constituirse con un equipo
                propio.
              </li>
              <li>
                <strong className="text-carbon">100&nbsp;% S.A.S. o S.A.</strong>: es el único nicho
                de la serie sin una sola S.R.L. — coherente con que administrar fideicomisos de
                terceros exige una estructura de responsabilidad limitada por acciones, no de
                cuotas.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Una curva sin rampa de despegue"
              subtitulo="Sociedades constituidas por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="sociedades"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es parcial: el relevamiento llega hasta julio. No hay sociedades del nicho con
              fecha de Constitución en 2017 — 2018 es el primer año con datos, y ya arranca como el
              segundo año más alto de la serie.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-carbon/80">
              A diferencia de los demás nichos —que muestran una rampa de crecimiento gradual desde
              2017— este arranca fuerte en 2018 (10 sociedades) y se mantiene en una banda de 4 a 8
              por año durante seis años, sin un patrón de boom ni de colapso, hasta el salto de 2025
              (13, el año más alto de toda la serie). No hay un evento de origen visible en los
              datos: para 2018 la figura del fideicomiso inmobiliario ya estaba consolidada como
              vehículo de inversión en Mendoza, y este relevamiento —que arranca en 2017— la
              encuentra ya en régimen, no naciendo.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">No es "gestión patrimonial": es financiamiento de obra</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El objeto social de las 63 sociedades deja poca ambigüedad sobre a qué se dedica
              realmente este código CLAE en Mendoza:
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Actividad declarada (además de "fiduciaria")</th>
                  <th className="py-2">Sociedades</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5">Inmobiliaria / constructora / desarrollo urbano</td>
                  <td className="py-2.5 font-bold">50 (79%)</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5">Financiera / inversora</td>
                  <td className="py-2.5 font-bold">31 (49%)</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              La combinación típica —fiduciaria + inmobiliaria/constructora— es la firma textual del{" "}
              <strong className="text-carbon">fideicomiso al costo</strong>: la figura donde un
              grupo de inversores ("fiduciantes") aporta capital a una sociedad ("fiduciaria") que
              administra la construcción de un edificio o loteo y distribuye unidades o rentabilidad
              al terminar la obra, sin que el desarrollador ponga capital propio de riesgo.
            </p>
            <p className="mt-4 rounded-2xl bg-humo p-4 text-sm leading-relaxed text-carbon/80 italic">
              "Fiduciaria: ejercer el carácter de fiduciaria en todo tipo de fideicomiso con
              excepción de los financieros y aquellos sujetos a la normativa de la ley de entidades
              financieras." — <span className="not-italic font-bold">Fontalba S.A.</span>
            </p>
            <p className="mt-3 rounded-2xl bg-humo p-4 text-sm leading-relaxed text-carbon/80 italic">
              "Operaciones inmobiliarias: compraventa, locación, leasing, fideicomiso de inmuebles.
              Actos jurídicos, inversiones y aportes de capitales, actuación como fiduciario..." —{" "}
              <span className="not-italic font-bold">Furmich S.A.S.</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Casi ninguna sociedad del nicho declara fideicomisos testamentarios, de garantía o de
              administración patrimonial familiar como actividad — el uso mendocino de esta figura
              societaria es, de manera abrumadora, financiamiento de desarrollo inmobiliario.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Perfil societario</h2>
            <div className="mt-4">
              <GraficoDona
                titulo="Tipo societario de las 63 sociedades"
                datos={PERFIL_SOCIETARIO_DONA}
                etiquetaUnidad="sociedades"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Es el único nicho de toda la serie sin una sola S.R.L. — coherente con que actuar como
              fiduciario de terceros es una actividad que exige una estructura de responsabilidad
              limitada por acciones (S.A.S. o S.A.), no la forma de cuotas sociales típica de un
              negocio familiar chico. Capital declarado: mediana de $292.000, rango de $20.000 a
              $20.000.000 (Grupo Magoviva S.A.S., 2025).
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Sociedad</th>
                  <th className="py-2">Capital</th>
                  <th className="py-2">Departamento</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Grupo Magoviva S.A.S.", "$20.000.000", "Capital"],
                  ["Fundamenta Pilares Desarrollos S.A.S.", "$10.000.000", "Capital"],
                  ["Utopía Desarrollos S.A.S.", "$8.000.000", "San Rafael"],
                  ["Betania S.A.S.", "$4.000.000", "Luján de Cuyo"],
                  ["Poldena Moon Sas", "$2.000.000", "Las Heras"],
                  ["Flogulu S.A.S.", "$2.000.000", "Capital"],
                  ["Grupo Gestión Urbana S.A.S.", "$1.500.000", "San Rafael"],
                  ["Jolmogori S.A.S.", "$1.500.000", "Guaymallén"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-carbon/10">
                    <td className="py-2.5">{row[0]}</td>
                    <td className="py-2.5 font-bold">{row[1]}</td>
                    <td className="py-2.5">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Los nombres mismos del top del ranking ("Fundamenta Pilares Desarrollos", "Utopía
              Desarrollos", "Grupo Gestión Urbana") refuerzan la lectura: son firmas de desarrollo
              inmobiliario que adoptaron la figura fiduciaria como estructura legal, no
              administradoras de fideicomisos como servicio abstracto.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Sin cadenas de fundadores repetidos</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              A diferencia de otros nichos de esta serie basados en CLAE, ningún socio se repite
              entre las 63 sociedades de este nicho. Cada proyecto fiduciario parece armarse con un
              equipo de inversores propio, sin que aparezca en los datos ningún desarrollador serial
              constituyendo múltiples vehículos fiduciarios sucesivos — al menos no bajo los mismos
              nombres de socios captados en el Boletín. No se puede descartar que un mismo grupo
              económico use apoderados o sociedades intermedias distintas en cada proyecto, algo que
              este relevamiento (basado en personas físicas nombradas como socios) no puede ver.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están"
              subtitulo="62 de 63 sociedades, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_FIDEICOMISOS}
              etiquetaUnidad="sociedades"
            />
            <p className="mt-3 px-1 text-sm text-carbon/70">
              Capital, Luján de Cuyo y Godoy Cruz concentran el 69&nbsp;% del nicho — los tres
              departamentos del Gran Mendoza con más desarrollo inmobiliario de edificios y
              countries en la última década, consistente con la lectura de que este es, ante todo,
              un vehículo de financiamiento de obra urbana.
            </p>
          </div>
        </Reveal>

        {ENTIDADES.length > 0 && (
          <Reveal delay={0.45}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">
                Directorio completo: las 63 sociedades de servicios de fideicomisos
              </h2>
              <p className="mt-2 text-sm text-carbon/60">
                Ficha completa de cada una de las 63 sociedades identificadas, ordenadas por fecha de
                publicación del acto de Constitución en el Boletín (la que no tiene fecha capturada
                va al final).
              </p>
              <div className="mt-6 space-y-6">
                {ENTIDADES.map((e) => (
                  <div key={e.nombre} className="border-t border-carbon/10 pt-6 first:border-t-0 first:pt-0">
                    <p className="text-base font-bold text-carbon">
                      <span className="mr-2 rounded-full bg-humo px-2.5 py-0.5 text-xs font-bold tracking-wider text-carbon/60 uppercase">
                        {e.tipo}
                      </span>
                      <Link to={`/sociedad/${e.sociedadId}`} className="text-vino hover:underline">
                        {e.nombre}
                      </Link>
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                      <div>
                        <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">CUIT</p>
                        <p className="text-carbon/80">{e.cuit ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">Capital</p>
                        <p className="text-carbon/80">{e.capital ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">Publicación</p>
                        <p className="text-carbon/80">{e.publicacion ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">Departamento</p>
                        <p className="text-carbon/80">{e.departamento ?? "—"}</p>
                      </div>
                    </div>
                    {e.socios.length > 0 && (
                      <p className="mt-3 text-sm text-carbon/70">
                        <span className="font-bold">Socios/Integrantes:</span>{" "}
                        {e.socios.map((s, i) => (
                          <span key={s.nombre}>
                            {i > 0 && " · "}
                            {s.sociedadId ? (
                              <Link to={`/sociedad/${s.sociedadId}`} className="text-vino hover:underline">
                                {s.nombre}
                              </Link>
                            ) : s.personaId ? (
                              <Link to={`/persona/${s.personaId}`} className="text-vino hover:underline">
                                {s.nombre}
                              </Link>
                            ) : (
                              s.nombre
                            )}
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="mt-1.5 text-sm text-carbon/70">
                      <span className="font-bold">Objeto social:</span> {e.objetoSocial ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.5}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Búsqueda por CLAE, mismo método que otros nichos de esta serie. Se usó el código
                643001 ("Servicios de fideicomisos") como actividad principal (orden 1, estado
                activo) declarada ante ARCA. Este método solo alcanza al 61,7&nbsp;% del corpus con
                cruce ARCA — una sociedad fiduciaria real sin ese cruce queda invisible, sin forma de
                estimar cuántas son.
              </p>
              <p>
                71 candidatas → 63 sociedades únicas: el cruce dio 71 filas, pero 8 nombres
                normalizados aparecían dos veces por el mismo patrón de republicación en el Boletín —
                se deduplicó por nombre normalizado, conservando la primera publicación cronológica.
              </p>
              <p>
                Cobertura ARCA: 37 de 63 (58,7&nbsp;%) cruzan contra el padrón de AFIP — la más baja
                de los tres nichos CLAE de esta serie, aunque todas las que cruzan están activas
                salvo un caso "No Inscripto" en IVA.
              </p>
              <p>
                Límite del método de socios: la ausencia de socios repetidos entre estas 63
                sociedades no significa necesariamente ausencia de desarrolladores seriales — este
                relevamiento identifica personas físicas nombradas como "Socio" en el Boletín, y una
                misma firma desarrolladora podría usar apoderados distintos o estructuras societarias
                intermedias en cada proyecto fiduciario sin que eso se refleje en los datos
                disponibles.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="mt-10">
            <FuenteDatos />
          </div>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              De los nichos de esta serie construidos por clasificación CLAE, el de fideicomisos es
              el más chico pero el más nítido en su identidad real: pese a llamarse "servicios de
              fideicomisos" en el nomenclador oficial, en Mendoza esta figura societaria es casi por
              completo el vehículo legal del desarrollo inmobiliario financiado por inversores
              particulares —el fideicomiso al costo—, no un servicio de administración patrimonial
              en sentido amplio. Es también el único nicho sin una sola S.R.L. y sin una sola cadena
              de fundadores repetidos: acá cada proyecto parece nacer con su propio equipo, bajo una
              estructura societaria pensada específicamente para canalizar capital de terceros hacia
              una obra concreta.
            </p>
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
