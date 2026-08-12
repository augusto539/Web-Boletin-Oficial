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
import { InformeNichoServiciosProfesionalesPDF } from "../components/pdf/InformeNichoServiciosProfesionalesPDF";
import { InformeNichoSoftwarePDF } from "../components/pdf/InformeNichoSoftwarePDF";
import type { Anuario, DepartamentoActivo } from "./informesApi";

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

export async function exportarNichoCannabisPDF() {
  const blob = await pdf(<InformeNichoCannabisPDF />).toBlob();
  descargarBlob(blob, "cannabis-y-canamo-en-mendoza.pdf");
}

export async function exportarNichoEnoturismoPDF() {
  const blob = await pdf(<InformeNichoEnoturismoPDF />).toBlob();
  descargarBlob(blob, "enoturismo-en-mendoza.pdf");
}

export async function exportarNichoBodegasBoutiquePDF() {
  const blob = await pdf(<InformeNichoBodegasBoutiquePDF />).toBlob();
  descargarBlob(blob, "bodegas-boutique-en-mendoza.pdf");
}

export async function exportarNichoEnergiaRenovablePDF() {
  const blob = await pdf(<InformeNichoEnergiaRenovablePDF />).toBlob();
  descargarBlob(blob, "energia-solar-y-eolica-en-mendoza.pdf");
}

export async function exportarNichoCriptoFintechPDF() {
  const blob = await pdf(<InformeNichoCriptoFintechPDF />).toBlob();
  descargarBlob(blob, "cripto-y-fintech-en-mendoza.pdf");
}

export async function exportarNichoSoftwarePDF() {
  const blob = await pdf(<InformeNichoSoftwarePDF />).toBlob();
  descargarBlob(blob, "desarrollo-de-software-en-mendoza.pdf");
}

export async function exportarNichoServiciosProfesionalesPDF() {
  const blob = await pdf(<InformeNichoServiciosProfesionalesPDF />).toBlob();
  descargarBlob(blob, "abogados-contadores-y-escribanos-en-mendoza.pdf");
}

export async function exportarNichoArquitecturaPDF() {
  const blob = await pdf(<InformeNichoArquitecturaPDF />).toBlob();
  descargarBlob(blob, "arquitectura-en-mendoza.pdf");
}

export async function exportarNichoCafePDF() {
  const blob = await pdf(<InformeNichoCafePDF />).toBlob();
  descargarBlob(blob, "cafe-de-especialidad-en-mendoza.pdf");
}

export async function exportarNichoCervezaPDF() {
  const blob = await pdf(<InformeNichoCervezaPDF />).toBlob();
  descargarBlob(blob, "cerveza-artesanal-en-mendoza.pdf");
}

export async function exportarNichoReciclajePDF() {
  const blob = await pdf(<InformeNichoReciclajePDF />).toBlob();
  descargarBlob(blob, "reciclaje-y-economia-circular-en-mendoza.pdf");
}

export async function exportarNichoFideicomisosPDF() {
  const blob = await pdf(<InformeNichoFideicomisosPDF />).toBlob();
  descargarBlob(blob, "servicios-de-fideicomisos-en-mendoza.pdf");
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
