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
  DEPARTAMENTOS_AGENCIAS_VIAJES,
  EVOLUCION_ANUAL,
  PERFIL_SOCIETARIO_DONA,
  TIPO_CLAE_DONA,
} from "../data/nichoAgenciasViajes";
import { registrarDescarga } from "../lib/descargasApi";
import { cuit as formatCuit, fecha, moneda } from "../lib/format";
import { type EntidadesNicho, obtenerEntidadesNicho } from "../lib/informesApi";
import { useAccionConSesion } from "../lib/useAccionConSesion";

export default function InformeNichoAgenciasViajes() {
  const [generando, setGenerando] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();
  const [datos, setDatos] = useState<EntidadesNicho | null>(null);

  useEffect(() => {
    obtenerEntidadesNicho("agencias-viajes").then(setDatos);
  }, []);

  async function descargar() {
    if (!datos) return;
    setGenerando(true);
    try {
      const { exportarNichoAgenciasViajesPDF } = await import("../lib/exportarInforme");
      await exportarNichoAgenciasViajesPDF(datos.entidades);
      registrarDescarga("informe_nicho_agencias_viajes", "pdf", null, "Agencias de Viajes en Mendoza");
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
                Agencias de viajes en Mendoza
              </h1>
              <p className="mt-2 text-lg text-carbon/60">
                La pandemia frenó la curva un año, no la cortó
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
            168 agencias de viajes identificadas entre 2017 y 2026 — el universo más grande de esta
            serie hasta ahora, construido con el código CLAE oficial (minorista o mayorista) en vez
            de una búsqueda de texto libre.
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
                <strong className="text-carbon">168 agencias de viajes identificadas</strong> entre
                2017 y 2026 — el universo más grande de esta serie hasta ahora, y el primero
                construido con el código CLAE oficial (791100 "minorista" o 791200 "mayorista")
                que cada sociedad declaró ante ARCA, en vez de buscar palabras clave en el objeto
                social.
              </li>
              <li>
                <strong className="text-carbon">La pandemia frenó la curva, no la cortó</strong>: de
                14 agencias en 2019 cae a 8 en 2020 (cierre de fronteras) y ya en 2021 supera el
                nivel prepandemia (16). El pico real llega después: <strong className="text-carbon">
                40 agencias en 2023</strong>, el año más alto de toda la serie.
              </li>
              <li>
                <strong className="text-carbon">85% son minoristas</strong> (143 de 168) contra 15%
                mayoristas (25) — un mercado de agencias chicas que venden al público, con un grupo
                minoritario operando como operador turístico/receptivo.
              </li>
              <li>
                <strong className="text-carbon">Cobertura ARCA excepcionalmente alta</strong>: 130 de
                168 (77,4%) tienen cruce con el padrón de AFIP, todas activas — muy por encima del
                30-50% típico de los demás nichos, coherente con una actividad regulada.
              </li>
              <li>
                <strong className="text-carbon">Viajo Facil S.A.</strong> (2025, Luján de Cuyo) reúne
                en una sociedad nueva con <strong className="text-carbon">$30.000.000 de capital</strong>{" "}
                a dos socios que un año y medio antes habían fundado agencias separadas el mismo día:
                una fusión de dos trayectorias individuales en una sociedad casi seis veces más grande
                que cualquiera de las dos anteriores.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <GraficoBarras
              titulo="Un año de pausa, no de quiebre"
              subtitulo="Agencias constituidas por año"
              datos={EVOLUCION_ANUAL}
              etiquetaUnidad="agencias"
            />
            <p className="mt-3 px-1 text-sm text-carbon/50">
              * 2026 es parcial: el relevamiento llega hasta julio. Dos sociedades del nicho no
              tienen fecha de Constitución capturada y no figuran en esta tabla.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-carbon/80">
              El turismo internacional fue uno de los sectores más golpeados por la pandemia, y la
              caída de 2019 a 2020 (14 → 8, -43%) lo confirma en los datos societarios locales. Pero
              el freno duró exactamente un año: 2021 ya cierra por encima de 2019 (16 contra 14), y
              de ahí el crecimiento es prácticamente ininterrumpido hasta el pico de 40 agencias en
              2023 — el año más alto de cualquier nicho relevado en esta serie hasta ahora. 2024 y
              2025 se mantienen en una meseta alta (29 y 27) sin volver a los niveles pre-2022, lo
              que sugiere que 2023 fue un pico de reapertura post-pandemia ("revenge travel") más
              que un nuevo piso estructural del sector.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Minoristas y mayoristas</h2>
            <div className="mt-4">
              <GraficoDona
                titulo="Tipo de agencia (CLAE)"
                datos={TIPO_CLAE_DONA}
                etiquetaUnidad="agencias"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              La proporción es la esperable en cualquier mercado turístico: la mayoría vende directo
              al público (minorista), y un grupo más chico opera como intermediario mayorista/operador.
              El capital declarado no distingue claramente a un grupo del otro: dos de los tres
              capitales más altos del nicho (Viajo Facil S.A. e Intermission S.A.S., ambas
              $30.000.000) están clasificadas como minoristas, no mayoristas — el volumen de capital
              parece responder más al tamaño de la operación que a su posición en la cadena de
              intermediación.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Perfil societario</h2>
            <div className="mt-4">
              <GraficoDona
                titulo="Tipo societario de las 168 agencias"
                datos={PERFIL_SOCIETARIO_DONA}
                etiquetaUnidad="agencias"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-carbon/80">
              El dominio de la S.A.S. (89%) es el más alto de toda la serie de nichos — coherente con
              que el 70% de las agencias se constituyeron desde 2021, el período en que la S.A.S. ya
              era la forma societaria por defecto para un emprendimiento chico en Mendoza. Capital
              declarado: mediana de $400.000, rango de $20.000 (Puerto Montt Viajes S.A.S., 2018) a
              $30.000.000 (dos casos: Viajo Facil S.A. y Lantier S.A., ambas 2025).
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Una fusión de trayectorias: el caso Viajo Facil</h2>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Cruzando socios entre las 168 agencias aparecen 15 pares de personas que participaron,
              en momentos distintos, de más de una agencia del nicho — suficiente para reconstruir
              algunas trayectorias. <strong className="text-carbon">Viajo Facil S.A.</strong> (03/04/2025,
              Luján de Cuyo, $30.000.000) es la sociedad con más capital del nicho, y sus dos socios
              no llegaron ahí como primerizos: Nicolas Furtado Flores había fundado Be Fun Travel S.A.
              ($5.000.000, Guaymallén) y Martin Lopez había fundado Global Xplore S.A. ($6.000.000,
              Capital) — ambas el mismo día, 15/05/2023. Casi dos años después, los dos se asociaron
              en una sociedad nueva con casi seis veces el capital de cualquiera de sus emprendimientos
              individuales anteriores.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-carbon/80">
              Un patrón inverso, de sociedad que se divide en vez de fusionarse, aparece en Sg S.A.S.
              (05/10/2020, Capital): sus dos socios fundadores se separaron societariamente al año
              siguiente, cada uno fundando una agencia nueva con un objeto social casi calcado del
              original — típico de una sociedad que se disuelve en dos negocios independientes del
              mismo rubro.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10">
            <MapaMendoza
              titulo="Dónde están"
              subtitulo="163 de 168 agencias, con departamento identificado."
              valorPorNombre={DEPARTAMENTOS_AGENCIAS_VIAJES}
              etiquetaUnidad="agencias"
            />
            <p className="mt-3 px-1 text-sm text-carbon/70">
              Capital concentra un tercio del nicho, esperable para un rubro de oficina y atención al
              público. Lo notable es la fuerte presencia de Luján de Cuyo (26, segundo lugar) por
              encima de Godoy Cruz — sede también de dos de las tres agencias con capital más alto, y
              de gran parte de la industria vitivinícola y del turismo del vino de la provincia.
            </p>
          </div>
        </Reveal>

        {datos && datos.entidades.length > 0 && (
          <Reveal delay={0.45}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">
                Directorio completo: las 168 agencias de viajes
              </h2>
              <p className="mt-2 text-sm text-carbon/60">
                Ficha completa de cada una de las 168 sociedades identificadas, ordenadas por fecha de
                publicación del acto de Constitución en el Boletín (las que no tienen fecha capturada
                van al final).
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
                Búsqueda por CLAE, no por palabra clave. A diferencia de los demás informes de esta
                serie, este nicho no se armó buscando términos en objeto social o nombre — se usó el
                código de actividad económica (CLAE) que cada sociedad declaró ante ARCA al
                inscribirse: 791100 ("Servicios minoristas de agencias de viajes") o 791200
                ("Servicios mayoristas de agencias de viajes"), tomando siempre la actividad marcada
                como principal. Es más preciso que el texto libre, pero solo alcanza al 61,7% del
                corpus que logró cruzar contra el Registro Nacional de Sociedades — una agencia real
                sin ese cruce queda invisible, sin forma de estimar cuántas son.
              </p>
              <p>
                191 candidatas → 168 agencias únicas. El cruce por CLAE principal dio 191 filas (164
                minorista + 27 mayorista); 189 sobrevivieron al filtro de duplicados exactos. De esas,
                19 pares/tríos correspondían a la misma sociedad publicada más de una vez en el
                Boletín — se deduplicó por nombre normalizado, conservando la primera publicación
                cronológica.
              </p>
              <p>
                Cobertura ARCA: 130 de 168 (77,4%) cruzan contra el padrón de AFIP, todas con estado
                "Activo" — la cobertura más alta de toda la serie de nichos, coherente con que operar
                como agencia de viajes es una actividad regulada que exige inscripción formal. Aun
                así, no permite estimar cuántas siguen operando hoy: la ausencia de baja en el padrón
                no es lo mismo que actividad comercial activa.
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
              Las agencias de viajes mendocinas tienen la biografía más clara de shock-y-recuperación
              de toda esta serie: un freno nítido en 2020 (-43% interanual) seguido de una
              recuperación que no solo compensó la caída sino que la superó ampliamente, con un pico
              en 2023 que casi triplica el nivel prepandemia. Es también el nicho con mejor cobertura
              ARCA de la serie y el primero construido sobre una clasificación oficial (CLAE) en
              lugar de una búsqueda de texto libre. Entre las 168, dos trayectorias resaltan por su
              dirección opuesta: una sociedad que se dividió en dos y dos trayectorias individuales
              que se fusionaron en una sola, mucho más grande (Be Fun Travel + Global Xplore → Viajo
              Facil).
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
