import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Aparición al entrar en viewport (fade + slide), para las secciones.
//
// `inmediato` apaga la animación y renderiza el contenido visible de una:
// se usa en el bloque de encabezado de cada página, que está sobre la línea
// de flote y suele ser el elemento LCP. Animarlo salía carísimo — el
// contenido arranca en opacity 0 y recién se pinta después de bajar el JS,
// hidratar React, disparar el IntersectionObserver y correr los 0,65 s de
// transición; PageSpeed lo medía como más de 3 s de "element render delay".
// El resto de las secciones, que sí están abajo del fold, mantienen la
// animación: para cuando el usuario scrollea hasta ellas, el costo ya no
// está en el camino crítico.
export function Reveal({
  children,
  delay = 0,
  className = "",
  inmediato = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  inmediato?: boolean;
}) {
  if (inmediato) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
