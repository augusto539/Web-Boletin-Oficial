import { type ReactNode, useEffect, useRef, useState } from "react";

// Monta sus hijos recién cuando el bloque está por entrar en pantalla.
//
// Hace falta además de React.lazy: lazy dispara el import cuando el
// componente se RENDERIZA, y los grafos viven dentro de un <Reveal>, que
// renderiza sus hijos de entrada (solo los deja transparentes hasta que se
// scrollea). Resultado: el chunk de Cytoscape (~435 KB) se bajaba y parseaba
// igual en la carga inicial de cada ficha, aunque el grafo esté al final de
// la página. Con esto el navegador ni lo pide hasta que el usuario se acerca
// -- que es justo lo que medía PageSpeed como "reduce unused JavaScript" y
// "reduce JavaScript execution time".
//
// El margen de 300px arranca la descarga un poco antes de que el bloque
// entre en viewport, así para cuando el usuario llega ya está listo y no ve
// el placeholder.
export function CargarAlVerse({
  children,
  alto = 480,
  className = "",
}: {
  children: ReactNode;
  /** Alto reservado para el placeholder, en px. Debe coincidir con el del
   * contenido real para no generar salto de layout (CLS). */
  alto?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    // Sin IntersectionObserver (navegador muy viejo) se muestra de una, que
    // es el comportamiento anterior: preferible a no mostrar nunca el grafo.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className={className}>
      {visible ? (
        children
      ) : (
        <div className="w-full rounded-3xl bg-humo" style={{ height: alto }} />
      )}
    </div>
  );
}
