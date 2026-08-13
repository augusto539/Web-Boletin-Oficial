import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DescargarIcon } from "../components/DescargarIcon";
import { FuenteDatos } from "../components/FuenteDatos";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoDona } from "../components/GraficoDona";
import { MapaMendoza } from "../components/MapaMendoza";
import { Reveal } from "../components/Reveal";
import { ModalRegistro } from "../components/auth/ModalRegistro";
import { DEPARTAMENTOS_CERVEZA, EVOLUCION_ANUAL, PERFIL_SOCIETARIO_DONA } from "../data/nichoCerveza";
import { registrarDescarga } from "../lib/descargasApi";
import { cuit as formatCuit, fecha, moneda } from "../lib/format";
import { type EntidadesNicho, obtenerEntidadesNicho } from "../lib/informesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoCerveza() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();
  const [datos, setDatos] = useState<EntidadesNicho | null>(null);

  useEffect(() => {
    obtenerEntidadesNicho("cerveza").then(setDatos);
  }, []);

  async function descargar() {
    if (!datos) return;
    setGenerando(true);
    try {
      const { exportarNichoCervezaPDF } = await import("../lib/exportarInforme");
      await exportarNichoCervezaPDF(datos.entidades);
      registrarDescarga("informe_nicho_cerveza", "pdf", null, "Cerveza Artesanal en Mendoza");
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
              <h1 className="mt-2 text-4xl font-bold md:text-5xl">Cerveza artesanal en Mendoza</h1>
              <p className="mt-2 text-lg text-carbon/60">
                Un boom de tres años que no volvió a repetirse
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
            36 sociedades cerveceras se constituyeron en Mendoza entre 2017 y 2026: productoras
            artesanales, cervecerías-bar con elaboración propia y una cámara gremial del sector. El
            72&nbsp;% se concentró en apenas tres años.
          </p>
          <p className="mt-3 text-sm text-carbon/50">
            Agosto de 2026 · Décimo de la serie de nichos sectoriales · Fuente: Boletín Oficial de
            la Provincia de Mendoza (2017–2026)
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Resumen ejecutivo</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-carbon/80">
              <li>
                <strong className="text-carbon">36 sociedades cerveceras</strong> identificadas
                entre 2017 y 2026: productoras artesanales, cervecerías-bar con elaboración propia
                y una cámara gremial del sector.
              </li>
              <li>
                <strong className="text-carbon">El sector nació de golpe y se apagó rápido:</strong>{" "}
                26 de las 36 (72&nbsp;%) se constituyeron en apenas tres años, 2017-2019. Desde
                2020 la curva colapsa: 4, 1, 1, 3, y ninguna desde 2023.
              </li>
              <li>
                La forma societaria dominante es la S.A.S. (22 de 36, 61&nbsp;%), pero con una
                proporción de S.A. inusualmente alta para un rubro de emprendimientos chicos (6 de
                36, 17&nbsp;%) — probablemente porque producir cerveza exige más capital inicial e
                infraestructura que una consultora o un estudio.
              </li>
              <li>
                Geografía: <strong className="text-carbon">Capital (9) y Godoy Cruz (8)</strong>{" "}
                concentran casi la mitad de las cerveceras — el corredor gastronómico/nocturno del
                Gran Mendoza, no las zonas agrícolas de materia prima.
              </li>
              <li>
                La institucionalización del sector quedó marcada por la{" "}
                <strong className="text-carbon">
                  Asociación Cámara Mendocina de Cervecerías Artesanales
                </strong>
                , constituida en 2018 — año pico del boom.
              </li>
              <li>
                Un pequeño grupo de personas repite entre distintas cervecerías: cuatro socios
                fundaron <strong className="text-carbon">Rodder S.A.S. y Leven Anclas S.A.S.</strong>{" "}
                con apenas tres semanas de diferencia (noviembre-diciembre de 2018).
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="El boom de 2017-2019, y lo que vino después"
              subtitulo="Cerveceras constituidas por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="cerveceras"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es un año parcial: boletines relevados hasta julio de 2026. Ninguna cervecera
              nueva desde 2023.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-3 text-sm leading-relaxed text-carbon/80">
              <p>
                El patrón es opuesto al de casi todos los nichos de esta serie, que muestran
                crecimiento sostenido o aceleración reciente. Acá el pico es 2018 (11 sociedades,
                casi una por mes) y la caída es abrupta: 2020 marca el quiebre, coincidiendo con las
                restricciones a la gastronomía y el consumo en bares durante la pandemia — un golpe
                especialmente duro para un rubro que combina producción de capital intensivo con
                venta en salón. La caída no se recupera después: solo 5 cerveceras más se
                registraron entre 2021 y 2026, y ninguna desde 2023.
              </p>
              <p>
                Una lectura alternativa, no excluyente: para 2019 ya había una oferta relativamente
                numerosa de cervecerías artesanales en el Gran Mendoza (al menos 26 según este
                relevamiento), y el mercado local puede haberse acercado a su punto de saturación
                antes de que llegara la pandemia — la caída de 2020 aceleraría un freno que ya se
                insinuaba.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Perfil societario</h2>
            <div className="mt-4">
              <GraficoDona
                titulo="Tipo societario de las 36 cerveceras"
                datos={PERFIL_SOCIETARIO_DONA}
                etiquetaUnidad="cerveceras"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              El 17&nbsp;% de Sociedades Anónimas es alto para un nicho de emprendimientos chicos:
              la S.A. exige más formalidad y capital mínimo que la S.A.S., y varias de las
              cerveceras más antiguas del listado (Cerveceria Andina, Master Beer, Cerveceria
              Junin, Boulder) eligieron esa forma — probablemente porque se constituyeron en
              2017-2018, antes de que la S.A.S. se consolidara como default absoluto del registro
              mendocino. Capital declarado: mediana de $120.000, con un rango de $20.000 a
              $2.074.600 (Kühlen Beer S.A.S., 2019).
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están"
              subtitulo="35 de 36 cerveceras, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_CERVEZA}
              etiquetaUnidad="cerveceras"
            />
            <p className="mt-3 px-1 text-sm text-carbon/70">
              Capital y Godoy Cruz juntos concentran el 47&nbsp;% del sector — el corredor
              gastronómico y de vida nocturna del Gran Mendoza, no las zonas rurales donde se
              cultiva el lúpulo o la cebada (que en la práctica se importan casi en su totalidad).
              Como en el informe de Bodegas Boutique, el domicilio legal describe dónde se vende y
              se administra el negocio, no necesariamente dónde está la planta de producción.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Un pequeño clúster de cofundadores repetidos</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Cruzando los socios de las 36 cerveceras aparecen ocho personas que participan en más
              de una:
            </p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs tracking-wider text-carbon/50 uppercase">
                <tr>
                  <th className="py-2">Personas</th>
                  <th className="py-2">Sociedades</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">
                    Federico Pace, Felipe Andrés Suarez Bidondo, Manuel Ortega Grebenc, Ramiro
                    Sanchez Del Gesso
                  </td>
                  <td className="py-2.5">Leven Anclas S.A.S. y Rodder S.A.S.</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Matías Fabián Bismach</td>
                  <td className="py-2.5">Fabrica De Triple Impacto S.A.S. y Mabisemi S.R.L.</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Ignacio Moyano Sierra</td>
                  <td className="py-2.5">Beer Time S.A. y Galinsky S.A.S.</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Juan Cruz Pereyra</td>
                  <td className="py-2.5">Galinsky S.A.S. y Vastra De Cuyo S.A.S.</td>
                </tr>
                <tr className="border-t border-carbon/10">
                  <td className="py-2.5 font-bold">Alexander Ernesto Atem</td>
                  <td className="py-2.5">Beer Time S.A. y Monaco Nero S.A.S.</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              El caso más llamativo: los cuatro socios de Leven Anclas S.A.S. (constituida
              20/12/2018) son los mismos cuatro de Rodder S.A.S. (constituida 29/11/2018) —
              veintiún días antes. Es el mismo equipo registrando dos sociedades cerveceras casi en
              simultáneo, un patrón de cofundación múltiple en miniatura, similar al que apareció a
              mayor escala en el análisis de grafos de esta misma base. No hay forma de saber desde
              el Boletín si una reemplazó a la otra, si dividen funciones (producción vs. venta) o
              si una quedó inactiva — es una pregunta abierta, no una conclusión.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">La cámara gremial</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              La{" "}
              <Link to={`/sociedad/${10677}`} className="text-vino hover:underline">
                Asociación Cámara Mendocina de Cervecerías Artesanales
              </Link>{" "}
              se constituyó en 2018, en pleno pico del boom (11 cerveceras ese año). Que el sector
              haya sentido la necesidad de organizarse gremialmente en su año de mayor crecimiento,
              y no antes ni después, es coherente con la lectura general: 2018 fue el momento de
              mayor efervescencia del rubro en Mendoza, antes de la desaceleración de 2020 en
              adelante.
            </p>
          </div>
        </Reveal>

        {datos && datos.entidades.length > 0 && (
          <Reveal delay={0.45}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">Directorio completo: las 36 cervecerías</h2>
              <p className="mt-2 text-sm text-carbon/60">
                Ficha completa de cada una de las 36 sociedades identificadas, ordenadas por fecha
                de publicación del acto de Constitución en el Boletín (la que no tiene fecha
                capturada va al final).
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
                Búsqueda: términos "cerveza", "cervecer[íi]a", "l[uú]pulo", "malter[íi]a",
                "brewing", "brewery" en nombre y objeto social — 90 sociedades candidatas.
              </p>
              <p>
                Clasificación manual: se incluyeron como cerveceras las entidades donde la
                elaboración, fabricación o comercialización de cerveza es una actividad declarada
                explícitamente (no solo mencionada de pasada en un objeto social genérico de
                "gastronomía en general"), o cuyo propio nombre de fantasía identifica a la empresa
                como cervecería/marca de cerveza. Se excluyeron: fabricantes de maquinaria para la
                industria de bebidas, distribuidoras generales de bebidas sin producción propia, y
                comercios gastronómicos genéricos donde "cervecería" aparece como una entre varias
                palabras de un objeto social tipo catálogo, sin que la cerveza sea el eje del
                negocio. La frontera entre "cervecería-bar con elaboración propia" y "bar genérico
                que también sirve cerveza" es la más subjetiva del criterio: 54 de las 90
                candidatas quedaron afuera por este motivo.
              </p>
              <p>
                Cobertura ARCA: solo 14 de las 36 (39&nbsp;%) tienen cruce con el padrón de AFIP,
                todas con estado "Activo" — la cobertura baja no es evidencia de cierre de
                negocios, sino una limitación del padrón disponible. No se puede usar este dato
                para estimar cuántas cerveceras siguen operando hoy.
              </p>
              <p>
                Como en toda la serie, las constituciones se cuentan por fecha de publicación del
                acto en el Boletín, no por fecha de constitución declarada.
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
              El sector cervecero artesanal mendocino tiene una biografía más corta y más abrupta
              que los demás nichos de esta serie: nació con fuerza en 2017-2019 (26 de 36
              sociedades, y su propia cámara gremial), y prácticamente dejó de generar sociedades
              nuevas después de 2020. Si es saturación de mercado, golpe de pandemia, o ambas cosas
              combinadas, es una pregunta que este relevamiento deja planteada — no puede
              responderla por sí solo.
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
