import { Document, Page, Text, View } from "@react-pdf/renderer";
import { DEPARTAMENTOS_CERVEZA, ENTIDADES, EVOLUCION_ANUAL, PERFIL_SOCIETARIO_DONA } from "../../data/nichoCerveza";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { GraficoDonaPDF } from "./GraficoDonaPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

export function InformeNichoCervezaPDF() {
  return (
    <Document title="INGcome — Cerveza artesanal en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Cerveza artesanal en Mendoza</Text>
          <Text style={e.subtitulo}>Un boom de tres años que no volvió a repetirse</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "36 sociedades cerveceras identificadas entre 2017 y 2026: productoras artesanales, cervecerías-bar con elaboración propia y una cámara gremial del sector.",
            "El sector nació de golpe y se apagó rápido: 26 de las 36 (72%) se constituyeron en apenas tres años, 2017-2019. Desde 2020 la curva colapsa, y ninguna desde 2023.",
            "S.A.S. domina (22 de 36, 61%), pero con una proporción de S.A. inusualmente alta (6 de 36, 17%).",
            "Capital (9) y Godoy Cruz (8) concentran casi la mitad de las cerveceras.",
            "La Asociación Cámara Mendocina de Cervecerías Artesanales se constituyó en 2018, año pico del boom.",
            "Cuatro socios fundaron Rodder S.A.S. y Leven Anclas S.A.S. con apenas tres semanas de diferencia.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <GraficoBarrasPDF titulo="El boom de 2017-2019, y lo que vino después" datos={EVOLUCION_ANUAL} />

        <View style={e.seccion}>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            El patrón es opuesto al de casi todos los nichos de esta serie. El pico es 2018 (11
            sociedades) y la caída es abrupta: 2020 marca el quiebre, coincidiendo con las
            restricciones a la gastronomía durante la pandemia. La caída no se recupera después:
            solo 5 cerveceras más se registraron entre 2021 y 2026, y ninguna desde 2023.
          </Text>
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Perfil societario</Text>
          <GraficoDonaPDF titulo="Tipo societario de las 36 cerveceras" datos={PERFIL_SOCIETARIO_DONA} etiquetaUnidad="cerveceras" />
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            El 17% de Sociedades Anónimas es alto para un nicho de emprendimientos chicos. Capital:
            mediana de $120.000, rango $20.000 a $2.074.600 (Kühlen Beer S.A.S., 2019).
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están (35 de 36, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_CERVEZA}
          etiquetaUnidad="cerveceras"
        />
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
          Capital y Godoy Cruz juntos concentran el 47% del sector — el corredor gastronómico y de
          vida nocturna del Gran Mendoza.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Un pequeño clúster de cofundadores repetidos</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "55%" }]}>Personas</Text>
            <Text style={[e.celdaEncabezado, { width: "45%" }]}>Sociedades</Text>
          </View>
          {[
            ["Federico Pace, Felipe Andrés Suarez Bidondo, Manuel Ortega Grebenc, Ramiro Sanchez Del Gesso", "Leven Anclas S.A.S. y Rodder S.A.S."],
            ["Matías Fabián Bismach", "Fabrica De Triple Impacto S.A.S. y Mabisemi S.R.L."],
            ["Ignacio Moyano Sierra", "Beer Time S.A. y Galinsky S.A.S."],
            ["Juan Cruz Pereyra", "Galinsky S.A.S. y Vastra De Cuyo S.A.S."],
            ["Alexander Ernesto Atem", "Beer Time S.A. y Monaco Nero S.A.S."],
          ].map((row) => (
            <View key={row[0]} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "55%" }]}>{row[0]}</Text>
              <Text style={[e.celda, { width: "45%" }]}>{row[1]}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            Los cuatro socios de Leven Anclas S.A.S. (20/12/2018) son los mismos cuatro de Rodder
            S.A.S. (29/11/2018) — veintiún días antes.
          </Text>
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Metodología y límites</Text>
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 10 }}>
          Búsqueda por "cerveza", "cervecer[íi]a", "l[uú]pulo", "malter[íi]a", "brewing", "brewery"
          — 90 candidatas. Clasificación manual: 54 de las 90 quedaron afuera por objeto social
          genérico sin que la cerveza fuera el eje del negocio. Cobertura ARCA: 14 de 36 (39%).
        </Text>

        {ENTIDADES.length > 0 && (
          <>
            <Text style={e.tituloSeccion}>Directorio completo: las 36 cervecerías</Text>
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
                  {ent.objetoSocial ?? "—"}
                </Text>
              </View>
            ))}
          </>
        )}

        <FuenteDatosPDF extra="Búsqueda por nombre y objeto social ('cerveza', 'cervecer[íi]a', 'l[uú]pulo', 'malter[íi]a', 'brewing', 'brewery'). Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
