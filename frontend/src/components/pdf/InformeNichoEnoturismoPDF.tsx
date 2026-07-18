import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_ENOTURISMO,
  ENTIDADES,
  EVOLUCION_ANUAL,
  LEYENDA_EVOLUCION,
  TIPO_ENTIDAD,
} from "../../data/nichoEnoturismo";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

export function InformeNichoEnoturismoPDF() {
  return (
    <Document title="INGcome — Enoturismo en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Enoturismo en Mendoza</Text>
          <Text style={e.subtitulo}>El negocio detrás de la Ruta del Vino</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "43 empresas de Mendoza tienen al enoturismo o turismo del vino como actividad real y específica en su nombre u objeto social, identificadas entre enero de 2017 y julio de 2026 en el Boletín Oficial.",
            "22 de las 43 (51,2 %) se constituyeron en los últimos tres años: 9 en 2023, 6 en 2024 y 7 en 2025. 2026, con boletines relevados solo hasta mayo, ya lleva 4.",
            "La primera de la muestra es de marzo de 2017 (Chacras de Loria S.R.L.), casi en simultáneo con la sanción de la Ley de la S.A.S.",
            "36 de las 43 (83,7 %) eligieron la S.A.S. como forma societaria.",
            "Mediana de capital inicial: $450.000, muy por encima de la mediana general de $100.000. Capital total declarado: $172,2 millones.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Qué es el enoturismo y por qué Mendoza es un caso de estudio</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            Mendoza concentra más del 70 % de la producción vitivinícola argentina y es la región
            vitivinícola más visitada del país. Este informe cuantifica por primera vez el lado de
            la oferta formal del enoturismo: cuántas empresas se constituyen específicamente para
            explotar ese negocio, cuándo, con qué forma jurídica y con cuánto capital.
          </Text>
        </View>

        <GraficoBarrasPDF
          titulo="Constituciones por año"
          datos={EVOLUCION_ANUAL}
          leyenda={LEYENDA_EVOLUCION}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es un año parcial: boletines relevados hasta principios de mayo de 2026.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Tipo societario y capital</Text>
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
            Mediana de capital inicial: $450.000 (sobre 42 de las 43 empresas). Capital total:
            $172.154.000. Las tres empresas de mayor capital ($30.000.000 cada una) son
            Viticultores Argentinos S.A.S., Rosardi Wine Of Mendoza S.A.S. y Winebeetle S.A.S.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están domiciliadas (41 de 43, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_ENOTURISMO}
          etiquetaUnidad="empresas"
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
            El domicilio es LEGAL, no necesariamente donde ocurre la experiencia turística. Luján
            de Cuyo, Maipú, Guaymallén, Godoy Cruz y Tupungato son más representativas de las zonas
            vitivinícolas tradicionales que Capital, que domina el ranking solo por concentrar
            domicilios legales (oficinas, estudios contables).
          </Text>
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Directorio completo: las 43 empresas</Text>
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
          </View>
        ))}

        <FuenteDatosPDF extra="Metodología de selección: búsqueda amplia por palabras clave (403 candidatas) seguida de revisión individual del nombre y objeto social de cada una, para confirmar actividad de enoturismo real y específica. El filtro descartó 360 de los 403 candidatos (89 %). La serie de evolución anual se recalculó a partir de la fecha de publicación de las 43 empresas del directorio, cruzadas contra la base real por CUIT o vínculos societarios. Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
