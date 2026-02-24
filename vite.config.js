import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.CSS_TRANSFORMER_WASM": "false",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        "process.env.CSS_TRANSFORMER_WASM": "false",
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
