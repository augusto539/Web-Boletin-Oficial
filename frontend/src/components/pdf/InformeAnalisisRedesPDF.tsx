import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  ANIOS_EVOLUCION,
  BETWEENNESS_TOP10,
  ESCENARIOS,
  ESCENARIOS_GRAFICO,
  ESTRUCTURA_G1,
  FUNDADORES_EMBARCA,
  HOLDING_ARISTAS,
  HOLDING_NODOS,
  LEYENDA_ESCENARIOS,
  LEYENDA_HOLDING,
  LEYENDA_PARES_NICHOS,
  PARES_NICHOS,
  QUIEBRE_2022,
  SERIES_EVOLUCION,
} from "../../data/analisisRedes";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasHorizontalPDF } from "./GraficoBarrasHorizontalPDF";
import { GraficoLineaPDF } from "./GraficoLineaPDF";
import { GrafoRelacionalPDF } from "./GrafoRelacionalPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

const pct = (v: number) => `${v.toLocaleString("es-AR", { maximumFractionDigits: 1 })}%`;
const tresDecimales = (v: number) =>
  v.toLocaleString("es-AR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

function Pie() {
  return (
    <View style={e.piePagina} fixed>
      <Text>INGcome Consultora — ingcome.com.ar</Text>
      <Text>Generado el {fecha(hoyISO())}</Text>
    </View>
  );
}

export function InformeAnalisisRedesPDF() {
  return (
    <Document title="INGcome — El mapa oculto de las sociedades mendocinas">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Análisis de redes</Text>
          <Text style={e.titulo}>El mapa oculto de las sociedades mendocinas</Text>
          <Text style={e.subtitulo}>Qué dice la teoría de grafos del registro societario</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "El registro societario mendocino no es una red: es un archipiélago. 12.004 componentes conexas sobre 52.056 nodos; la componente típica tiene 3 nodos.",
            "Los domicilios compartidos, no la sociedad entre personas, son el tejido conectivo real: multiplican por 6,3 la componente gigante (3,1% → 18,9%).",
            "Quiebre neto en 2022: la conectividad vía domicilio salta de 3,2% a 10,2% en un solo año y sigue hasta 18,6% en 2026.",
            "La misma métrica encontró dos estructuras distintas sin hipótesis previa: una red de cofundación ligada a una aceleradora real y un holding energético de 15 sociedades.",
            "Los 12 nichos sectoriales de esta serie no se tocan de forma directa: cuando conectan, es casi siempre vía domicilios compartidos.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>1. El archipiélago</Text>
          {ESTRUCTURA_G1.map((s) => (
            <View key={s.concepto} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "72%" }]}>{s.concepto}</Text>
              <Text style={[e.celda, { width: "28%" }]}>{s.valor}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            La componente típica son una sociedad y sus dos socios. No hay "seis grados de
            separación": hay doce mil islas. El 97% de los nodos vive en componentes donde no hay
            nada que medir, así que todas las centralidades se calculan solo dentro de la componente
            gigante.
          </Text>
        </View>

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>2. Lo que conecta el archipiélago: los domicilios</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "50%" }]}>Escenario</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Componentes</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Comp. gigante</Text>
          </View>
          {ESCENARIOS.map((s) => (
            <View key={s.escenario} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "50%" }]}>{s.escenario}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{s.componentes}</Text>
              <Text style={[e.celda, { width: "25%" }]}>
                {s.nodos} ({pct(s.gigante)})
              </Text>
            </View>
          ))}
        </View>

        <GraficoBarrasHorizontalPDF
          titulo="% de nodos en la componente gigante, por escenario"
          datos={ESCENARIOS_GRAFICO}
          leyenda={LEYENDA_ESCENARIOS}
          formatearValor={pct}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          El escenario C es una advertencia metodológica, no un resultado: sin excluir barrios
          privados ni rutas, la componente gigante se infla un 23% con puentes que no existen.
        </Text>

        <GraficoLineaPDF
          titulo="3. El quiebre de 2022 (% de nodos en la componente gigante)"
          series={SERIES_EVOLUCION}
          etiquetas={ANIOS_EVOLUCION}
          formatearValor={pct}
          referencia={QUIEBRE_2022}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          G1: solo vínculos persona-sociedad. G2: + sociedad-domicilio (normalizador corregido).
        </Text>

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <GraficoBarrasHorizontalPDF
          titulo="4. Quiénes son los puentes estructurales (betweenness, G1)"
          datos={BETWEENNESS_TOP10}
          formatearValor={tresDecimales}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          Ranking filtrado a personas (las sociedades aparecían como "puente" por pura estructura
          bipartita). Nada de esto implica irregularidad: "puente estructural" describe una posición
          dentro de un grafo, no una conducta.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Una sorpresa frente a la hipótesis de partida</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            No aparecen los nombres del informe de Domicilios Hub. El ranking por cantidad de
            sociedades y el ranking por posición estructural no coinciden: domiciliar a muchos
            clientes te hace aparecer en muchas sociedades, pero no te convierte en puente
            estructural si esas sociedades no comparten personas entre sí. Validación previa a
            publicar: las 11 personas del top-20 tienen documento registrado (riesgo de fusión de
            identidad bajo) y se excluyó el artefacto bipartito.
          </Text>
        </View>

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>5.1 La red de cofundación de Embarca</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 8 }}>
            Las 15 personas de mayor intermediación están conectadas a 61 sociedades constituidas
            entre 2017 y 2022, con un ancla identificable: Embarca Aceleradora De Startups S.A.S.
            Tres de sus cuatro fundadores públicos están en el registro:
          </Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "32%" }]}>Fundador (fuente pública)</Text>
            <Text style={[e.celdaEncabezado, { width: "68%" }]}>En la base</Text>
          </View>
          {FUNDADORES_EMBARCA.map((f) => (
            <View key={f.publico} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "32%" }]}>{f.publico}</Text>
              <Text style={[e.celda, { width: "68%" }]}>{f.enLaBase}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            El portfolio público de Embarca son 15 empresas; solo 1 cayó en el clúster que encontró
            la centralidad, y por coincidencia. Ningún fundador figura como socio en ninguna empresa
            de su propio portfolio: el equity que una aceleradora toma se transfiere después de la
            constitución, y esos actos casi no se publican (22 cesiones en 22.065 actos). El clúster
            no es el portfolio: es la red personal de cofundación de sus socios, con vehículos de
            sindicación de inversores en el centro. Que el método encontrara esa estructura sin saber
            nada de Embarca es una validación fuerte; que no viera el portfolio es su límite exacto.
          </Text>
        </View>

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <GrafoRelacionalPDF
          titulo="5.2 El holding energético: gobierno corporativo replicado (k-core = 7)"
          nodos={HOLDING_NODOS}
          aristas={HOLDING_ARISTAS}
          leyenda={LEYENDA_HOLDING}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          Quince sociedades anónimas constituidas en tres meses de 2017 con el mismo directorio, los
          mismos síndicos y el mismo domicilio. 14 de las 15 tienen actividad CLAE registrada: 13
          declaran "Generación de energía n.c.p.". El informe fuente nombra a los tres directores
          titulares pero no a los síndicos, identificados acá por su rol.
        </Text>

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <GraficoBarrasHorizontalPDF
          titulo="6. Personas compartidas entre pares de nichos sectoriales"
          datos={PARES_NICHOS}
          leyenda={LEYENDA_PARES_NICHOS}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          Ninguna sociedad pertenece a dos nichos a la vez. El par Cannabis ↔ Publicidad es un falso
          cruce: las 8 personas vienen de una sola sociedad capturada por dos criterios de búsqueda.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Metodología y límites</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            Se construyeron tres grafos distintos, nunca mezclados: G1 (societario puro), G2 (G1 +
            sociedad-domicilio) y G3 (proyección persona-persona ponderada por 1/(n−1) al estilo
            Newman). Toda cifra indica de cuál proviene. Comunidades por Louvain con 10 semillas
            sobre la componente gigante de G2: 100-106 comunidades por corrida, 68,9% de estabilidad
            — señal de estructura real, pero no una partición definitiva. El escribano interviniente
            se evaluó como eje adicional y se descartó por cobertura insuficiente (6,9% de los
            actos). Error propio corregido antes de publicar: k-core sobre G1 daba un núcleo espurio
            que mezclaba parques renovables, un grupo farmacéutico y una sociedad sin relación; se
            usó la corrida sobre G2. Nada de lo que aparece en este informe implica irregularidad.
          </Text>
        </View>

        <FuenteDatosPDF extra="Este informe modela el registro societario como un grafo. Las métricas de centralidad describen posiciones dentro de esa estructura, no conductas ni vínculos comerciales verificados." />

        <Pie />
      </Page>
    </Document>
  );
}
