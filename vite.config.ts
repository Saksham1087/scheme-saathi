import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@seed": path.resolve(import.meta.dirname, "./functions/src/data"),
    },
  },
  server: {
    allowedHosts: ["https://saksham1087.github.io/scheme-saathi/"],
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
