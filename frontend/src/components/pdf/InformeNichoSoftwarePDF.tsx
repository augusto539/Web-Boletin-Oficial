import { Document, Page, Text, View } from "@react-pdf/renderer";
import { DEPARTAMENTOS_SOFTWARE, EVOLUCION_ANUAL, TIPO_ENTIDAD } from "../../data/nichoSoftware";
import { cuit as formatCuit, fecha, hoyISO, moneda } from "../../lib/format";
import type { EntidadNicho } from "../../lib/informesApi";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

interface Props {
  entidades: EntidadNicho[];
}

export function InformeNichoSoftwarePDF({ entidades }: Props) {
  return (
    <Document title="INGcome — Desarrollo de Software en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Desarrollo de software en Mendoza</Text>
          <Text style={e.subtitulo}>El sector que estuvo ahí desde el primer día</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "103 sociedades de desarrollo de software identificadas entre 2017 y 2026 — el nicho más grande de los evaluados en esta tanda.",
            "Único nicho de toda la serie presente desde el primer año con volumen real: 7 sociedades en 2017, subiendo a 21 en 2018.",
            "No hay boom ni colapso: la curva sube y baja entre 3 y 21 sociedades por año sin un patrón de ciclo económico claro.",
            "15 pares de sociedades comparten al menos un socio — la red de fundadores seriales más densa de esta serie (14,6 % de las 103 sociedades conectadas).",
            "Capital y Godoy Cruz concentran el 61 % (43 y 20 de 103).",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <GraficoBarrasPDF titulo="Una curva sin ciclo aparente" datos={EVOLUCION_ANUAL} />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es un año parcial: boletines relevados hasta julio de 2026.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>
            Una red de fundadores densa, con un puente al análisis de grafos
          </Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            15 pares de sociedades comparten al menos un socio. El caso más notable: Linka Space
            S.A.S. y Litt Ar S.A.S., vinculadas por Matías Demián Benegas, son dos de las 61
            sociedades del clúster de cofundadores tecnológicos identificado por el análisis de
            grafos de esta misma base (ligado a la aceleradora Embarca) — una validación cruzada
            entre dos métodos distintos sobre la misma base.
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Perfil societario</Text>
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
            80 de 103 (78 %) son S.A.S. Capital: mediana $100.000, rango $17.720 a $10.000.000 — la
            mediana más baja de toda esta tanda de informes.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están domiciliadas (99 de 103, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_SOFTWARE}
          etiquetaUnidad="sociedades"
        />
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
          Capital y Godoy Cruz concentran el 61 % — la mayor concentración geográfica de toda esta
          tanda de informes.
        </Text>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Metodología y límites</Text>
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 10 }}>
          Búsqueda por objeto social y nombre: 214 sociedades candidatas. Clasificación asistida por
          script de tres niveles, con revisión manual de las 41 candidatas ambiguas y una segunda
          pasada sobre la palabra "programación" (ambigua entre sentido informático y de
          eventos/obras). 111 de las 214 (52 %) se descartaron. Cobertura ARCA: 37 de 103 (35,9 %).
        </Text>

        {entidades.length > 0 && (
          <>
            <Text style={e.tituloSeccion}>Directorio completo: las 103 sociedades</Text>
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

        <FuenteDatosPDF extra="Búsqueda por objeto social y nombre (desarrollo de software/sistemas/aplicaciones, programación, servicios informáticos, consultoría informática, desarrollo web/de plataformas), 214 candidatas. Clasificador automático de tres niveles con revisión manual completa. Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
