import { useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  DEPARTAMENTOS_CANNABIS,
  ENTIDADES,
  EVOLUCION_ANUAL,
  SOCIOS_REPETIDOS,
  TIPO_ENTIDAD,
} from "../data/nichoCannabis";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoCannabis() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarNichoCannabisPDF } = await import("../lib/exportarInforme");
      await exportarNichoCannabisPDF();
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">Cannabis y Cáñamo en Mendoza</h1>
              <p className="mt-2 text-lg text-carbon/60">
                Entidades registradas en el Boletín Oficial · 2017–2026
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
            27 empresas y entidades de cannabis en Mendoza registradas en el Boletín Oficial entre
            2017 y 2026, con casi la mitad nacida en 2025-2026: el rubro combina dos mundos,
            empresas comerciales que apuestan a la industria y asociaciones civiles orientadas al
            acceso a la salud.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Julio de 2026 · Primero de la serie de nichos sectoriales · Fuente: Boletín Oficial de
            la Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">27 entidades</strong> identificadas entre 2017 y
                2026 en el Boletín Oficial de Mendoza: 23 empresas comerciales y 4 asociaciones
                civiles (estas últimas, sin fines de lucro, orientadas al acceso a la salud bajo la
                Ley 27.350).
              </li>
              <li>
                La primera entidad del sector es de mayo de 2021 (Cannabafl S.A.S.); la más
                reciente, de junio de 2026 (Eirene Cannabica Asociación Civil).
              </li>
              <li>
                11 de las 27 (40,7 %) se registraron en 2025-2026: 6 en 2025 y 5 en el tramo de 2026
                relevado. El sector recién está entrando en su fase de mayor actividad, más de dos
                años después de la sanción de la ley que lo regula.
              </li>
              <li>16 de las 27 (59,3 %) eligieron la S.A.S. como forma societaria.</li>
              <li>
                El capital total declarado por las 27 entidades es de $142,7 millones, con una
                mediana de $1.000.000 — muy por encima de la mediana general de $100.000 que
                predomina en el grueso de las sociedades mendocinas.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Contexto legal: por qué apareció este rubro y cuándo</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                El cannabis medicinal tiene marco legal en Argentina desde la Ley 27.350 (2017), que
                habilitó la investigación científica y el acceso a aceites y derivados del cannabis
                con fines medicinales. Pero esa ley no creó todavía una industria comercial regulada:
                abrió la puerta al uso terapéutico y a la investigación, no a una cadena productiva.
              </p>
              <p>
                El marco que sí habilitó una cadena productiva y comercial es la Ley 27.669
                (sancionada el 5 de mayo de 2022 y publicada el 26 de mayo de 2022): el "Marco
                Regulatorio para el Desarrollo de la Industria del Cannabis Medicinal y el Cáñamo
                Industrial". Esta ley creó la ARICCAME (Agencia Regulatoria de la Industria del
                Cáñamo y el Cannabis Medicinal), el organismo que regula el cultivo, la producción
                industrial, la importación/exportación y la comercialización de la planta y sus
                derivados en todo el país.
              </p>
              <p>
                Es interesante notar que las primeras entidades de esta muestra (2021) son
                anteriores a la Ley 27.669: el sector empezó a organizarse societariamente incluso
                antes de tener el marco industrial completo, apostando a la regulación que se sabía
                venía en camino. El grueso del crecimiento (11 de las 27 entidades) llega recién en
                2025-2026, varios años después de sancionada la ley — un rezago típico entre la
                sanción de una ley marco y la maduración operativa de la agencia que la implementa
                (reglamentación, registros, habilitaciones).
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">¿Quién cultiva cannabis en Mendoza?</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                No hay una única respuesta: la actividad se reparte entre 27 empresas y
                asociaciones civiles de cannabis en Mendoza con sede legal en la provincia,
                concentradas sobre todo en Luján de Cuyo, San Rafael, San Martín, Las Heras y
                Guaymallén — departamentos con perfil agrícola donde es más probable que ocurra el
                cultivo real, más allá de que el domicilio legal figure con más frecuencia en
                Capital (ver mapa y advertencia metodológica más abajo).
              </p>
              <p>
                Esta lista no pretende ser exhaustiva. Nuestra metodología rastrea el Boletín
                Oficial por nombre y objeto social de la sociedad, y eso deja afuera entidades cuyo
                objeto social publicado es genérico y no menciona cannabis en absoluto. Un caso
                público conocido es <strong className="text-carbon">Wichan S.A.S.</strong> (Los
                Corralitos, Guaymallén), habilitada en el Registro Provincial de Cannabis y activa
                en genética y producción de semillas: su objeto social en el Boletín no menciona la
                palabra cannabis, así que no aparece en nuestro rastreo automático por palabras
                clave aunque sí figure en fuentes públicas del sector.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Evolución temporal: un despegue tardío pero sostenido"
              subtitulo="Entidades registradas por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="entidades"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es un año parcial: boletines relevados hasta principios de junio de 2026.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="text-sm leading-relaxed text-carbon/80">
              <p>
                No hay entidades de este rubro antes de 2021 en la base (que cubre desde 2017): el
                sector directamente no existía en términos societarios hasta ese año.
              </p>
              <p className="mt-3">
                El arranque es disperso —6 entidades en 2021, apenas 2 en 2022 y 3 en 2023— y desde
                2024 el ritmo se acelera con claridad: 5, 6 y 5 registros en los últimos tres años.
                Así, 11 de las 27 entidades (40,7 %) se concentran en el tramo 2025-2026, el más
                reciente. Esa aceleración no coincide con el momento de la sanción de la Ley
                27.669 (2022) sino con la maduración operativa de la ARICCAME varios años después:
                los emprendimientos parecen haberse formalizado recién cuando la agencia tuvo en
                marcha su andamiaje de reglamentación, registros y habilitaciones.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Tipo de entidad y capital: dos lógicas conviviendo</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Tipo</th>
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
                La S.A.S. domina (16 de 27, 59,3 %), pero con menos intensidad que en otros rubros de
                esta serie: en Enoturismo llegaba al 83,7 %. Las 4 asociaciones civiles y las 7
                S.A./S.R.L. muestran que este sector todavía no se concentró tan fuerte en una sola
                figura, quizás porque conviven dos lógicas distintas: la del negocio comercial y la
                del acceso a la salud sin fines de lucro (las asociaciones civiles).
              </p>
              <p>
                En cuanto al capital, 26 de las 27 entidades lo declaran (una asociación civil no
                declara capital, algo normal en su figura legal). El total asciende a $142.733.200,
                con una mediana de $1.000.000 — diez veces la mediana general de $100.000. Es
                coherente con un rubro que exige cumplir requisitos regulatorios de una agencia
                federal (ARICCAME) desde el arranque.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están domiciliadas las entidades de cannabis y cáñamo"
              subtitulo="25 de 27 entidades, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_CANNABIS}
              etiquetaUnidad="entidades"
            />
            <div className="mt-3 space-y-3">
              <p className="px-1 text-sm text-carbon/50">
                25 de las 27 entidades tienen departamento identificado; 2 no.
              </p>
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-800">Advertencia metodológica</p>
                <p className="mt-1.5 text-sm leading-relaxed text-amber-900/80">
                  Que Capital encabece el ranking (9 de 27) no significa que ahí esté el cultivo o la
                  producción — es el domicilio LEGAL de la entidad, no necesariamente el lugar donde
                  ocurre la actividad productiva real (cultivo, producción industrial). Las zonas con
                  mayor concentración fuera de Capital —Luján de Cuyo con 5, seguida de San Rafael,
                  San Martín, Las Heras y Guaymallén con 2 cada una— son más representativas de dónde
                  efectivamente se desarrollan actividades agropecuarias e industriales vinculadas al
                  cannabis y el cáñamo.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Directorio completo: las 27 entidades</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Ficha completa de cada una de las 27 entidades identificadas, ordenadas por fecha de
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
                        <span key={s.personaId}>
                          {i > 0 && " · "}
                          <Link to={`/persona/${s.personaId}`} className="text-vino hover:underline">
                            {s.nombre}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                  <p className="mt-1.5 text-sm text-carbon/70">
                    <span className="font-bold">Objeto social:</span> {e.objetoSocial}
                  </p>
                  {e.nombreGenerico && (
                    <p className="mt-2 text-xs text-carbon/50">
                      ■ El nombre de la entidad sugiere actividad de cannabis, pero el objeto social
                      registrado es genérico y no lo menciona explícitamente — inclusión basada en el
                      nombre, a confirmar.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Socios que participan en más de una entidad del sector</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SOCIOS_REPETIDOS.map((s) => (
                <li
                  key={s.nombre}
                  className="rounded-full bg-humo px-3 py-1.5 text-sm text-carbon/80"
                >
                  {s.nombre} <span className="text-carbon/50">({s.veces})</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10">
            <FuenteDatos>
              <p>
                <strong className="text-carbon">Nota de metodología de este informe.</strong> La
                cobertura geográfica de este informe mejoró desde su primera versión: hoy 25 de las
                27 entidades tienen departamento identificado (92,6 %), gracias a una mejora reciente
                en la resolución de domicilios de la base de datos del proyecto. Términos de
                búsqueda utilizados: cannabis, cáñamo, marihuana, hemp, CBD, cannabidiol, THC, cbn,
                cbg y variantes; algunas entidades fueron incluidas por nombre aunque su objeto
                social registrado no menciona cannabis explícitamente — están marcadas
                individualmente en el directorio de arriba. Ninguna búsqueda por palabras clave es
                perfecta: quedan afuera entidades con objeto social genérico y sin ningún término
                cannábico en el nombre (ver más abajo el caso de Wichan S.A.S.). El capital se
                expresa en pesos nominales, sin ajuste por inflación. El CUIT se cruzó con el
                Registro Nacional de Sociedades / padrón ARCA-AFIP donde estuvo disponible.
              </p>
            </FuenteDatos>
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
