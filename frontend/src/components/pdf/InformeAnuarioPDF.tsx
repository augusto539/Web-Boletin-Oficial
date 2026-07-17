import { Document, Page, Text, View } from "@react-pdf/renderer";
import { dato, fecha, hoyISO } from "../../lib/format";
import type { Anuario } from "../../lib/informesApi";
import { estilosPDF as e } from "./estilosPDF";

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={e.campo}>
      <Text style={e.campoEtiqueta}>{etiqueta}</Text>
      <Text style={e.campoValor}>{valor}</Text>
    </View>
  );
}

export function InformeAnuarioPDF({ anuario }: { anuario: Anuario }) {
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

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
