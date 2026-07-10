import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

// Número que cuenta de 0 al valor al entrar en viewport.
export function CountUp({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!visible || !ref.current) return;
    const controls = animate(0, valor, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("es-AR");
      },
    });
    return () => controls.stop();
  }, [visible, valor]);

  return <span ref={ref}>0</span>;
}
