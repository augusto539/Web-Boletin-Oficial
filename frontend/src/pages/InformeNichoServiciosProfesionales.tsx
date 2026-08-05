import { useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarrasHorizontal } from "../components/GraficoBarrasHorizontal";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  DEPARTAMENTOS_SERVICIOS_PROFESIONALES,
  ENTIDADES,
  ESCRIBANOS_TOP,
  ESPECIALIDAD_ESTUDIOS,
  EVOLUCION_ANUAL,
  PROFESIONES_ECOSISTEMA,
  RANKING_PROFESIONES_LIBERALES,
  TIPO_ENTIDAD,
  type EntidadServiciosProfesionales,
} from "../data/nichoServiciosProfesionales";
import { registrarDescarga } from "../lib/descargasApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

const CATEGORIAS: EntidadServiciosProfesionales["categoria"][] = [
  "Jurídico",
  "Jurídico-contable",
  "Contable",
  "Gestoría y trámites",
];

export default function InformeNichoServiciosProfesionales() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarNichoServiciosProfesionalesPDF } = await import("../lib/exportarInforme");
      await exportarNichoServiciosProfesionalesPDF();
      registrarDescarga(
        "informe_nicho_servicios_profesionales",
        "pdf",
        null,
        "Abogados, contadores y escribanos en Mendoza",
      );
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
              <p className="text-xs font-bold tracking-wider text-vino uppercase">
                Informe de datos · Nichos sectoriales
              </p>
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                Abogados, contadores y escribanos en Mendoza
              </h1>
              <p className="mt-2 text-lg text-carbon/60">
                Los profesionales que fabrican empresas
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
            46 estudios profesionales se constituyeron como sociedad en Mendoza entre 2017 y 2026 —
            ninguno de ellos una escribanía. El rubro aparece en este informe desde dos lados
            distintos del mismo dato: como sociedades propias, y como los profesionales que, sin
            constituir un estudio, más se repiten entre los socios de las demás 19.485 sociedades de
            la base.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Agosto de 2026 · Séptimo de la serie de nichos sectoriales · Fuente: Boletín Oficial de
            la Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">46 estudios profesionales</strong> identificados
                entre 2017 y 2026 — jurídicos (25), contables (11), jurídico-contables (9) y de
                gestoría y trámites (1). Ninguno notarial: la escribanía no puede constituirse como
                sociedad comercial.
              </li>
              <li>
                Del lado del boletín como base de socios: <strong className="text-carbon">821
                abogados/as</strong> y <strong className="text-carbon">1.136 contadores/as</strong>{" "}
                aparecen como socios en 1.028 y 1.639 sociedades respectivamente, de toda la base —
                muy por encima de cualquier estudio propio del rubro.
              </li>
              <li>
                <strong className="text-carbon">66 escribanos/as</strong> aparecen como socios en
                cualquier sociedad — la profesión liberal que menos se asocia de las seis relevadas
                (contra 1.485 ingenieros/as o 983 médicos/as), consistente con la misma razón legal
                que impide la escribanía-sociedad.
              </li>
              <li>
                <strong className="text-carbon">559 escribanos/as</strong> intervinieron como
                escribano actuante en 1.511 actos del boletín — un mercado atomizado: el 52,9&nbsp;%
                (296 de 559) aparece una sola vez, y solo el 6,9&nbsp;% de los 21.989 actos totales
                de la base declara qué escribano intervino.
              </li>
              <li>
                Capital concentra el 73,9&nbsp;% de los 46 estudios (34 de 46) — la mayor
                concentración geográfica de toda esta serie de informes.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="Un rubro que está en los dos lados del dato"
              subtitulo="Especialidad de los 46 estudios profesionales constituidos como sociedad"
              datos={ESPECIALIDAD_ESTUDIOS}
              etiquetaUnidad="estudios"
            />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Los estudios que sí son empresa</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                De los 46 estudios, 25 (54,3&nbsp;%) son jurídicos, 11 (23,9&nbsp;%) contables y 9
                (19,6&nbsp;%) combinan ambas especialidades en un mismo objeto social — un patrón
                habitual entre estudios chicos que ofrecen asesoramiento integral. Un solo estudio
                (2,2&nbsp;%) se dedica exclusivamente a gestoría y trámites.
              </p>
              <p>
                Por año, el rubro no muestra una tendencia clara: 5 estudios en 2018, un pico de 11
                en 2019, y una meseta baja de 3 a 8 por año el resto del período — con números tan
                bajos por año, no hay tendencia real para leer en la serie temporal.
              </p>
              <table className="mt-4 w-full text-left text-sm">
                <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                  <tr>
                    {EVOLUCION_ANUAL.map((a) => (
                      <th key={a.etiqueta} className="py-2 pr-3">
                        {a.etiqueta}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-carbon/10">
                    {EVOLUCION_ANUAL.map((a) => (
                      <td key={a.etiqueta} className="py-2.5 pr-3 font-bold">
                        {a.valor}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">La escribanía que no existe</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              De los 46 estudios de este informe, ninguno es notarial — y no es casualidad ni un
              artefacto de la búsqueda. El registro notarial es personal e intransferible: un
              escribano no puede aportarlo como capital a una sociedad, ni ejercer la función
              notarial a través de una persona jurídica. Por eso una escribanía, a diferencia de un
              estudio jurídico o contable, estructuralmente no puede aparecer en el Boletín Oficial
              como sociedad comercial — el 0&nbsp;% del gráfico de especialidades no mide ausencia
              de mercado, mide un límite legal.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">El otro lado: los profesionales que fabrican empresas</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Contadores y abogados no aparecen solo en sus propios estudios: son, de lejos, las
              profesiones más repetidas entre los socios de cualquier sociedad de toda la base —
              muchas veces como socio fundador, otras como el profesional que estructura la sociedad
              de un cliente y queda como parte del capital inicial.
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Profesión</th>
                  <th className="py-2">Personas</th>
                  <th className="py-2">Sociedades donde participan</th>
                </tr>
              </thead>
              <tbody>
                {PROFESIONES_ECOSISTEMA.map((p) => (
                  <tr key={p.profesion} className="border-t border-carbon/10">
                    <td className="py-2.5 font-bold">{p.profesion}</td>
                    <td className="py-2.5">{p.personas.toLocaleString("es-AR")}</td>
                    <td className="py-2.5">{p.sociedades ? p.sociedades.toLocaleString("es-AR") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="El ranking de profesiones liberales entre los socios de toda la base"
              subtitulo="Personas con esa profesión declarada, entre los socios de las 19.485 sociedades"
              datos={RANKING_PROFESIONES_LIBERALES}
              etiquetaUnidad="personas"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              Escribano/a, en rojo: la profesión liberal que menos se asocia de las seis relevadas.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Los escribanos del Boletín: un mercado atomizado</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Un escribano nunca aparece como socio (ver arriba), pero sí como escribano
                interviniente en el acto societario. 559 escribanos/as distintos intervinieron en
                1.511 actos del Boletín — un mercado atomizado, no dominado por un puñado de
                estudios: los 10 escribanos más activos concentran apenas 237 actos
                (15,7&nbsp;%), los 50 más activos llegan a 589 (39,0&nbsp;%), y 296 de los 559
                (52,9&nbsp;%) aparecen una única vez en toda la base.
              </p>
            </div>
            <div className="mt-6">
              <GraficoBarrasHorizontal
                titulo="Los escribanos más activos"
                subtitulo="Actos societarios con ese escribano interviniente"
                datos={ESCRIBANOS_TOP}
                etiquetaUnidad="actos"
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Importante para leer estos números: solo el 6,9&nbsp;% de los actos de toda la base
              (1.511 de 21.989) declara qué escribano intervino — el resto del boletín no captura
              ese dato, así que el ranking describe a los escribanos que sí figuran, no a la
              totalidad del mercado notarial mendocino.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Perfil societario</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Tipo societario</th>
                  <th className="py-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {TIPO_ENTIDAD.map((t) => (
                  <tr key={t.tipo} className="border-t border-carbon/10">
                    <td className="py-2.5 font-bold">{t.tipo}</td>
                    <td className="py-2.5">{t.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              36 de los 46 (78,3&nbsp;%) eligieron la S.A.S. — el mismo patrón dominante del resto
              de la economía societaria mendocina. Capital declarado: mediana de $101.000, entre un
              mínimo de $20.000 y un máximo de $3.000.000.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están domiciliados los estudios profesionales"
              subtitulo="45 de 46 estudios, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_SERVICIOS_PROFESIONALES}
              etiquetaUnidad="estudios"
            />
            <div className="mt-3 space-y-3">
              <p className="px-1 text-sm text-carbon/50">
                45 de los 46 estudios tienen departamento identificado; 1 no.
              </p>
              <p className="px-1 text-sm text-carbon/70">
                Capital concentra el 73,9&nbsp;% (34 de 46) — la mayor concentración geográfica de
                toda esta tanda de informes, coherente con un rubro que gravita hacia los tribunales,
                los organismos públicos y el resto del ecosistema profesional.
              </p>
            </div>
          </div>
        </Reveal>

        {ENTIDADES.length > 0 && (
          <Reveal delay={0.55}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">Directorio completo: los 46 estudios</h2>
              <p className="mt-2 text-sm text-carbon/60">
                Ficha completa de cada uno de los 46 estudios identificados, agrupados por
                especialidad y ordenados por fecha de publicación del acto de Constitución en el
                Boletín.
              </p>
              {CATEGORIAS.map((categoria) => {
                const entidadesCategoria = ENTIDADES.filter((e) => e.categoria === categoria);
                if (entidadesCategoria.length === 0) return null;
                return (
                  <div key={categoria} className="mt-8 first:mt-6">
                    <h3 className="text-sm font-bold tracking-wider text-vino uppercase">
                      {categoria} ({entidadesCategoria.length})
                    </h3>
                    <div className="mt-4 space-y-6">
                      {entidadesCategoria.map((e) => (
                        <div
                          key={e.nombre}
                          className="border-t border-carbon/10 pt-6 first:border-t-0 first:pt-0"
                        >
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
                              <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">
                                CUIT
                              </p>
                              <p className="text-carbon/80">{e.cuit ?? "—"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">
                                Capital
                              </p>
                              <p className="text-carbon/80">{e.capital ?? "—"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">
                                Publicación
                              </p>
                              <p className="text-carbon/80">{e.publicacion ?? "—"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">
                                Departamento
                              </p>
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
                            <span className="font-bold">Objeto social:</span> {e.objetoSocial}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.6}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Búsqueda por objeto social y nombre: términos jurídicos, contables y notariales —
                163 sociedades candidatas. Revisión manual del universo completo: 117 de las 163
                (71,8&nbsp;%) se descartaron, la mayoría objeto social catálogo con un término del
                rubro entre otros muchos, o falsos positivos como "Sociedades de Productores
                Asesores de Seguros" (que comparten vocabulario con estudios jurídicos pero no son
                el mismo rubro).
              </p>
              <p>
                Los datos de escribanos (intervinientes en actos y socios en cualquier sociedad) y
                de profesiones entre socios (contadores, abogados, ingenieros, médicos,
                arquitectos, escribanos) se calculan sobre toda la base de 19.485 sociedades y
                21.989 actos, no solo sobre los 46 estudios de este informe — de ahí la distinción
                entre "estudios propios" y "el otro lado del dato" en las secciones de arriba.
              </p>
              <p>
                Como en toda la serie, las constituciones se cuentan por fecha de publicación del
                acto en el Boletín, no por fecha de constitución declarada.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.65}>
          <div className="mt-10">
            <FuenteDatos />
          </div>
        </Reveal>

        <Reveal delay={0.7}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El rubro de servicios profesionales es, en esta base, más grande de lo que sus 46
              estudios propios sugieren: abogados y contadores son, con amplio margen, las
              profesiones liberales más presentes entre los socios de toda la economía societaria
              mendocina. Los escribanos, en cambio, quedan estructuralmente afuera de ambos lados
              del dato — nunca socios, casi nunca dueños de su propio estudio-sociedad, presentes
              solo como firma en el acto — un límite legal, no una elección de mercado.
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
