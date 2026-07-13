import { pdf } from "@react-pdf/renderer";
import ExcelJS from "exceljs";
import { FichaPersonaPDF } from "../components/pdf/FichaPersonaPDF";
import { FichaSociedadPDF } from "../components/pdf/FichaSociedadPDF";
import type { SociedadAgrupada } from "../pages/Persona";
import type { ActoAgrupado, VinculoAgrupado } from "../pages/Sociedad";
import { cuit as formatCuit, dato, fecha, formatDomicilio, listaConY, moneda, porcentaje, siNo } from "./format";
import type { PersonaFisica, Sociedad } from "./queries";

// Mismo criterio que el resto del sitio para nombres de archivo (ver
// GrafoExploracion.tsx / descargarImagen): minúsculas, sin acentos, guiones.
function slug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function descargarBlob(blob: Blob, nombreArchivo: string) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}

const ANCHO_COLUMNA_MAX = 60;

function autoAncho(hoja: ExcelJS.Worksheet) {
  hoja.columns.forEach((columna) => {
    let maximo = 10;
    columna.eachCell?.({ includeEmpty: false }, (celda) => {
      maximo = Math.max(maximo, String(celda.value ?? "").length + 2);
    });
    columna.width = Math.min(maximo, ANCHO_COLUMNA_MAX);
  });
}

function estilizarEncabezado(hoja: ExcelJS.Worksheet, fila: number) {
  const filaEncabezado = hoja.getRow(fila);
  filaEncabezado.font = { bold: true, color: { argb: "FFFFFFFF" } };
  filaEncabezado.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF691824" } };
}

export async function exportarSociedadPDF(
  sociedad: Sociedad,
  vinculos: VinculoAgrupado[],
  actos: ActoAgrupado[],
) {
  const blob = await pdf(
    <FichaSociedadPDF sociedad={sociedad} vinculos={vinculos} actos={actos} />,
  ).toBlob();
  descargarBlob(blob, `${slug(sociedad.nombre) || "sociedad"}.pdf`);
}

export async function exportarPersonaPDF(persona: PersonaFisica, sociedades: SociedadAgrupada[]) {
  const blob = await pdf(<FichaPersonaPDF persona={persona} sociedades={sociedades} />).toBlob();
  descargarBlob(blob, `${slug(persona.nombre) || "persona"}.pdf`);
}

export async function exportarSociedadExcel(
  sociedad: Sociedad,
  vinculos: VinculoAgrupado[],
  actos: ActoAgrupado[],
) {
  const libro = new ExcelJS.Workbook();
  libro.creator = "INGcome";
  libro.created = new Date();

  const general = libro.addWorksheet("Datos generales");
  general.columns = [
    { header: "Campo", key: "campo" },
    { header: "Valor", key: "valor" },
  ];
  general.addRows([
    { campo: "Nombre", valor: sociedad.nombre },
    { campo: "Tipo", valor: dato(sociedad.tipoSociedadByTipoSociedadId?.nombre) },
    { campo: "CUIT", valor: sociedad.cuit ? formatCuit(sociedad.cuit) : dato(null) },
    { campo: "Fecha de constitución", valor: fecha(sociedad.fechaConstitucion) },
    { campo: "Capital inicial", valor: moneda(sociedad.capitalInicial) },
    { campo: "Empleador", valor: siNo(sociedad.empleador) },
    { campo: "Impuesto a las Ganancias", valor: dato(sociedad.estadoGananciasByEstadoGananciasId?.nombre) },
    { campo: "IVA", valor: dato(sociedad.estadoIvaByEstadoIvaId?.nombre) },
    { campo: "Cotejo con ARCA", valor: dato(sociedad.tipoMatchArcaByTipoMatchArcaId?.nombre) },
    { campo: "Domicilio", valor: formatDomicilio(sociedad.domicilioByDomicilioId) },
    { campo: "Objeto social", valor: dato(sociedad.objetoSocial) },
  ]);
  estilizarEncabezado(general, 1);
  autoAncho(general);

  const actividadesHoja = libro.addWorksheet("Actividades (CLAE)");
  actividadesHoja.columns = [
    { header: "Código", key: "codigo" },
    { header: "Descripción", key: "descripcion" },
    { header: "Grupo", key: "grupo" },
    { header: "Principal", key: "principal" },
    { header: "Estado", key: "estado" },
  ];
  for (const a of [...sociedad.sociedadActividadesBySociedadId.nodes].sort(
    (x, y) => (x.orden ?? 99) - (y.orden ?? 99),
  )) {
    actividadesHoja.addRow({
      codigo: dato(a.actividadClaeByClaeCodigo?.codigo),
      descripcion: dato(a.actividadClaeByClaeCodigo?.descripcion),
      grupo: dato(a.grupoClaeByClaeGrupo?.nombre),
      principal: siNo(a.orden === 1),
      estado: a.estado === "BD" ? "Baja" : "Activa",
    });
  }
  estilizarEncabezado(actividadesHoja, 1);
  autoAncho(actividadesHoja);

  const socios = libro.addWorksheet("Socios y autoridades");
  socios.columns = [
    { header: "Nombre", key: "nombre" },
    { header: "Rol", key: "rol" },
    { header: "Participación", key: "participacion" },
    { header: "Ingreso", key: "ingreso" },
    { header: "Estado", key: "estado" },
  ];
  for (const v of vinculos) {
    const nombre =
      v.personaFisicaByPersonaId?.nombre ??
      v.sociedadBySociedadMiembroId?.nombre ??
      v.nombreJuridicoFallback ??
      dato(null);
    socios.addRow({
      nombre,
      rol: listaConY(v.roles),
      participacion: porcentaje(v.porcentaje),
      ingreso: fecha(v.fechaEntrada),
      estado: v.fechaSalida ? `Baja ${fecha(v.fechaSalida)}` : "Vigente",
    });
  }
  estilizarEncabezado(socios, 1);
  autoAncho(socios);

  const historial = libro.addWorksheet("Historial de actos");
  historial.columns = [
    { header: "Fecha", key: "fecha" },
    { header: "Tipo de acto", key: "tipo" },
    { header: "Descripción", key: "descripcion" },
    { header: "Capital anterior", key: "capitalAnterior" },
    { header: "Capital nuevo", key: "capitalNuevo" },
    { header: "Escribano/a", key: "escribano" },
    { header: "Fuente (Boletín)", key: "fuente" },
  ];
  for (const acto of actos) {
    historial.addRow({
      fecha:
        acto.fechasActo.length > 1
          ? acto.fechasActo.map((f) => fecha(f)).join(" y ")
          : fecha(acto.fechasActo[0]),
      tipo: dato(acto.tipoActoByTipoActoId?.nombre),
      descripcion: dato(acto.descripcion),
      capitalAnterior: moneda(acto.capitalAnterior),
      capitalNuevo: moneda(acto.capitalNuevo),
      escribano: dato(acto.personaFisicaByEscribanoId?.nombre),
      fuente: acto.fuentes.map((f) => `Boletín ${fecha(f.fecha)}${f.enlace ? ` (${f.enlace})` : ""}`).join(" | "),
    });
  }
  estilizarEncabezado(historial, 1);
  autoAncho(historial);

  const buffer = await libro.xlsx.writeBuffer();
  descargarBlob(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${slug(sociedad.nombre) || "sociedad"}.xlsx`,
  );
}

export async function exportarPersonaExcel(persona: PersonaFisica, sociedades: SociedadAgrupada[]) {
  const libro = new ExcelJS.Workbook();
  libro.creator = "INGcome";
  libro.created = new Date();

  const general = libro.addWorksheet("Datos generales");
  general.columns = [
    { header: "Campo", key: "campo" },
    { header: "Valor", key: "valor" },
  ];
  general.addRows([
    { campo: "Nombre", valor: persona.nombre },
    { campo: "DNI", valor: dato(persona.documento) },
    { campo: "CUIT", valor: persona.cuit ? formatCuit(persona.cuit) : dato(null) },
    { campo: "Profesión", valor: dato(persona.profesion) },
    { campo: "Fecha de nacimiento", valor: fecha(persona.fechaNacimiento) },
    { campo: "Domicilio", valor: formatDomicilio(persona.domicilioByDomicilioId) },
    { campo: "Domicilio electrónico", valor: dato(persona.domicilioElectronico) },
  ]);
  estilizarEncabezado(general, 1);
  autoAncho(general);

  const hojaSociedades = libro.addWorksheet("Sociedades");
  hojaSociedades.columns = [
    { header: "Sociedad", key: "sociedad" },
    { header: "Rol", key: "rol" },
    { header: "Participación", key: "participacion" },
    { header: "Ingreso", key: "ingreso" },
    { header: "Estado", key: "estado" },
    { header: "Fuente (Boletín)", key: "fuente" },
  ];
  for (const s of sociedades) {
    hojaSociedades.addRow({
      sociedad: dato(s.sociedad?.nombre),
      rol: listaConY(s.roles),
      participacion: porcentaje(s.porcentaje),
      ingreso: fecha(s.fechaEntrada),
      estado: s.fechaSalida ? `Baja ${fecha(s.fechaSalida)}` : "Vigente",
      fuente: s.fuente ? `Boletín ${fecha(s.fuente.fecha)}${s.fuente.enlace ? ` (${s.fuente.enlace})` : ""}` : dato(null),
    });
  }
  estilizarEncabezado(hojaSociedades, 1);
  autoAncho(hojaSociedades);

  const buffer = await libro.xlsx.writeBuffer();
  descargarBlob(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${slug(persona.nombre) || "persona"}.xlsx`,
  );
}
