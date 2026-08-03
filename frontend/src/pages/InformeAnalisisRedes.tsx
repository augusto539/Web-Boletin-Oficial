import { useState } from "react";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarrasHorizontal } from "../components/GraficoBarrasHorizontal";
import { GraficoLinea } from "../components/GraficoLinea";
import { GrafoRelacional } from "../components/GrafoRelacional";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  ANIOS_EVOLUCION,
  BETWEENNESS_TOP10,
  ESCENARIOS,
  ESCENARIOS_GRAFICO,
  ESTRUCTURA_G1,
  EVOLUCION_TABLA,
  FUNDADORES_EMBARCA,
  HOLDING_ARISTAS,
  HOLDING_NODOS,
  LEYENDA_ESCENARIOS,
  LEYENDA_HOLDING,
  LEYENDA_PARES_NICHOS,
  PARES_NICHOS,
  QUIEBRE_2022,
  SERIES_EVOLUCION,
} from "../data/analisisRedes";
import { registrarDescarga } from "../lib/descargasApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

const pct = (v: number) => `${v.toLocaleString("es-AR", { maximumFractionDigits: 1 })}%`;
const tresDecimales = (v: number) =>
  v.toLocaleString("es-AR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export default function InformeAnalisisRedes() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarAnalisisRedesPDF } = await import("../lib/exportarInforme");
      await exportarAnalisisRedesPDF();
      registrarDescarga("informe_analisis_redes", "pdf", null, "El mapa oculto de las sociedades mendocinas");
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
                Informe de datos · Análisis de redes
              </p>
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                El mapa oculto de las sociedades mendocinas
              </h1>
              <p className="mt-2 text-lg text-carbon/60">
                Qué dice la teoría de grafos del registro societario
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
            De todos los informes de esta serie, el único que no mira un rubro ni una variable: mira
            la forma del registro societario completo, tratado como lo que es —un grafo de 62.201
            vínculos, 19.563 sociedades y 33.694 personas— y deja que esa forma, no una hipótesis
            previa, dicte los hallazgos.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Julio de 2026 · Fuente: Boletín Oficial de la Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">El registro societario mendocino no es una red: es un archipiélago.</strong>{" "}
                Sobre 52.056 nodos hay 12.004 componentes conexas, y la componente típica tiene 3
                nodos — una sociedad y sus dos socios. La más grande reúne apenas el 3,1% del grafo.
              </li>
              <li>
                <strong className="text-carbon">Los domicilios compartidos, no la sociedad entre personas, son el tejido conectivo real.</strong>{" "}
                Sumar aristas sociedad-domicilio multiplica por 6,3 el tamaño de la componente
                gigante (de 3,1% a 18,9%).
              </li>
              <li>
                Hay un quiebre neto en 2022: hasta 2021 la conectividad vía domicilio crecía despacio
                (0,9% → 3,2%); en 2022 salta a 10,2% en un solo año y sigue creciendo hasta 18,6% en
                2026. La conectividad entre personas nunca se movió de ese nivel bajo.
              </li>
              <li>
                La misma métrica —centralidad de intermediación— encontró dos estructuras
                completamente distintas sin ninguna hipótesis previa: una red de cofundación ligada a
                una aceleradora de startups real, y un holding energético de 15 sociedades con
                directorio y domicilio idénticos.
              </li>
              <li>
                Los 12 nichos sectoriales de esta serie no se tocan entre sí de forma directa —
                cuando conectan, es casi siempre a través de domicilios compartidos.
              </li>
            </ul>
          </div>
        </Reveal>

        {/* 1. El archipiélago */}
        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">1. El archipiélago: por qué el registro no es una red</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Se construyó el grafo bipartito persona↔sociedad (una arista por cada vínculo: socio,
              administrador, director, síndico, apoderado) y se midió su estructura:
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <tbody>
                {ESTRUCTURA_G1.map((e) => (
                  <tr key={e.concepto} className="border-t border-carbon/10">
                    <td className="py-2.5 text-carbon/80">{e.concepto}</td>
                    <td className="py-2.5 text-right font-bold">{e.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              La componente típica del registro societario mendocino son una sociedad y sus dos
              socios — la S.A.S. estándar, sin ninguna conexión con el resto del universo. No hay
              "seis grados de separación": hay doce mil islas. Esto tiene una consecuencia
              metodológica inmediata: cualquier centralidad calculada sobre el grafo completo sería
              casi puro ruido, porque el 97% de los nodos vive en componentes donde no hay nada que
              medir. Por eso todo lo que sigue se calcula solo dentro de la componente gigante.
            </p>
          </div>
        </Reveal>

        {/* 2. Domicilios */}
        <Reveal delay={0.15}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">2. Lo que conecta el archipiélago: los domicilios</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                  <tr>
                    <th className="py-2">Escenario</th>
                    <th className="py-2">Componentes</th>
                    <th className="py-2">Componente gigante</th>
                  </tr>
                </thead>
                <tbody>
                  {ESCENARIOS.map((e) => (
                    <tr key={e.escenario} className="border-t border-carbon/10">
                      <td className="py-2.5 font-bold">{e.escenario}</td>
                      <td className="py-2.5">{e.componentes}</td>
                      <td className="py-2.5">
                        {e.nodos} ({pct(e.gigante)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              El domicilio compartido multiplica por 6,3 la componente gigante. La estructura del
              ecosistema societario mendocino no está en quién se asocia con quién: está en dónde se
              domicilian.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="El peso de los domicilios en la conectividad"
              subtitulo="% de nodos dentro de la componente gigante, por escenario"
              datos={ESCENARIOS_GRAFICO}
              etiquetaUnidad="del grafo"
              leyenda={LEYENDA_ESCENARIOS}
              formatearValor={pct}
            />
            <p className="mt-2 text-xs text-carbon/40">
              El escenario C es una advertencia metodológica, no un resultado: agrupar direcciones
              sin excluir barrios privados ni rutas infla la componente gigante un 23% adicional con
              puentes que no existen (los 27 vecinos de un mismo barrio privado, o sociedades a
              decenas de kilómetros bajo la misma "Ruta Provincial 50"). Todo este informe corre
              sobre el escenario B.
            </p>
          </div>
        </Reveal>

        {/* 3. Quiebre 2022 */}
        <Reveal delay={0.25}>
          <div className="mt-10">
            <GraficoLinea
              titulo="3. El quiebre de 2022"
              subtitulo="% de nodos en la componente gigante, grafo acumulado hasta cada año"
              series={SERIES_EVOLUCION}
              etiquetas={ANIOS_EVOLUCION}
              etiquetaUnidad="del grafo"
              formatearValor={pct}
              referencia={QUIEBRE_2022}
            />
            <p className="mt-2 text-xs text-carbon/40">
              G1: solo vínculos persona-sociedad. G2: + sociedad-domicilio (normalizador corregido,
              excluye barrios privados y rutas). El salto de 3,2% a 10,2% ocurre en un solo año y no
              vuelve a bajar.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-base font-bold">Componente gigante año a año</h3>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Año</th>
                  <th className="py-2">G1 — societario puro</th>
                  <th className="py-2">G2 — + domicilio</th>
                </tr>
              </thead>
              <tbody>
                {EVOLUCION_TABLA.map((e) => (
                  <tr key={e.anio} className={`border-t border-carbon/10 ${e.anio === "2022" ? "bg-vino/5" : ""}`}>
                    <td className="py-2.5 font-bold">{e.anio}</td>
                    <td className="py-2.5">{pct(e.g1)}</td>
                    <td className={`py-2.5 ${e.anio === "2022" ? "font-bold text-vino" : ""}`}>{pct(e.g2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              La lectura más consistente con el resto de esta serie: la consolidación del ecosistema
              no vino de que las personas empezaran a co-fundar más entre sí. Vino de que, a partir
              de 2022, más sociedades nuevas empezaron a compartir domicilio con sociedades ya
              existentes — el volumen creciente parece haber empujado a más constituyentes hacia
              gestores y estudios que ya domiciliaban a otros clientes. Es una lectura razonable a
              partir del dato, no una causalidad probada: el grafo muestra el qué, no el porqué.
            </p>
          </div>
        </Reveal>

        {/* 4. Puentes */}
        <Reveal delay={0.35}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="4. Quiénes son los puentes estructurales"
              subtitulo="Centralidad de intermediación dentro de la componente gigante (G1)"
              datos={BETWEENNESS_TOP10}
              etiquetaUnidad="de betweenness"
              formatearValor={tresDecimales}
            />
            <p className="mt-2 text-xs text-carbon/40">
              Ranking filtrado a personas: las sociedades aparecían como "puente" por pura estructura
              bipartita, no por ser intermediarias. Nada de esto implica irregularidad — "puente
              estructural" describe una posición dentro de un grafo, no una conducta.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-base font-bold">Una sorpresa frente a la hipótesis de partida</h3>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              No aparecen los nombres del informe de Domicilios Hub (los estudios que domicilian a
              decenas de clientes). El ranking por cantidad de sociedades y el ranking por posición
              estructural en el grafo no coinciden — miden cosas distintas. Domiciliar a muchos
              clientes te hace aparecer en muchas sociedades, pero no te convierte en puente
              estructural si esas sociedades, más allá de compartir domicilio, no comparten personas
              entre sí.
            </p>
            <h4 className="mt-5 text-sm font-bold">Compuerta de validación</h4>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">Fusión de identidad.</strong> Dos personas distintas
                fusionadas por nombre similar crean un puente falso, y la intermediación premia
                exactamente eso. De las 11 personas del top-20, las 11 tienen documento registrado —
                riesgo de fusión bajo.
              </li>
              <li>
                <strong className="text-carbon">Artefacto bipartito.</strong> Una sociedad con muchos
                socios es, por pura estructura, un "puente" entre ellos sin ser un intermediario
                real. Se confirmó: 2 sociedades grandes aparecían en el ranking crudo por ese motivo.
                Se resolvió filtrando la intermediación a nodos de tipo persona únicamente.
              </li>
            </ul>
          </div>
        </Reveal>

        {/* 5.1 Embarca */}
        <Reveal delay={0.45}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">5.1 La red de cofundación de Embarca</h2>
            <p className="mt-2 text-sm leading-relaxed text-carbon/80">
              Las 15 personas de mayor intermediación están conectadas a 61 sociedades constituidas
              entre 2017 y 2022, con un ancla identificable: Embarca Aceleradora De Startups S.A.S.,
              constituida el 2 de noviembre de 2017. Embarca existe: es una aceleradora y fondo de
              capital de riesgo con sede en Mendoza, fundada en 2017 —coincide exactamente con la
              fecha de constitución en la base—. Tres de sus cuatro fundadores públicos están en el
              registro, con IDs de persona consecutivos:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                  <tr>
                    <th className="py-2">Fundador (fuente pública)</th>
                    <th className="py-2">En la base</th>
                  </tr>
                </thead>
                <tbody>
                  {FUNDADORES_EMBARCA.map((f) => (
                    <tr key={f.publico} className="border-t border-carbon/10">
                      <td className="py-2.5 font-bold">{f.publico}</td>
                      <td className="py-2.5 text-carbon/70">{f.enLaBase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              <strong className="text-carbon">El hallazgo que corrigió el análisis.</strong> El
              portfolio público de Embarca son 15 empresas. De esas, 6 existen en el Boletín de
              Mendoza, y solo 1 cayó en el clúster que encontró la centralidad — y llegó ahí por una
              coincidencia. Ningún fundador de Embarca figura como socio en ninguna empresa de su
              propio portfolio. La explicación es estructural: el equity que una aceleradora toma se
              transfiere después de que la empresa ya se constituyó, y esos actos casi no se
              publican (22 cesiones y 23 aumentos de capital en 22.065 actos).
            </p>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              <strong className="text-carbon">Qué es entonces el clúster.</strong> No es el portfolio
              de la aceleradora: es la red personal de cofundación de sus socios. Grupo Mdd S.A.S. —el
              nodo individual de mayor betweenness de todo el grafo— declara como objeto "inversión
              mediante compra, venta o permuta de acciones" y reúne a 12 cosocios. Lo que la
              centralidad detectó no son startups: son los vehículos con los que un grupo de
              inversores sindica capital entre sí. Que el método haya encontrado esa estructura sin
              saber nada de Embarca de antemano es una validación fuerte; que no haya podido ver el
              portfolio es una demostración igual de clara de su límite.
            </p>
          </div>
        </Reveal>

        {/* 5.2 Holding */}
        <Reveal delay={0.5}>
          <div className="mt-10">
            <GrafoRelacional
              titulo="5.2 El holding energético: gobierno corporativo replicado"
              subtitulo="Núcleo más denso del grafo (k-core máximo = 7, calculado sobre G2)"
              nodos={HOLDING_NODOS}
              aristas={HOLDING_ARISTAS}
              leyenda={LEYENDA_HOLDING}
            />
            <p className="mt-2 text-xs text-carbon/40">
              Las quince sociedades (Allen, Auquinco, Butaco, Calbuco, Collico, Kuar, Kuntur, Kunuk,
              Liuco, Nahuen, Nauco, Petrehué, Trancurá, Xetiu e Yelap Energía S.A.) se constituyeron
              en un lapso de tres meses de 2017 con el mismo directorio, los mismos síndicos y el
              mismo domicilio. El informe fuente nombra a los tres directores titulares pero no a los
              síndicos, que acá van identificados por su rol.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-carbon/80">
              Cruzado contra el catálogo CLAE, la confirmación es total e independiente:{" "}
              <strong className="text-carbon">14 de las 15 tienen actividad registrada, 13 declaran "Generación de energía n.c.p." y 1 "Generación de energía hidráulica"</strong>.
              Es la estructura clásica de sociedades vehículo (SPV) de un grupo de generación de
              energía, cada una nombrada como un proyecto distinto bajo el mismo grupo controlante.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El contraste entre las dos historias es el hallazgo real de esta sección: la misma
              métrica, aplicada sin prejuicio sectorial, encontró tanto una red de cofundación
              variable y heterogénea (Embarca) como gobierno corporativo replicado sin variación (el
              holding). Son dos formas opuestas de "estructura económica no declarada como tal", y el
              grafo las distingue solo por su forma.
            </p>
          </div>
        </Reveal>

        {/* 6. Nichos */}
        <Reveal delay={0.6}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="6. ¿Los nichos de esta serie están aislados entre sí?"
              subtitulo="Personas compartidas entre pares de nichos sectoriales"
              datos={PARES_NICHOS}
              etiquetaUnidad="personas"
              leyenda={LEYENDA_PARES_NICHOS}
            />
            <p className="mt-2 text-xs text-carbon/40">
              Ninguna sociedad pertenece a dos nichos a la vez; donde hay conexión, es por personas
              compartidas. El par Cannabis ↔ Publicidad resultó ser un falso cruce: las 8 personas
              vienen de una sola sociedad, una productora de eventos capturada por dos criterios de
              búsqueda distintos.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.65}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-carbon/80">
              El primer par no sorprende: es el mismo ecosistema vitivinícola visto desde dos
              ángulos, y esta es la primera vez que esa superposición queda medida en vez de asumida.
              El segundo sí es una señal nueva: agencias digitales y software factories comparten un
              perfil de fundador tecnológico mendocino.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              <strong className="text-carbon">Ningún nicho, por sí solo, es central en el grafo general</strong>:
              todos caen entre el 0% y el 22,9% dentro de la componente gigante. Cuando un nicho
              conecta con el resto, es casi siempre vía domicilios compartidos, no por vínculos
              societarios directos con otros rubros — la misma conclusión de la sección 2, confirmada
              ahora nicho por nicho.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.7}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                <strong className="text-carbon">Modelo de grafo.</strong> Se construyeron tres grafos
                distintos, nunca mezclados: G1 (societario puro: persona↔sociedad), G2 (G1 +
                sociedad↔domicilio) y G3 (proyección persona-persona, ponderada por 1/(n−1) al estilo
                Newman, para que una sociedad de 36 socios no genere sola un clique que domine
                cualquier métrica). Toda cifra indica de cuál de los tres proviene — no son
                intercambiables.
              </p>
              <p>
                <strong className="text-carbon">Comunidades (Louvain).</strong> Se corrió detección de
                comunidades con 10 semillas distintas sobre la componente gigante de G2: entre 100 y
                106 comunidades por corrida, con 68,9% de estabilidad. Es una señal de estructura
                real, no ruido puro, pero tampoco una partición definitiva — se usa solo para orientar
                dónde mirar, no como un mapa cerrado de "grupos económicos".
              </p>
              <p>
                <strong className="text-carbon">Escribanos.</strong> Se evaluó si el escribano
                interviniente podía funcionar como un eje adicional del grafo. Cobertura: 6,9% de los
                actos. Insuficiente para una sección propia; se descarta y queda como límite
                documentado.
              </p>
              <p>
                <strong className="text-carbon">Un error propio, corregido antes de publicar.</strong>{" "}
                Correr k-core sobre G1 (sin domicilios) da un resultado distinto y espurio para la
                sección 5.2: mezcla, en un mismo núcleo denso, un grupo de parques renovables, un
                grupo farmacéutico y una sociedad sin relación entre ellos. Se detectó al notar que el
                resultado no tenía sentido de negocio, se descartó, y se usó la corrida sobre G2.
              </p>
              <p>
                <strong className="text-carbon">Nada de lo que aparece en este informe implica irregularidad.</strong>{" "}
                "Puente estructural" describe una posición dentro de un grafo, no una conducta.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.75}>
          <div className="mt-10">
            <FuenteDatos />
          </div>
        </Reveal>

        <Reveal delay={0.8}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El registro societario de Mendoza, mirado como lo que es —un grafo—, no es una red de
              negocios interconectados: es un archipiélago de doce mil islas que empezó a conectarse
              recién en 2022, y casi exclusivamente a través de domicilios compartidos. Cuando se
              mira dentro de esa conectividad con una sola métrica y sin hipótesis sectorial previa,
              aparecen dos estructuras económicas reales que ningún informe de nicho de esta serie
              había encontrado por su cuenta: una red de sindicación de inversores en torno a una
              aceleradora tecnológica verificable, y un holding energético con gobierno corporativo
              replicado. La primera sirvió para demostrar en vivo tanto la potencia del método como
              su límite exacto: el Boletín Oficial registra quién funda una empresa, no quién termina
              siendo dueño de ella.
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
