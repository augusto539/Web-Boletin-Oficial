import { useState } from "react";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoBarrasHorizontal } from "../components/GraficoBarrasHorizontal";
import { GraficoDona } from "../components/GraficoDona";
import { GraficoLinea } from "../components/GraficoLinea";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  BAJAS_SITUACION,
  CLUSTERS,
  COBERTURA_ANUAL,
  COBERTURA_ANUAL_GRAFICO,
  COLA_LARGA,
  DIVERSIFICACION,
  DIVERSIFICACION_GRAFICO,
  EVOLUCION_GRAFICO,
  GRUPOS_VACIOS,
  LEYENDA_EVOLUCION,
  LEYENDA_LOCALIZACION,
  LEYENDA_NCP,
  LEYENDA_NICHOS,
  LEYENDA_TASA_BAJA,
  LINEA_BASE_RECIENTE,
  LOCALIZACION,
  NICHOS_COBERTURA,
  NICHOS_GRAFICO,
  PARES_COOCURRENCIA,
  RESIDUALES,
  TASA_BAJA_GRAFICO,
  TOP_ACTIVIDADES,
  TOP_ACTIVIDADES_GRAFICO,
} from "../data/actividadesClae";
import { registrarDescarga } from "../lib/descargasApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

const pct = (v: number) => `${v.toLocaleString("es-AR", { maximumFractionDigits: 1 })}%`;

export default function InformeActividadesClae() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarActividadesClaePDF } = await import("../lib/exportarInforme");
      await exportarActividadesClaePDF();
      registrarDescarga("informe_actividades_clae", "pdf", null, "Actividades CLAE en Mendoza");
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
                Informe de datos · Corte transversal
              </p>
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                Qué hacen realmente las empresas mendocinas
              </h1>
              <p className="mt-2 text-lg text-carbon/60">
                Anatomía del nomenclador CLAE
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
            Este informe no analiza un rubro: analiza el instrumento con el que se clasifican todos
            los rubros. Sobre 25.583 asignaciones de actividad a 11.918 sociedades mendocinas, mide
            qué declara cada empresa que hace, qué actividades abandona, qué combinaciones forman
            cadenas de valor reales, y cuánto de la economía mendocina termina metida en cajones de
            sastre porque el nomenclador no tiene una casilla mejor.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Julio de 2026 · Fuente: Boletín Oficial de Mendoza cruzado con el padrón CLAE de ARCA (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">El 42,3% de todas las asignaciones de actividad son categorías residuales "n.c.p."</strong>{" "}
                (no clasificado en otra parte). Entre las actividades principales el porcentaje sube
                al 44,7%: casi la mitad de las empresas mendocinas tiene como actividad declarada
                principal un cajón de sastre.
              </li>
              <li>
                La actividad más frecuente de toda la economía mendocina es "Servicios empresariales
                n.c.p." (672 asignaciones) — literalmente, "servicios a empresas que no supimos dónde
                poner".
              </li>
              <li>
                <strong className="text-carbon">Las bajas de actividad no miden muerte de empresas:</strong>{" "}
                ninguna de las 11.918 sociedades tiene todas sus actividades dadas de baja. Son poda
                de actividades dentro de empresas que siguen vivas — 1.514 sociedades (12,7%) podaron
                alguna.
              </li>
              <li>
                Diez clusters económicos reales emergen del análisis de co-ocurrencia (modularidad
                Q=0,390), y no coinciden con la jerarquía del nomenclador: el cluster vitivinícola une
                cultivo, elaboración y venta mayorista, tres ramas CLAE distintas.
              </li>
              <li>
                Especialización geográfica nítida: Tupungato tiene 11 veces más servicios de apoyo
                agrícola de lo que le correspondería por su tamaño; General Alvear, 11 veces más cría
                de animales; Capital, 2,6 veces más servicios jurídicos.
              </li>
              <li>
                19 grupos CLAE completos no tienen ni una sola sociedad mendocina — el retrato en
                negativo de lo que Mendoza no produce: pesca, carbón, armas, locomotoras,
                instrumentos musicales, reaseguros.
              </li>
            </ul>
          </div>
        </Reveal>

        {/* 1. Cajón de sastre */}
        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">1. El nomenclador es, sobre todo, un cajón de sastre</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2"></th>
                  <th className="py-2">Asignaciones</th>
                  <th className="py-2">%</th>
                </tr>
              </thead>
              <tbody>
                {RESIDUALES.map((r) => (
                  <tr key={r.etiqueta} className="border-t border-carbon/10">
                    <td className="py-2.5 font-bold">{r.etiqueta}</td>
                    <td className="py-2.5">{r.valor.toLocaleString("es-AR")}</td>
                    <td className="py-2.5">
                      {pct((r.valor / RESIDUALES.reduce((a, x) => a + x.valor, 0)) * 100)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Total</td>
                  <td className="py-2.5 font-bold">25.583</td>
                  <td className="py-2.5 font-bold">100%</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Restringido solo a la actividad principal de cada empresa, la proporción residual sube
              a 44,7% (5.854 de 13.087).
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoDona
              titulo="Residuales vs. específicas"
              subtitulo="Sobre el total de asignaciones de actividad"
              datos={RESIDUALES}
              etiquetaUnidad="asignaciones"
              etiquetaCentro="asignaciones"
            />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="Las diez actividades más declaradas de Mendoza"
              subtitulo="Siete de las diez primeras terminan en n.c.p."
              datos={TOP_ACTIVIDADES_GRAFICO}
              etiquetaUnidad="asignaciones"
              leyenda={LEYENDA_NCP}
            />
            <p className="mt-2 text-xs text-carbon/40">
              La única del podio que describe con precisión lo que la empresa hace —y no lo que no
              es— es cultivo de vid para vinificar, en sexto lugar.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-base font-bold">Códigos del top 10</h3>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">#</th>
                  <th className="py-2">Código</th>
                  <th className="py-2">Actividad</th>
                  <th className="py-2">Asignaciones</th>
                </tr>
              </thead>
              <tbody>
                {TOP_ACTIVIDADES.map((a, i) => (
                  <tr key={a.codigo} className="border-t border-carbon/10">
                    <td className="py-2.5 text-carbon/50">{i + 1}</td>
                    <td className="py-2.5 font-mono text-xs">{a.codigo}</td>
                    <td className="py-2.5">{a.actividad}</td>
                    <td className="py-2.5 font-bold">{a.asignaciones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <GraficoLinea
              titulo="Cola larga, no concentración"
              subtitulo="% del total de asignaciones cubierto por las N actividades más frecuentes"
              datos={COLA_LARGA}
              etiquetaUnidad="del total"
              formatearValor={pct}
              maximoY={100}
            />
            <p className="mt-2 text-xs text-carbon/40">
              Eje X: cantidad de códigos distintos. Hacen falta 100 códigos para cubrir el 62% de la
              economía declarada, y los 1.016 del nomenclador se usan todos al menos una vez.
            </p>
          </div>
        </Reveal>

        {/* 2. Bajas */}
        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">2. Las bajas no son muertes: son podas</h2>
            <p className="mt-2 text-sm text-carbon/60">
              El campo estado distingue actividades activas (23.024 = 90,0%) de dadas de baja (2.559
              = 10,0%). La lectura intuitiva sería "una de cada diez actividades murió". Es
              incorrecta:
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Situación</th>
                  <th className="py-2">Sociedades</th>
                </tr>
              </thead>
              <tbody>
                {BAJAS_SITUACION.map((b) => (
                  <tr key={b.situacion} className="border-t border-carbon/10">
                    <td className="py-2.5 font-bold">{b.situacion}</td>
                    <td className={`py-2.5 ${b.sociedades === 0 ? "font-bold text-vino" : ""}`}>
                      {b.sociedades.toLocaleString("es-AR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Ninguna sociedad del corpus tiene la totalidad de sus actividades dadas de baja. La
              explicación es estructural: una empresa que cesa por completo desaparece del padrón de
              ARCA y no aparece acá con sus actividades de baja — simplemente no aparece. Lo que las
              bajas miden es poda de actividades dentro de empresas que siguen operando.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-base font-bold">Diversificación y bajas</h3>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Actividades declaradas</th>
                  <th className="py-2">Sociedades</th>
                  <th className="py-2">% de sus actividades dadas de baja</th>
                </tr>
              </thead>
              <tbody>
                {DIVERSIFICACION.map((d) => (
                  <tr key={d.rango} className="border-t border-carbon/10">
                    <td className="py-2.5 font-bold">{d.rango}</td>
                    <td className="py-2.5">{d.sociedades.toLocaleString("es-AR")}</td>
                    <td className="py-2.5">{pct(d.pctBaja)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Cuantos más rubros declara una empresa, más termina abandonando"
              subtitulo="% de actividades dadas de baja, según cuántas declaró"
              datos={DIVERSIFICACION_GRAFICO}
              etiquetaUnidad="% de baja"
            />
            <p className="mt-2 text-xs text-carbon/40">
              El 0,0% de las monoactividad no es una virtud: es una imposibilidad estructural del
              dataset (si podaran su única actividad, desaparecerían del padrón). La progresión del
              resto sí es informativa.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="Qué se poda y qué no"
              subtitulo="Tasa de baja por actividad (mín. 40 casos)"
              datos={TASA_BAJA_GRAFICO}
              etiquetaUnidad="de baja"
              leyenda={LEYENDA_TASA_BAJA}
              formatearValor={pct}
            />
            <p className="mt-2 text-xs text-carbon/40">
              Las que más se abandonan son residuales y financieras — se declaran "por las dudas" y
              después no se ejercen. Las que casi nunca se abandonan tienen activos físicos e
              infraestructura específica: un frigorífico, una panadería, un viñedo.
            </p>
          </div>
        </Reveal>

        {/* 3. Clusters */}
        <Reveal delay={0.55}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">3. Diez clusters que el nomenclador no declara</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Conectando actividades que aparecen juntas en la misma sociedad se obtiene una red de
              996 actividades y 19.526 pares. La detección de comunidades (Louvain, modularidad
              Q=0,390) encuentra diez clusters con sentido económico propio:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                  <tr>
                    <th className="py-2">Cluster</th>
                    <th className="py-2">Activ.</th>
                    <th className="py-2">Asign.</th>
                    <th className="py-2">Núcleo</th>
                  </tr>
                </thead>
                <tbody>
                  {CLUSTERS.map((c) => (
                    <tr key={c.nombre} className="border-t border-carbon/10">
                      <td className="py-2.5 font-bold">{c.nombre}</td>
                      <td className="py-2.5">{c.actividades}</td>
                      <td className="py-2.5">{c.asignaciones.toLocaleString("es-AR")}</td>
                      <td className="py-2.5 text-xs text-carbon/70">{c.nucleo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              El valor de esto es que los clusters no respetan la jerarquía del nomenclador. El
              cluster vitivinícola cruza tres ramas que CLAE trata como mundos separados: agricultura
              (cultivo de vid), industria manufacturera (elaboración de vinos) y comercio mayorista
              (venta de vino). Para CLAE son tres sectores distintos; para las bodegas mendocinas son
              un solo negocio.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="Los pares de actividades que más co-ocurren"
              subtitulo="Sociedades que declaran ambas actividades"
              datos={PARES_COOCURRENCIA}
              etiquetaUnidad="sociedades"
            />
          </div>
        </Reveal>

        {/* 4. Geografía */}
        <Reveal delay={0.65}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="4. La geografía tiene especialidades muy marcadas"
              subtitulo="Cociente de localización por departamento y actividad"
              datos={LOCALIZACION}
              etiquetaUnidad="veces más concentrado"
              leyenda={LEYENDA_LOCALIZACION}
              formatearValor={(v) => v.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            />
            <p className="mt-2 text-xs text-carbon/40">
              Un valor de 3 significa "tres veces más concentrado de lo que le correspondería por su
              tamaño". El Valle de Uco (Tupungato, Tunuyán, San Carlos) aparece como un bloque
              especializado en apoyo agrícola y cultivos temporales; el este (San Martín, Rivadavia)
              en elaboración de bebidas. Capital es el único cuya especialización más fuerte es de
              servicios profesionales.
            </p>
          </div>
        </Reveal>

        {/* 5. Qué crece y qué se apaga */}
        <Reveal delay={0.7}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="5. Qué crece y qué se apaga"
              subtitulo="% de las asignaciones de cada actividad que corresponden a 2022-2026"
              datos={EVOLUCION_GRAFICO}
              etiquetaUnidad="del período reciente"
              leyenda={LEYENDA_EVOLUCION}
              referencia={{ valor: LINEA_BASE_RECIENTE, etiqueta: "base 54,4%" }}
              formatearValor={pct}
            />
            <p className="mt-2 text-xs text-carbon/40">
              La línea punteada es la base global: 54,4% de todas las asignaciones son del período
              reciente. Una actividad por encima crece, por debajo se apaga — un 55% no indica
              crecimiento, indica comportamiento promedio. El turismo es el gran ganador de la
              segunda mitad de la década; "Generación de energía n.c.p." en 25,6% confirma por otra
              vía el hallazgo del informe de Energía Solar y Eólica de esta serie.
            </p>
          </div>
        </Reveal>

        {/* 6. Cobertura por nicho */}
        <Reveal delay={0.75}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="6. La cobertura CLAE valida la premisa de la serie de nichos"
              subtitulo="% de sociedades de cada nicho con al menos un código CLAE registrado"
              datos={NICHOS_GRAFICO}
              etiquetaUnidad="de cobertura"
              leyenda={LEYENDA_NICHOS}
              formatearValor={pct}
            />
          </div>
        </Reveal>

        <Reveal delay={0.8}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-base font-bold">El código más frecuente de cada nicho</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                  <tr>
                    <th className="py-2">Nicho</th>
                    <th className="py-2">Soc.</th>
                    <th className="py-2">Con CLAE</th>
                    <th className="py-2">Código principal más frecuente</th>
                  </tr>
                </thead>
                <tbody>
                  {NICHOS_COBERTURA.map((n) => (
                    <tr key={n.nicho} className="border-t border-carbon/10">
                      <td className="py-2.5 font-bold">{n.nicho}</td>
                      <td className="py-2.5">{n.sociedades}</td>
                      <td className="py-2.5">{pct(n.cobertura)}</td>
                      <td className="py-2.5 text-xs text-carbon/70">{n.codigo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Cannabis, con 29,2% de cobertura, es el nicho peor cubierto, y su código más usado
              aparece una sola vez: no existe ningún código CLAE que contenga la palabra "cannabis".
              En el otro extremo, Bodegas Boutique, Arquitectura y Software mapean limpiamente a
              códigos propios — para esos rubros CLAE funciona, y el aporte del informe de nicho fue
              el recorte fino, no la existencia misma de la categoría.
            </p>
          </div>
        </Reveal>

        {/* 7. Grupos vacíos */}
        <Reveal delay={0.85}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">7. Lo que Mendoza no hace: 19 grupos vacíos</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Diecinueve grupos CLAE completos no tienen ni una sola sociedad mendocina en todo el
              corpus — un retrato en negativo de la estructura productiva provincial:
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Grupo</th>
                  <th className="py-2">Actividad ausente</th>
                </tr>
              </thead>
              <tbody>
                {GRUPOS_VACIOS.map((g) => (
                  <tr key={g.grupo} className="border-t border-carbon/10">
                    <td className="py-2.5 font-mono text-xs">{g.grupo}</td>
                    <td className="py-2.5">{g.actividad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Algunas ausencias son geográficas evidentes (pesca, carbón en una provincia
              mediterránea). Otras son estructurales y más interesantes: no se constituyó ni una sola
              sociedad de transporte ferroviario ni de fabricación de material rodante en diez años,
              en una provincia atravesada por trazas ferroviarias históricas.
            </p>
          </div>
        </Reveal>

        {/* 8. Cobertura anual */}
        <Reveal delay={0.9}>
          <div className="mt-10">
            <GraficoLinea
              titulo="8. La cobertura CLAE como termómetro de actividad real"
              subtitulo="% de sociedades de cada cohorte con al menos una actividad registrada en ARCA"
              datos={COBERTURA_ANUAL_GRAFICO}
              etiquetaUnidad="de cobertura"
              formatearValor={pct}
              maximoY={100}
            />
            <p className="mt-2 text-xs text-carbon/40">
              * 2026 parcial (relevamiento hasta julio). El derrumbe al 32,9% no indica que las
              empresas nuevas no operen: refleja el rezago de aproximadamente un año entre constituir
              la sociedad y darse de alta en el padrón de actividades de ARCA.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.95}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-base font-bold">Cobertura por cohorte</h3>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Año</th>
                  <th className="py-2">Sociedades</th>
                  <th className="py-2">Con CLAE</th>
                  <th className="py-2">Cobertura</th>
                </tr>
              </thead>
              <tbody>
                {COBERTURA_ANUAL.map((c) => (
                  <tr key={c.anio} className="border-t border-carbon/10">
                    <td className="py-2.5 font-bold">{c.anio}</td>
                    <td className="py-2.5">{c.sociedades.toLocaleString("es-AR")}</td>
                    <td className="py-2.5">{c.conClae.toLocaleString("es-AR")}</td>
                    <td className="py-2.5">{pct(c.cobertura)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Leído al revés, ese techo del 67% es informativo: cerca de un tercio de las sociedades
              que se constituyen en Mendoza nunca registra ninguna actividad económica en ARCA, ni
              siquiera años después.
            </p>
          </div>
        </Reveal>

        <Reveal delay={1.0}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                <strong className="text-carbon">Fuentes.</strong> Tablas de actividades CLAE (1.016
                códigos), grupos CLAE (225 grupos) y sus vínculos con sociedades (25.583 vínculos,
                11.918 sociedades), construidas a partir del padrón de actividades de ARCA cruzado
                por CUIT contra las sociedades extraídas del Boletín Oficial.
              </p>
              <p>
                <strong className="text-carbon">Cobertura.</strong> El análisis cubre las 11.918
                sociedades con al menos una actividad CLAE registrada, el 60,9% de las 19.563 del
                corpus. Las conclusiones sobre composición sectorial valen para ese subconjunto —
                que, como muestra la sección 8, está sesgado hacia empresas que efectivamente
                operaron.
              </p>
              <p>
                <strong className="text-carbon">Sobre las bajas.</strong> No miden cese de actividad
                empresarial sino poda de actividades declaradas dentro de empresas que permanecen en
                el padrón. Cualquier lectura de "mortalidad empresarial" a partir de este campo sería
                incorrecta.
              </p>
              <p>
                <strong className="text-carbon">Clusters.</strong> Detección de comunidades Louvain
                sobre el grafo de co-ocurrencia de actividades, ponderado por 1/(n−1) al estilo
                Newman para neutralizar el efecto de las sociedades con muchas actividades declaradas
                (la mayor declara 53). Se corrieron 10 semillas y se reporta la partición de mayor
                modularidad (Q=0,390).
              </p>
              <p>
                <strong className="text-carbon">Cociente de localización.</strong> Calculado a nivel
                de grupo CLAE, restringido a combinaciones con al menos 15 casos en departamentos con
                al menos 200 asignaciones, para evitar cocientes altos por puro ruido de muestra
                chica. Depende de la geolocalización del domicilio legal, que no siempre coincide con
                el lugar de la actividad productiva.
              </p>
              <p>
                <strong className="text-carbon">Evolución temporal.</strong> La fecha de referencia
                es la publicación del acto de Constitución. La línea de base global (54,4% de
                asignaciones en 2022-2026) debe usarse siempre como referencia.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1.05}>
          <div className="mt-10">
            <FuenteDatos />
          </div>
        </Reveal>

        <Reveal delay={1.1}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El hallazgo más útil de este informe es incómodo para el propio instrumento que
              analiza: casi la mitad de la economía mendocina se declara ante el Estado con una
              categoría que dice, esencialmente, "ninguna de las anteriores". Eso no invalida al CLAE
              —es el único mapa disponible y, como muestran los clusters y la especialización
              geográfica, todavía tiene mucha señal— pero fija su límite con precisión, y explica por
              qué esta serie tuvo que salir a buscar cannabis, cripto o café de especialidad por
              fuera del nomenclador: no estaban escondidos, simplemente no tenían casilla.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El segundo hallazgo es metodológico: las bajas de actividad no son muertes de empresas.
              Lo que se ve al mirar las bajas no es mortalidad, es el momento en que una empresa deja
              de fingir que hace veinte cosas y se queda con las dos que realmente hace.
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
