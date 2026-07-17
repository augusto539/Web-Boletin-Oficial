import { pdf } from "@react-pdf/renderer";
import { InformeAnuarioPDF } from "../components/pdf/InformeAnuarioPDF";
import { InformeDepartamentosPDF } from "../components/pdf/InformeDepartamentosPDF";
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
) {
  const blob = await pdf(
    <InformeDepartamentosPDF departamentos={departamentos} actualizadoEl={actualizadoEl} />,
  ).toBlob();
  descargarBlob(blob, "departamentos-mas-activos.pdf");
}

export async function exportarAnuarioPDF(anuario: Anuario) {
  const blob = await pdf(<InformeAnuarioPDF anuario={anuario} />).toBlob();
  descargarBlob(blob, `anuario-${anuario.anio}.pdf`);
}
