import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import {
  cuit as formatCuit,
  dato,
  fecha,
  formatDomicilio,
  hoyISO,
  listaConY,
  porcentaje,
  SIN_DATO,
} from "../../lib/format";
import type { PersonaFisica } from "../../lib/queries";
import type { SociedadAgrupada } from "../../pages/Persona";
import { estilosPDF as e } from "./estilosPDF";

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={e.campo}>
      <Text style={e.campoEtiqueta}>{etiqueta}</Text>
      <Text style={e.campoValor}>{valor}</Text>
    </View>
  );
}

export function FichaPersonaPDF({
  persona,
  sociedades,
}: {
  persona: PersonaFisica;
  sociedades: SociedadAgrupada[];
}) {
  return (
    <Document title={`INGcome — ${persona.nombre}`}>
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>{persona.profesion ?? "Persona física"}</Text>
          <Text style={e.titulo}>{persona.nombre}</Text>
          <Text style={e.subtitulo}>
            {persona.documento ? `DNI ${persona.documento}` : SIN_DATO}
            {persona.cuit ? ` · CUIT ${formatCuit(persona.cuit)}` : ""}
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Datos generales</Text>
          <View style={e.grillaCampos}>
            <Campo etiqueta="DNI" valor={dato(persona.documento)} />
            <Campo etiqueta="CUIT" valor={persona.cuit ? formatCuit(persona.cuit) : SIN_DATO} />
            <Campo etiqueta="Profesión" valor={dato(persona.profesion)} />
            <Campo etiqueta="Fecha de nacimiento" valor={fecha(persona.fechaNacimiento)} />
            <Campo etiqueta="Domicilio" valor={formatDomicilio(persona.domicilioByDomicilioId)} />
            <Campo etiqueta="Domicilio electrónico" valor={dato(persona.domicilioElectronico)} />
          </View>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Sociedades</Text>
          {sociedades.length === 0 ? (
            <Text style={e.vacio}>
              No forma ni formó parte de ninguna sociedad registrada en la base.
            </Text>
          ) : (
            <View style={e.tabla}>
              <View style={e.filaEncabezado}>
                <Text style={[e.celdaEncabezado, { width: "30%" }]}>Sociedad</Text>
                <Text style={[e.celdaEncabezado, { width: "18%" }]}>Rol</Text>
                <Text style={[e.celdaEncabezado, { width: "14%" }]}>Participación</Text>
                <Text style={[e.celdaEncabezado, { width: "12%" }]}>Ingreso</Text>
                <Text style={[e.celdaEncabezado, { width: "12%" }]}>Estado</Text>
                <Text style={[e.celdaEncabezado, { width: "14%" }]}>Fuente</Text>
              </View>
              {sociedades.map((s) => {
                const vigente = !s.fechaSalida;
                return (
                  <View key={s.clave} style={e.fila} wrap={false}>
                    <Text style={[e.celda, { width: "30%" }]}>{s.sociedad?.nombre ?? SIN_DATO}</Text>
                    <Text style={[e.celda, { width: "18%" }]}>{listaConY(s.roles)}</Text>
                    <Text style={[e.celda, { width: "14%" }]}>{porcentaje(s.porcentaje)}</Text>
                    <Text style={[e.celda, { width: "12%" }]}>{fecha(s.fechaEntrada)}</Text>
                    <Text style={[e.celda, { width: "12%" }]}>
                      {vigente ? "Vigente" : `Baja ${fecha(s.fechaSalida)}`}
                    </Text>
                    <Text style={[e.celda, { width: "14%" }]}>
                      {s.fuente?.enlace ? (
                        <Link src={s.fuente.enlace} style={e.enlace}>
                          {fecha(s.fuente.fecha)}
                        </Link>
                      ) : s.fuente ? (
                        fecha(s.fuente.fecha)
                      ) : (
                        SIN_DATO
                      )}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
