import { useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoDona } from "../components/GraficoDona";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import { DEPARTAMENTOS_CAFE, ENTIDADES, EVOLUCION_ANUAL, PERFIL_SOCIETARIO_DONA } from "../data/nichoCafe";
import { registrarDescarga } from "../lib/descargasApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoCafe() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarNichoCafePDF } = await import("../lib/exportarInforme");
      await exportarNichoCafePDF();
      registrarDescarga("informe_nicho_cafe", "pdf", null, "Café de Especialidad en Mendoza");
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">Café de especialidad en Mendoza</h1>
              <p className="mt-2 text-lg text-carbon/60">
                Crecimiento sostenido, sin el boom ni el colapso de la cerveza artesanal
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
            42 sociedades cafeteras se constituyeron en Mendoza entre 2017 y 2026, casi todas
            nombradas explícitamente con "café" o "coffee" — a diferencia de otros nichos de esta
            serie, acá el propio nombre comercial es el filtro más confiable.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Agosto de 2026 · Noveno de la serie de nichos sectoriales · Fuente: Boletín Oficial de
            la Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">42 sociedades cafeteras</strong> identificadas
                entre 2017 y 2026 — a diferencia de otros nichos de la serie, acá el propio nombre
                comercial es el filtro más confiable.
              </li>
              <li>
                <strong className="text-carbon">Crecimiento sostenido, sin boom ni colapso:</strong>{" "}
                de 2 sociedades en 2017 sube de forma pareja hasta un pico de 7 en 2022, y desde
                entonces se mantiene estable en 5-6 por año hasta 2025 — el patrón opuesto al de la
                cerveza artesanal, que colapsó después de 2020.
              </li>
              <li>
                <strong className="text-carbon">Norbu S.A.S.</strong> (2024) es el único caso de
                "especialidad" en sentido estricto de la industria: importa granos de café verde,
                tuesta y muele, y fabrica sus propias máquinas tostadoras — con $10.000.000 de
                capital declarado, el más alto del nicho por lejos.
              </li>
              <li>
                Aparece un <strong className="text-carbon">pequeño grupo familiar</strong>: Lilia
                Laura Guillén, Marcos David Guillén y Mateo Samuel Guillén participan, en distintas
                combinaciones, de tres cafeterías en San Rafael — una cadena chica y familiar
                creciendo en la misma zona durante tres años.
              </li>
              <li>
                <strong className="text-carbon">Capital y San Rafael concentran</strong> a partes
                iguales una porción relevante del nicho (11 y 5 de 42) — San Rafael es un polo
                local inusualmente activo para un rubro que en el resto de la serie tiende a
                concentrarse casi exclusivamente en el Gran Mendoza.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Una curva sin sobresaltos"
              subtitulo="Cafeterías constituidas por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="cafeterías"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es un año parcial: boletines relevados hasta julio de 2026.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-carbon/80">
              La comparación con el informe anterior de esta tanda es directa e instructiva: la
              cerveza artesanal tuvo un boom concentrado en 2017-2019 (72&nbsp;% del total) y un
              colapso casi total después de 2020. El café de especialidad, en cambio, crece de
              forma pareja y sostenida, sin un año de despegue evidente ni una caída posterior — el
              pico de 2022 (7) es apenas un máximo local dentro de una meseta de 5 a 7 sociedades
              por año que se mantiene desde 2021 hasta 2025. Es el patrón de un rubro que se instaló
              como categoría de consumo estable, no el de una moda que sube y baja.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">El único caso de especialidad en sentido estricto</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                De las 42 sociedades, la enorme mayoría son cafeterías con objeto social genérico
                de boilerplate societario — el nombre comercial es, en la mayoría de los casos, la
                única señal real de que se trata de un negocio de café. Una sola sociedad declara
                una cadena de valor propia de la industria de especialidad:
              </p>
              <p className="rounded-2xl bg-humo p-4">
                <strong className="text-carbon">Norbu S.A.S.</strong> (constituida 03/07/2024):
                "Compraventas, importación y exportación de granos de café verde, procesos de
                tostado, torrado y molienda de café. Fabricación de maquinarias tostadoras."
                Capital declarado: <strong className="text-carbon">$10.000.000</strong> — más del
                doble del segundo capital más alto del nicho ($5.000.000, Un Café Copado Mza
                S.A.S., 2025).
              </p>
              <p>
                Ningún otro caso del nicho declara importación de grano verde ni fabricación de
                maquinaria propia. El resto —incluidas otras dos sociedades con objeto social
                relacionado con café en sentido comercial más amplio, Mondovi S.A. (tostadero,
                fraccionamiento y distribución) y Toccafe Sas (granos, máquinas de espresso,
                eventos culturales sobre café)— se acerca a la idea de especialidad, pero Norbu es
                la única que integra toda la cadena, desde la importación del grano hasta la
                maquinaria de tueste.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Un pequeño grupo familiar y otros founders repetidos</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Cruzando los socios de las 42 sociedades aparecen cinco pares de cafeterías con al
              menos una persona en común. La más notable involucra a tres sociedades y una misma
              familia:
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Personas</th>
                  <th className="py-2">Sociedades</th>
                  <th className="py-2">Departamento</th>
                  <th className="py-2">Años</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Lilia Laura Guillén</td>
                  <td className="py-2.5">My Coffee S.A.S. → Grupo Café Del Mundo S.A.S.</td>
                  <td className="py-2.5">San Rafael</td>
                  <td className="py-2.5">2021 → 2023</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Marcos David Guillén</td>
                  <td className="py-2.5">Grupo Café Del Mundo S.A.S. → Café Del Mundo Alvear S.A.S.</td>
                  <td className="py-2.5">San Rafael</td>
                  <td className="py-2.5">2023 → 2026</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Mateo Samuel Guillén</td>
                  <td className="py-2.5">Café Del Mundo Alvear S.A.S.</td>
                  <td className="py-2.5">San Rafael</td>
                  <td className="py-2.5">2026</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Es una familia sanrafaelina construyendo, en tres años, una cadena chica de tres
              cafeterías bajo el nombre "Café Del Mundo" (con "My Coffee" como primer paso previo a
              adoptar esa marca). Otros dos pares de fundadores repetidos: María Mercedes Rossi,
              que fundó Cafe 2020 S.R.L. en 2020 y dos años después Cafe Rossi Tostadores S.A.S.
              (2022) — el apellido propio como marca de una segunda etapa más especializada—, y
              Lucas Germán Laborde (Café Lyn S.A.S. y El Club Del Café S.A., ambas en 2022).
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Perfil societario</h2>
            <div className="mt-4">
              <GraficoDona
                titulo="Tipo societario de las 42 cafeterías"
                datos={PERFIL_SOCIETARIO_DONA}
                etiquetaUnidad="cafeterías"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              La S.A.S. domina con más fuerza que en el resto de la serie (81&nbsp;% contra un
              rango típico de 60-65&nbsp;% en los otros nichos de esta tanda) — coherente con que
              la mayoría de las cafeterías nuevas son emprendimientos chicos y recientes, el perfil
              que más eligió la S.A.S. desde su masificación. Capital declarado: mediana de
              $300.000, rango de $50.000 a $10.000.000 (Norbu S.A.S.).
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están"
              subtitulo="39 de 42 cafeterías, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_CAFE}
              etiquetaUnidad="cafeterías"
            />
            <p className="mt-3 px-1 text-sm text-carbon/70">
              San Rafael, con 5 cafeterías (12&nbsp;% del nicho), es un polo llamativo para un
              departamento fuera del Gran Mendoza — explicado en buena parte por el grupo familiar
              Guillén (3 de esas 5) y por My Coffee/Café San Rafael, ambas también de esa zona.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Un caso de duplicado detectado</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Cafeteria Tina S.A.S. aparece dos veces en la base con fechas de publicación
              separadas por solo 8 días (17/10/2025 y 24/10/2025), el mismo socio (Erica Angélica
              López), el mismo capital ($1.000.000) y un objeto social casi idéntico con
              variaciones menores de redacción. Es, con alta probabilidad, la misma constitución
              societaria publicada dos veces en el Boletín (una corrección o repetición
              administrativa), no dos empresas distintas. Se cuenta una sola vez en todos los
              números de este informe (42 sociedades, no 43).
            </p>
          </div>
        </Reveal>

        {ENTIDADES.length > 0 && (
          <Reveal delay={0.5}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">Directorio completo: las 42 cafeterías y tostadurías</h2>
              <p className="mt-2 text-sm text-carbon/60">
                Ficha completa de cada una de las 42 sociedades identificadas, ordenadas por fecha
                de publicación del acto de Constitución en el Boletín (la que no tiene fecha
                capturada va al final).
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
                      <span className="font-bold">Objeto social:</span> {e.objetoSocial}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.55}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Búsqueda: a diferencia de otros nichos de esta serie, acá el filtro por nombre
                ("café", "coffee", "tostad%", "barista", "roaster") resultó mucho más preciso que
                buscar en el objeto social — 41 de las 43 candidatas tienen "café" o "coffee"
                literalmente en su razón social, y ese es el criterio principal de inclusión: una
                sociedad que se nombra a sí misma "Café X" se presenta públicamente como un negocio
                de café, más allá de que su objeto social legal sea el boilerplate genérico
                habitual de una S.A.S. Solo 2 de las 43 (Mondovi S.A. y Norbu S.A.S.) se incluyeron
                exclusivamente por objeto social, sin tener "café" en el nombre.
              </p>
              <p>
                Un caso de duplicado (Cafetería Tina, ver arriba) se detectó y se cuenta una sola
                vez.
              </p>
              <p>
                Cobertura ARCA: 20 de 42 (47,6&nbsp;%) tienen cruce con el padrón de AFIP, todas
                activas — mismo límite que en los informes anteriores: no alcanza para estimar
                cuántas siguen operando hoy.
              </p>
              <p>
                Como en toda la serie, las constituciones se cuentan por fecha de publicación del
                acto en el Boletín, no por fecha de constitución declarada.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mt-10">
            <FuenteDatos />
          </div>
        </Reveal>

        <Reveal delay={0.65}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El café de especialidad mendocino tiene la biografía de una categoría de consumo que
              se asentó de a poco y sin sobresaltos, muy distinta a la de la cerveza artesanal
              relevada en el informe anterior. Con una sola excepción real de integración vertical
              (Norbu, con importación de grano verde y fabricación propia de máquinas tostadoras),
              la mayoría son cafeterías de barrio o de franquicia que adoptaron el nombre "café"
              como marca — y al menos un grupo familiar en San Rafael que construyó, en tres años,
              una cadena chica bajo un mismo apellido y un mismo nombre de fantasía.
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
