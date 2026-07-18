import { Document, Page, Text, View } from "@react-pdf/renderer";
import { fecha, hoyISO } from "../../lib/format";
import type { DepartamentoActivo } from "../../lib/informesApi";
import { estilosPDF as e } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";
import { MapaDepartamentosPDF } from "./MapaDepartamentosPDF";

export function InformeDepartamentosPDF({
  departamentos,
  actualizadoEl,
  sinDepartamento,
}: {
  departamentos: DepartamentoActivo[];
  actualizadoEl: string | null;
  sinDepartamento: number;
}) {
  return (
    <Document title="INGcome — Departamentos más activos">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe</Text>
          <Text style={e.titulo}>Departamentos más activos en Mendoza</Text>
          <Text style={e.subtitulo}>
            {actualizadoEl ? `Actualizado el ${fecha(actualizadoEl)}` : ""}
          </Text>
        </View>

        <MapaDepartamentosPDF departamentos={departamentos} />

        <View style={e.seccion}>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "50%" }]}>Departamento</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Sociedades (histórico)</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Último año</Text>
          </View>
          {departamentos.map((d) => (
            <View key={d.departamentoId} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "50%" }]}>{d.nombre}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{d.cantidadSociedades}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{d.cantidadUltimoAnio}</Text>
            </View>
          ))}
        </View>

        <FuenteDatosPDF
          extra={
            sinDepartamento > 0
              ? `Además, ${sinDepartamento.toLocaleString("es-AR")} sociedades no tienen un departamento asignado en este informe (domicilio sin localidad determinable, p. ej. "Provincia de Mendoza" o direcciones ambiguas).`
              : undefined
          }
        />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
