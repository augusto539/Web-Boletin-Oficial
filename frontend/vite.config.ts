import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // El .env vive en la raíz del monorepo (junto al de db/ y backend/), no acá:
  // sin esto Vite solo miraría frontend/.env y las VITE_* del .env raíz
  // (como VITE_GA_ID) nunca llegarían al build.
  envDir: "..",
});
