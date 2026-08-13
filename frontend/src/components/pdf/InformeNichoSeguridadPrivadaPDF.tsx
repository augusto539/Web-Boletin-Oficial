import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_SEGURIDAD_PRIVADA,
  EVOLUCION_ANUAL,
  PERFIL_SOCIETARIO_DONA,
} from "../../data/nichoSeguridadPrivada";
import { cuit as formatCuit, fecha, hoyISO, moneda } from "../../lib/format";
import type { EntidadNicho } from "../../lib/informesApi";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { GraficoDonaPDF } from "./GraficoDonaPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

interface Props {
  entidades: EntidadNicho[];
}

export function InformeNichoSeguridadPrivadaPDF({ entidades }: Props) {
  return (
    <Document title="INGcome — Seguridad privada en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Seguridad privada en Mendoza</Text>
          <Text style={e.subtitulo}>El único rubro de la serie que no sintió la pandemia</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "136 empresas de seguridad privada identificadas entre 2017 y 2026, vía el código CLAE 801090 declarado como actividad principal.",
            "El único nicho de la serie sin caída en 2020: apenas bajó de 15 a 13 empresas nuevas (-13%), mientras las agencias de viajes cayeron 43%.",
            "Crecimiento sostenido hasta el final: 2024 y 2025 son los dos años más altos (21 empresas cada uno).",
            "Un código, dos negocios distintos: 26 empresas declaran sistemas técnicos, 9 transporte de caudales/valores, y solo 6 investigación privada en sentido literal.",
            "Grupo Rl: Lorena Belén Lescano y Pablo Andrés Juliani fundaron tres empresas de seguridad en Maipú en cuatro años — la cadena de fundadores repetidos más larga de la serie.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <GraficoBarrasPDF titulo="Crecimiento sin pausa, ni siquiera en pandemia" datos={EVOLUCION_ANUAL} />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es parcial: el relevamiento llega hasta julio. Cinco empresas sin fecha de acto
          capturada no figuran en el gráfico.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Un código, dos negocios distintos</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            De las 136 empresas, 26 declaran explícitamente sistemas técnicos (alarmas, cámaras,
            monitoreo), 9 declaran transporte de caudales/valores, y solo 6 mencionan "investigación
            privada" en sentido literal — siempre junto con vigilancia y custodia, nunca como
            actividad exclusiva.
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
          <GraficoDonaPDF
            titulo="Tipo societario de las 136 empresas"
            datos={PERFIL_SOCIETARIO_DONA}
            etiquetaUnidad="empresas"
          />
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            Capital declarado: mediana de $200.000 (la más baja de toda la serie de nichos hasta
            ahora), rango de $1 a $30.000.000.
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Grupo Rl: tres empresas, dos socios, cuatro años</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            Lorena Belén Lescano y Pablo Andrés Juliani aparecen juntos como socios en tres
            sociedades de seguridad sucesivas, todas en Maipú: Grupo Rl Seguridad Privada S.A.
            (2020), Vabeju S.A.S. (2023) y Grupo Rl Vigilancia Er S.A.S. (2024).
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están (130 de 136, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_SEGURIDAD_PRIVADA}
          etiquetaUnidad="empresas"
        />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Metodología y límites</Text>
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 10 }}>
          Búsqueda por CLAE 801090 ("Servicios de seguridad e investigación n.c.p.") como actividad
          principal declarada ante ARCA, excluyendo deliberadamente el código 801020 (sistemas de
          seguridad técnicos). 153 candidatas, 136 empresas únicas tras deduplicar. Cobertura ARCA:
          93 de 136 (68,4%).
        </Text>

        {entidades.length > 0 && (
          <>
            <Text style={e.tituloSeccion}>Directorio completo: las 136 empresas de seguridad</Text>
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

        <FuenteDatosPDF extra="Búsqueda por CLAE 801090 (Servicios de seguridad e investigación n.c.p.). Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
