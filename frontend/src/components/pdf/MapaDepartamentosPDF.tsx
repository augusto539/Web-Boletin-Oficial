import type { DepartamentoActivo } from "../../lib/informesApi";
import { MapaMendozaPDF } from "./MapaMendozaPDF";

// Usa siempre el histórico total — es la métrica por defecto también en la
// página web (el PDF no tiene el toggle histórico/último año).
export function MapaDepartamentosPDF({ departamentos }: { departamentos: DepartamentoActivo[] }) {
  const valorPorNombre = new Map(departamentos.map((d) => [d.nombre, d.cantidadSociedades]));
  return <MapaMendozaPDF titulo="Mapa de sociedades por departamento (histórico)" valorPorNombre={valorPorNombre} />;
}
