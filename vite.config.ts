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
    allowedHosts: ["saathi.rairahulr1.com"],
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
