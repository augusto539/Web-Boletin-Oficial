import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_CANNABIS,
  ENTIDADES,
  EVOLUCION_ANUAL,
  SOCIOS_REPETIDOS,
  TIPO_ENTIDAD,
} from "../../data/nichoCannabis";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

export function InformeNichoCannabisPDF() {
  return (
    <Document title="INGcome — Cannabis y Cáñamo en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Cannabis y Cáñamo en Mendoza</Text>
          <Text style={e.subtitulo}>Entidades registradas en el Boletín Oficial · 2017–2026</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "27 entidades identificadas entre 2017 y 2026 en el Boletín Oficial de Mendoza: 23 empresas comerciales y 4 asociaciones civiles.",
            "La primera entidad del sector es de mayo de 2021 (Cannabafl S.A.S.); la más reciente, de junio de 2026 (Eirene Cannabica Asociación Civil).",
            "11 de las 27 (40,7 %) se registraron en 2025-2026: 6 en 2025 y 5 en el tramo de 2026 relevado.",
            "16 de las 27 (59,3 %) eligieron la S.A.S. como forma societaria.",
            "Capital total declarado: $142,7 millones, con una mediana de $1.000.000 — muy por encima de la mediana general de $100.000.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Contexto legal</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            El cannabis medicinal tiene marco legal en Argentina desde la Ley 27.350 (2017). El
            marco que habilitó una cadena productiva y comercial es la Ley 27.669 (2022), que creó
            la ARICCAME. Las primeras entidades de esta muestra (2021) son anteriores a la Ley
            27.669; el grueso del crecimiento llega recién en 2025-2026, con la maduración
            operativa de la agencia.
          </Text>
        </View>

        <GraficoBarrasPDF titulo="Evolución temporal: entidades registradas por año" datos={EVOLUCION_ANUAL} />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es un año parcial: boletines relevados hasta principios de junio de 2026.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Tipo de entidad y capital</Text>
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
            Capital total: $142.733.200, mediana $1.000.000 — diez veces la mediana general de
            $100.000 del resto de las sociedades mendocinas.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están domiciliadas (25 de 27, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_CANNABIS}
          etiquetaUnidad="entidades"
        />
        <View
          style={{
            marginTop: 8,
            padding: 10,
            backgroundColor: "#FBF6E9",
            borderWidth: 1,
            borderColor: "#c9a13a",
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 9, fontWeight: 700, color: "#7a5c00", marginBottom: 3 }}>
            Advertencia metodológica
          </Text>
          <Text style={{ fontSize: 8, color: "#7a5c00", lineHeight: 1.4 }}>
            El domicilio es LEGAL, no necesariamente el lugar de cultivo o producción. Luján de
            Cuyo, San Rafael, San Martín, Las Heras y Guaymallén son más representativos de dónde
            efectivamente se desarrollan actividades agropecuarias e industriales vinculadas al
            cannabis y el cáñamo que Capital, que domina el ranking solo por concentrar domicilios
            legales.
          </Text>
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Directorio completo: las 27 entidades</Text>
        <Text style={{ fontSize: 8, color: "#888888", marginBottom: 10 }}>
          Ordenadas por fecha de publicación del acto de constitución en el Boletín.
        </Text>

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
                <Text style={e.campoValor}>{ent.publicacion}</Text>
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
            {ent.nombreGenerico && (
              <Text style={{ fontSize: 7, color: "#999999", marginTop: 3, fontStyle: "italic" }}>
                El nombre sugiere actividad de cannabis, pero el objeto social registrado es
                genérico y no lo menciona explícitamente — inclusión basada en el nombre.
              </Text>
            )}
          </View>
        ))}

        <View style={{ marginTop: 6, marginBottom: 8 }}>
          <Text style={e.tituloSeccion}>Socios que participan en más de una entidad</Text>
          <Text style={{ fontSize: 8, color: "#444444", lineHeight: 1.5 }}>
            {SOCIOS_REPETIDOS.map((s) => `${s.nombre} (${s.veces})`).join(" · ")}
          </Text>
        </View>

        <FuenteDatosPDF extra="Términos de búsqueda: cannabis, cáñamo, marihuana, hemp, CBD, cannabidiol, THC, cbn, cbg y variantes. Algunas entidades fueron incluidas por nombre aunque su objeto social no menciona cannabis explícitamente — marcadas en el directorio. Ninguna búsqueda por palabras clave es perfecta: entidades con objeto social genérico y sin término cannábico en el nombre (ej. Wichan S.A.S.) no aparecen en este rastreo. Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
