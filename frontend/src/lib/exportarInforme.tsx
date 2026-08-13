import { pdf } from "@react-pdf/renderer";
import { InformeActividadesClaePDF } from "../components/pdf/InformeActividadesClaePDF";
import { InformeAnalisisRedesPDF } from "../components/pdf/InformeAnalisisRedesPDF";
import { InformeAnuarioPDF } from "../components/pdf/InformeAnuarioPDF";
import { InformeDepartamentosPDF } from "../components/pdf/InformeDepartamentosPDF";
import { InformeNichoCannabisPDF } from "../components/pdf/InformeNichoCannabisPDF";
import { InformeNichoBodegasBoutiquePDF } from "../components/pdf/InformeNichoBodegasBoutiquePDF";
import { InformeNichoCriptoFintechPDF } from "../components/pdf/InformeNichoCriptoFintechPDF";
import { InformeNichoEnergiaRenovablePDF } from "../components/pdf/InformeNichoEnergiaRenovablePDF";
import { InformeNichoEnoturismoPDF } from "../components/pdf/InformeNichoEnoturismoPDF";
import { InformeMujeresFundadorasPDF } from "../components/pdf/InformeMujeresFundadorasPDF";
import { InformeNichoArquitecturaPDF } from "../components/pdf/InformeNichoArquitecturaPDF";
import { InformeNichoCafePDF } from "../components/pdf/InformeNichoCafePDF";
import { InformeNichoCervezaPDF } from "../components/pdf/InformeNichoCervezaPDF";
import { InformeNichoReciclajePDF } from "../components/pdf/InformeNichoReciclajePDF";
import { InformeNichoFideicomisosPDF } from "../components/pdf/InformeNichoFideicomisosPDF";
import { InformeNichoAgenciasViajesPDF } from "../components/pdf/InformeNichoAgenciasViajesPDF";
import { InformeNichoServiciosProfesionalesPDF } from "../components/pdf/InformeNichoServiciosProfesionalesPDF";
import { InformeNichoSoftwarePDF } from "../components/pdf/InformeNichoSoftwarePDF";
import type { Anuario, DepartamentoActivo, EntidadNicho } from "./informesApi";

// Duplicado a propósito (no importado de exportarFicha.tsx): ese módulo se
// carga con await import() dinámico desde Sociedad.tsx/Persona.tsx
// justamente para mantener @react-pdf/renderer fuera del bundle principal;
// importar algo de ahí acá arrastraría todo ese módulo también a este chunk
// (mismo motivo por el que este archivo se importa dinámicamente desde las
// páginas de informes, no de forma estática).
function descargarBlob(blob: Blob, nombreArchivo: string) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}

export async function exportarDepartamentosPDF(
  departamentos: DepartamentoActivo[],
  actualizadoEl: string | null,
  sinDepartamento: number,
) {
  const blob = await pdf(
    <InformeDepartamentosPDF
      departamentos={departamentos}
      actualizadoEl={actualizadoEl}
      sinDepartamento={sinDepartamento}
    />,
  ).toBlob();
  descargarBlob(blob, "departamentos-mas-activos.pdf");
}

export async function exportarAnuarioPDF(anuario: Anuario) {
  const blob = await pdf(<InformeAnuarioPDF anuario={anuario} />).toBlob();
  descargarBlob(blob, `anuario-${anuario.anio}.pdf`);
}

export async function exportarNichoCannabisPDF(
  entidades: EntidadNicho[],
  sociosRepetidos: { nombre: string; veces: number }[],
) {
  const blob = await pdf(
    <InformeNichoCannabisPDF entidades={entidades} sociosRepetidos={sociosRepetidos} />,
  ).toBlob();
  descargarBlob(blob, "cannabis-y-canamo-en-mendoza.pdf");
}

export async function exportarNichoEnoturismoPDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoEnoturismoPDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "enoturismo-en-mendoza.pdf");
}

export async function exportarNichoBodegasBoutiquePDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoBodegasBoutiquePDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "bodegas-boutique-en-mendoza.pdf");
}

export async function exportarNichoEnergiaRenovablePDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoEnergiaRenovablePDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "energia-solar-y-eolica-en-mendoza.pdf");
}

export async function exportarNichoCriptoFintechPDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoCriptoFintechPDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "cripto-y-fintech-en-mendoza.pdf");
}

export async function exportarNichoSoftwarePDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoSoftwarePDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "desarrollo-de-software-en-mendoza.pdf");
}

export async function exportarNichoServiciosProfesionalesPDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoServiciosProfesionalesPDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "abogados-contadores-y-escribanos-en-mendoza.pdf");
}

export async function exportarNichoArquitecturaPDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoArquitecturaPDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "arquitectura-en-mendoza.pdf");
}

export async function exportarNichoCafePDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoCafePDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "cafe-de-especialidad-en-mendoza.pdf");
}

export async function exportarNichoCervezaPDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoCervezaPDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "cerveza-artesanal-en-mendoza.pdf");
}

export async function exportarNichoReciclajePDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoReciclajePDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "reciclaje-y-economia-circular-en-mendoza.pdf");
}

export async function exportarNichoFideicomisosPDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoFideicomisosPDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "servicios-de-fideicomisos-en-mendoza.pdf");
}

export async function exportarNichoAgenciasViajesPDF(entidades: EntidadNicho[]) {
  const blob = await pdf(<InformeNichoAgenciasViajesPDF entidades={entidades} />).toBlob();
  descargarBlob(blob, "agencias-de-viajes-en-mendoza.pdf");
}

export async function exportarMujeresFundadorasPDF() {
  const blob = await pdf(<InformeMujeresFundadorasPDF />).toBlob();
  descargarBlob(blob, "mujeres-que-fundan-empresas-en-mendoza.pdf");
}

export async function exportarActividadesClaePDF() {
  const blob = await pdf(<InformeActividadesClaePDF />).toBlob();
  descargarBlob(blob, "actividades-clae-en-mendoza.pdf");
}

export async function exportarAnalisisRedesPDF() {
  const blob = await pdf(<InformeAnalisisRedesPDF />).toBlob();
  descargarBlob(blob, "mapa-oculto-sociedades-mendocinas.pdf");
}
