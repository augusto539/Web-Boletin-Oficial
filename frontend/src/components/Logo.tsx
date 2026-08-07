// Todos los SVG de marca comparten el mismo lienzo (ver public/brand/): las
// variantes horizontal y principal usan viewBox "0 0 336.53 190.21", y el
// imagotipo "0 0 336.5 142.5".
//
// Los atributos width/height van sí o sí aunque el tamaño real lo defina el
// className (h-25 w-auto, etc.): el navegador los usa solo para deducir la
// relación de aspecto y reservar el espacio ANTES de bajar el archivo. Sin
// ellos el logo ocupaba 0px hasta que cargaba y después empujaba todo lo de
// abajo -- eso solo valía 0,250 de CLS en PageSpeed (rango "malo"), y como
// el Nav y el Footer usan este componente, pasaba en todas las páginas.
const LIENZO = {
  horizontal: { width: 337, height: 190 },
  principal: { width: 337, height: 190 },
  imagotipo: { width: 337, height: 143 },
} as const;

export function Logo({
  claro = false,
  variante = "horizontal",
  className = "h-9 w-auto",
  prioridad = false,
}: {
  claro?: boolean;
  variante?: "horizontal" | "principal" | "imagotipo";
  className?: string;
  /** Marca la imagen como de alta prioridad de carga. Solo para el logo del
   * Nav: en las páginas sin imagen destacada (fichas de sociedad/persona)
   * termina siendo el elemento LCP. */
  prioridad?: boolean;
}) {
  const src = claro ? `/brand/${variante}-blanco.svg` : `/brand/${variante}-color.svg`;
  const { width, height } = LIENZO[variante];
  return (
    <img
      src={src}
      alt="INGcome Consultora"
      width={width}
      height={height}
      {...(prioridad ? { fetchPriority: "high" as const, loading: "eager" as const } : {})}
      className={`select-none ${className}`}
    />
  );
}
