import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_RECICLAJE,
  OLEADAS,
  PERFIL_SOCIETARIO_DONA,
  TOP_CAPITALES,
} from "../../data/nichoReciclaje";
import { cuit as formatCuit, fecha, hoyISO, moneda } from "../../lib/format";
import type { EntidadNicho } from "../../lib/informesApi";
import { GraficoBarrasHorizontalPDF } from "./GraficoBarrasHorizontalPDF";
import { GraficoDonaPDF } from "./GraficoDonaPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

function formatearPesos(v: number): string {
  return `$${v.toLocaleString("es-AR")}`;
}

interface Props {
  entidades: EntidadNicho[];
}

export function InformeNichoReciclajePDF({ entidades }: Props) {
  return (
    <Document title="INGcome — Reciclaje y economía circular en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Reciclaje y economía circular en Mendoza</Text>
          <Text style={e.subtitulo}>De la chatarrería al "impacto ambiental" como marca</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "41 sociedades identificadas entre 2018 y 2026 con la gestión, comercialización o reciclado de residuos como actividad central.",
            "No hay una única curva sino tres oleadas sucesivas: plásticos en 2018-2020, metales/chatarra en 2021-2023, y consultoras ambientales/economía circular desde 2023.",
            "La capitalización sube fuerte en la capa más nueva: mediana general $440.000, pero Trigenus, Palcriva y Transformación Estratégica Circular ($60.000.000) son los tres capitales más altos del nicho.",
            "Capital y Guaymallén concentran el 51% de las sociedades (21 de 41).",
            "Aparece una cooperativa (Economía Popular Y Circular Ltda., 2023) y una Unión Transitoria para tres centros ambientales municipales (2021).",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Tres oleadas, no una curva</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Período</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Plásticos</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Chatarra/Metales</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Ambiental/otros</Text>
          </View>
          {OLEADAS.map((o) => (
            <View key={o.periodo} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "25%" }]}>{o.periodo}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{o.plasticos}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{o.metales}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{o.ambiental}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            No hay un solo quiebre o boom identificable, sino un relevo entre subrubros: plástico
            primero, metales/chatarra después, y consultoras ambientales/"economía circular" desde
            2023.
          </Text>
        </View>

        <GraficoBarrasHorizontalPDF
          titulo="La profesionalización se nota en el capital declarado"
          datos={TOP_CAPITALES}
          formatearValor={formatearPesos}
        />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Perfil societario</Text>
          <GraficoDonaPDF titulo="Tipo societario de las 41 sociedades" datos={PERFIL_SOCIETARIO_DONA} etiquetaUnidad="sociedades" />
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            La S.A.S. domina, pero el 24% de S.A. es alto para un nicho de este tamaño —
            probablemente por la escala de capital de trabajo que requiere el acopio y comercio de
            materiales.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están (39 de 41, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_RECICLAJE}
          etiquetaUnidad="sociedades"
        />
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
          Capital y Guaymallén concentran más de la mitad del nicho — el corredor urbano del Gran
          Mendoza, donde se genera la mayor parte de los residuos a gestionar.
        </Text>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Metodología y límites</Text>
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 10 }}>
          Búsqueda por "recicl%", "circular", "residuo%", "chatarr%", "compost%", "scrap" en
          nombre y objeto social — 81 candidatas. Clasificación manual: 40 de las 81 quedaron
          afuera por objeto social catálogo sin que el reciclaje/residuos fuera el eje del
          negocio. Subcategorización editorial, no una categoría del Boletín ni de ARCA.
        </Text>

        {entidades.length > 0 && (
          <>
            <Text style={e.tituloSeccion}>Directorio completo: las 41 empresas de reciclaje</Text>
            {entidades.map((ent) => (
              <View key={ent.sociedadId} style={{ marginBottom: 14 }} wrap={false}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: CARBON }}>
                  {ent.tipo ? `${ent.tipo} — ` : ""}{ent.nombre}
                </Text>
                <View style={[e.grillaCampos, { marginTop: 4 }]}>
                  <View style={e.campo}>
                    <Text style={e.campoEtiqueta}>CUIT</Text>
                    <Text style={e.campoValor}>{formatCuit(ent.cuit)}</Text>
                  </View>
                  <View style={e.campo}>
                    <Text style={e.campoEtiqueta}>Capital</Text>
                    <Text style={e.campoValor}>{moneda(ent.capital?.toString())}</Text>
                  </View>
                  <View style={e.campo}>
                    <Text style={e.campoEtiqueta}>Publicación</Text>
                    <Text style={e.campoValor}>{fecha(ent.publicacion)}</Text>
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
                  {ent.objetoSocial ?? "—"}
                </Text>
              </View>
            ))}
          </>
        )}

        <FuenteDatosPDF extra="Búsqueda por nombre y objeto social ('recicl%', 'circular', 'residuo%', 'chatarr%', 'compost%', 'scrap'). Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
