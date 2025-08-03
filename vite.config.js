import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./lib"), // <-- tambahkan ini
    },
  },
  server: {
    fs: {
      allow: ["."], // <-- izinkan akses ke direktori luar src
    },
  },
  optimizeDeps: {
    exclude: ["three"],
  },
});
