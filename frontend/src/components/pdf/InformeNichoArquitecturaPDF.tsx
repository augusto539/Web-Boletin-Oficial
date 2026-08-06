import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_ARQUITECTURA,
  ECOSISTEMA_PROFESIONES,
  ENTIDADES,
  EVOLUCION_ANUAL,
  PERFIL_SOCIETARIO_DONA,
  TIPO_ENTIDAD,
} from "../../data/nichoArquitectura";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { GraficoBarrasHorizontalPDF } from "./GraficoBarrasHorizontalPDF";
import { GraficoDonaPDF } from "./GraficoDonaPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

export function InformeNichoArquitecturaPDF() {
  return (
    <Document title="INGcome — Arquitectura en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Arquitectura en Mendoza</Text>
          <Text style={e.subtitulo}>27 estudios y una profesión de asociación media</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "27 estudios de arquitectura constituidos como sociedad comercial entre 2018 y 2026 — el nicho más chico de todos los evaluados en esta ronda.",
            "Sin patrón temporal: entre 1 y 5 constituciones por año, sin boom, sin colapso, sin meseta — un goteo constante desde 2018.",
            "Geografía mucho menos concentrada que el resto de la serie: solo el 26 % (7 de 27) está en Capital — la proporción más baja de todos los nichos evaluados.",
            "475 personas declaran ser arquitectos/as en toda la base; 464 figuran como socios en alguna sociedad — menos que abogados (770) y contadores (952).",
            "Capital declarado: mediana de $450.000 — más alto que Software ($100.000) o Café ($300.000).",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <GraficoBarrasPDF titulo="Un goteo, no una curva" datos={EVOLUCION_ANUAL} />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es un año parcial: boletines relevados hasta julio de 2026.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>El ángulo de ecosistema</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 4 }}>
            475 personas declaran una profesión que contiene "arquitect@", y 464 (98 %) figuran
            como socias en al menos una sociedad — la profesión liberal con menos socios de las
            cuatro comparadas.
          </Text>
          <GraficoBarrasHorizontalPDF
            titulo="Menos socios que las otras tres profesiones comparadas"
            datos={ECOSISTEMA_PROFESIONES}
          />
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Perfil societario</Text>
          <GraficoDonaPDF titulo="Tipo societario de los 27 estudios" datos={PERFIL_SOCIETARIO_DONA} etiquetaUnidad="estudios" />
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "70%" }]}>Tipo</Text>
            <Text style={[e.celdaEncabezado, { width: "30%" }]}>Cantidad</Text>
          </View>
          {TIPO_ENTIDAD.map((t) => (
            <View key={t.tipo} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "70%" }]}>{t.tipo}</Text>
              <Text style={[e.celda, { width: "30%" }]}>{t.cantidad}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            Mediana de capital declarado: $450.000 (rango $40.000-$15.000.000).
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Menos concentrado en Capital que cualquier otro nicho de la serie"
          valorPorNombre={DEPARTAMENTOS_ARQUITECTURA}
          etiquetaUnidad="estudios"
        />
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
          Capital reúne solo el 26 % de los estudios — la proporción más baja de cualquier nicho
          evaluado en esta tanda.
        </Text>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Metodología y límites</Text>
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 10 }}>
          Búsqueda solo por nombre ("arquitect%") — el objeto social es boilerplate demasiado común
          en constructoras e inmobiliarias sin relación con un estudio real. 27 candidatas por
          nombre, ninguna requirió depuración. El ángulo de ecosistema usa el campo profesión
          autodeclarado, sin verificación contra la matrícula del Colegio de Arquitectos de
          Mendoza. Universo chico: cualquier lectura de tendencia es orientativa, no robusta.
        </Text>

        {ENTIDADES.length > 0 && (
          <>
            <Text style={e.tituloSeccion}>Directorio completo: los 27 estudios</Text>
            {ENTIDADES.map((ent) => (
              <View key={ent.nombre} style={{ marginBottom: 14 }} wrap={false}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: CARBON }}>
                  {ent.tipo} — {ent.nombre}
                </Text>
                <View style={[e.grillaCampos, { marginTop: 4 }]}>
                  <View style={e.campo}>
                    <Text style={e.campoEtiqueta}>CUIT</Text>
                    <Text style={e.campoValor}>{ent.cuit ?? "—"}</Text>
                  </View>
                  <View style={e.campo}>
                    <Text style={e.campoEtiqueta}>Capital</Text>
                    <Text style={e.campoValor}>{ent.capital ?? "—"}</Text>
                  </View>
                  <View style={e.campo}>
                    <Text style={e.campoEtiqueta}>Publicación</Text>
                    <Text style={e.campoValor}>{ent.publicacion ?? "—"}</Text>
                  </View>
                  <View style={e.campo}>
                    <Text style={e.campoEtiqueta}>Departamento</Text>
                    <Text style={e.campoValor}>{ent.departamento ?? "—"}</Text>
                  </View>
                </View>
                {ent.socios.length > 0 && (
                  <Text style={{ fontSize: 8, color: "#444444", marginTop: 4, lineHeight: 1.4 }}>
                    <Text style={{ fontWeight: 700 }}>Socios/Integrantes: </Text>
                    {ent.socios.map((s) => s.nombre).join(" · ")}
                  </Text>
                )}
                <Text style={{ fontSize: 8, color: "#444444", marginTop: 2, lineHeight: 1.4 }}>
                  <Text style={{ fontWeight: 700 }}>Objeto social: </Text>
                  {ent.objetoSocial}
                </Text>
              </View>
            ))}
          </>
        )}

        <FuenteDatosPDF extra="Búsqueda solo por nombre ('arquitect%'). Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
