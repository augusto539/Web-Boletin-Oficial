import { useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  DEPARTAMENTOS_BODEGAS,
  ENTIDADES,
  EVOLUCION_ANUAL,
  TIPO_ENTIDAD,
} from "../data/nichoBodegasBoutique";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoBodegasBoutique() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarNichoBodegasBoutiquePDF } = await import("../lib/exportarInforme");
      await exportarNichoBodegasBoutiquePDF();
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">Bodegas boutique en Mendoza</h1>
              <p className="mt-2 text-lg text-carbon/60">La otra vitivinicultura mendocina</p>
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
            63 bodegas y emprendimientos vitivinícolas chicos se constituyeron o registraron
            actividad en el Boletín Oficial de Mendoza entre 2017 y 2026, con una mediana de
            capital inicial de apenas $200.000. Lejos de las grandes bodegas industriales, es un
            flujo que no explota ni se apaga: se sostiene, año tras año, durante toda la década.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Julio de 2026 · Tercero de la serie de nichos sectoriales · Fuente: Boletín Oficial de
            la Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">63 bodegas y emprendimientos vitivinícolas</strong>{" "}
                identificados entre 2017 y 2026 en el Boletín Oficial de la Provincia de Mendoza,
                cuya actividad real es la explotación de viñedos y/o la elaboración de vino propio
                — no la comercialización de vinos de terceros.
              </li>
              <li>
                A diferencia de otros rubros de esta misma serie, este no es un fenómeno nuevo: las
                bodegas chicas se vienen constituyendo de forma sostenida durante los diez años de
                cobertura, con un pico de 9 en 2023 y un piso de 3 en 2017 — sin la aceleración
                reciente que sí se observa, por ejemplo, en enoturismo.
              </li>
              <li>
                La mediana de capital inicial declarado es de $200.000, con un rango que va de
                $25.000 a $60.000.000. La inmensa mayoría son emprendimientos chicos, con un puñado
                de excepciones de mayor escala. El capital total declarado por las 59 empresas que
                lo informan es de $202,5 millones.
              </li>
              <li>
                33 de las 63 (52,4 %) eligieron la S.A.S., pero la S.A. tiene una presencia
                inusualmente alta: 28 de 63 (44,4 %) — muy por encima de lo que se ve en el resto de
                la economía societaria mendocina, donde la S.A.S. suele arrasar. Solo 2 (3,2 %) son
                S.R.L.
              </li>
              <li>
                5 de las 63 bodegas de la muestra no tienen fecha de constitución capturada en la
                base — probablemente porque se fundaron antes de 2017, fuera de la ventana de
                cobertura del Boletín digitalizado, y aparecen acá por actos posteriores
                (modificaciones, cambios de autoridades) publicados entre 2017 y 2026. Entre ellas
                hay nombres reconocidos como Bodega Atamisque S.A.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">
              Qué es una "bodega boutique" y por qué es distinta de la industria grande
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Mendoza tiene una industria vitivinícola de escala industrial —grandes bodegas
                centenarias, marcas exportadoras que mueven millones de litros— conviviendo con un
                fenómeno paralelo mucho menos visible en las estadísticas: emprendimientos chicos,
                muchas veces familiares o de pocos socios, que cultivan unas pocas hectáreas y
                elaboran vino propio en volúmenes acotados. Es lo que en la jerga del sector se
                conoce como "bodega boutique" o "bodega de autor".
              </p>
              <p>
                El problema para medirlas es que el nomenclador oficial de actividades económicas
                (CLAE) no distingue entre ambas escalas: "elaboración de vinos" es una sola
                categoría, que mete en la misma bolsa a una bodega que exporta millones de litros y
                a un emprendimiento de dos hectáreas. Este informe usa el Boletín Oficial —donde
                cada sociedad declara su propio capital inicial al constituirse— para poder, por
                primera vez, aislar a los actores chicos del promedio industrial.
              </p>
              <p>
                Un dato de contexto: el boom de la S.A.S. desde 2017 —tema de otro informe de esta
                misma serie— les dio a estos emprendimientos chicos una vía de formalización mucho
                más rápida y barata que la que existía antes. Aunque, como se verá más adelante, en
                este rubro en particular la S.A. sigue siendo protagonista, probablemente porque
                muchas de estas bodegas vienen de estructuras familiares más antiguas.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Evolución temporal: un fenómeno sostenido, no una moda"
              subtitulo="Bodegas y emprendimientos constituidos por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="bodegas"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es un año parcial: boletines relevados hasta julio de 2026. ** Las otras 5
              bodegas de la muestra (de 63 totales) no tienen fecha de constitución capturada en la
              base y no figuran en este gráfico, aunque sí están incluidas en el directorio.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="text-sm leading-relaxed text-carbon/80">
              <p>
                Si los informes anteriores de esta serie contaban historias de aceleración, este
                cuenta la contraria —y ahí está su interés—. Acá no hay curva que despega: el ritmo
                de constituciones se mantiene en un rango de 3 a 9 por año durante toda la década,
                con 2023 como pico (9) y 2017 como piso (3, aunque es el primer año de la serie y su
                cobertura es parcial). No hay tendencia clara de crecimiento ni de caída. Es un
                flujo constante.
              </p>
              <p className="mt-3">
                El contraste con Enoturismo y Cannabis —los dos informes previos de esta serie,
                ambos con una aceleración fuerte en 2023-2025— es explícito y deliberado: las
                bodegas boutique no responden a una moda ni a un cambio regulatorio reciente.
                Responden a una demanda estructural y constante de la región. Todos los años, en
                Mendoza, un puñado de familias, socios o enólogos independientes decide formalizar
                su proyecto de vino propio. Pasó en 2017, pasó en pandemia, pasó en 2023 y sigue
                pasando.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">
              Tipo societario y capital: acá la S.A. pelea de igual a igual
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
                Este es el hallazgo diferencial más fuerte del informe. En casi todos los demás
                rubros analizados en esta serie —y en la economía societaria mendocina en general—
                la S.A.S. arrasa, con proporciones del 70 al 90 %. Acá no: la S.A.S. encabeza con 33
                casos (52,4 %), pero la S.A. la sigue de cerca con 28 (44,4 %), una proporción mucho
                más alta que en cualquier otro rubro analizado hasta ahora. La S.R.L. es
                testimonial: 2 casos (3,2 %).
              </p>
              <p>
                Una hipótesis razonable —es una lectura, no un hecho probado—: el sector
                vitivinícola arrastra estructuras societarias más antiguas y familiares, muchas
                veces heredadas de generación en generación, que ya estaban constituidas como S.A.
                antes de que la S.A.S. existiera. O directamente se sigue prefiriendo la S.A. en
                este rubro, por tradición o por la escala de activos —tierra, viñedos— que estas
                sociedades manejan, aun cuando su capital declarado sea chico.
              </p>
              <p>
                Sobre el capital: 59 de las 63 sociedades declaran capital inicial (entre las
                restantes están las bodegas "legacy" sin acto de constitución capturado). La
                mediana es de $200.000, con un mínimo de $25.000 y un máximo de $60.000.000. Esa
                mediana duplica la mediana general de la economía mendocina ($100.000), pero sigue
                siendo un capital claramente chico —consistente con el recorte de "boutique" que da
                nombre al informe. El caso de $60.000.000 (Bodega Morato Gonzalez S.A.S.) es un
                outlier, un solo caso muy por encima del resto: hay que nombrarlo, pero no
                representa al grueso de la muestra.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están domiciliadas las bodegas boutique"
              subtitulo="61 de 63 sociedades, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_BODEGAS}
              etiquetaUnidad="bodegas"
            />
            <div className="mt-3 space-y-3">
              <p className="px-1 text-sm text-carbon/50">
                61 de las 63 sociedades tienen departamento identificado; 2 no.
              </p>
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-800">Advertencia metodológica</p>
                <p className="mt-1.5 text-sm leading-relaxed text-amber-900/80">
                  La misma advertencia que en los informes anteriores de la serie: que Capital
                  lidere con 13 de 63 no significa que ahí estén los viñedos. Lo que se registra es
                  el domicilio LEGAL de la sociedad, que suele coincidir con el estudio contable o
                  jurídico que la constituyó, no con la finca. Dicho eso, hay una diferencia con
                  Enoturismo y Cannabis: acá la distribución fuera de Capital está menos concentrada
                  en un solo departamento y más repartida entre las zonas vitivinícolas
                  tradicionales de la provincia —Luján de Cuyo (10), San Martín y Guaymallén (6 cada
                  uno), San Rafael y Maipú (5 cada uno)—. Ese reparto, sumado, más que duplica a
                  Capital y refleja bastante mejor la geografía real de la producción vitivinícola
                  mendocina: la Primera Zona (Luján de Cuyo), el Este (San Martín), el Valle de Uco
                  (Tunuyán) y el Sur (San Rafael).
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Directorio completo: las 63 bodegas y emprendimientos</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Ficha completa de cada una de las 63 sociedades identificadas, ordenadas por fecha de
              publicación del acto de constitución en el Boletín (las 5 sin fecha capturada van al
              final).
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
                          {s.personaId ? (
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

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y fuente de datos</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Fuente: sección "Contratos Sociales" del Boletín Oficial de la Provincia de Mendoza,
                período 2017-2026. Búsqueda inicial: se partió de una búsqueda por nombre ("bodega",
                "viñedo", "viñas", "viña") y por objeto social (elaboración de vino combinada con
                cultivo o viñedos), que arrojó 112 candidatas.
              </p>
              <p>
                El problema de la palabra "bodega": este informe tuvo un desafío metodológico
                específico que los anteriores de la serie no tenían: en español, "bodega" es una
                palabra ambigua. Además de bodega de vino, significa depósito o almacén de guarda.
                Entre las 112 candidatas aparecieron empresas de guarda y almacenamiento
                (self-storage), proveedoras de insumos para bodegas (sin ser ellas mismas
                productoras) y uniones transitorias de otros rubros con "Bodega" en el nombre
                compuesto de una de las partes —ninguna de ellas relacionada con el vino.
              </p>
              <p>
                Filtro manual: cada una de las 112 candidatas se revisó individualmente para
                confirmar que la actividad real fuera la explotación de viñedos y/o la elaboración
                de vino propio —no la comercialización de vinos de terceros ni el depósito de
                mercadería. El filtro descartó 49 de las 112 (43,8 %). Las 63 que quedaron son las
                que este informe analiza.
              </p>
              <p>
                Fechas: como en los demás informes de la serie, las constituciones se cuentan por
                fecha de publicación del acto en el Boletín, no por la fecha de constitución
                declarada en el contrato (existe un rezago normal entre ambas). 5 de las 63 bodegas
                no tienen acto de Constitución capturado en la base —probablemente porque son
                preexistentes a 2017 y aparecen por actos posteriores— y por eso no figuran en el
                gráfico de evolución temporal, aunque sí están incluidas en el directorio.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10">
            <FuenteDatos>
              <p>
                <strong className="text-carbon">Nota de metodología de este informe.</strong> La
                tabla de evolución anual se calculó a partir de la fecha de publicación de las 58
                bodegas del directorio que sí tienen acto de constitución capturado en la base
                (todas cruzadas por CUIT o por nombre contra la base real). Los 5 casos sin fecha
                aparecen en el directorio pero no en el gráfico de evolución. El capital se expresa
                en pesos nominales, sin ajuste por inflación.
              </p>
            </FuenteDatos>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Este es el tercer informe de la serie de nichos sectoriales sobre el Boletín Oficial
              de Mendoza, después de Cannabis y Enoturismo. Y deja una lección distinta a la de sus
              antecesores: no todos los rubros son fenómenos nuevos en plena aceleración. Las
              bodegas boutique muestran que el emprendimiento societario pequeño convive desde
              siempre con la industria grande en Mendoza —no es una tendencia, es una parte
              estructural y permanente del mapa vitivinícola provincial.
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
