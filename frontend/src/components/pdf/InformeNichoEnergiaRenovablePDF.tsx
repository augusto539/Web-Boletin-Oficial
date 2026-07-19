import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_ENERGIA,
  ENTIDADES,
  EVOLUCION_ANUAL,
  LEYENDA_EVOLUCION,
  TIPO_ENTIDAD,
} from "../../data/nichoEnergiaRenovable";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

export function InformeNichoEnergiaRenovablePDF() {
  return (
    <Document title="INGcome — Energía Solar y Eólica en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Energía solar y eólica en Mendoza</Text>
          <Text style={e.subtitulo}>Dos olas, un mismo objetivo</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "50 empresas de energía solar, eólica o renovable identificadas entre 2017 y 2026 en el Boletín Oficial.",
            "Dos olas separadas por un vacío casi total: 18 constituciones en 2017 (más de un tercio del total), caída abrupta con 2023 en cero, y una segunda ola más chica en 2024-2026 (7, 4 y 2).",
            "La primera ola coincide con el Programa RenovAr (rondas de licitación 2016-2017); varias empresas se constituyeron el mismo día, en tandas de SPV.",
            "La S.A. domina el total (27 de 50, 54 %), empujada por la ola 2017 con capital nominal idéntico de $100.000. La ola 2024-2026 es mayoritariamente S.A.S.: 11 de 13.",
            "Luján de Cuyo (13) y San Rafael (11) juntas superan a Capital (8) — a diferencia del resto de la serie, acá el domicilio legal tiende a coincidir con la zona real del proyecto.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>El contexto: RenovAr primero, generación distribuida después</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            El Programa RenovAr (2016-2017) adjudicó 147 proyectos por 4.466,5 MW en todo el país;
            cada proyecto de gran escala se organiza como una sociedad de propósito específico (SPV)
            con capital nominal mínimo. La segunda ola (2024-2026) responde a un fenómeno distinto:
            la generación distribuida habilitada por la Ley 27.424, con empresas de instalación y
            servicios mayoritariamente S.A.S.
          </Text>
        </View>

        <GraficoBarrasPDF
          titulo="Dos olas separadas por un vacío"
          datos={EVOLUCION_ANUAL}
          leyenda={LEYENDA_EVOLUCION}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es un año parcial: boletines relevados hasta julio de 2026. ** 2 empresas sin fecha
          de constitución capturada no figuran en este gráfico, aunque sí en el directorio.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Tipo societario y capital: cada ola tiene su propio perfil</Text>
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
            46 de 50 declaran capital. Mediana $100.000, mínimo $30.000, máximo $30.000.000
            (Energías Renovables El Diamante S.A., 2024). Para los vehículos de proyecto de 2017,
            $100.000 era el mínimo legal nominal, sin relación con la inversión real.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están domiciliadas (47 de 50, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_ENERGIA}
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
            El domicilio es LEGAL, no necesariamente la ubicación física del parque. A diferencia
            del resto de la serie, acá Capital queda en tercer lugar: Luján de Cuyo (13) y San
            Rafael (11) —zonas de proyecto real, como el río Diamante en San Rafael, que da nombre
            a "Helios Río Diamante"— superan a Capital (8).
          </Text>
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Directorio completo: las 50 empresas</Text>
        <Text style={{ fontSize: 8, color: "#888888", marginBottom: 10 }}>
          Ordenadas por fecha de publicación del acto de constitución en el Boletín (las 2 sin fecha
          capturada van al final). Los socios que son personas jurídicas no tienen ficha propia en
          el sitio.
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

        <FuenteDatosPDF extra="Búsqueda inicial por nombre y objeto social (solar, eólica/eolica, fotovoltaica, renovable, energía renovable, energías limpias), 95 candidatas. Filtro manual descartó 45 de las 95 (47,4 %). Varios socios de la ola 2017 son personas jurídicas (Dax Energy Holdings, Tassaroli S.A., Green S.A., entre otras) sin ficha propia en el sitio. Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
