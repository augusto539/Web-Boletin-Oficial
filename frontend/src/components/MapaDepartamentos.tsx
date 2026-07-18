import { useMemo, useState } from "react";
import type { DepartamentoActivo } from "../lib/informesApi";
import { MapaMendoza } from "./MapaMendoza";

type Metrica = "historico" | "ultimoAnio";

const ETIQUETA_METRICA: Record<Metrica, string> = {
  historico: "Histórico",
  ultimoAnio: "Último año",
};

export function MapaDepartamentos({ departamentos }: { departamentos: DepartamentoActivo[] }) {
  const [metrica, setMetrica] = useState<Metrica>("historico");

  const valorPorNombre = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const d of departamentos) {
      mapa.set(d.nombre, metrica === "historico" ? d.cantidadSociedades : d.cantidadUltimoAnio);
    }
    return mapa;
  }, [departamentos, metrica]);

  return (
    <MapaMendoza
      titulo="Mapa de sociedades por departamento"
      subtitulo="Cuanto más oscuro, más sociedades constituidas."
      valorPorNombre={valorPorNombre}
      controles={
        <div className="flex gap-1.5">
          {(Object.keys(ETIQUETA_METRICA) as Metrica[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetrica(m)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                metrica === m ? "bg-vino text-white" : "bg-humo text-carbon/60 hover:bg-carbon/10"
              }`}
            >
              {ETIQUETA_METRICA[m]}
            </button>
          ))}
        </div>
      }
    />
  );
}
