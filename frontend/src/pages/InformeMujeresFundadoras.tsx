import { useState } from "react";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoDona } from "../components/GraficoDona";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  EVOLUCION_ANUAL,
  FUNDADORAS_SERIALES,
  LEYENDA_GENERO,
  LEYENDA_TITULAR_SUPLENTE,
  PANORAMA,
  ROLES_DECISION,
  TITULAR_SUPLENTE,
  TOP_MUJERES,
} from "../data/mujeresFundadoras";
import { registrarDescarga } from "../lib/descargasApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeMujeresFundadoras() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarMujeresFundadorasPDF } = await import("../lib/exportarInforme");
      await exportarMujeresFundadorasPDF();
      registrarDescarga("informe_mujeres_fundadoras", "pdf", null, "Mujeres que Fundan Empresas en Mendoza");
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
                Las mujeres que fundan empresas en Mendoza
              </h1>
              <p className="mt-2 text-lg text-carbon/60">
                Una brecha que no se cierra, y que se agranda cuanto más arriba se mira
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
            No es un nicho sectorial como los demás informes de esta serie: es un corte transversal
            de toda la base (33.694 personas físicas, 62.201 vínculos) mirado a través de una única
            variable — el género inferido de cada persona — que el catálogo de roles del Boletín casi
            nunca declara de forma explícita.
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
                <strong className="text-carbon">El 31,5% de las personas que participan en sociedades mendocinas son mujeres</strong>{" "}
                (10.264 de 32.592 personas clasificables). La proporción se mantuvo prácticamente
                estancada en la década: 28,3% en 2017, 29,7% en 2026.
              </li>
              <li>
                La brecha se agranda a medida que se sube en la jerarquía formal de la sociedad:
                27,9% de mujeres entre los socios, pero solo 21,2% en los roles de decisión
                (presidente, administrador/gerente/director titular) y 19,4% entre los síndicos
                (fiscalización).
              </li>
              <li>
                <strong className="text-carbon">El hallazgo más nítido: mujeres en roles "Suplente", varones en roles "Titular".</strong>{" "}
                En los tres pares Titular/Suplente medibles, el patrón se repite sin excepción, con
                una brecha de 14 a 16 puntos porcentuales, siempre en la misma dirección.
              </li>
              <li>
                Los hombres que fundan una empresa tienen 45% más probabilidad de fundar una segunda
                que las mujeres que fundan una empresa: 20,9% de los hombres con al menos una
                sociedad tienen dos o más, contra 14,4% de las mujeres.
              </li>
              <li>
                Entre las personas con más sociedades a su nombre en toda la base, solo 3 mujeres
                superan las 10 sociedades — contra 36 varones en el mismo umbral.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cómo se mide esto sin que el dato exista</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                El catálogo de roles del Boletín casi nunca marca género: sobre 62.201 vínculos,
                apenas ~300 usan una forma explícitamente femenina del cargo ("Presidenta", "Socia",
                "Directora", "Apoderada"...) — el resto usa la forma por default del formulario legal
                ("Presidente", "Socio", "Director"), sea quien sea la persona. No alcanza para medir
                nada por sí solo.
              </p>
              <p>
                La alternativa —la única viable con este dataset— es inferir el género desde el
                nombre de pila de cada persona física. Es un método imperfecto, y se explica en
                detalle en la sección de metodología, pero tiene una ventaja: se puede validar
                contra los pocos casos donde el Boletín sí marcó género explícitamente. Y valida
                bien: entre los vínculos etiquetados "Directora Suplente" (género explícito, forma
                femenina), el 93,3% de las personas fueron clasificadas como mujeres por el método
                de nombre de pila; entre "Administradora Titular", el 77,8%. El método y la fuente
                coinciden donde se los puede comparar.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">El panorama general</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2"></th>
                  <th className="py-2">Personas</th>
                  <th className="py-2">%</th>
                </tr>
              </thead>
              <tbody>
                {PANORAMA.map((p) => (
                  <tr key={p.etiqueta} className="border-t border-carbon/10">
                    <td className="py-2.5 font-bold">{p.etiqueta}</td>
                    <td className="py-2.5">{p.valor.toLocaleString("es-AR")}</td>
                    <td className="py-2.5">
                      {(p.valor / PANORAMA.reduce((a, x) => a + x.valor, 0)).toLocaleString("es-AR", {
                        style: "percent",
                        maximumFractionDigits: 1,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Sobre las personas clasificables, 31,5% son mujeres. Es menos de un tercio del
              ecosistema societario mendocino — y esa proporción no mejoró de forma perceptible en
              la década que cubre esta base.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <GraficoDona
              titulo="Panorama general: quién participa en sociedades mendocinas"
              datos={PANORAMA}
              etiquetaUnidad="personas"
              etiquetaCentro="personas"
            />
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">La brecha se agranda en los roles de decisión</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Categoría</th>
                  <th className="py-2">Vínculos</th>
                  <th className="py-2">% mujeres</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Socio/a</td>
                  <td className="py-2.5">37.653</td>
                  <td className="py-2.5">27,9%</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Roles de decisión (presidente, administrador/gerente/director titular)</td>
                  <td className="py-2.5">11.262</td>
                  <td className="py-2.5">21,2%</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Apoderado/a</td>
                  <td className="py-2.5">364</td>
                  <td className="py-2.5">20,9%</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Fiscalización (síndico)</td>
                  <td className="py-2.5">165</td>
                  <td className="py-2.5">19,4%</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              El patrón es consistente: cuanto más alto el rol en la estructura formal de poder de la
              sociedad, menor la proporción de mujeres. La caída de "socia" a "rol de decisión" es de
              casi 7 puntos porcentuales — no es ruido estadístico sobre miles de casos.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <GraficoBarras
              titulo="La brecha se agranda en los roles de decisión"
              subtitulo="% de mujeres y hombres por categoría de vínculo"
              datos={ROLES_DECISION}
              etiquetaUnidad="%"
              leyenda={LEYENDA_GENERO}
            />
            <p className="mt-2 text-xs text-carbon/40">
              "Hombres" es el complemento del % de mujeres e incluye a las personas no clasificables
              por nombre (~3% del total, ver metodología).
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">El hallazgo más nítido: Titular vs. Suplente</h2>
            <p className="mt-2 text-sm text-carbon/60">
              El Boletín registra, para varios cargos, un titular y un suplente (quien ocupa el
              cargo si el titular no puede). Comparando el mismo cargo en sus dos variantes:
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Cargo</th>
                  <th className="py-2">% mujeres — Titular</th>
                  <th className="py-2">% mujeres — Suplente</th>
                  <th className="py-2">Diferencia</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Administrador</td>
                  <td className="py-2.5">22,2% (n=5.600)</td>
                  <td className="py-2.5">36,6% (n=5.327)</td>
                  <td className="py-2.5">+14,4 pp</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Gerente</td>
                  <td className="py-2.5">21,9% (n=2.172)</td>
                  <td className="py-2.5">36,8% (n=1.315)</td>
                  <td className="py-2.5">+14,9 pp</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Director</td>
                  <td className="py-2.5">15,5% (n=1.075)</td>
                  <td className="py-2.5">31,9% (n=2.676)</td>
                  <td className="py-2.5">+16,4 pp</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              En los tres cargos, sin excepción, las mujeres están sobrerrepresentadas en el rol
              suplente y subrepresentadas en el rol titular, con una brecha estable de 14 a 16 puntos
              porcentuales. El suplente es, en la mayoría de las estructuras societarias chicas, un
              cargo formal y obligatorio —alguien tiene que ocuparlo por si el titular falta— pero no
              es quien ejerce la conducción efectiva del día a día. Que la mujer aparezca
              sistemáticamente en el lugar formal y no en el lugar de conducción, en tres cargos
              distintos y con una magnitud casi idéntica, sugiere una estructura y no una
              coincidencia. Es una lectura del patrón, no una afirmación sobre ninguna sociedad en
              particular: puede haber muchas razones legítimas para la distribución de roles en
              cualquier empresa concreta.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Titular vs. Suplente: el mismo patrón en tres cargos distintos"
              subtitulo="% de mujeres por cargo y variante"
              datos={TITULAR_SUPLENTE}
              etiquetaUnidad="% mujeres"
              leyenda={LEYENDA_TITULAR_SUPLENTE}
            />
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Una brecha que no se cerró en diez años</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Año</th>
                  <th className="py-2">Socios/as</th>
                  <th className="py-2">% mujeres</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["2017", "1.767", "28,3%"],
                  ["2018", "3.364", "27,3%"],
                  ["2019", "4.263", "28,0%"],
                  ["2020", "3.903", "25,9%"],
                  ["2021", "4.781", "26,0%"],
                  ["2022", "4.882", "28,7%"],
                  ["2023", "5.049", "29,1%"],
                  ["2024", "5.445", "27,4%"],
                  ["2025", "5.244", "27,7%"],
                  ["2026*", "2.794", "29,7%"],
                ].map(([anio, socios, pct]) => (
                  <tr key={anio} className="border-t border-carbon/10">
                    <td className="py-2.5 font-bold">{anio}</td>
                    <td className="py-2.5">{socios}</td>
                    <td className="py-2.5">{pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              * 2026 es parcial, el relevamiento llega hasta julio. La serie oscila entre 26% y 30%
              sin tendencia clara — ni deterioro ni mejora sostenida. En una década donde la
              constitución de empresas se triplicó en Mendoza y la S.A.S. abarató y agilizó el
              trámite de fundar una empresa, la proporción de mujeres entre quienes lo hacen
              prácticamente no se movió.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Una brecha que no se cerró en diez años"
              subtitulo="% de mujeres y hombres entre los socios, por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="%"
              leyenda={LEYENDA_GENERO}
            />
            <p className="mt-2 text-xs text-carbon/40">
              "Hombres" es el complemento del % de mujeres e incluye a las personas no clasificables
              por nombre (~3% del total, ver metodología).
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Ellas fundan una vez; ellos, más de una</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2"></th>
                  <th className="py-2">Con 2+ sociedades</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">%</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Mujeres</td>
                  <td className="py-2.5">1.429</td>
                  <td className="py-2.5">9.902</td>
                  <td className="py-2.5">14,4%</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Varones</td>
                  <td className="py-2.5">4.637</td>
                  <td className="py-2.5">22.182</td>
                  <td className="py-2.5">20,9%</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Entre quienes fundan al menos una sociedad, los varones tienen 45% más probabilidades
              de convertirse en fundadores seriales (2 o más sociedades) que las mujeres. La brecha
              de participación (31,5% del ecosistema) es más chica que la brecha de reincidencia
              (20,9% vs. 14,4%): no solo hay menos mujeres fundando, las que fundan tienen menos
              probabilidad de volver a hacerlo.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Ellas fundan una vez; ellos, más de una"
              subtitulo="% de fundadores/as con 2 o más sociedades"
              datos={FUNDADORAS_SERIALES}
              etiquetaUnidad="%"
            />
          </div>
        </Reveal>

        <Reveal delay={0.65}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Las mujeres con más sociedades</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Solo tres mujeres superan las 10 sociedades en toda la base (contra 36 varones en el
              mismo umbral). Se mantiene la profesión declarada y la cantidad de sociedades; se omite
              la identidad.
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Profesión declarada</th>
                  <th className="py-2">Sociedades</th>
                </tr>
              </thead>
              <tbody>
                {TOP_MUJERES.map((m) => (
                  <tr key={m.profesion} className="border-t border-carbon/10">
                    <td className="py-2.5 font-bold">{m.profesion}</td>
                    <td className="py-2.5">{m.sociedades}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              La de mayor cantidad de sociedades ocupa, en la mayoría de esos casos, el rol de
              directora o directora suplente — el mismo patrón de "rol formal, no de conducción" que
              este informe encuentra a escala de toda la base. La contadora del listado encaja en el
              perfil de "intermediaria profesional" (habitual entre estudios contables que gestionan
              sociedades de terceros) más que en el de empresaria con negocios propios.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.7}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                <strong className="text-carbon">Inferencia de género.</strong> Se clasificó el primer
                token del campo nombre de cada persona física contra un diccionario curado a mano de
                los 600 nombres de pila más frecuentes de la base (cubren el 87,3% de las 33.694
                personas), con una regla heurística documentada para el resto: termina en "a" →
                femenino (con la única excepción relevante detectada, "Luca"), lista de excepciones
                femeninas que no terminan en "a" (Carmen, Inés, Beatriz, Pilar, Soledad y otras 45
                más), y masculino por default en el resto.
              </p>
              <p>
                <strong className="text-carbon">No clasificable (3,3%).</strong> Alrededor de 90
                tokens frecuentes resultaron ser apellidos, no nombres de pila — un artefacto de
                extracción: para esas personas el campo nombre quedó con el orden invertido (Apellido
                antes que Nombre) o solo con el apellido. Se identificaron y excluyeron de la
                clasificación en vez de adivinar.
              </p>
              <p>
                <strong className="text-carbon">Error residual conocido, no corregido.</strong> El
                mismo problema de orden invertido puede afectar a nombres poco frecuentes que no
                entraron en el diccionario curado: si el apellido que quedó primero termina en "a",
                el método lo clasifica como femenino por error. No hay forma de cuantificar cuántos
                casos así existen sin revisar la base entera a mano; se estima que es una fracción
                chica del 12,7% de nombres fuera del diccionario curado, insuficiente para cambiar
                ninguna de las conclusiones de magnitud reportadas acá, pero suficiente para no
                tratar ningún número individual de este informe como exacto al 100%.
              </p>
              <p>
                <strong className="text-carbon">Validación cruzada.</strong> Donde el propio Boletín
                usa una forma de rol explícitamente femenina (~300 de 62.201 vínculos: "Presidenta",
                "Directora Suplente", "Administradora Titular", etc.), la clasificación por nombre
                coincide en la enorme mayoría de los casos (93,3% y 77,8% en los dos ejemplos citados
                arriba).
              </p>
              <p>
                <strong className="text-carbon">Unidad de medida.</strong> Los porcentajes por rol y
                por año se calculan sobre vínculos (una persona puede aparecer varias veces, con
                roles distintos, en la misma o distintas sociedades), no sobre personas únicas — es
                la unidad correcta para medir "qué proporción de las decisiones formales toman
                mujeres". El panorama general (30,5%/66,3%) sí se calcula una vez por persona.
              </p>
              <p>
                <strong className="text-carbon">Lo que este informe no puede decir.</strong> No mide
                intención, mérito, ni causas — solo la distribución observable en el registro
                societario público. Las razones detrás de la brecha (acceso a capital, redes
                profesionales, distribución de roles dentro de un mismo núcleo familiar u otras)
                están fuera del alcance de este dataset.
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
              Mendoza tiene, según este relevamiento, una proporción de mujeres fundadoras que ronda
              el 30% desde 2017 y no muestra señales de moverse. Pero el dato más importante de este
              informe no es ese número solo: es que la brecha no es pareja — se agranda con cada
              escalón de poder formal dentro de la sociedad, y se manifiesta con particular nitidez
              en el contraste entre los cargos titulares (donde los varones dominan) y los suplentes
              (donde las mujeres están sobrerrepresentadas).
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
