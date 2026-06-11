import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

/**
 * Three-pass build (see package.json):
 *  - ui:      popup + options pages (React, ES modules, multi-page)
 *  - sw:      background service worker → single self-contained IIFE
 *  - content: content script → single self-contained IIFE (content scripts
 *             cannot be ES modules, so no shared chunks allowed)
 * Static files (manifest, rules, icons) are copied by scripts/copy-static.mjs.
 */
export default defineConfig(({ mode }) => {
  const common = {
    resolve: { alias: { "@": resolve(__dirname, "src") } },
  };

  if (mode === "sw") {
    return {
      ...common,
      build: {
        outDir: "dist",
        emptyOutDir: false,
        sourcemap: false,
        lib: {
          entry: resolve(__dirname, "src/background/service-worker.ts"),
          formats: ["iife"] as const,
          name: "NoNoiseSW",
          fileName: () => "service-worker.js",
        },
      },
    };
  }

  if (mode === "content") {
    return {
      ...common,
      build: {
        outDir: "dist",
        emptyOutDir: false,
        sourcemap: false,
        lib: {
          entry: resolve(__dirname, "src/content/cleaner.ts"),
          formats: ["iife"] as const,
          name: "NoNoiseContent",
          fileName: () => "content.js",
        },
      },
    };
  }

  // mode === "ui" (default)
  return {
    ...common,
    plugins: [react()],
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: false,
      rollupOptions: {
        input: {
          popup: resolve(__dirname, "src/popup/popup.html"),
          options: resolve(__dirname, "src/options/options.html"),
        },
      },
    },
  };
});
