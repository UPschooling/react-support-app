/// <reference types="vitest" />
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [react(), tsconfigPaths(), nodePolyfills()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [],
    },
  },
  build: {
    outDir: "nextcloud/upschoolingsupport",
    target: "es2015",
    rollupOptions: {
      plugins: [],
      output: {
        entryFileNames: "js/main.js",
        chunkFileNames: "css/style.css",
        manualChunks: {
          "index.html": ["templates/main.php"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ".vitest/setup",
    include: ["**/*.test.{ts,tsx}"],
  },
  server: {
    cors: {
      origin: false,
    },
  },
});
