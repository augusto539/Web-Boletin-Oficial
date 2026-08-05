import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  DEPARTAMENTOS_SERVICIOS_PROFESIONALES,
  ENTIDADES,
  ESCRIBANOS_TOP,
  ESPECIALIDAD_ESTUDIOS,
  PROFESIONES_ECOSISTEMA,
  RANKING_PROFESIONES_LIBERALES,
  TIPO_ENTIDAD,
  type EntidadServiciosProfesionales,
} from "../../data/nichoServiciosProfesionales";
import { fecha, hoyISO } from "../../lib/format";
import { GraficoBarrasHorizontalPDF } from "./GraficoBarrasHorizontalPDF";
import { MapaMendozaPDF } from "./MapaMendozaPDF";
import { estilosPDF as e, CARBON } from "./estilosPDF";
import { FuenteDatosPDF } from "./FuenteDatosPDF";

const CATEGORIAS: EntidadServiciosProfesionales["categoria"][] = [
  "Jurídico",
  "Jurídico-contable",
  "Contable",
  "Gestoría y trámites",
];

export function InformeNichoServiciosProfesionalesPDF() {
  return (
    <Document title="INGcome — Abogados, contadores y escribanos en Mendoza">
      <Page size="A4" style={e.pagina} wrap>
        <View style={e.encabezado}>
          <Text style={e.etiquetaTipo}>Informe de datos · Nichos sectoriales</Text>
          <Text style={e.titulo}>Abogados, contadores y escribanos en Mendoza</Text>
          <Text style={e.subtitulo}>Los profesionales que fabrican empresas</Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Resumen ejecutivo</Text>
          {[
            "46 estudios profesionales identificados entre 2017 y 2026 — jurídicos (25), contables (11), jurídico-contables (9) y de gestoría y trámites (1). Ninguno notarial.",
            "821 abogados/as y 1.136 contadores/as aparecen como socios en 1.028 y 1.639 sociedades de toda la base, muy por encima de cualquier estudio propio del rubro.",
            "66 escribanos/as aparecen como socios en cualquier sociedad — la profesión liberal que menos se asocia de las seis relevadas.",
            "559 escribanos/as intervinieron en 1.511 actos del boletín: mercado atomizado, el 52,9 % (296 de 559) aparece una sola vez.",
            "Capital concentra el 73,9 % de los 46 estudios (34 de 46).",
          ].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: CARBON, lineHeight: 1.5, marginBottom: 4 }}>
              •  {t}
            </Text>
          ))}
        </View>

        <GraficoBarrasHorizontalPDF
          titulo="Un rubro que está en los dos lados del dato"
          datos={ESPECIALIDAD_ESTUDIOS}
        />

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>La escribanía que no existe</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
            Ninguno de los 46 estudios es notarial, y no es casualidad: el registro notarial es
            personal e intransferible, un escribano no puede aportarlo como capital a una sociedad
            ni ejercer la función notarial a través de una persona jurídica. Una escribanía,
            estructuralmente, no puede aparecer en el Boletín Oficial como sociedad comercial.
          </Text>
        </View>

        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>El otro lado: los profesionales que fabrican empresas</Text>
          <View style={e.filaEncabezado}>
            <Text style={[e.celdaEncabezado, { width: "40%" }]}>Profesión</Text>
            <Text style={[e.celdaEncabezado, { width: "30%" }]}>Personas</Text>
            <Text style={[e.celdaEncabezado, { width: "30%" }]}>Sociedades</Text>
          </View>
          {PROFESIONES_ECOSISTEMA.map((p) => (
            <View key={p.profesion} style={e.fila} wrap={false}>
              <Text style={[e.celda, { width: "40%" }]}>{p.profesion}</Text>
              <Text style={[e.celda, { width: "30%" }]}>{p.personas.toLocaleString("es-AR")}</Text>
              <Text style={[e.celda, { width: "30%" }]}>
                {p.sociedades ? p.sociedades.toLocaleString("es-AR") : "—"}
              </Text>
            </View>
          ))}
        </View>

        <GraficoBarrasHorizontalPDF
          titulo="Ranking de profesiones liberales entre los socios de toda la base"
          datos={RANKING_PROFESIONES_LIBERALES}
        />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>

      <Page size="A4" style={e.pagina} wrap>
        <View style={e.seccion}>
          <Text style={e.tituloSeccion}>Los escribanos del Boletín: un mercado atomizado</Text>
          <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginBottom: 8 }}>
            559 escribanos/as distintos intervinieron en 1.511 actos del Boletín. Los 10 más activos
            concentran 237 actos (15,7 %), los 50 más activos 589 (39,0 %), y 296 de los 559
            (52,9 %) aparecen una única vez. Solo el 6,9 % de los 21.989 actos totales de la base
            declara qué escribano intervino.
          </Text>
          <GraficoBarrasHorizontalPDF titulo="Los escribanos más activos" datos={ESCRIBANOS_TOP} />
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
            36 de 46 (78,3 %) son S.A.S. Capital: mediana $101.000, rango $20.000 a $3.000.000.
          </Text>
        </View>

        <MapaMendozaPDF
          titulo="Dónde están domiciliados (45 de 46, con departamento identificado)"
          valorPorNombre={DEPARTAMENTOS_SERVICIOS_PROFESIONALES}
          etiquetaUnidad="estudios"
        />
        <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5, marginTop: 8 }}>
          Capital concentra el 73,9 % (34 de 46) — la mayor concentración geográfica de toda esta
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
          Búsqueda por objeto social y nombre: términos jurídicos, contables y notariales — 163
          sociedades candidatas. Revisión manual completa: 117 de las 163 (71,8 %) se descartaron.
          Los datos de escribanos y de profesiones entre socios se calculan sobre toda la base de
          19.485 sociedades y 21.989 actos, no solo sobre los 46 estudios de este informe.
        </Text>

        {ENTIDADES.length > 0 && (
          <>
            <Text style={e.tituloSeccion}>Directorio completo: los 46 estudios</Text>
            {CATEGORIAS.map((categoria) => {
              const entidadesCategoria = ENTIDADES.filter((ent) => ent.categoria === categoria);
              if (entidadesCategoria.length === 0) return null;
              return (
                <View key={categoria}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#691824",
                      textTransform: "uppercase",
                      marginTop: 10,
                      marginBottom: 6,
                    }}
                  >
                    {categoria} ({entidadesCategoria.length})
                  </Text>
                  {entidadesCategoria.map((ent) => (
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
                </View>
              );
            })}
          </>
        )}

        <FuenteDatosPDF extra="Búsqueda por objeto social y nombre (términos jurídicos, contables y notariales), 163 candidatas. Revisión manual completa del universo. Capital en pesos nominales, sin ajuste por inflación." />

        <View style={e.piePagina} fixed>
          <Text>INGcome Consultora — ingcome.com.ar</Text>
          <Text>Generado el {fecha(hoyISO())}</Text>
        </View>
      </Page>
    </Document>
  );
}
