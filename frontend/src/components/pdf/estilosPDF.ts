import { StyleSheet } from "@react-pdf/renderer";

// Compartido entre FichaSociedadPDF y FichaPersonaPDF: misma identidad visual
// (vino/carbon/humo) que el resto del sitio, adaptada a lo que react-pdf
// soporta (no hay Tailwind acá, es un renderer propio con su propio layout
// engine tipo flexbox).
export const VINO = "#691824";
export const CARBON = "#191d20";
export const HUMO = "#efefef";

export const estilosPDF = StyleSheet.create({
  pagina: {
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
    fontSize: 10,
    color: CARBON,
  },
  encabezado: {
    marginBottom: 24,
  },
  etiquetaTipo: {
    fontSize: 9,
    color: VINO,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 700,
    color: CARBON,
  },
  subtitulo: {
    marginTop: 6,
    fontSize: 10,
    color: "#555555",
  },
  seccion: {
    marginTop: 20,
  },
  tituloSeccion: {
    fontSize: 13,
    fontWeight: 700,
    color: CARBON,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: HUMO,
    paddingBottom: 6,
  },
  grillaCampos: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -10,
  },
  campo: {
    width: "33.33%",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  campoAncho: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  campoEtiqueta: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#888888",
    marginBottom: 3,
  },
  campoValor: {
    fontSize: 10,
    color: CARBON,
    lineHeight: 1.4,
  },
  vacio: {
    fontSize: 10,
    color: "#999999",
    backgroundColor: HUMO,
    padding: 10,
    borderRadius: 4,
  },
  tabla: {
    marginTop: 4,
  },
  filaEncabezado: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingBottom: 5,
    marginBottom: 5,
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: HUMO,
    paddingVertical: 6,
  },
  celdaEncabezado: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#888888",
  },
  celda: {
    fontSize: 9,
    color: CARBON,
  },
  celdaSub: {
    fontSize: 8,
    color: "#888888",
    marginTop: 1,
  },
  enlace: {
    color: VINO,
    textDecoration: "none",
  },
  actividad: {
    fontSize: 9,
    backgroundColor: HUMO,
    color: CARBON,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  actividadPrincipal: {
    backgroundColor: VINO,
    color: "#ffffff",
    fontWeight: 700,
  },
  listaActividades: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  acto: {
    marginBottom: 14,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: HUMO,
  },
  actoFecha: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#888888",
  },
  actoTitulo: {
    fontSize: 11,
    fontWeight: 700,
    color: CARBON,
    marginTop: 2,
  },
  actoTexto: {
    fontSize: 9,
    color: "#444444",
    marginTop: 2,
    lineHeight: 1.4,
  },
  piePagina: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#999999",
    borderTopWidth: 0.5,
    borderTopColor: HUMO,
    paddingTop: 8,
  },
});
