import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_AGENCIAS_VIAJES,
  EVOLUCION_ANUAL,
  PERFIL_SOCIETARIO_DONA,
  TIPO_CLAE_DONA,
} from "../../data/nichoAgenciasViajes";
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

export function InformeNichoAgenciasViajesPDF({ entidades }: Props) {
  return (
    <Document title="INGcome — Agencias de viajes en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Agencias de viajes en Mendoza</Text>
          <Text style={e.subtitulo}>La pandemia frenó la curva un año, no la cortó</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "168 agencias de viajes identificadas entre 2017 y 2026 — el universo más grande de esta serie, construido con el código CLAE oficial (minorista/mayorista) en vez de búsqueda de texto libre.",
            "La pandemia frenó la curva, no la cortó: de 14 agencias en 2019 cae a 8 en 2020 y ya en 2021 supera el nivel prepandemia (16). El pico real llega en 2023 (40, el año más alto de toda la serie).",
            "85% son minoristas (143 de 168) contra 15% mayoristas (25).",
            "Cobertura ARCA excepcionalmente alta: 130 de 168 (77,4%) cruzan contra el padrón de AFIP, todas activas — la más alta de toda la serie.",
            "Viajo Facil S.A. (2025) reúne, con $30.000.000 de capital, a dos socios que un año y medio antes habían fundado agencias separadas el mismo día.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <GraficoBarrasPDF titulo="Un año de pausa, no de quiebre" datos={EVOLUCION_ANUAL} />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es parcial: el relevamiento llega hasta julio. Dos sociedades sin fecha de
          Constitución capturada no figuran en el gráfico.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Un año de pausa, no de quiebre</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            La caída de 2019 a 2020 (14 → 8, -43%) confirma el golpe de la pandemia en los datos
            societarios locales. El freno duró exactamente un año: 2021 ya cierra por encima de 2019,
            y el crecimiento es prácticamente ininterrumpido hasta el pico de 40 agencias en 2023.
          </Text>
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Minoristas y mayoristas</Text>
          <GraficoDonaPDF titulo="Tipo de agencia (CLAE)" datos={TIPO_CLAE_DONA} etiquetaUnidad="agencias" />
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            La mayoría vende directo al público (minorista), y un grupo más chico opera como
            intermediario mayorista/operador. El capital no distingue claramente a un grupo del otro.
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Perfil societario</Text>
          <GraficoDonaPDF
            titulo="Tipo societario de las 168 agencias"
            datos={PERFIL_SOCIETARIO_DONA}
            etiquetaUnidad="agencias"
          />
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            El dominio de la S.A.S. (89%) es el más alto de toda la serie. Capital declarado: mediana
            de $400.000, rango $20.000 a $30.000.000.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están (163 de 168, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_AGENCIAS_VIAJES}
          etiquetaUnidad="agencias"
        />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Metodología y límites</Text>
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 10 }}>
          Búsqueda por CLAE 791100/791200 (agencias de viajes minoristas/mayoristas) como actividad
          principal declarada ante ARCA — 191 candidatas, 168 agencias únicas tras deduplicar por
          republicación en el Boletín. Cobertura ARCA: 130 de 168 (77,4%), la más alta de la serie.
        </Text>

        {entidades.length > 0 && (
          <>
            <Text style={e.tituloSeccion}>Directorio completo: las 168 agencias de viajes</Text>
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

        <FuenteDatosPDF extra="Búsqueda por CLAE 791100/791200 (agencias de viajes minoristas/mayoristas). Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
