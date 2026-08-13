import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoDona } from "../components/GraficoDona";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  DEPARTAMENTOS_SEGURIDAD_PRIVADA,
  EVOLUCION_ANUAL,
  PERFIL_SOCIETARIO_DONA,
} from "../data/nichoSeguridadPrivada";
import { registrarDescarga } from "../lib/descargasApi";
import { cuit as formatCuit, fecha, moneda } from "../lib/format";
import { type EntidadesNicho, obtenerEntidadesNicho } from "../lib/informesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoSeguridadPrivada() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();
  const [datos, setDatos] = useState<EntidadesNicho | null>(null);

  useEffect(() => {
    obtenerEntidadesNicho("seguridad-privada").then(setDatos);
  }, []);

  async function descargar() {
    if (!datos) return;
    setGenerando(true);
    try {
      const { exportarNichoSeguridadPrivadaPDF } = await import("../lib/exportarInforme");
      await exportarNichoSeguridadPrivadaPDF(datos.entidades);
      registrarDescarga("informe_nicho_seguridad_privada", "pdf", null, "Seguridad Privada en Mendoza");
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                Seguridad privada en Mendoza
              </h1>
              <p className="mt-2 text-lg text-carbon/60">
                El único rubro de la serie que no sintió la pandemia
              </p>
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
            136 empresas de seguridad privada identificadas entre 2017 y 2026, vía el código CLAE
            "Servicios de seguridad e investigación n.c.p." — el único nicho de la serie sin caída
            en 2020.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Agosto de 2026 · Serie de nichos sectoriales · Fuente: Boletín Oficial de la Provincia de
            Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">136 empresas de seguridad privada identificadas</strong>{" "}
                entre 2017 y 2026, vía el código CLAE 801090 ("Servicios de seguridad e investigación
                n.c.p.") declarado como actividad principal — mismo método por clasificación oficial
                que el informe anterior de esta serie (Agencias de Viajes).
              </li>
              <li>
                <strong className="text-carbon">El único nicho de la serie sin caída en 2020</strong>:
                mientras las agencias de viajes cayeron 43% ese año, la seguridad privada apenas bajó
                de 15 a 13 empresas nuevas (-13%) y ya en 2021 se mantiene en el mismo nivel —
                coherente con que la vigilancia y custodia de bienes se mantuvo como actividad
                esencial durante la pandemia.
              </li>
              <li>
                <strong className="text-carbon">Crecimiento sostenido hasta el final de la serie</strong>:
                2024 y 2025 son los dos años más altos (21 empresas cada uno), sin señales de meseta
                ni de declive — el único nicho de esta tanda que todavía está acelerando al cierre
                del relevamiento.
              </li>
              <li>
                <strong className="text-carbon">Un código, dos negocios distintos</strong>: 26
                empresas declaran explícitamente sistemas técnicos (alarmas, cámaras, monitoreo), 9
                declaran transporte de caudales/valores, y solo 6 mencionan "investigación privada"
                en sentido literal de detective.
              </li>
              <li>
                <strong className="text-carbon">Grupo Rl</strong>: Lorena Belén Lescano y Pablo Andrés
                Juliani fundaron tres empresas de seguridad en Maipú en cuatro años — la cadena de
                fundadores repetidos más larga de toda la serie de nichos.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Crecimiento sin pausa, ni siquiera en pandemia"
              subtitulo="Empresas de seguridad constituidas por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="empresas"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es parcial: el relevamiento llega hasta julio. Cinco empresas del nicho no
              tienen fecha de acto capturada y no figuran en esta tabla.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-carbon/80">
              El contraste con el informe anterior de esta serie es directo: las agencias de viajes
              cayeron 43% interanual en 2020 y tardaron un año en recuperar el nivel prepandemia. La
              seguridad privada, en cambio, apenas sintió el golpe (-13%) y nunca dejó de crecer en
              el mediano plazo — 2024 y 2025 son los dos años más altos de toda la serie del rubro
              (21 cada uno), sin el patrón de pico-y-meseta que muestran café, cerveza o incluso las
              propias agencias de viajes. Es consistente con la naturaleza de la actividad: la
              vigilancia y custodia de bienes no se detiene cuando cae la actividad económica
              general — si acaso, una percepción de mayor inseguridad durante y después de la
              pandemia pudo haber sostenido la demanda.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Un código, dos negocios distintos (y un tercero minoritario)</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El nombre del código CLAE —"servicios de seguridad e investigación"— es una herencia de
              la clasificación internacional (ISIC/CIIU), que agrupa históricamente vigilancia
              privada y detectives bajo una misma categoría. En los datos reales de Mendoza, esa
              mezcla se ve, pero muy desequilibrada: de las 136 empresas, 26 declaran explícitamente
              sistemas técnicos (alarmas, cámaras, monitoreo), 9 declaran transporte de
              caudales/valores, y solo 6 mencionan "investigación privada" en sentido literal de
              detective — siempre junto con vigilancia y custodia, nunca como actividad exclusiva.
            </p>
            <p className="mt-4 rounded-2xl bg-humo p-4 text-sm leading-relaxed text-carbon/80 italic">
              "Servicios de investigación privada, vigilancia, custodia de bienes, seguridad en
              transporte de mercadería y caudales, fabricación y comercialización de [artículos de
              seguridad]..." — <span className="not-italic font-bold">Asabay Seguridad Privada S.A.S.</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              No aparece ningún caso de una sociedad dedicada solo a investigación privada sin
              vigilancia — el detective como actividad exclusiva, si existe en Mendoza, no se
              constituye bajo este código ni con esta combinación de palabras.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Perfil societario</h2>
            <div className="mt-4">
              <GraficoDona
                titulo="Tipo societario de las 136 empresas"
                datos={PERFIL_SOCIETARIO_DONA}
                etiquetaUnidad="empresas"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              Capital declarado: mediana de $200.000 (la más baja de toda la serie de nichos hasta
              ahora), rango de $1 a $30.000.000. El caso de $1 (Valhalla Servicios S.A.S., 2026) es
              casi con certeza un artefacto de extracción o un error de tipeo en el Boletín original,
              no un capital real — se conserva en los datos sin corregir, siguiendo el mismo criterio
              del resto del pipeline de no alterar lo publicado.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Grupo Rl: tres empresas, dos socios, cuatro años</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Cruzando socios entre las 136 empresas aparece la cadena de fundadores repetidos más
              larga de toda la serie de nichos: Lorena Belén Lescano y Pablo Andrés Juliani aparecen
              juntos como socios en tres sociedades de seguridad sucesivas, todas en Maipú — Grupo Rl
              Seguridad Privada S.A. (08/09/2020), Vabeju S.A.S. (05/05/2023) y Grupo Rl Vigilancia Er
              S.A.S. (19/12/2024). El patrón —misma pareja de socios, mismo departamento, sociedades
              sucesivas cada dos o tres años, dos de las tres con "Grupo Rl" en el nombre— sugiere una
              misma operación comercial reconstituida bajo sociedades nuevas, más que tres
              emprendimientos independientes.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Un segundo caso, más simple, es una historia de continuidad de marca: Javier Andrés
              Muñoz fundó Visión Seguridad S.A.S. (10/05/2022, Capital) y tres años después Seguridad
              Grupo Visión Sas (28/07/2025, Guaymallén) — mismo nombre de fantasía, otro departamento,
              un posible relanzamiento o expansión de la misma marca.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están"
              subtitulo="130 de 136 empresas, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_SEGURIDAD_PRIVADA}
              etiquetaUnidad="empresas"
            />
            <p className="mt-3 px-1 text-sm text-carbon/70">
              Capital y Guaymallén concentran casi la mitad del nicho a partes iguales (32 cada uno).
              Lo más llamativo es la presencia de Junín (6 empresas) — un departamento chico y
              agrícola que no aparece con este peso en ningún otro nicho de la serie, y que junto con
              Tunuyán y Tupungato sugiere una porción de la demanda ligada a custodia rural y de
              establecimientos agroindustriales, no solo a seguridad urbana.
            </p>
          </div>
        </Reveal>

        {datos && datos.entidades.length > 0 && (
          <Reveal delay={0.45}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">
                Directorio completo: las 136 empresas de seguridad
              </h2>
              <p className="mt-2 text-sm text-carbon/60">
                Ficha completa de cada una de las 136 sociedades identificadas, ordenadas por fecha
                de publicación del acto en el Boletín (las que no tienen fecha capturada van al
                final).
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

        <Reveal delay={0.5}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Búsqueda por CLAE, mismo método que Agencias de Viajes. Se usó el código 801090
                ("Servicios de seguridad e investigación n.c.p.") como actividad principal (orden 1,
                estado activo) declarada ante ARCA. Se excluyó deliberadamente el código 801020
                ("Servicios de sistemas de seguridad", 22 empresas en el corpus) — es una actividad
                más específicamente técnica (instalación de equipos), y mezclarla hubiera diluido el
                foco del informe en la vigilancia y custodia como servicio. Este método solo alcanza
                al 61,7% del corpus con cruce ARCA — una empresa de seguridad real sin ese cruce
                queda invisible.
              </p>
              <p>
                153 candidatas → 136 empresas únicas. El cruce dio 153 filas; ninguna quedó marcada
                como duplicado exacto, pero 17 nombres normalizados aparecían dos veces por el mismo
                patrón de republicación en el Boletín — se deduplicó por nombre normalizado,
                conservando la primera publicación cronológica. Cinco de las 153 filas no son actos
                de Constitución (modificaciones/cesiones) — sociedades sin acto de Constitución
                identificado, donde se usó la fecha del acto disponible.
              </p>
              <p>
                Cobertura ARCA: 93 de 136 (68,4%) cruzan contra el padrón de AFIP, todas con estado
                "Activo" — más alta que el promedio de la serie, aunque algo menor que Agencias de
                Viajes (77,4%). Consistente con que la seguridad privada es una actividad regulada
                (registro provincial de empresas de seguridad), aunque menos uniformemente que el
                turismo.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="mt-10">
            <FuenteDatos />
          </div>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              La seguridad privada mendocina tiene la biografía más lineal de toda esta serie:
              crecimiento sostenido durante nueve años, sin el boom-y-colapso de la cerveza artesanal
              ni siquiera el freno temporal que sufrieron las agencias de viajes en 2020. Es, además,
              el único rubro de la serie que parece seguir acelerando al cierre del relevamiento, con
              sus dos años más altos (2024 y 2025) justo al final. El nombre del código CLAE promete
              una mezcla de vigilancia y detectives que los datos no confirman: la inmensa mayoría son
              empresas de custodia y vigilancia física, un grupo más chico se especializa en sistemas
              técnicos, y la investigación privada en sentido estricto aparece solo como una línea
              secundaria dentro de seis objetos sociales, nunca como actividad exclusiva.
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
