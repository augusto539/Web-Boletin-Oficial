import { motion } from "framer-motion";

// Reveal palabra por palabra con máscara, estilo ventriloc: cada palabra sube
// desde abajo de una línea recortada, con stagger.
export function SplitText({
  texto,
  delay = 0,
  className = "",
}: {
  texto: string;
  delay?: number;
  className?: string;
}) {
  const palabras = texto.split(" ");
  return (
    <span className={className} aria-label={texto} role="text">
      {palabras.map((palabra, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.055,
            }}
          >
            {palabra}
            {i < palabras.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
