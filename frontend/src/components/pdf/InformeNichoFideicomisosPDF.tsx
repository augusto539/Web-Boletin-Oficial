import { Document, Page, Text, View } from "@react-pdf/renderer";
import { DEPARTAMENTOS_FIDEICOMISOS, EVOLUCION_ANUAL, PERFIL_SOCIETARIO_DONA } from "../../data/nichoFideicomisos";
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

export function InformeNichoFideicomisosPDF({ entidades }: Props) {
  return (
    <Document title="INGcome — Servicios de fideicomisos en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Servicios de fideicomisos en Mendoza</Text>
          <Text style={e.subtitulo}>
            El vehículo financiero del boom inmobiliario, no un servicio patrimonial genérico
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "63 sociedades de servicios de fideicomisos identificadas vía el código CLAE 643001 — el universo más chico de los nichos CLAE de esta serie, y el único sin ningún año en cero.",
            "No es un servicio patrimonial genérico: es el vehículo del 'fideicomiso al costo' inmobiliario. El 79% (50 de 63) declara explícitamente actividad inmobiliaria, constructora o de desarrollo urbano.",
            "Arranca fuerte desde el primer año con datos (10 sociedades en 2018) y 2025 es el pico de toda la serie (13).",
            "Ningún fundador se repite entre las 63 sociedades — el único de los tres nichos CLAE de esta serie sin una sola cadena de socios compartidos.",
            "100% S.A.S. o S.A.: es el único nicho de la serie sin una sola S.R.L.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <GraficoBarrasPDF titulo="Una curva sin rampa de despegue" datos={EVOLUCION_ANUAL} />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es parcial: el relevamiento llega hasta julio. No hay sociedades con fecha de
          Constitución en 2017.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>No es "gestión patrimonial": es financiamiento de obra</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            El 79% de las 63 sociedades (50) declara explícitamente actividad inmobiliaria,
            constructora o de desarrollo urbano en su objeto social — la combinación típica
            fiduciaria + inmobiliaria/constructora es la firma textual del "fideicomiso al costo":
            un grupo de inversores aporta capital a una sociedad fiduciaria que administra la
            construcción de un edificio o loteo y distribuye unidades o rentabilidad al terminar la
            obra.
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
            titulo="Tipo societario de las 63 sociedades"
            datos={PERFIL_SOCIETARIO_DONA}
            etiquetaUnidad="sociedades"
          />
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
            Es el único nicho de toda la serie sin una sola S.R.L. Capital declarado: mediana de
            $292.000, rango $20.000 a $20.000.000 (Grupo Magoviva S.A.S., 2025).
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Los ocho capitales más altos</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "50%" }]}>Sociedad</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Capital</Text>
            <Text style={[e.celdaEncabezado, { width: "25%" }]}>Departamento</Text>
          </View>
          {[
            ["Grupo Magoviva S.A.S.", "$20.000.000", "Capital"],
            ["Fundamenta Pilares Desarrollos S.A.S.", "$10.000.000", "Capital"],
            ["Utopía Desarrollos S.A.S.", "$8.000.000", "San Rafael"],
            ["Betania S.A.S.", "$4.000.000", "Luján de Cuyo"],
            ["Poldena Moon Sas", "$2.000.000", "Las Heras"],
            ["Flogulu S.A.S.", "$2.000.000", "Capital"],
            ["Grupo Gestión Urbana S.A.S.", "$1.500.000", "San Rafael"],
            ["Jolmogori S.A.S.", "$1.500.000", "Guaymallén"],
          ].map((row) => (
            <View key={row[0]} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "50%" }]}>{row[0]}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{row[1]}</Text>
              <Text style={[e.celda, { width: "25%" }]}>{row[2]}</Text>
            </View>
          ))}
        </View>

        <MapaMendozaPDF
          titulo="Dónde están (62 de 63, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_FIDEICOMISOS}
          etiquetaUnidad="sociedades"
        />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Metodología y límites</Text>
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 10 }}>
          Búsqueda por CLAE 643001 ("Servicios de fideicomisos") como actividad principal declarada
          ante ARCA — 71 candidatas, 63 sociedades únicas tras deduplicar por republicación en el
          Boletín. Cobertura ARCA: 37 de 63 (58,7%), la más baja de los nichos CLAE de la serie. La
          ausencia de socios repetidos no descarta desarrolladores seriales usando apoderados o
          estructuras distintas por proyecto.
        </Text>

        {entidades.length > 0 && (
          <>
            <Text style={e.tituloSeccion}>
              Directorio completo: las 63 sociedades de servicios de fideicomisos
            </Text>
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

        <FuenteDatosPDF extra="Búsqueda por CLAE 643001 ('Servicios de fideicomisos'). Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
