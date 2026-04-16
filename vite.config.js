import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
    proxy: {
      "/api": {
        target: "https://localhost:7251",
        changeOrigin: true,
        secure: false,
      },
      "/chatHub": {
        target: "https://localhost:7251",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
