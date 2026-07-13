import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import {
  cuit as formatCuit,
  dato,
  fecha,
  formatDomicilio,
  hoyISO,
  listaConY,
  moneda,
  porcentaje,
  siNo,
  SIN_DATO,
} from "../../lib/format";
import type { Sociedad } from "../../lib/queries";
import type { ActoAgrupado, VinculoAgrupado } from "../../pages/Sociedad";
import { estilosPDF as e } from "./estilosPDF";

function Campo({ etiqueta, valor, ancho }: { etiqueta: string; valor: string; ancho?: boolean }) {
  return (
    <View style={ancho ? e.campoAncho : e.campo}>
      <Text style={e.campoEtiqueta}>{etiqueta}</Text>
      <Text style={e.campoValor}>{valor}</Text>
    </View>
  );
}

export function FichaSociedadPDF({
  sociedad,
  vinculos,
  actos,
}: {
  sociedad: Sociedad;
  vinculos: VinculoAgrupado[];
  actos: ActoAgrupado[];
}) {
  return (
    <Document title={`INGcome — ${sociedad.nombre}`}>
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>{sociedad.tipoSociedadByTipoSociedadId?.nombre ?? "Sociedad"}</Text>
          <Text style={e.titulo}>{sociedad.nombre}</Text>
          <Text style={e.subtitulo}>
            {sociedad.cuit ? `CUIT ${formatCuit(sociedad.cuit)}` : SIN_DATO}
            {sociedad.fechaConstitucion ? ` · Constituida el ${fecha(sociedad.fechaConstitucion)}` : ""}
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Datos generales</Text>
          <View style={e.grillaCampos}>
            <Campo etiqueta="Capital inicial" valor={moneda(sociedad.capitalInicial)} />
            <Campo etiqueta="Empleador" valor={siNo(sociedad.empleador)} />
            <Campo etiqueta="Impuesto a las Ganancias" valor={dato(sociedad.estadoGananciasByEstadoGananciasId?.nombre)} />
            <Campo etiqueta="IVA" valor={dato(sociedad.estadoIvaByEstadoIvaId?.nombre)} />
            <Campo etiqueta="Cotejo con ARCA" valor={dato(sociedad.tipoMatchArcaByTipoMatchArcaId?.nombre)} />
            <Campo etiqueta="Domicilio" valor={formatDomicilio(sociedad.domicilioByDomicilioId)} />
            <Campo etiqueta="Objeto social" valor={dato(sociedad.objetoSocial)} ancho />
          </View>
        </View>

        <View style={e.seccion} wrap={false}>
          <Text style={e.tituloSeccion}>Actividades (CLAE)</Text>
          {sociedad.sociedadActividadesBySociedadId.nodes.length === 0 ? (
            <Text style={e.vacio}>Sin actividades registradas.</Text>
          ) : (
            <View style={e.listaActividades}>
              {[...sociedad.sociedadActividadesBySociedadId.nodes]
                .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99))
                .map((a) => {
                  const principal = a.orden === 1;
                  const texto = a.actividadClaeByClaeCodigo
                    ? `${a.actividadClaeByClaeCodigo.codigo} — ${a.actividadClaeByClaeCodigo.descripcion}${
                        a.grupoClaeByClaeGrupo ? ` (${a.grupoClaeByClaeGrupo.nombre})` : ""
                      }${principal ? " · principal" : ""}`
                    : SIN_DATO;
                  return (
                    <Text
                      key={a.id}
                      style={principal ? [e.actividad, e.actividadPrincipal] : e.actividad}
                    >
                      {texto}
                    </Text>
                  );
                })}
            </View>
          )}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Socios y autoridades</Text>
          {vinculos.length === 0 ? (
            <Text style={e.vacio}>Sin vínculos registrados.</Text>
          ) : (
            <View style={e.tabla}>
              <View style={e.filaEncabezado}>
                <Text style={[e.celdaEncabezado, { width: "32%" }]}>Nombre</Text>
                <Text style={[e.celdaEncabezado, { width: "22%" }]}>Rol</Text>
                <Text style={[e.celdaEncabezado, { width: "16%" }]}>Participación</Text>
                <Text style={[e.celdaEncabezado, { width: "14%" }]}>Ingreso</Text>
                <Text style={[e.celdaEncabezado, { width: "16%" }]}>Estado</Text>
              </View>
              {vinculos.map((v) => {
                const nombre =
                  v.personaFisicaByPersonaId?.nombre ??
                  v.sociedadBySociedadMiembroId?.nombre ??
                  v.nombreJuridicoFallback ??
                  SIN_DATO;
                const vigente = !v.fechaSalida;
                return (
                  <View key={v.clave} style={e.fila} wrap={false}>
                    <View style={{ width: "32%" }}>
                      <Text style={e.celda}>{nombre}</Text>
                      {v.personaFisicaByPersonaId?.profesion && (
                        <Text style={e.celdaSub}>{v.personaFisicaByPersonaId.profesion}</Text>
                      )}
                    </View>
                    <Text style={[e.celda, { width: "22%" }]}>{listaConY(v.roles)}</Text>
                    <Text style={[e.celda, { width: "16%" }]}>{porcentaje(v.porcentaje)}</Text>
                    <Text style={[e.celda, { width: "14%" }]}>{fecha(v.fechaEntrada)}</Text>
                    <Text style={[e.celda, { width: "16%" }]}>
                      {vigente ? "Vigente" : `Baja ${fecha(v.fechaSalida)}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Historial de actos</Text>
          {actos.length === 0 ? (
            <Text style={e.vacio}>Sin actos registrados.</Text>
          ) : (
            actos.map((acto) => (
              <View key={acto.clave} style={e.acto} wrap={false}>
                <Text style={e.actoFecha}>
                  {acto.fechasActo.length > 1
                    ? acto.fechasActo.map((f) => fecha(f)).join(" y ")
                    : fecha(acto.fechasActo[0])}
                </Text>
                <Text style={e.actoTitulo}>{acto.tipoActoByTipoActoId?.nombre ?? "Acto"}</Text>
                {acto.descripcion && <Text style={e.actoTexto}>{acto.descripcion}</Text>}
                {(acto.capitalAnterior || acto.capitalNuevo) && (
                  <Text style={e.actoTexto}>
                    Capital: {moneda(acto.capitalAnterior)} → {moneda(acto.capitalNuevo)}
                  </Text>
                )}
                {acto.personaFisicaByEscribanoId && (
                  <Text style={e.actoTexto}>
                    Escribano/a: {acto.personaFisicaByEscribanoId.nombre}
                    {acto.registroNotarial ? ` · ${acto.registroNotarial}` : ""}
                  </Text>
                )}
                {acto.fuentes.length > 0 && (
                  <Text style={e.actoTexto}>
                    {acto.fuentes.length > 1 ? "Fuentes: " : "Fuente: "}
                    {acto.fuentes.map((f, i) => (
                      <Text key={f.fecha}>
                        {i > 0 && ", "}
                        {f.enlace ? (
                          <Link src={f.enlace} style={e.enlace}>
                            Boletín Oficial — {fecha(f.fecha)}
                          </Link>
                        ) : (
                          `Boletín Oficial — ${fecha(f.fecha)}`
                        )}
                      </Text>
                    ))}
                  </Text>
                )}
              </View>
            ))
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
