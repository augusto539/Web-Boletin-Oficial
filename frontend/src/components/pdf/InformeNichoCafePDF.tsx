import { Document, Page, Text, View } from "@react-pdf/renderer";
import { DEPARTAMENTOS_CAFE, ENTIDADES, EVOLUCION_ANUAL, PERFIL_SOCIETARIO_DONA } from "../../data/nichoCafe";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { GraficoDonaPDF } from "./GraficoDonaPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

export function InformeNichoCafePDF() {
  return (
    <Document title="INGcome — Café de especialidad en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Café de especialidad en Mendoza</Text>
          <Text style={e.subtitulo}>Crecimiento sostenido, sin el boom ni el colapso de la cerveza artesanal</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "42 sociedades cafeteras identificadas entre 2017 y 2026, casi todas nombradas explícitamente con 'café' o 'coffee'.",
            "Crecimiento sostenido, sin boom ni colapso: de 2 sociedades en 2017 sube de forma pareja hasta un pico de 7 en 2022, y se mantiene estable en 5-6 por año hasta 2025.",
            "Norbu S.A.S. (2024) es el único caso de 'especialidad' en sentido estricto: importa granos de café verde, tuesta y fabrica sus propias máquinas tostadoras. $10.000.000 de capital, el más alto del nicho.",
            "Un pequeño grupo familiar (Guillén) participa, en distintas combinaciones, de tres cafeterías en San Rafael entre 2021 y 2026.",
            "Capital y San Rafael concentran a partes iguales una porción relevante del nicho (11 y 5 de 42).",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <GraficoBarrasPDF titulo="Una curva sin sobresaltos" datos={EVOLUCION_ANUAL} />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es un año parcial: boletines relevados hasta julio de 2026.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>El único caso de especialidad en sentido estricto</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            Norbu S.A.S. (03/07/2024): "Compraventas, importación y exportación de granos de café
            verde, procesos de tostado, torrado y molienda de café. Fabricación de maquinarias
            tostadoras." Capital declarado: $10.000.000 — más del doble del segundo capital más
            alto del nicho ($5.000.000, Un Café Copado Mza S.A.S., 2025). Ningún otro caso del
            nicho declara importación de grano verde ni fabricación de maquinaria propia.
          </Text>
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Un pequeño grupo familiar</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "30%" }]}>Personas</Text>
            <Text style={[e.celdaEncabezado, { width: "40%" }]}>Sociedades</Text>
            <Text style={[e.celdaEncabezado, { width: "15%" }]}>Departamento</Text>
            <Text style={[e.celdaEncabezado, { width: "15%" }]}>Años</Text>
          </View>
          {[
            ["Lilia Laura Guillén", "My Coffee S.A.S. → Grupo Café Del Mundo S.A.S.", "San Rafael", "2021 → 2023"],
            ["Marcos David Guillén", "Grupo Café Del Mundo S.A.S. → Café Del Mundo Alvear S.A.S.", "San Rafael", "2023 → 2026"],
            ["Mateo Samuel Guillén", "Café Del Mundo Alvear S.A.S.", "San Rafael", "2026"],
          ].map((row) => (
            <View key={row[0]} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "30%" }]}>{row[0]}</Text>
              <Text style={[e.celda, { width: "40%" }]}>{row[1]}</Text>
              <Text style={[e.celda, { width: "15%" }]}>{row[2]}</Text>
              <Text style={[e.celda, { width: "15%" }]}>{row[3]}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            Familia sanrafaelina construyendo, en tres años, una cadena chica de tres cafeterías
            bajo el nombre "Café Del Mundo". Otros dos pares de fundadores repetidos: María
            Mercedes Rossi (Cafe 2020 S.R.L., 2020, y Cafe Rossi Tostadores S.A.S., 2022) y Lucas
            Germán Laborde (Café Lyn S.A.S. y El Club Del Café S.A., ambas 2022).
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Perfil societario</Text>
          <GraficoDonaPDF titulo="Tipo societario de las 42 cafeterías" datos={PERFIL_SOCIETARIO_DONA} etiquetaUnidad="cafeterías" />
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            La S.A.S. domina con más fuerza que en el resto de la serie (81 %). Capital: mediana de
            $300.000, rango $50.000 a $10.000.000.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están (39 de 42, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_CAFE}
          etiquetaUnidad="cafeterías"
        />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Metodología y límites</Text>
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 10 }}>
          Búsqueda por nombre ("café", "coffee", "tostad%", "barista", "roaster") — 41 de las 43
          candidatas tienen "café" o "coffee" literalmente en su razón social. Solo 2 (Mondovi S.A.
          y Norbu S.A.S.) se incluyeron exclusivamente por objeto social. Un caso de duplicado
          (Cafetería Tina, publicada dos veces con 8 días de diferencia) se cuenta una sola vez.
          Cobertura ARCA: 20 de 42 (47,6 %).
        </Text>

        {ENTIDADES.length > 0 && (
          <>
            <Text style={e.tituloSeccion}>Directorio completo: las 42 cafeterías y tostadurías</Text>
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

        <FuenteDatosPDF extra="Búsqueda por nombre ('café', 'coffee', 'tostad%', 'barista', 'roaster'). Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
