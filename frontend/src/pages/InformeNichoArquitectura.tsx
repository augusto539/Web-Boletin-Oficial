import { useEffect, useState } from "react";
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
  DEPARTAMENTOS_ARQUITECTURA,
  ECOSISTEMA_PROFESIONES,
  EVOLUCION_ANUAL,
  PERFIL_SOCIETARIO_DONA,
  TIPO_ENTIDAD,
} from "../data/nichoArquitectura";
import { registrarDescarga } from "../lib/descargasApi";
import { cuit as formatCuit, fecha, moneda } from "../lib/format";
import { type EntidadesNicho, obtenerEntidadesNicho } from "../lib/informesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoArquitectura() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();
  const [datos, setDatos] = useState<EntidadesNicho | null>(null);

  useEffect(() => {
    obtenerEntidadesNicho("arquitectura").then(setDatos);
  }, []);

  async function descargar() {
    if (!datos) return;
    setGenerando(true);
    try {
      const { exportarNichoArquitecturaPDF } = await import("../lib/exportarInforme");
      await exportarNichoArquitecturaPDF(datos.entidades);
      registrarDescarga("informe_nicho_arquitectura", "pdf", null, "Arquitectura en Mendoza");
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">Arquitectura en Mendoza</h1>
              <p className="mt-2 text-lg text-carbon/60">
                27 estudios y una profesión de asociación media
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
            Hermano chico del informe de Servicios Profesionales: la arquitectura es otra profesión
            regulada por colegio propio que el nomenclador CLAE mezcla con la ingeniería en una
            categoría poco discriminante, y que ese informe no cubrió. 27 estudios constituidos como
            sociedad entre 2018 y 2026 — el nicho más chico de toda esta serie.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Agosto de 2026 · Octavo de la serie de nichos sectoriales · Fuente: Boletín Oficial de la
            Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">27 estudios de arquitectura</strong> constituidos
                como sociedad comercial entre 2018 y 2026 — el nicho más chico de todos los
                evaluados en esta ronda, en el rango de tamaño de Cripto/Fintech (14).
              </li>
              <li>
                <strong className="text-carbon">Sin patrón temporal:</strong> entre 1 y 5
                constituciones por año, sin boom, sin colapso, sin meseta — un goteo constante desde
                2018.
              </li>
              <li>
                <strong className="text-carbon">Geografía mucho menos concentrada</strong> que el
                resto de la serie: solo el 26&nbsp;% (7 de 27) está en Capital — la proporción más
                baja de todos los nichos evaluados. Hay estudios propios en General Alvear, San
                Carlos y Tupungato, departamentos que en la mayoría de los otros nichos de esta
                serie no aparecen.
              </li>
              <li>
                <strong className="text-carbon">El ángulo de ecosistema:</strong> 475 personas
                declaran ser arquitectos/as en toda la base, de las cuales 464 figuran como socios
                en alguna sociedad — menos que abogados (770) y contadores (952), y también menos
                que el conjunto de todas las especialidades de ingeniería juntas (1.465).
              </li>
              <li>
                <strong className="text-carbon">Capital declarado:</strong> mediana de $450.000 —
                más alto que Software ($100.000) o Café ($300.000), coherente con un rubro que
                combina servicio profesional con desarrollo inmobiliario.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Un goteo, no una curva"
              subtitulo="Estudios de arquitectura constituidos por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="estudios"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es un año parcial: boletines relevados hasta julio de 2026.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-carbon/80">
              Con un universo de 27 no hay volumen suficiente para hablar de tendencia: la serie
              oscila entre 1 y 5 por año sin ningún patrón identificable, ni boom ni colapso. Es
              consistente con lo esperable de una profesión liberal tradicional que se organiza
              como sociedad comercial de forma ocasional, caso por caso, y no como resultado de un
              ciclo de mercado o una moda — la misma lectura que el informe de Servicios
              Profesionales hizo sobre los bufetes de abogados y contadores.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">El ángulo de ecosistema</h2>
            <p className="mt-2 text-sm text-carbon/60">
              Cuántas personas declaran cada profesión y cuántas de ellas figuran como socias en
              alguna sociedad de toda la base.
            </p>
            <div className="mt-6">
              <GraficoBarrasHorizontal
                titulo="Menos socios que las otras tres profesiones liberales comparadas"
                datos={ECOSISTEMA_PROFESIONES}
                etiquetaUnidad="personas"
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              475 personas del registro societario mendocino declaran una profesión que contiene
              "arquitect@", y 464 de ellas (98&nbsp;%) figuran como socias en al menos una sociedad
              — la profesión liberal con menos socios de las cuatro comparadas, aunque la
              comparación con ingeniería no es del todo pareja: esa etiqueta agrupa muchas
              especialidades distintas (civil, industrial, agrónomo, electromecánico y otras) bajo
              una sola palabra, mientras que arquitectura es una disciplina única.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Los arquitectos con más sociedades a su nombre no siempre están al frente de un
              estudio de arquitectura: el caso de mayor participación, con 7 sociedades, es un
              arquitecto vinculado a una serie de sociedades anónimas de desarrollo inmobiliario
              (nombradas como plazas europeas: Alexanderplatz S.A., Piazza Navona S.A.), no a
              ninguno de los 27 estudios de este relevamiento — el mismo patrón de "profesional que
              participa del negocio inmobiliario más allá de su estudio" que otros informes de esta
              serie encontraron en abogados y contadores.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <GraficoDona
              titulo="Perfil societario"
              subtitulo="Tipo societario de los 27 estudios"
              datos={PERFIL_SOCIETARIO_DONA}
              etiquetaUnidad="estudios"
            />
            <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <table className="w-full text-left text-sm">
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
              <p className="mt-4 text-sm text-carbon/70">
                Mediana de capital declarado: <strong className="text-carbon">$450.000</strong>{" "}
                (rango $40.000-$15.000.000) — más alto que Software ($100.000) o Café ($300.000), y
                comparable a Cerveza y Reciclaje ($440.000).
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Menos concentrado en Capital que cualquier otro nicho de la serie"
              subtitulo="27 de 27 estudios, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_ARQUITECTURA}
              etiquetaUnidad="estudios"
            />
            <p className="mt-3 px-1 text-sm text-carbon/70">
              Capital reúne solo el 26&nbsp;% de los estudios — la proporción más baja de cualquier
              nicho evaluado en esta tanda. La explicación más simple: el desarrollo inmobiliario y
              la obra privada que sostiene a un estudio de arquitectura ocurre en todos los
              departamentos donde hay crecimiento urbano, no solo en la capital provincial — General
              Alvear, San Carlos y Tupungato, que casi no aparecen en el resto de esta serie, tienen
              acá su propio estudio.
            </p>
          </div>
        </Reveal>

        {datos && datos.entidades.length > 0 && (
          <Reveal delay={0.4}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">Directorio completo: los 27 estudios</h2>
              <p className="mt-2 text-sm text-carbon/60">
                Ficha completa de cada uno de los 27 estudios identificados, ordenados por fecha de
                publicación del acto de Constitución en el Boletín (el que no tiene fecha capturada
                va al final).
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

        <Reveal delay={0.45}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Metodología y límites</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                Búsqueda solo por nombre ("arquitect%"), a diferencia de casi todos los demás
                nichos de esta serie — el objeto social ("obras de ingeniería y arquitectura") es
                una frase de boilerplate tan común en sociedades constructoras e inmobiliarias sin
                relación con un estudio real que buscar por objeto social hubiera dado 212
                candidatas, casi todas ruido. Las 27 candidatas por nombre no tuvieron que
                depurarse: todas son, en efecto, estudios o firmas de arquitectura reales.
              </p>
              <p>
                El ángulo de ecosistema (475 arquitectos, 464 socios) usa el campo profesión
                autodeclarado de las personas físicas, sin verificación contra la matrícula del
                Colegio de Arquitectos de Mendoza.
              </p>
              <p>
                Universo chico: con 27 sociedades, cualquier lectura de tendencia temporal o
                geográfica debe tomarse como orientativa, no como una serie estadísticamente
                robusta — el mismo límite que tuvo el informe de Cripto/Fintech (14 sociedades) en
                esta misma serie.
              </p>
              <p>
                Como en toda la serie, las constituciones se cuentan por fecha de publicación del
                acto en el Boletín, no por fecha de constitución declarada.
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
              La arquitectura como empresa en Mendoza es un fenómeno chico y disperso
              geográficamente, sin la narrativa de boom, colapso o meseta que mostraron los nichos
              más grandes de esta serie. Su interés no está en la curva sino en el contraste: es la
              profesión liberal menos concentrada en Capital de toda la serie, y sus miembros más
              prolíficos como socios societarios no siempre están construyendo estudios de
              arquitectura, sino participando del negocio inmobiliario en sentido amplio.
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
