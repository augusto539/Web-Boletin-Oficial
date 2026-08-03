import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  EVOLUCION_ANUAL,
  FUNDADORAS_SERIALES,
  LEYENDA_GENERO,
  PANORAMA,
  ROLES_DECISION,
  TITULAR_SUPLENTE,
  TOP_MUJERES,
} from "../../data/mujeresFundadoras";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { GraficoDonaPDF } from "./GraficoDonaPDF";
import { estilosPDF as e, CARBON, VINO } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

const LEYENDA_TITULAR_SUPLENTE = [
  { color: VINO, etiqueta: "Titular" },
  { color: "#4b5259", etiqueta: "Suplente" },
];

export function InformeMujeresFundadorasPDF() {
  return (
    <Document title="INGcome — Las mujeres que fundan empresas en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Corte transversal</Text>
          <Text style={e.titulo}>Las mujeres que fundan empresas en Mendoza</Text>
          <Text style={e.subtitulo}>
            Una brecha que no se cierra, y que se agranda cuanto más arriba se mira
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "El 31,5% de las personas que participan en sociedades mendocinas son mujeres (10.264 de 32.592 clasificables). Estancado en la década: 28,3% en 2017, 29,7% en 2026.",
            "La brecha se agranda con la jerarquía: 27,9% de mujeres entre socios, 21,2% en roles de decisión, 19,4% entre síndicos.",
            "Hallazgo más nítido: mujeres sobrerrepresentadas en roles Suplente, subrepresentadas en Titular, en los tres cargos medibles (brecha de 14 a 16 pp).",
            "Los hombres que fundan una empresa tienen 45% más probabilidad de fundar una segunda que las mujeres (20,9% vs. 14,4%).",
            "Solo 3 mujeres superan las 10 sociedades en toda la base, contra 36 varones.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Cómo se mide esto sin que el dato exista</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            El catálogo de roles del Boletín casi nunca marca género explícitamente. Se infiere el
            género desde el nombre de pila de cada persona física, validado contra los pocos casos
            donde el Boletín sí lo marca de forma explícita ("Directora Suplente": 93,3% coincide;
            "Administradora Titular": 77,8% coincide).
          </Text>
        </View>

        <GraficoDonaPDF
          titulo="El panorama general"
          datos={PANORAMA}
          etiquetaUnidad="personas"
          etiquetaCentro="personas"
        />
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 4 }}>
          Sobre las personas clasificables, 31,5% son mujeres.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>La brecha se agranda en los roles de decisión</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "55%" }]}>Categoría</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Vínculos</Text>
            <Text style={[e.celdaEncabezado, { width: "20%" }]}>% mujeres</Text>
          </View>
          {[
            ["Socio/a", "37.653", "27,9%"],
            ["Roles de decisión", "11.262", "21,2%"],
            ["Apoderado/a", "364", "20,9%"],
            ["Fiscalización", "165", "19,4%"],
          ].map((f) => (
            <View key={f[0]} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "55%" }]}>{f[0]}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{f[1]}</Text>
              <Text style={[e.celda, { width: "20%" }]}>{f[2]}</Text>
            </View>
          ))}
        </View>
        <GraficoBarrasPDF
          titulo="% de mujeres y hombres por categoría de vínculo"
          datos={ROLES_DECISION}
          leyenda={LEYENDA_GENERO}
        />
        <Text style={{ fontSize: 7, color: "#999999", marginTop: 2 }}>
          "Hombres" incluye no clasificables por nombre (~3% del total).
        </Text>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>El hallazgo más nítido: Titular vs. Suplente</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Cargo</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>% mujeres — Titular</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>% mujeres — Suplente</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Diferencia</Text>
          </View>
          {[
            ["Administrador", "22,2% (n=5.600)", "36,6% (n=5.327)", "+14,4 pp"],
            ["Gerente", "21,9% (n=2.172)", "36,8% (n=1.315)", "+14,9 pp"],
            ["Director", "15,5% (n=1.075)", "31,9% (n=2.676)", "+16,4 pp"],
          ].map((f) => (
            <View key={f[0]} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "25%" }]}>{f[0]}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{f[1]}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{f[2]}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{f[3]}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            En los tres cargos, sin excepción, las mujeres están sobrerrepresentadas en el rol
            suplente y subrepresentadas en el rol titular, con una brecha estable de 14 a 16 puntos
            porcentuales.
          </Text>
        </View>
        <GraficoBarrasPDF
          titulo="% de mujeres por cargo y variante"
          datos={TITULAR_SUPLENTE}
          leyenda={LEYENDA_TITULAR_SUPLENTE}
        />

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Una brecha que no se cerró en diez años</Text>
        </View>
        <GraficoBarrasPDF
          titulo="% de mujeres y hombres entre los socios, por año"
          datos={EVOLUCION_ANUAL}
          leyenda={LEYENDA_GENERO}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es parcial. La serie oscila entre 26% y 30% sin tendencia clara. "Hombres" incluye
          no clasificables por nombre (~3% del total).
        </Text>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Ellas fundan una vez; ellos, más de una</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}></Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Con 2+ sociedades</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Total</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>%</Text>
          </View>
          {[
            ["Mujeres", "1.429", "9.902", "14,4%"],
            ["Varones", "4.637", "22.182", "20,9%"],
          ].map((f) => (
            <View key={f[0]} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "25%" }]}>{f[0]}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{f[1]}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{f[2]}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{f[3]}</Text>
            </View>
          ))}
        </View>
        <GraficoBarrasPDF titulo="% de fundadores/as con 2 o más sociedades" datos={FUNDADORAS_SERIALES} />

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Las mujeres con más sociedades</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 8 }}>
            Solo tres mujeres superan las 10 sociedades en toda la base. Se mantiene la profesión y
            la cantidad de sociedades; se omite la identidad.
          </Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "70%" }]}>Profesión declarada</Text>
            <Text style={[e.celdaEncabezado, { width: "30%" }]}>Sociedades</Text>
          </View>
          {TOP_MUJERES.map((m) => (
            <View key={m.profesion} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "70%" }]}>{m.profesion}</Text>
              <Text style={[e.celda, { width: "30%" }]}>{m.sociedades}</Text>
            </View>
          ))}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Metodología y límites</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            Inferencia de género por diccionario curado de los 600 nombres más frecuentes (87,3% de
            cobertura) + regla heurística para el resto. No clasificable (3,3%): tokens que resultaron
            ser apellidos, no nombres de pila. Los porcentajes por rol y por año se calculan sobre
            vínculos, no sobre personas únicas. No mide intención, mérito ni causas — solo la
            distribución observable en el registro societario público.
          </Text>
        </View>

        <FuenteDatosPDF extra="Inferencia de género por nombre de pila, validada contra los vínculos con forma de rol explícitamente femenina del propio Boletín. Los porcentajes por rol y por año se calculan sobre vínculos, no sobre personas únicas." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
