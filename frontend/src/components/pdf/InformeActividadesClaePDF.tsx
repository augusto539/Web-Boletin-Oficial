import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  BAJAS_SITUACION,
  CLUSTERS,
  COBERTURA_ANUAL_GRAFICO,
  COLA_LARGA,
  DIVERSIFICACION_GRAFICO,
  EVOLUCION_GRAFICO,
  GRUPOS_VACIOS,
  LEYENDA_EVOLUCION,
  LEYENDA_LOCALIZACION,
  LEYENDA_NCP,
  LEYENDA_NICHOS,
  LEYENDA_TASA_BAJA,
  LINEA_BASE_RECIENTE,
  LOCALIZACION,
  NICHOS_COBERTURA,
  NICHOS_GRAFICO,
  PARES_COOCURRENCIA,
  RESIDUALES,
  TASA_BAJA_GRAFICO,
  TOP_ACTIVIDADES_GRAFICO,
} from "../../data/actividadesClae";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { GraficoBarrasHorizontalPDF } from "./GraficoBarrasHorizontalPDF";
import { GraficoDonaPDF } from "./GraficoDonaPDF";
import { GraficoLineaPDF } from "./GraficoLineaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

const pct = (v: number) => `${v.toLocaleString("es-AR", { maximumFractionDigits: 1 })}%`;

function Pie() {
  return (
    <View style={e.piePagina} fixed>
      <Text>INGcome Consultora — ingcome.com.ar</Text>
      <Text>Generado el {fecha(hoyISO())}</Text>
    </View>
  );
}

export function InformeActividadesClaePDF() {
  return (
    <Document title="INGcome — Qué hacen realmente las empresas mendocinas">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Corte transversal</Text>
          <Text style={e.titulo}>Qué hacen realmente las empresas mendocinas</Text>
          <Text style={e.subtitulo}>Anatomía del nomenclador CLAE</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "El 42,3% de todas las asignaciones de actividad son categorías residuales n.c.p. Entre las principales sube al 44,7%.",
            "La actividad más frecuente de la economía mendocina es \"Servicios empresariales n.c.p.\" (672 asignaciones).",
            "Las bajas no miden muerte de empresas: ninguna de las 11.918 sociedades tiene todas sus actividades de baja.",
            "Diez clusters económicos reales (modularidad Q=0,390) que no coinciden con la jerarquía del nomenclador.",
            "Especialización geográfica nítida: Tupungato, 11 veces más servicios de apoyo agrícola; Capital, 2,6 veces más servicios jurídicos.",
            "19 grupos CLAE completos sin ni una sola sociedad mendocina: pesca, carbón, armas, locomotoras, reaseguros.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <GraficoDonaPDF
          titulo="1. Residuales vs. específicas"
          datos={RESIDUALES}
          etiquetaUnidad="asignaciones"
          etiquetaCentro="asignaciones"
        />

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <GraficoBarrasHorizontalPDF
          titulo="Las diez actividades más declaradas de Mendoza"
          datos={TOP_ACTIVIDADES_GRAFICO}
          leyenda={LEYENDA_NCP}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          Siete de las diez primeras terminan en n.c.p. La única del podio que describe con precisión
          lo que la empresa hace es cultivo de vid para vinificar, en sexto lugar.
        </Text>

        <GraficoLineaPDF
          titulo="Cola larga, no concentración"
          datos={COLA_LARGA}
          formatearValor={pct}
          maximoY={100}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          Eje X: cantidad de códigos distintos. Hacen falta 100 códigos para cubrir el 62% de la
          economía declarada.
        </Text>

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>2. Las bajas no son muertes: son podas</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "70%" }]}>Situación</Text>
            <Text style={[e.celdaEncabezado, { width: "30%" }]}>Sociedades</Text>
          </View>
          {BAJAS_SITUACION.map((b) => (
            <View key={b.situacion} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "70%" }]}>{b.situacion}</Text>
              <Text style={[e.celda, { width: "30%" }]}>{b.sociedades.toLocaleString("es-AR")}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            Ninguna sociedad tiene la totalidad de sus actividades dadas de baja: la que cesa por
            completo desaparece del padrón de ARCA y no aparece acá. Lo que las bajas miden es poda
            de actividades dentro de empresas que siguen operando.
          </Text>
        </View>

        <GraficoBarrasPDF
          titulo="Cuantos más rubros declara una empresa, más termina abandonando (% de baja)"
          datos={DIVERSIFICACION_GRAFICO}
        />

        <GraficoBarrasHorizontalPDF
          titulo="Qué se poda y qué no (tasa de baja, mín. 40 casos)"
          datos={TASA_BAJA_GRAFICO}
          leyenda={LEYENDA_TASA_BAJA}
          formatearValor={pct}
        />

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>3. Diez clusters que el nomenclador no declara</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "42%" }]}>Cluster</Text>
            <Text style={[e.celdaEncabezado, { width: "16%" }]}>Activ.</Text>
            <Text style={[e.celdaEncabezado, { width: "20%" }]}>Asign.</Text>
          </View>
          {CLUSTERS.map((c) => (
            <View key={c.nombre} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "42%" }]}>{c.nombre}</Text>
              <Text style={[e.celda, { width: "16%" }]}>{c.actividades}</Text>
              <Text style={[e.celda, { width: "20%" }]}>{c.asignaciones.toLocaleString("es-AR")}</Text>
            </View>
          ))}
        </View>

        <GraficoBarrasHorizontalPDF
          titulo="Los pares de actividades que más co-ocurren"
          datos={PARES_COOCURRENCIA}
        />

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <GraficoBarrasHorizontalPDF
          titulo="4. La geografía tiene especialidades muy marcadas"
          datos={LOCALIZACION}
          leyenda={LEYENDA_LOCALIZACION}
          formatearValor={(v) => v.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          Cociente de localización: un valor de 3 significa "tres veces más concentrado de lo que le
          correspondería por su tamaño".
        </Text>

        <GraficoBarrasHorizontalPDF
          titulo="5. Qué crece y qué se apaga (% de asignaciones en 2022-2026)"
          datos={EVOLUCION_GRAFICO}
          leyenda={LEYENDA_EVOLUCION}
          referencia={{ valor: LINEA_BASE_RECIENTE, etiqueta: "base 54,4%" }}
          formatearValor={pct}
        />

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <GraficoBarrasHorizontalPDF
          titulo="6. La cobertura CLAE valida la premisa de la serie de nichos"
          datos={NICHOS_GRAFICO}
          leyenda={LEYENDA_NICHOS}
          formatearValor={pct}
        />

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>El código más frecuente de cada nicho</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "28%" }]}>Nicho</Text>
            <Text style={[e.celdaEncabezado, { width: "14%" }]}>Con CLAE</Text>
            <Text style={[e.celdaEncabezado, { width: "58%" }]}>Código principal</Text>
          </View>
          {NICHOS_COBERTURA.map((n) => (
            <View key={n.nicho} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "28%" }]}>{n.nicho}</Text>
              <Text style={[e.celda, { width: "14%" }]}>{pct(n.cobertura)}</Text>
              <Text style={[e.celda, { width: "58%" }]}>{n.codigo}</Text>
            </View>
          ))}
        </View>

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>7. Lo que Mendoza no hace: 19 grupos vacíos</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "22%" }]}>Grupo</Text>
            <Text style={[e.celdaEncabezado, { width: "78%" }]}>Actividad ausente</Text>
          </View>
          {GRUPOS_VACIOS.map((g) => (
            <View key={g.grupo} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "22%" }]}>{g.grupo}</Text>
              <Text style={[e.celda, { width: "78%" }]}>{g.actividad}</Text>
            </View>
          ))}
        </View>

        <GraficoLineaPDF
          titulo="8. La cobertura CLAE como termómetro de actividad real"
          datos={COBERTURA_ANUAL_GRAFICO}
          formatearValor={pct}
          maximoY={100}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 parcial. El derrumbe al 32,9% refleja el rezago de ~1 año entre constituir la
          sociedad y darse de alta en el padrón de actividades de ARCA.
        </Text>

        <Pie />
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Metodología y límites</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            Fuentes: tablas de actividades CLAE (1.016 códigos), grupos CLAE (225) y sus vínculos con
            sociedades (25.583 vínculos, 11.918 sociedades), del padrón de ARCA cruzado por CUIT
            contra las sociedades extraídas del Boletín Oficial. El análisis cubre el 60,9% del
            corpus (las que tienen al menos una actividad registrada), sesgado hacia empresas que
            efectivamente operaron. Las bajas no miden cese de actividad empresarial sino poda de
            actividades declaradas. Clusters por detección de comunidades Louvain sobre el grafo de
            co-ocurrencia, ponderado por 1/(n−1), mejor de 10 semillas (Q=0,390). El cociente de
            localización se restringe a combinaciones con al menos 15 casos en departamentos con al
            menos 200 asignaciones, y depende del domicilio legal, que no siempre coincide con el
            lugar de la actividad productiva.
          </Text>
        </View>

        <FuenteDatosPDF extra="Las actividades CLAE provienen del padrón de ARCA, no del Boletín Oficial: se cruzan por CUIT contra las sociedades extraídas del Boletín, y por eso solo cubren a las que ya se dieron de alta en ARCA." />

        <Pie />
      </Page>
    </Document>
  );
}
