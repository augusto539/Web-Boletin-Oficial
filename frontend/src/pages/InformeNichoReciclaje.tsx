import { useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoBarrasHorizontal } from "../components/GraficoBarrasHorizontal";
import { GraficoDona } from "../components/GraficoDona";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import {
  DEPARTAMENTOS_RECICLAJE,
  ENTIDADES,
  OLEADAS_BARRAS,
  OLEADAS_LEYENDA,
  PERFIL_SOCIETARIO_DONA,
  TOP_CAPITALES,
} from "../data/nichoReciclaje";
import { registrarDescarga } from "../lib/descargasApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

function formatearPesos(v: number): string {
  return `$${v.toLocaleString("es-AR")}`;
}

export default function InformeNichoReciclaje() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();

  async function descargar() {
    setGenerando(true);
    try {
      const { exportarNichoReciclajePDF } = await import("../lib/exportarInforme");
      await exportarNichoReciclajePDF();
      registrarDescarga("informe_nicho_reciclaje", "pdf", null, "Reciclaje y Economía Circular en Mendoza");
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
                Reciclaje y economía circular en Mendoza
              </h1>
              <p className="mt-2 text-lg text-carbon/60">
                De la chatarrería al "impacto ambiental" como marca
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
            41 sociedades se constituyeron en Mendoza entre 2018 y 2026 con la gestión,
            comercialización o reciclado de residuos como actividad central. No hay una única
            curva: tres oleadas sucesivas, por tipo de material y de negocio.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Agosto de 2026 · Undécimo de la serie de nichos sectoriales · Fuente: Boletín Oficial
            de la Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">41 sociedades identificadas</strong> entre 2018 y
                2026 con la gestión, comercialización o reciclado de residuos como actividad
                central: recicladoras de metales y plásticos, gestión de residuos peligrosos y
                urbanos, y consultoras ambientales.
              </li>
              <li>
                <strong className="text-carbon">No hay una única curva sino tres oleadas
                sucesivas</strong>, por tipo de material y de negocio: recicladoras de plástico
                concentradas en 2018-2020 (4 de 5), recicladoras de metales/chatarra concentradas
                en 2021-2023 (7 de 10), y una capa más reciente y mejor capitalizada de
                consultoras ambientales y "economía circular" que aparece casi toda entre 2023 y
                2026.
              </li>
              <li>
                <strong className="text-carbon">La capitalización sube fuerte en la capa más
                nueva:</strong> mientras la mediana general es de $440.000, las consultoras de
                2023-2026 declaran capitales sensiblemente mayores — Trigenus S.A. ($4.500.000,
                2023), Palcriva Estrategias Integrales ($3.000.000, 2025) y, en el extremo,
                Transformación Estratégica Circular S.A. ($60.000.000, 2024) son los tres
                capitales más altos del nicho.
              </li>
              <li>
                <strong className="text-carbon">Capital y Guaymallén concentran el 51&nbsp;%</strong>{" "}
                de las sociedades (21 de 41) — el corredor urbano del Gran Mendoza, donde se
                genera la mayor parte de los residuos a gestionar.
              </li>
              <li>
                Aparece una <strong className="text-carbon">cooperativa</strong> entre las 41:
                Economía Popular Y Circular Ltda. (2023) — la única forma societaria no
                lucrativa/asociativa del nicho.
              </li>
              <li>
                Un proyecto público notable: una{" "}
                <strong className="text-carbon">Unión Transitoria entre dos empresas</strong> para
                construir tres centros ambientales municipales en Tupungato, San Carlos y Tunuyán
                (2021).
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Tres oleadas, no una curva"
              subtitulo="Sociedades constituidas por período y subrubro"
              datos={OLEADAS_BARRAS}
              etiquetaUnidad="sociedades"
              leyenda={OLEADAS_LEYENDA}
            />
            <p className="mt-3 px-1 text-sm text-carbon/80">
              A diferencia de la mayoría de los nichos de esta serie, acá no hay un solo quiebre o
              boom identificable, sino un relevo entre subrubros. Las recicladoras de plástico
              dominan la primera oleada (Norplast, Madera Plástica, Aconcagua Reciclados,
              Tecmiplast); las de chatarra y metales ferrosos/no ferrosos toman el relevo en
              2021-2023 (Ferros Vip, Recuper Flethier, Metalnegocios Reciclados, Flet Ar Met 22,
              Cejas E Hijos Reciclados, Acopios Oeste Reciclados); y desde 2023 la categoría más
              numerosa pasa a ser la de consultoras y gestoras ambientales que se presentan
              explícitamente bajo la bandera de "economía circular", "triple impacto" o
              "estrategia ambiental" — un vocabulario que no aparece en ninguna sociedad del nicho
              antes de 2020.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <GraficoBarrasHorizontal
              titulo="La profesionalización se nota en el capital declarado"
              subtitulo="Los seis capitales más altos del nicho"
              datos={TOP_CAPITALES}
              etiquetaUnidad="capital declarado"
              formatearValor={formatearPesos}
            />
            <p className="mt-3 px-1 text-sm text-carbon/70">
              Mediana del nicho completo: <strong className="text-carbon">$440.000</strong> (rango
              $30.000-$60.000.000). Las tres consultoras/estrategas ambientales de 2023-2026
              (Trigenus, Palcriva, Transformación Estratégica Circular) están entre los cinco
              capitales más altos del nicho — llamativo para un rubro que en su primera oleada
              (2018-2020) tenía capitales típicos de $50.000 a $300.000. La lectura razonable: la
              gestión ambiental dejó de ser, al menos para una parte del sector, un negocio de
              recuperación de materiales a pequeña escala y pasó a presentarse como una actividad
              de consultoría estratégica y "sustentabilidad corporativa", con la capitalización
              inicial que eso implica.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Perfil societario</h2>
            <div className="mt-4">
              <GraficoDona
                titulo="Tipo societario de las 41 sociedades"
                datos={PERFIL_SOCIETARIO_DONA}
                etiquetaUnidad="sociedades"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              La S.A.S. domina como en casi toda la serie, pero el 24&nbsp;% de S.A. es alto para
              un nicho de este tamaño — varias de las recicladoras de metales/chatarra más
              antiguas (Vld Hierros, Ferros Vip, Recuper Flethier, Cejas E Hijos Reciclados, Flet
              Ar Met 22) eligieron esa forma, probablemente por la escala de capital de trabajo
              que requiere el acopio y comercio de materiales.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están"
              subtitulo="39 de 41 sociedades, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_RECICLAJE}
              etiquetaUnidad="sociedades"
            />
            <p className="mt-3 px-1 text-sm text-carbon/70">
              Capital y Guaymallén concentran más de la mitad del nicho — coherente con que la
              actividad de acopio y reciclado necesita estar cerca de donde se genera el volumen
              de residuos urbanos e industriales del Gran Mendoza, no en las zonas rurales del sur
              o el este provincial.
            </p>
          </div>
        </Reveal>

        {ENTIDADES.length > 0 && (
          <Reveal delay={0.35}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">Directorio completo: las 41 empresas de reciclaje</h2>
              <p className="mt-2 text-sm text-carbon/60">
                Ficha completa de cada una de las 41 sociedades identificadas, ordenadas por fecha
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
                      <span className="font-bold">Objeto social:</span> {e.objetoSocial ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Búsqueda: términos "recicl%", "circular", "residuo%", "chatarr%", "compost%",
                "scrap" en nombre y objeto social — 81 sociedades candidatas.
              </p>
              <p>
                Clasificación manual: se incluyeron las entidades donde el reciclado, la
                comercialización de materiales reciclables, la gestión/tratamiento de residuos o
                la consultoría en economía circular es la actividad central declarada, o donde el
                nombre de la sociedad lo identifica directamente. Se excluyeron 40 de las 81
                candidatas por el mismo patrón que en informes anteriores: objetos sociales
                catálogo donde "residuos" o "reciclaje" aparece como una palabra más entre muchas,
                sin ser el eje del negocio.
              </p>
              <p>
                Fecha de referencia: se usó la fecha de publicación del acto de Constitución; para
                dos sociedades sin acto de Constitución identificado (Economía Popular Y Circular
                Ltda. y Transformación Estratégica Circular S.A.) se usó la fecha de su primer
                acto registrado en el Boletín — en el segundo caso, un acto de "Transformación"
                (cambio de tipo societario), no de constitución original.
              </p>
              <p>
                Subcategorización (chatarra/metales, plásticos, cartuchos/electrónica,
                orgánicos/compost, ambiental-consultoría) es una clasificación editorial de este
                informe, no una categoría que declare el Boletín ni ARCA.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10">
            <FuenteDatos />
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Cierre</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              El reciclaje y la economía circular en Mendoza no tienen la biografía de un boom
              sectorial como la cerveza artesanal, ni la de un crecimiento sostenido y lineal:
              tienen la biografía de un rubro que cambió de cara con el tiempo, del chatarrero y el
              reciclador de plástico de los primeros años a la consultora ambiental de capital más
              alto que se presenta bajo la bandera de la "economía circular" en la segunda mitad de
              la década. Ambas capas conviven hoy en la misma base, y el Boletín Oficial es, hasta
              donde se sabe, el único registro público que permite verlas por separado.
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
