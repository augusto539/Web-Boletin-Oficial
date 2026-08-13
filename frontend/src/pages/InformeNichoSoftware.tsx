import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import { DEPARTAMENTOS_SOFTWARE, EVOLUCION_ANUAL, TIPO_ENTIDAD } from "../data/nichoSoftware";
import { registrarDescarga } from "../lib/descargasApi";
import { cuit as formatCuit, fecha, moneda } from "../lib/format";
import { type EntidadesNicho, obtenerEntidadesNicho } from "../lib/informesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoSoftware() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();
  const [datos, setDatos] = useState<EntidadesNicho | null>(null);

  useEffect(() => {
    obtenerEntidadesNicho("software").then(setDatos);
  }, []);

  async function descargar() {
    if (!datos) return;
    setGenerando(true);
    try {
      const { exportarNichoSoftwarePDF } = await import("../lib/exportarInforme");
      await exportarNichoSoftwarePDF(datos.entidades);
      registrarDescarga("informe_nicho_software", "pdf", null, "Desarrollo de Software en Mendoza");
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">Desarrollo de software en Mendoza</h1>
              <p className="mt-2 text-lg text-carbon/60">El sector que estuvo ahí desde el primer día</p>
            </div>
            <button
              type="button"
              onClick={() => ejecutar(descargar)}
              disabled={generando || !datos}
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
            103 sociedades de desarrollo de software se constituyeron en Mendoza entre 2017 y 2026 —
            el nicho más grande de toda esta serie de informes. A diferencia de los rubros ligados a
            una moda o un ciclo de precios, el software estuvo presente desde el primer año del
            relevamiento, sin boom ni colapso.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Julio de 2026 · Sexto de la serie de nichos sectoriales · Fuente: Boletín Oficial de la
            Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">103 sociedades de desarrollo de software</strong>{" "}
                identificadas entre 2017 y 2026 — el nicho más grande de los evaluados en esta tanda,
                por delante de Reciclaje y Café, y comparable en tamaño a Publicidad y Contenidos.
              </li>
              <li>
                Es el único nicho de toda la serie presente desde el primer año con volumen real: 7
                sociedades en 2017, subiendo enseguida a 21 en 2018 — casi la quinta parte de todo el
                nicho en un solo año, sin una causa puntual identificable más allá de la ola general
                de adopción temprana de la S.A.S.
              </li>
              <li>
                No hay boom ni colapso, tampoco meseta perfecta: la curva sube y baja entre 3 y 21
                sociedades por año sin un patrón de ciclo económico claro (a diferencia de
                cripto/fintech, atado al precio de Bitcoin) — un sector con demanda de fondo más que
                una moda puntual.
              </li>
              <li>
                Densidad de cofundadores repetidos inusualmente alta: 15 pares de sociedades comparten
                al menos un socio — proporcionalmente la red de fundadores seriales más densa de todos
                los nichos de esta serie (14,6&nbsp;% de las 103 sociedades conectadas a otra por una
                persona en común).
              </li>
              <li>
                Capital y Godoy Cruz concentran el 61&nbsp;% (43 y 20 de 103) — el corredor
                urbano-tecnológico del Gran Mendoza.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Una curva sin ciclo aparente"
              subtitulo="Sociedades de software constituidas por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="sociedades"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es un año parcial: boletines relevados hasta julio de 2026.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="text-sm leading-relaxed text-carbon/80">
              <p>
                A diferencia de todos los demás nichos evaluados hasta ahora en esta serie —que
                muestran o un boom concentrado (cripto, cerveza), o un crecimiento sostenido y
                ordenado (café), o relevos claros entre subrubros (reciclaje)—, el software no tiene
                una narrativa temporal limpia. El pico de 2018 (21 sociedades, el 20&nbsp;% del nicho
                en un solo año) no coincide con ningún evento identificable en la base: entre esas 21
                aparecen desde software factories dedicadas (Interbrain, Predictive Lab, Fibercon)
                hasta la constitución local de <strong className="text-carbon">Uber Eats S.A.S.</strong>,
                y un segundo repunte en 2021 (17) tampoco corresponde a ningún ciclo evidente.
              </p>
              <p className="mt-3">
                La lectura más razonable es que el desarrollo de software en Mendoza es una categoría
                de demanda de fondo, presente en todos los años del relevamiento sin depender de una
                moda o un ciclo de precios externo — lo opuesto al patrón que mostró Cripto/Fintech,
                con el 64&nbsp;% de sus sociedades concentradas en el boom de Bitcoin de 2020-2022.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">
              Una red de fundadores densa, con un puente directo al análisis de grafos
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Cruzando los socios de las 103 sociedades aparecen 15 pares con al menos una persona
                en común — la proporción más alta de repetición de fundadores de todos los nichos
                evaluados en esta tanda (en Cerveza Artesanal fueron 5 pares sobre 36 sociedades; en
                Café, 5 sobre 42; acá, 15 sobre 103).
              </p>
              <p>
                El caso más notable no es una coincidencia aislada:{" "}
                <strong className="text-carbon">Linka Space S.A.S. y Litt Ar S.A.S.</strong>, dos
                sociedades vinculadas por la misma persona —Matías Demián Benegas—, son dos de las 61
                sociedades del clúster de cofundadores tecnológicos identificado en el análisis de
                grafos de esta misma base (ligado a la aceleradora Embarca Aceleradora De Startups
                Sas, 2017). Este informe de nicho, construido de forma completamente independiente por
                palabras clave de objeto social, redescubrió por otra vía la misma red que el análisis
                de grafos había encontrado matemáticamente — una validación cruzada entre dos métodos
                distintos sobre la misma base.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
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
              80 de las 103 (78&nbsp;%) eligieron la S.A.S. — el patrón habitual del resto de la
              economía societaria mendocina. Capital declarado: mediana de $100.000, rango de
              $17.720 a $10.000.000 — la mediana más baja de toda esta tanda de informes (cerveza
              $440.000, reciclaje $440.000, café $300.000), coherente con un rubro donde el activo
              principal es el conocimiento y el código, no equipamiento ni infraestructura física.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están domiciliadas las sociedades de software"
              subtitulo="99 de 103 sociedades, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_SOFTWARE}
              etiquetaUnidad="sociedades"
            />
            <div className="mt-3 space-y-3">
              <p className="px-1 text-sm text-carbon/50">
                99 de las 103 sociedades tienen departamento identificado; 4 no.
              </p>
              <p className="px-1 text-sm text-carbon/70">
                Capital y Godoy Cruz concentran el 61&nbsp;% — la mayor concentración geográfica de
                toda esta tanda de informes, consistente con un sector de trabajo remoto/de oficina
                que no necesita estar cerca de ninguna materia prima ni cliente físico, y que gravita
                hacia donde ya está el ecosistema profesional y universitario.
              </p>
            </div>
          </div>
        </Reveal>

        {datos && datos.entidades.length > 0 && (
          <Reveal delay={0.4}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">Directorio completo: las 103 sociedades</h2>
              <p className="mt-2 text-sm text-carbon/60">
                Ficha completa de cada una de las 103 sociedades identificadas, ordenadas por fecha
                de publicación del acto de Constitución en el Boletín (la única sin fecha capturada
                va al final).
              </p>
              <div className="mt-6 space-y-6">
                {datos.entidades.map((e) => (
                  <div key={e.sociedadId} className="border-t border-carbon/10 pt-6 first:border-t-0 first:pt-0">
                    <p className="text-base font-bold text-carbon">
                      {e.tipo && (
                        <span className="mr-2 rounded-full bg-humo px-2.5 py-0.5 text-xs font-bold tracking-wider text-carbon/60 uppercase">
                          {e.tipo}
                        </span>
                      )}
                      <Link to={`/sociedad/${e.sociedadId}`} className="text-vino hover:underline">
                        {e.nombre}
                      </Link>
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                      <div>
                        <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">CUIT</p>
                        <p className="text-carbon/80">{formatCuit(e.cuit)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">Capital</p>
                        <p className="text-carbon/80">{moneda(e.capital?.toString())}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider text-carbon/50 uppercase">Publicación</p>
                        <p className="text-carbon/80">{fecha(e.publicacion)}</p>
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

        <Reveal delay={0.45}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Búsqueda: objeto social con "desarrollo de software/sistemas/aplicaciones",
                "programación" (en sentido informático), "servicios informáticos", "consultoría
                informática", "desarrollo web/de plataformas", más nombre con "software" — 214
                sociedades candidatas, el segundo universo más grande de esta serie después de
                Publicidad y Contenidos.
              </p>
              <p>
                Clasificación asistida por script, con revisión manual del universo completo. Dado el
                volumen (214 candidatas), se usó un clasificador automático de tres niveles —señal en
                el nombre, posición del término técnico dentro del objeto social, y detección de
                boilerplate genérico multi-rubro— y se revisaron a mano las 41 candidatas ambiguas que
                el script no pudo resolver solo, más una segunda pasada específica sobre la palabra
                "programación" (ambigua en español entre "programación informática" y "programación de
                eventos/obras"; esa segunda revisión corrigió 9 falsos positivos). 111 de las 214
                candidatas (52&nbsp;%) se descartaron, la mayoría por objeto social catálogo con
                "desarrollo de software" como una palabra más entre construcción, gastronomía, salud o
                agropecuaria, sin que sea el eje real del negocio.
              </p>
              <p>
                Cobertura ARCA: 37 de 103 (35,9&nbsp;%) tienen cruce con el padrón de AFIP — la
                cobertura más baja de esta tanda.
              </p>
              <p>
                Como en toda la serie, las constituciones se cuentan por fecha de publicación del acto
                en el Boletín, no por fecha de constitución declarada.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-10">
            <FuenteDatos />
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El desarrollo de software es, de los nichos evaluados en esta serie, el que menos se
              parece a una moda y más a una categoría estructural: estuvo presente desde el primer año
              del relevamiento, no depende de un ciclo de precios externo como cripto, y generó una
              red de cofundadores lo bastante densa como para cruzarse, de forma independiente, con el
              hallazgo más fuerte del análisis de grafos de esta misma base.
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
