import { useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  DEPARTAMENTOS_ENERGIA,
  ENTIDADES,
  EVOLUCION_ANUAL,
  LEYENDA_EVOLUCION,
  TIPO_ENTIDAD,
} from "../data/nichoEnergiaRenovable";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoEnergiaRenovable() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarNichoEnergiaRenovablePDF } = await import("../lib/exportarInforme");
      await exportarNichoEnergiaRenovablePDF();
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">Energía solar y eólica en Mendoza</h1>
              <p className="mt-2 text-lg text-carbon/60">Dos olas, un mismo objetivo</p>
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
            Entre 2017 y 2026 se constituyeron 50 empresas de energía solar, eólica o renovable en
            Mendoza. Pero no llegaron de a poco: los datos muestran dos olas bien diferenciadas —una
            explosión en 2017 y un rebrote en 2024-2026—, separadas por un vacío de años que en 2023
            fue absoluto.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Julio de 2026 · Cuarto de la serie de nichos sectoriales · Fuente: Boletín Oficial de la
            Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">50 empresas</strong> de energía solar, eólica o
                renovable identificadas entre 2017 y 2026 en el Boletín Oficial de la Provincia de
                Mendoza.
              </li>
              <li>
                Los datos muestran dos olas separadas por un vacío casi total: una primera ola de 18
                constituciones en un solo año, 2017 —más de un tercio del total de toda la muestra—,
                seguida de una caída abrupta —2023 no registra una sola constitución— hasta una
                segunda ola más chica en 2024-2026 (7, 4 y 2 respectivamente).
              </li>
              <li>
                La primera ola coincide con el Programa RenovAr del gobierno nacional (rondas de
                licitación de energía renovable en 2016 y agosto de 2017). Varias empresas de 2017 se
                constituyeron el mismo día, en grupos: cuatro sociedades el 26 de enero de 2017, seis
                "Helios Río Diamante" numeradas I a VI el 15 y 22 de mayo — el patrón típico de
                sociedades de propósito específico (SPV) creadas para ejecutar un proyecto de energía
                renovable a escala de "parque".
              </li>
              <li>
                La S.A. domina el total (27 de 50, 54 %), empujada casi enteramente por la primera
                ola: de las 18 empresas de 2017, la inmensa mayoría son S.A. con un capital inicial
                nominal idéntico de $100.000 —el mínimo legal de la época, que no refleja la
                inversión real del proyecto—. La segunda ola (2024-2026), en cambio, es
                mayoritariamente S.A.S.: 11 de las 13 empresas de ese tramo.
              </li>
              <li>
                Geográficamente, a diferencia de los otros informes de esta serie, las zonas de
                proyecto le ganan a la capital administrativa: Luján de Cuyo (13) y San Rafael (11)
                juntas superan ampliamente a Capital (8).
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">
              El contexto: RenovAr primero, generación distribuida después
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                En 2016 el gobierno nacional lanzó el Programa RenovAr, un esquema de licitaciones
                públicas para sumar generación de energía renovable a la matriz eléctrica argentina.
                La Ronda 1 (mayo de 2016) adjudicó 29 proyectos por 1.142 MW; la Ronda 1.5 (octubre de
                2016) sumó 30 proyectos por 1.281,5 MW; la Ronda 2 (agosto de 2017) adjudicó 88
                proyectos por 2.043 MW. En conjunto, las tres rondas adjudicaron 147 proyectos por
                4.466,5 MW en todo el país.
              </p>
              <p>
                Cada proyecto de gran escala —un "parque solar" o un "parque eólico"— suele
                organizarse como una sociedad de propósito específico: una S.A. creada exclusivamente
                para ese proyecto, con capital inicial nominal (a menudo el mínimo legal), porque el
                financiamiento real viene de deuda de proyecto o de inversores, no del capital social
                declarado. Eso explica el patrón de 2017 en los datos de Mendoza: varias sociedades
                constituidas el mismo día, con nombres que remiten a proyectos concretos ("Parque
                Eólico Florencia", "Parque Solar Katrina", "Helios Río Diamante PV I" a "VI") y
                capital idéntico de $100.000.
              </p>
              <p>
                La segunda ola (2024-2026) responde a un fenómeno distinto: el crecimiento de la
                generación distribuida —instalación de paneles solares en techos y a pequeña escala,
                habilitada por la Ley 27.424 de 2017 y su reglamentación posterior, que permite a
                particulares y empresas generar su propia energía e inyectar excedentes a la red—.
                Los nombres de esta segunda camada (Solarenergy, Suntec Energía, Solarix, Soluciones
                Renovables) son más genéricos y comerciales, no ligados a un proyecto específico, y
                eligen mayoritariamente la S.A.S. —consistente con negocios de instalación y
                servicios, no con vehículos de un solo proyecto de gran escala.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Energía solar y eólica en Mendoza: dos olas separadas por un vacío"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="empresas"
              leyenda={LEYENDA_EVOLUCION}
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es un año parcial: boletines relevados hasta julio de 2026. ** Las otras 2
              empresas de la muestra (de 50 totales) no tienen fecha de constitución capturada y no
              figuran en este gráfico, aunque sí están en el directorio.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="text-sm leading-relaxed text-carbon/80">
              <p>
                El arranque es un pico altísimo: 18 constituciones en 2017, más de un tercio de toda
                la muestra en un solo año. Después, una caída empinada y sostenida: entre 2018 y 2022
                ningún año supera las 7 constituciones, y 2023 no tiene ni una sola. Recién en
                2024-2026 aparece una segunda ola, más chica y más pareja: 7, 4 y 2.
              </p>
              <p className="mt-3">
                Las dos olas se explican por lo que contamos en la sección anterior. La de 2017 es la
                huella de las rondas de licitación de RenovAr (2016-2017): una vez adjudicados los
                proyectos, los vehículos societarios para ejecutarlos se constituyeron en tandas —de
                ahí las cuatro sociedades del 26 de enero de 2017 y las seis "Helios Río Diamante" del
                15 y 22 de mayo—. El vacío de 2018-2023 es consistente con que, constituidos esos
                vehículos, no hubo una ronda nacional comparable en los años siguientes. Y la
                reaparición en 2024-2026 no responde a una nueva licitación de gran escala sino a un
                fenómeno distinto y más chico: la generación distribuida.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">
              Tipo societario y capital: cada ola tiene su propio perfil
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
                El patrón societario confirma la lectura de las dos olas. La S.A. lidera el total (27
                de 50, 54 %) casi enteramente por arrastre de la ola de 2017: los vehículos de
                proyecto de la era RenovAr, que en su gran mayoría eligieron esa figura. La ola
                2024-2026, en cambio, es mayoritariamente S.A.S. —11 de las 13 empresas de ese
                tramo—, el mismo patrón de adopción masiva de la S.A.S. que ya documentó el informe de
                esta serie dedicado a esa figura.
              </p>
              <p>
                En cuanto al capital: 46 de las 50 empresas declaran capital inicial, con una mediana
                de $100.000, un mínimo de $30.000 y un máximo de $30.000.000 (Energías Renovables El
                Diamante S.A., 2024).
              </p>
              <p>
                La mediana de $100.000 coincide con la mediana general de toda la economía mendocina
                en esos años, pero en este rubro particular ese número es engañoso: para los
                vehículos de proyecto de 2017, $100.000 era apenas el capital social mínimo nominal,
                sin relación con la inversión real del proyecto, que se mide en millones de dólares y
                se financia aparte, vía deuda o inversores. El capital declarado en el Boletín no
                captura el tamaño real de una inversión en un parque solar o eólico.
              </p>
              <p>
                El outlier de $30.000.000 (Energías Renovables El Diamante S.A., 2024) es la
                excepción más reciente y la de mayor capital declarado de toda la muestra.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están domiciliadas las empresas de energía renovable"
              subtitulo="47 de 50 empresas, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_ENERGIA}
              etiquetaUnidad="empresas"
            />
            <div className="mt-3 space-y-3">
              <p className="px-1 text-sm text-carbon/50">
                47 de las 50 empresas tienen departamento identificado; 3 no.
              </p>
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-800">Advertencia metodológica</p>
                <p className="mt-1.5 text-sm leading-relaxed text-amber-900/80">
                  Vale la misma advertencia de los informes anteriores de esta serie: el departamento
                  corresponde al domicilio LEGAL de la sociedad, no necesariamente a la ubicación
                  física del parque solar o eólico. Pero acá hay un matiz que distingue a este rubro.
                  En Enoturismo, Cannabis y Bodegas boutique, Capital encabezaba claramente el
                  ranking —el clásico sesgo del domicilio en estudios jurídicos y contables del
                  microcentro—. En energía renovable, en cambio, Capital queda en tercer lugar,
                  detrás de Luján de Cuyo (13) y San Rafael (11). Los nombres de las empresas de la
                  ola 2017 lo insinúan: "Helios Río Diamante" remite al río Diamante, que está en el
                  departamento de San Rafael. En este rubro el domicilio legal tiende a coincidir más
                  con la zona real del proyecto que en otros de la serie — razonable, tratándose de
                  infraestructura física de gran escala que necesita anclarse administrativamente
                  cerca de donde se construye.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Directorio completo: las 50 empresas</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Ficha completa de cada una de las 50 sociedades identificadas, ordenadas por fecha de
              publicación del acto de constitución en el Boletín (las 2 sin fecha capturada van al
              final). Los socios que son personas jurídicas —Dax Energy Holdings, Tassaroli S.A.,
              Green S.A. y similares— no tienen ficha propia en el sitio y aparecen sin enlace.
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

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y fuente de datos</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Fuente: sección "Contratos Sociales" del Boletín Oficial de la Provincia de Mendoza,
                2017-2026. La búsqueda inicial por nombre y objeto social ("solar", "eólica/eolica",
                "fotovoltaica", "renovable", "energía renovable", "energías limpias") arrojó 95
                candidatas.
              </p>
              <p>
                Igual que en los informes anteriores de la serie, el filtro inicial es ruidoso:
                muchas S.A.S. con objeto social boilerplate mencionan actividades "energéticas" entre
                15-20 rubros no relacionados, sin ser realmente empresas de energía renovable.
                También aparecieron casos donde "solar" no se refería a energía: apellidos, nombres
                de fincas, "solar" como sinónimo de terreno o lote. Cada una de las 95 candidatas se
                revisó individualmente; el filtro descartó 45 de las 95 (47,4 %). Las 50 que quedaron
                son las que este informe analiza.
              </p>
              <p>
                Nota metodológica ya usada en la serie: las constituciones se cuentan por fecha de
                publicación del acto en el Boletín, no por fecha de constitución declarada. 2 de las
                50 empresas no tienen acto de Constitución capturado en la base y no aparecen en la
                tabla de evolución temporal, aunque sí están en el directorio.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10">
            <FuenteDatos>
              <p>
                <strong className="text-carbon">Nota de metodología de este informe.</strong> Varios
                socios de las sociedades de propósito específico de la ola 2017 son personas
                jurídicas (Dax Energy Argentina Holdings S.p.A., Dax Energy Holdings S.p.A., Tassaroli
                S.A., Green S.A., Grupo Energías Globales S.A., entre otras), sin ficha propia en este
                sitio — aparecen listadas en el directorio pero sin enlace. El capital se expresa en
                pesos nominales, sin ajuste por inflación.
              </p>
            </FuenteDatos>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Este es el cuarto informe de la serie de nichos sectoriales, y deja la lección más
              nítida de todas. La energía renovable en Mendoza no creció de forma orgánica y
              sostenida como las bodegas boutique, ni en aceleración continua como el enoturismo o el
              cannabis: creció en dos saltos discretos, cada uno gatillado por una política pública
              distinta —una ronda de licitación nacional en 2017, la generación distribuida más
              recientemente—, con un vacío de años en el medio. Es la prueba más clara de esta serie
              de que la política regulatoria, más que la demanda de mercado por sí sola, puede
              prender y apagar un sector entero.
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
