import Lenis from "lenis";

// Scroll suave con inercia para toda la app (estilo ventriloc).
export const lenis = new Lenis({ autoRaf: true });

export function scrollToSection(selector: string) {
  lenis.scrollTo(selector, { offset: -72 });
}
