import { useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  DEPARTAMENTOS_ENOTURISMO,
  ENTIDADES,
  EVOLUCION_ANUAL,
  LEYENDA_EVOLUCION,
  TIPO_ENTIDAD,
} from "../data/nichoEnoturismo";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoEnoturismo() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarNichoEnoturismoPDF } = await import("../lib/exportarInforme");
      await exportarNichoEnoturismoPDF();
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">Enoturismo en Mendoza</h1>
              <p className="mt-2 text-lg text-carbon/60">El negocio detrás de la Ruta del Vino</p>
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
            Detrás de la postal de viñedos y degustaciones hay una industria formal que se puede
            medir: 43 empresas de enoturismo y turismo del vino en Mendoza se constituyeron con esa
            actividad real y específica desde 2017, y algo más de la mitad nació en los últimos tres
            años.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Julio de 2026 · Segundo de la serie de nichos sectoriales · Fuente: Boletín Oficial de
            la Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">43 empresas</strong> de Mendoza tienen al
                enoturismo o turismo del vino como actividad real y específica —no de relleno— en
                su nombre u objeto social, identificadas entre enero de 2017 y julio de 2026 en el
                Boletín Oficial de la provincia.
              </li>
              <li>
                22 de las 43 (51,2 %) se constituyeron en los últimos tres años: 9 en 2023, 6 en
                2024 y 7 en 2025. Y 2026, con boletines relevados solo hasta mayo, ya lleva 4.
              </li>
              <li>
                La primera de la muestra es de marzo de 2017 (Chacras de Loria S.R.L.), casi en
                simultáneo con la sanción de la Ley de la S.A.S.
              </li>
              <li>
                36 de las 43 (83,7 %) eligieron la S.A.S. como forma societaria, el mismo patrón de
                adopción masiva que se ve en el resto del ecosistema empresarial mendocino.
              </li>
              <li>
                La mediana de capital inicial declarado es de $450.000, bastante por encima de la
                mediana general de $100.000 que predomina en el grueso de las constituciones
                societarias de Mendoza en esos mismos años. El capital total declarado por las 43
                empresas es de $172,2 millones.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">
              Qué es el enoturismo y por qué Mendoza es un caso de estudio
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                El enoturismo —o turismo del vino— es el segmento que combina la visita a bodegas y
                viñedos, las catas y degustaciones, el alojamiento boutique en fincas vitivinícolas
                y los tours guiados por zonas productoras. En las últimas dos décadas creció con
                fuerza a nivel mundial, y pocas regiones lo encarnan mejor que Mendoza.
              </p>
              <p>
                La provincia concentra más del 70 % de la producción vitivinícola argentina y es la
                región vitivinícola más visitada del país. La combinación de bodegas históricas,
                zonas nuevas como el Valle de Uco y la cercanía a la Cordillera puso a Mendoza en el
                radar del turismo internacional de vinos.
              </p>
              <p>
                Hasta ahora, sin embargo, ese fenómeno se conocía sobre todo por el lado de la
                demanda: cantidad de turistas, ocupación hotelera, gasto promedio. Lo que casi no se
                había mirado es el lado de la oferta formal: cuántas empresas de enoturismo se
                constituyen específicamente para explotar ese negocio en Mendoza, cuándo, con qué
                forma jurídica y con cuánto capital. Eso es lo que este informe cuantifica por
                primera vez, a partir de los contratos sociales publicados en el Boletín Oficial.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Enoturismo en Mendoza: constituciones por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="empresas"
              leyenda={LEYENDA_EVOLUCION}
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es un año parcial: boletines relevados hasta principios de mayo de 2026.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="text-sm leading-relaxed text-carbon/80">
              <p>
                La curva no es lineal. El primer tramo, de 2017 a 2022, es errático: años con 0, con
                2, con 5 constituciones, sin un patrón claro. Pero desde 2023 el rubro sube a un
                escalón más alto y, sobre todo, sostenido: 9, 6 y 7 constituciones en tres años
                consecutivos. No es un pico aislado que pueda atribuirse al ruido de una muestra
                chica, sino tres años seguidos en un nivel que antes nunca se había tocado.
              </p>
              <p className="mt-3">
                El resultado es el dato más fuerte del informe: 22 de las 43 empresas —el 51,2 %—
                nacieron en los últimos tres años (2023-2025). Buena parte del ecosistema formal del
                enoturismo mendocino es, en términos societarios, muy joven. Por qué se aceleró justo
                ahí es una pregunta que estos datos no alcanzan a responder; lo que sí muestran, sin
                ambigüedad, es que la aceleración existe.
              </p>
              <div className="mt-4 rounded-2xl border border-carbon/10 bg-humo p-4 text-xs text-carbon/60">
                <span className="font-bold text-carbon/70">Pendiente para una futura versión:</span>{" "}
                un mapa interactivo de Mendoza con cada empresa geolocalizada (o al menos por
                departamento) y un control deslizante de año, para ver cómo se fue "poblando" el
                mapa del enoturismo con el correr del tiempo. Por ahora este informe usa el mapa
                estático de domicilios más abajo.
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Quién funda estas empresas: tipo societario y capital</h2>
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
                El dominio de la S.A.S. no sorprende: 36 de las 43 empresas (83,7 %) eligieron esa
                figura. Es el mismo patrón que ya documentó el informe de esta serie dedicado al
                cannabis y el cáñamo, donde la S.A.S. también predominó, aunque con menos
                intensidad. El enoturismo no es la excepción: es un rubro poblado de empresas
                nuevas, y las empresas nuevas en Mendoza se constituyen abrumadoramente como S.A.S.
              </p>
              <p>
                Donde el rubro sí se despega del promedio es en el capital. La mediana de capital
                inicial declarado es de $450.000 (calculada sobre 42 de las 43 empresas: se excluyó
                la Unión Transitoria, que no declara capital inicial en su figura legal). Es una
                cifra bastante más alta que la mediana general de $100.000 que predominó durante
                varios años en el grueso de las sociedades mendocinas. La lectura es intuitiva:
                montar un negocio de enoturismo —infraestructura de recepción, alojamiento,
                vehículos, terrenos— exige más capital declarado que una sociedad de servicios
                genérica.
              </p>
              <p>
                En el extremo alto, tres empresas se constituyeron con $30.000.000 de capital cada
                una: Viticultores Argentinos S.A.S., Rosardi Wine Of Mendoza S.A.S. y Winebeetle
                S.A.S. Son la señal de que el rubro no atrae solo emprendimientos chicos: también
                hay inversión de mayor escala apostando al negocio.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están domiciliadas las empresas de enoturismo"
              subtitulo="41 de 43 empresas, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_ENOTURISMO}
              etiquetaUnidad="empresas"
            />
            <div className="mt-3 space-y-3">
              <p className="px-1 text-sm text-carbon/50">
                41 de las 43 empresas tienen departamento identificado; 2 no.
              </p>
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-800">Advertencia metodológica</p>
                <p className="mt-1.5 text-sm leading-relaxed text-amber-900/80">
                  Que Capital —la ciudad de Mendoza— encabece el ranking con 17 de las 43 empresas
                  no significa que ahí estén las bodegas o los viñedos que se visitan: la ciudad de
                  Mendoza no es zona vitivinícola. Lo que el mapa refleja es el domicilio LEGAL de
                  cada sociedad, que suele coincidir con la oficina, el estudio contable o el
                  domicilio del socio que la constituye, no con el lugar donde ocurre la experiencia
                  turística. Esa experiencia se concentra en las zonas vitivinícolas tradicionales
                  —Luján de Cuyo, Maipú, Guaymallén, Godoy Cruz, Tupungato—, que miradas en conjunto
                  ya suman más casos que Capital sola.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Quiénes son: un vistazo a la diversidad del rubro</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Detrás de las 43 empresas no hay un único modelo de negocio, y un recorrido por los
                objetos sociales lo muestra bien.
              </p>
              <p>
                Está el modelo clásico de agencia u operador de tours: Aerocalles S.A.S., por
                ejemplo, se constituyó para hacer recorridas turísticas con visitas a bodegas y
                lugares de interés. Del otro lado del mostrador está la bodega que se abre al
                turismo: Chito S.A.S. combina la explotación de bodega y viñedos propios con la
                intermediación en servicios hoteleros y guías turísticos.
              </p>
              <p>
                Entre esos dos extremos aparecen modelos más integrales. Sardiro Del Valle Village
                S.A.S. es una agencia de viajes que suma hospedaje, excursiones y organización de
                eventos enoturísticos: la apuesta por la "experiencia completa". Wi Wine Tourism
                S.A.S., con nombre en inglés y un objeto centrado en hospedaje turístico y
                enoturismo, apunta con claridad al visitante extranjero. Argentia Winery Lodge
                Sociedad Anónima condensa su modelo en el propio nombre: alojamiento boutique —un
                "lodge"— vinculado a una bodega. Y Myosotis S.A.S. muestra hacia dónde se está
                actualizando el rubro: combina la producción de vino con la organización de eventos
                gastronómicos y enoturísticos y con la comercialización digital vía e-commerce.
              </p>
              <p>
                El conjunto deja una conclusión clara: el enoturismo mendocino no es un solo negocio
                sino al menos tres perfiles que conviven —bodegas que suman una pata turística,
                agencias especializadas en vino, y alojamientos boutique construidos alrededor de la
                experiencia vitivinícola—, con híbridos y variantes digitales en el medio.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Directorio completo: las 43 empresas</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Ficha completa de cada una de las 43 empresas identificadas, ordenadas por fecha de
              publicación del acto de constitución en el Boletín.
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
                      <p className="text-carbon/80">{e.publicacion}</p>
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

        <Reveal delay={0.45}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología de selección</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Se partió de una búsqueda amplia por palabras clave en el nombre y el objeto social
                de las sociedades de la base (términos como "enoturismo", "turismo del vino", "wine
                tour", "vitivinícola" combinado con "turismo", "bodega" combinado con "visita
                guiada", "hospedaje" o "cata"). Esa búsqueda arrojó 403 candidatas.
              </p>
              <p>
                Ese primer filtro es intencionalmente amplio y ruidoso. Muchas sociedades
                argentinas —sobre todo las S.A.S.— usan un objeto social "boilerplate": un estatuto
                genérico que lista 15 a 20 actividades no relacionadas entre sí (agropecuaria,
                inmobiliaria, financiera, minería, salud, petróleo, etc.). En esos textos, "turismo"
                y "vitivinícola" pueden aparecer juntas por pura casualidad de redacción, sin que la
                empresa tenga nada que ver con el enoturismo real.
              </p>
              <p>
                Por eso, cada una de las 403 candidatas se revisó individualmente —nombre y objeto
                social completo— para confirmar si la actividad de enoturismo era real y específica,
                o solo una mención de relleno dentro de una lista genérica. El filtro descartó 360 de
                los 403 candidatos (89 %). Las 43 empresas de este informe son las que quedaron.
              </p>
              <p>
                Vale ser explícitos: es una muestra chica y curada a propósito, no un conteo
                automático masivo. El objetivo fue precisión sobre volumen — identificar con
                confianza quiénes son realmente los actores del rubro, no inflar un número.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-10">
            <FuenteDatos>
              <p>
                <strong className="text-carbon">Nota de metodología de este informe.</strong> Las
                constituciones se cuentan por la fecha de publicación del acto en el Boletín, no por
                la fecha de constitución declarada en el estatuto (entre ambas hay un rezago
                normal). La serie de evolución anual de este informe se recalculó a partir de la
                fecha de publicación de cada una de las 43 empresas del directorio de arriba, todas
                cruzadas contra la base real por CUIT o por sus vínculos societarios. El capital se
                expresa en pesos nominales, sin ajuste por inflación.
              </p>
            </FuenteDatos>
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Este es el segundo informe de nuestra serie de nichos sectoriales —el primero estuvo
              dedicado al cannabis y el cáñamo—, rubros que el nomenclador oficial no distingue como
              categoría propia y que solo se vuelven visibles leyendo el texto libre de cada
              contrato social. En el caso del enoturismo, lo que emerge de esa lectura es un rubro
              que se capitaliza por encima del promedio y que concentró más de la mitad de sus
              nacimientos en apenas tres años: señales de que el turismo del vino en Mendoza está
              dejando de ser un fenómeno espontáneo alrededor de las bodegas para convertirse en un
              negocio formal en plena expansión.
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
