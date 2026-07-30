import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_CRIPTO,
  ENTIDADES,
  EVOLUCION_ANUAL,
  LEYENDA_EVOLUCION,
  TIPO_ENTIDAD,
} from "../../data/nichoCriptoFintech";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasPDF } from "./GraficoBarrasPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

export function InformeNichoCriptoFintechPDF() {
  return (
    <Document title="INGcome — Cripto y Fintech en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Cripto y fintech en Mendoza</Text>
          <Text style={e.subtitulo}>El termómetro del boom</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "14 empresas de cripto/blockchain y fintech identificadas entre 2017 y 2026 en el Boletín Oficial. Es la muestra más chica de la serie, con un patrón temporal muy claro.",
            "9 de las 14 (64,3 %) se concentran en 2020-2022, coincidiendo con el boom de precio de Bitcoin (2020-2021) y su resaca. Silencio casi total en 2023 (crypto winter) y segunda ola en 2024-2026, en sintonía con la recuperación y los ETF de Bitcoin.",
            "La primera ola (2020-2022) se reparte casi igual entre S.A. (6) y S.A.S. (6), con 2 S.R.L. La segunda ola (4 empresas) muestra capitales bastante más altos.",
            "Capital total declarado: $61.562.000, con una mediana de $600.000 — bien por encima de la mediana general de $100.000, con mucha dispersión (de $40.000 a $30.000.000).",
            "Las 14 empresas tienen departamento identificado (100 % de cobertura): 8 en Capital, 3 en Godoy Cruz, 2 en San Rafael y 1 en Luján de Cuyo.",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Qué es cripto/blockchain, qué es fintech, y por qué van juntos</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            Cripto/blockchain abarca compraventa, custodia y minería de criptomonedas y desarrollo
            de tecnología blockchain; fintech, billeteras virtuales, medios de pago digitales y
            servicios financieros por plataforma. Muchas empresas combinan ambas en un mismo objeto
            social, y el nomenclador CLAE no las distingue como categoría propia. A diferencia de
            otros rubros de la serie (con un disparador legal claro, como la Ley 27.669 para el
            cannabis), acá el disparador es puramente de mercado: el ciclo de precio de Bitcoin.
          </Text>
        </View>

        <GraficoBarrasPDF
          titulo="El ciclo de Bitcoin, en miniatura"
          datos={EVOLUCION_ANUAL}
          leyenda={LEYENDA_EVOLUCION}
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 2 }}>
          * 2026 es un año parcial: boletines relevados hasta julio de 2026. ** No hay empresas de
          este rubro en la muestra antes de 2020.
        </Text>

        <View style={e.seccion}>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            9 de las 14 empresas (64,3 %) se concentran en el trienio 2020-2022 —boom y resaca
            inmediata—, y las 5 restantes aparecen recién desde fines de 2024, en sintonía con la
            segunda gran suba del precio. En el medio, 2023: cero constituciones. Es una muestra
            chica (14 casos), pero el patrón temporal es nítido: una serie hiperlocal que reproduce,
            con meses de rezago, un ciclo de mercado global.
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Tipo societario y capital: la segunda ola apuesta más fuerte</Text>
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
            Las 14 empresas declaran capital inicial. Total $61.562.000, mediana $600.000, mínimo
            $40.000 (Bitmonedero S.A.S., 2020), máximo $30.000.000 (SDM S.A., 2025). La segunda ola
            (2024-2026) declara capitales notablemente más altos que la primera —consistente con un
            mercado más maduro y con más capital institucional entrando tras la aprobación de los
            ETF.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están domiciliadas (14 de 14, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_CRIPTO}
          etiquetaUnidad="empresas"
        />
        <Text style={{ fontSize: 8, color: "#999999", marginTop: 4, lineHeight: 1.4 }}>
          A diferencia de otros informes de la serie, acá no hace falta la advertencia sobre la
          brecha entre domicilio legal y zona real de actividad: un negocio de cripto o fintech no
          tiene una "zona de producción" física equivalente a un viñedo o un parque solar.
        </Text>

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <Text style={e.tituloSeccion}>Directorio completo: las 14 empresas</Text>
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

        <FuenteDatosPDF extra="Búsqueda inicial por nombre y objeto social (cripto, crypto, blockchain, bitcoin, fintech, activos digitales, billetera virtual, medios de pago, pasarela de pago, moneda digital, activos virtuales, exchange), 35 candidatas. Filtro manual descartó 21 de las 35 (60 %) — la proporción de descarte más alta de la serie. Las constituciones se cuentan por fecha de publicación del acto en el Boletín, no por fecha de constitución declarada." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
