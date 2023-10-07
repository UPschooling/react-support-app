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
        assetFileNames: `css/[name].[ext]`,
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name].js",
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
