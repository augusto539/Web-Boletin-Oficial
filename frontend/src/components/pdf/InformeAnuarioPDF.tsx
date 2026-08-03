import { Document, Page, Text, View } from "@react-pdf/renderer";
import { dato, fecha, hoyISO } from "../../lib/format";
import type { Anuario } from "../../lib/informesApi";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { GraficoDonaPDF } from "./GraficoDonaPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON, VINO } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const PALETA_TIPO_SOCIEDAD = ["#691824", "#4b5259", "#b0473f", "#8a8f93", "#5f7a61"];
const GRIS_OTROS = "#c9c9c9";

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={e.campo}>
      <Text style={e.campoEtiqueta}>{etiqueta}</Text>
      <Text style={e.campoValor}>{valor}</Text>
    </View>
  );
}

export function InformeAnuarioPDF({ anuario }: { anuario: Anuario }) {
  const datosMeses = anuario.meses.map((m) => ({ etiqueta: MESES[m.mes - 1]!, valor: m.cantidad, color: VINO }));
  const datosTipoSociedad = anuario.tipoSociedad.map((t, i) => ({
    etiqueta: t.tipo,
    valor: t.cantidad,
    color: t.tipo === "Otros" ? GRIS_OTROS : PALETA_TIPO_SOCIEDAD[i % PALETA_TIPO_SOCIEDAD.length]!,
  }));
  const mapaDepartamentos = new Map(anuario.departamentos.map((d) => [d.nombre, d.cantidad]));

  return (
    <Document title={`INGcome — Anuario ${anuario.anio}`}>
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe anual</Text>
          <Text style={e.titulo}>Anuario {anuario.anio}: sociedades constituidas en Mendoza</Text>
          <Text style={e.subtitulo}>Actualizado el {fecha(anuario.actualizadoEl)}</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen del año</Text>
          <View style={e.grillaCampos}>
            <Campo etiqueta="Sociedades constituidas" valor={String(anuario.sociedadesConstituidas)} />
            <Campo etiqueta="Personas involucradas" valor={String(anuario.personasInvolucradas)} />
            <Campo etiqueta="Actividad más común" valor={dato(anuario.grupoClaeMasActivo)} />
            <Campo etiqueta="Departamento más activo" valor={dato(anuario.departamentoMasActivo)} />
            <Campo etiqueta="Tipo de sociedad más común" valor={dato(anuario.tipoSociedadMasComun)} />
          </View>
        </View>

        <GraficoBarrasPDF titulo="Distribución mensual" datos={datosMeses} />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <MapaMendozaPDF titulo="Distribución territorial" valorPorNombre={mapaDepartamentos} />

        <GraficoDonaPDF titulo="Tipo de sociedad" datos={datosTipoSociedad} etiquetaUnidad="sociedades" />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Actividades más frecuentes</Text>
          <Text style={{ fontSize: 9, color: "#666666", marginBottom: 8 }}>
            Top 10 grupos CLAE por cantidad de sociedades constituidas
          </Text>
          {anuario.actividadesTop10.map((a, i) => (
            <View key={a.grupoClae} style={e.fila} wrap={false}>
              <Text style={{ fontSize: 9, fontWeight: 700, color: VINO, width: "6%" }}>{i + 1}</Text>
              <Text style={[e.celda, { width: "80%" }]}>{a.grupoClae}</Text>
              <Text style={{ fontSize: 9, fontWeight: 700, color: CARBON, width: "14%", textAlign: "right" }}>
                {a.cantidad}
              </Text>
            </View>
          ))}
        </View>

        <FuenteDatosPDF />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
