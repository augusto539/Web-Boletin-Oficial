import { useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  DEPARTAMENTOS_CRIPTO,
  ENTIDADES,
  EVOLUCION_ANUAL,
  LEYENDA_EVOLUCION,
  TIPO_ENTIDAD,
} from "../data/nichoCriptoFintech";
import { registrarDescarga } from "../lib/descargasApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoCriptoFintech() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarNichoCriptoFintechPDF } = await import("../lib/exportarInforme");
      await exportarNichoCriptoFintechPDF();
      registrarDescarga("informe_nicho_cripto_fintech", "pdf", null, "Cripto y Fintech en Mendoza");
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">Cripto y fintech en Mendoza</h1>
              <p className="mt-2 text-lg text-carbon/60">El termómetro del boom</p>
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
            Catorce empresas alcanzan para contar una historia: las constituciones societarias de
            cripto y fintech en Mendoza siguen, con meses de rezago, el pulso del ciclo global de
            precio de Bitcoin. Cuando el mercado sube, aparecen empresas en el Boletín Oficial;
            cuando cae, el registro se apaga.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Julio de 2026 · Quinto de la serie de nichos sectoriales · Fuente: Boletín Oficial de la
            Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">14 empresas</strong> de cripto/blockchain y fintech
                identificadas entre 2017 y 2026 en el Boletín Oficial de Mendoza. Es la muestra más
                chica de esta serie de informes, pero con un patrón temporal muy claro.
              </li>
              <li>
                Las constituciones siguen de cerca el ciclo de precio de Bitcoin: 9 de las 14
                (64,3&nbsp;%) se concentran en 2020-2022, coincidiendo con el boom de precios de
                2020-2021 (Bitcoin superó los US$&nbsp;60.000 en noviembre de 2021) y su resaca
                inmediata. Después, un silencio casi total en 2023 —el año más duro del "crypto
                winter"— y una segunda ola más chica pero de mayor capital en 2024-2026, en sintonía
                con la recuperación del precio y la aprobación de los ETF de Bitcoin en EE.UU. a
                inicios de 2024.
              </li>
              <li>
                La primera ola (2020-2022) se reparte casi por igual entre S.A. (6) y S.A.S. (6), con
                dos S.R.L. La segunda ola (2024-2026, 4 empresas) muestra capitales bastante más
                altos.
              </li>
              <li>
                El capital total declarado por las 14 empresas es de{" "}
                <strong className="text-carbon">$61.562.000</strong>, con una mediana de $600.000 —
                bien por encima de la mediana general de $100.000, aunque con mucha dispersión: desde
                $40.000 hasta $30.000.000 en un mismo caso (SDM S.A., 2025).
              </li>
              <li>
                Las 14 empresas tienen departamento identificado (100&nbsp;% de cobertura, algo
                inusual en esta serie): 8 en Capital, 3 en Godoy Cruz, 2 en San Rafael y 1 en Luján de
                Cuyo.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">
              Qué es cripto/blockchain, qué es fintech, y por qué van juntos
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Cripto/blockchain y fintech son dos categorías con una frontera borrosa. La primera
                abarca la compraventa, custodia y minería de criptomonedas y el desarrollo de
                tecnología blockchain; la segunda, las billeteras virtuales, los medios de pago
                digitales y los servicios financieros por plataforma. En la práctica, muchas empresas
                del rubro combinan ambas actividades en un mismo objeto social —billetera virtual más
                custodia de cripto, por ejemplo—, y el nomenclador CLAE tampoco distingue ninguna de
                las dos como categoría propia: quedan disueltas dentro de "servicios financieros" o
                "actividades informáticas" genéricas. Por eso este informe las trata como un mismo
                fenómeno de finanzas digitales en sentido amplio.
              </p>
              <p>
                Hay otra razón para leerlas juntas, y es la que define el carácter de este informe. A
                diferencia de otros rubros de esta serie, que tuvieron un disparador legal claro —la
                Ley 27.669 para el cannabis, el Programa RenovAr para la energía renovable—, acá el
                disparador es puramente de mercado: el precio de Bitcoin y de las criptomonedas en
                general, que atravesó en estos años un ciclo de auge y caída muy marcado. Como se ve
                en la sección siguiente, ese ciclo se refleja con una correlación notable en las
                constituciones societarias de Mendoza.
              </p>
              <p>
                Es, de hecho, el único informe de la serie donde el "disparador" no es una política
                pública argentina sino un ciclo de mercado global —lo que lo convierte en un caso de
                estudio distinto.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Evolución temporal: el ciclo de Bitcoin, en miniatura</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                El patrón temporal es el corazón de este informe. Para leerlo hace falta tener a mano
                el ciclo de precio de Bitcoin: 2020-2021 fue el boom, con el precio en alza sostenida
                y un pico en noviembre de 2021 por encima de los US$&nbsp;60.000. 2022 fue el "crypto
                winter": el precio cayó de unos US$&nbsp;47.000 a menos de US$&nbsp;16.000 a fines de
                año. 2023 fue el año de la recuperación lenta. 2024 marcó la aprobación de los
                primeros ETF spot de Bitcoin en Estados Unidos, y el precio superó por primera vez los
                US$&nbsp;100.000 a fin de año. 2025 llegó a nuevos máximos históricos, por encima de
                US$&nbsp;124.000.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Cripto y fintech en Mendoza: el ciclo de Bitcoin, en miniatura"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="empresas"
              leyenda={LEYENDA_EVOLUCION}
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es un año parcial: boletines relevados hasta julio de 2026. ** No hay empresas de
              este rubro en la muestra antes de 2020.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="text-sm leading-relaxed text-carbon/80">
              <p>
                La correspondencia es difícil de ignorar. Nueve de las 14 empresas (64,3&nbsp;%) se
                concentran en el trienio 2020-2022 —el boom y su resaca inmediata—, y las 5 restantes
                aparecen recién desde fines de 2024 en adelante, en sintonía con la segunda gran suba
                del precio. En el medio, 2023: ni una sola constitución nueva del rubro en todo el
                año.
              </p>
              <p className="mt-3">
                Ese cero de 2023 merece una lectura aparte. El precio de Bitcoin tocó fondo a fines de
                2022 y durante 2023 ya venía recuperándose, pero en Mendoza el silencio registral
                llegó con rezago respecto al piso del mercado. Es un desfasaje esperable: los
                emprendedores tardan en animarse a formalizar un proyecto hasta ver una recuperación
                sostenida, no solo un rebote. Constituir una sociedad es una apuesta a mediano plazo,
                y nadie la hace mirando el precio del día.
              </p>
              <p className="mt-3">
                Vale ser claros sobre el alcance del hallazgo: la muestra es de apenas 14 casos, y con
                ese tamaño nadie puede hablar de una prueba estadística contundente. Pero como
                hallazgo cualitativo es genuinamente interesante: una serie de datos hiperlocal
                —constituciones societarias en una provincia argentina— que reproduce, con meses de
                rezago, un ciclo de mercado global. El termómetro es chico, pero mide.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">
              Tipo societario y capital: la segunda ola apuesta más fuerte
            </h2>
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
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                A diferencia de otros informes de la serie, acá no hay un tipo societario claramente
                dominante: S.A. y S.A.S. empatan con 6 casos cada una, con dos S.R.L. completando el
                cuadro. Es un contraste con el resto de la economía mendocina, donde la S.A.S. suele
                liderar cómodamente.
              </p>
              <p>
                En materia de capital, las 14 empresas declaran capital inicial. El total suma
                $61.562.000, con una mediana de $600.000, un mínimo de $40.000 (Bitmonedero S.A.S.,
                2020) y un máximo de $30.000.000 (SDM S.A., 2025).
              </p>
              <p>
                Lo que distingue a la segunda ola (2024-2026) es justamente el capital: de las 4
                empresas de ese tramo, los capitales declarados son notablemente más altos —hasta
                $30.000.000 en un caso y $24.000.000 en otro— que los de la primera ola (2020-2022,
                mayormente entre $40.000 y $1.500.000). El dato es consistente con la idea de un
                mercado más maduro, con más capital institucional dispuesto a entrar después de la
                aprobación de los ETF y la consolidación del sector a nivel global. Si la primera ola
                fue de entusiastas, la segunda parece ser de apuestas más serias.
              </p>
              <p>
                La mediana de $600.000 —seis veces la mediana general de $100.000 de la economía
                mendocina— es otra señal en la misma dirección: este es un rubro que, cuando decide
                formalizarse, entra con un capital declarado bastante por encima del promedio.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están domiciliadas las empresas de cripto y fintech"
              subtitulo="14 de 14 empresas, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_CRIPTO}
              etiquetaUnidad="empresas"
            />
            <div className="mt-3 space-y-3">
              <p className="px-1 text-sm text-carbon/50">
                Las 14 empresas tienen departamento identificado (100&nbsp;% de cobertura).
              </p>
              <p className="px-1 text-sm text-carbon/70">
                Las 14 empresas tienen departamento identificado —100&nbsp;% de cobertura, algo
                inusual en esta serie, donde 1 o 2 casos suelen quedar sin departamento resuelto—. Y a
                diferencia de informes como los de bodegas o energía, acá no hace falta la advertencia
                sobre la brecha entre domicilio legal y zona real de actividad: un negocio de cripto o
                fintech no tiene una "zona de producción" física equivalente a un viñedo o un parque
                solar. El domicilio legal de una fintech es, razonablemente, donde opera. Capital
                concentra más de la mitad de los casos (8 de 14), algo coherente con un rubro digital,
                de oficina, sin necesidad de infraestructura distribuida por el territorio.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Directorio completo: las 14 empresas</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Ficha completa de cada una de las 14 sociedades identificadas, ordenadas por fecha de
              publicación del acto de constitución en el Boletín: tipo, CUIT, capital inicial
              declarado, fecha de publicación, departamento, socios/integrantes y objeto social
              completo.
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

        <Reveal delay={0.45}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y fuente de datos</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                La fuente es la sección "Contratos Sociales" del Boletín Oficial de la Provincia de
                Mendoza, período 2017-2026. La búsqueda inicial se hizo por nombre y objeto social,
                con términos como cripto, crypto, blockchain, bitcoin, fintech, activos digitales,
                billetera virtual, medios de pago, pasarela de pago, moneda digital, activos virtuales
                y exchange, y arrojó 35 candidatas.
              </p>
              <p>
                Igual que en los informes anteriores de la serie, ese filtro inicial es ruidoso:
                varias S.A.S. con objeto social boilerplate mencionan "criptomonedas" o "fintech"
                entre 15 o 20 actividades no relacionadas. Hay incluso casos donde el nombre de la
                empresa sugiere el rubro —"Leydek Fintech", "Qiang Fintech Argentina"— pero el objeto
                social registrado es puro boilerplate genérico, sin ninguna mención específica de la
                actividad real. Cada una de las 35 candidatas se revisó individualmente, y el filtro
                descartó 21 de las 35 (60&nbsp;%) —la proporción de descarte más alta de toda la serie
                hasta ahora. Las 14 que quedaron son las que este informe analiza.
              </p>
              <p>
                Es, con diferencia, la muestra más chica de la serie, y vale decirlo con la misma
                honestidad que en los informes anteriores: el valor de este informe no está en el
                volumen sino en el patrón temporal, que es nítido a pesar del tamaño chico de la
                muestra.
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
              Este es el quinto informe de la serie de nichos sectoriales, y el primero que combina
              dos rubros afines en uno solo. La muestra es chica —14 empresas, la menor de toda la
              serie—, pero el hallazgo es contundente: ni siquiera en una provincia lejos de las
              grandes plazas financieras el ciclo de Bitcoin pasa desapercibido. Se nota, con meses de
              rezago, en algo tan concreto como el ritmo al que la gente decide —o no— formalizar un
              proyecto de cripto o fintech.
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
