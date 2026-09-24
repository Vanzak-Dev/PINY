import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import base44Plugin from "@base44/vite-plugin";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    base44Plugin({ legacySDKImports: true }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      "/api": process.env.API_PROXY_TARGET || "http://localhost:8000",
    },
  },
});
