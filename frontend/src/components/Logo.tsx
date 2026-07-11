export function Logo({
  claro = false,
  variante = "horizontal",
  className = "h-9 w-auto",
}: {
  claro?: boolean;
  variante?: "horizontal" | "principal" | "imagotipo";
  className?: string;
}) {
  const src = claro ? `/brand/${variante}-blanco.svg` : `/brand/${variante}-color.svg`;
  return <img src={src} alt="INGcome Consultora" className={`select-none ${className}`} />;
}
