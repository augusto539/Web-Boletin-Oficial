import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // El .env vive en la raíz del monorepo (junto al de db/ y backend/), no acá:
  // sin esto Vite solo miraría frontend/.env y las VITE_* del .env raíz
  // (como VITE_GA_ID) nunca llegarían al build.
  envDir: "..",
  // Target default de Vite (~2020: chrome87/firefox78/safari14/edge88) hace
  // que esbuild transpile clases/spread a formas más viejas y agregue
  // polyfills (Math.hypot) que no hacen falta en los navegadores reales de
  // hoy -- "esnext" en optimizeDeps evita esa transpilación de más al
  // pre-empaquetar las dependencias (PageSpeed Insights lo marcaba como
  // "Legacy JavaScript").
  optimizeDeps: {
    esbuildOptions: { target: "esnext" },
  },
  build: {
    target: "esnext",
    // Sin esto, Lighthouse marca "Missing source maps for large first-party
    // JavaScript" (no puede mapear el bundle minificado al código fuente).
    // El .map se sirve como un archivo estático más junto al .js -- lo baja
    // el browser solo si el usuario abre DevTools con sourcemaps activado,
    // así que no pesa nada en una carga normal.
    sourcemap: true,
  },
});
