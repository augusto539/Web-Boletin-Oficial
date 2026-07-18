import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_BODEGAS,
  ENTIDADES,
  EVOLUCION_ANUAL,
  TIPO_ENTIDAD,
} from "../../data/nichoBodegasBoutique";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

export function InformeNichoBodegasBoutiquePDF() {
  return (
    <Document title="INGcome — Bodegas Boutique en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Bodegas boutique en Mendoza</Text>
          <Text style={e.subtitulo}>La otra vitivinicultura mendocina</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "63 bodegas y emprendimientos vitivinícolas identificados entre 2017 y 2026 en el Boletín Oficial, cuya actividad real es la explotación de viñedos y/o la elaboración de vino propio.",
            "No es un fenómeno nuevo: se constituyen de forma sostenida durante los diez años de cobertura, con un pico de 9 en 2023 y un piso de 3 en 2017, sin la aceleración reciente que sí se ve en enoturismo.",
            "Mediana de capital inicial: $200.000 (rango $25.000 a $60.000.000). Capital total declarado por las 59 empresas que lo informan: $202,5 millones.",
            "33 de 63 (52,4 %) son S.A.S., pero la S.A. tiene presencia inusualmente alta: 28 de 63 (44,4 %). Solo 2 (3,2 %) son S.R.L.",
            "5 de las 63 bodegas no tienen fecha de constitución capturada — probablemente preexistentes a 2017, aparecen por actos posteriores.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>
            Qué es una "bodega boutique" y por qué es distinta de la industria grande
          </Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            El nomenclador oficial de actividades (CLAE) no distingue escalas: "elaboración de
            vinos" mete en la misma categoría a una bodega que exporta millones de litros y a un
            emprendimiento de dos hectáreas. Este informe usa el capital inicial declarado en el
            Boletín Oficial para aislar, por primera vez, a los actores chicos del promedio
            industrial.
          </Text>
        </View>

        <GraficoBarrasPDF titulo="Evolución temporal: un fenómeno sostenido, no una moda" datos={EVOLUCION_ANUAL} />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es un año parcial: boletines relevados hasta julio de 2026. ** 5 bodegas sin fecha
          de constitución capturada no figuran en este gráfico, aunque sí en el directorio.
        </Text>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Tipo societario y capital: acá la S.A. pelea de igual a igual</Text>
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
            59 de 63 declaran capital. Mediana $200.000, mínimo $25.000, máximo $60.000.000 (Bodega
            Morato Gonzalez S.A.S., un outlier). Mediana el doble de la general de $100.000.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están domiciliadas (61 de 63, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_BODEGAS}
          etiquetaUnidad="bodegas"
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
            El domicilio es LEGAL, no necesariamente donde está la finca. A diferencia de
            Enoturismo y Cannabis, acá la distribución fuera de Capital está más repartida entre
            zonas vitivinícolas tradicionales: Luján de Cuyo (10), San Martín y Guaymallén (6 cada
            uno), San Rafael y Maipú (5 cada uno) — sumadas, más que duplican a Capital.
          </Text>
        </View>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Directorio completo: las 63 bodegas y emprendimientos</Text>
        <Text style={{ fontSize: 8, color: "#888888", marginBottom: 10 }}>
          Ordenadas por fecha de publicación del acto de constitución en el Boletín (las 5 sin
          fecha capturada van al final).
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

        <FuenteDatosPDF extra="Búsqueda inicial por nombre (bodega, viñedo, viñas, viña) y objeto social, 112 candidatas. Filtro manual descartó 49 de las 112 (43,8 %) por ambigüedad de la palabra 'bodega' (depósito/almacén, no solo bodega de vino). La serie de evolución anual se calculó a partir de la fecha de publicación de las 58 bodegas del directorio con acto de constitución capturado. Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
