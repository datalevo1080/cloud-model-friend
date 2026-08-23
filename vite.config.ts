// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load all env vars (including non-VITE_ server secrets) into process.env for
// server routes. These are NOT injected into the client bundle.
const serverEnv = loadEnv(process.env["NODE_ENV"] ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        // Route every JSX text node through the auto-translation dictionary.
        "react/jsx-dev-runtime": path.resolve(__dirname, "src/i18n/jsx-dev-runtime.ts"),
        "react/jsx-runtime": path.resolve(__dirname, "src/i18n/jsx-runtime.ts"),
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Static pre-rendering: every public route ships complete crawlable HTML.
    prerender: { enabled: true, crawlLinks: true, failOnError: false },
    pages: [
      { path: "/", prerender: { enabled: true } },
      { path: "/gif-compressor", prerender: { enabled: true } },
      { path: "/compress-gif-for-discord", prerender: { enabled: true } },
      { path: "/gif-cropper", prerender: { enabled: true } },
      { path: "/gif-resizer", prerender: { enabled: true } },
      { path: "/gif-speed-changer", prerender: { enabled: true } },
      { path: "/gif-splitter", prerender: { enabled: true } },
      { path: "/gif-trimmer", prerender: { enabled: true } },
      { path: "/png-to-gif", prerender: { enabled: true } },
      { path: "/gif-to-png", prerender: { enabled: true } },
      { path: "/about", prerender: { enabled: true } },
      { path: "/contact", prerender: { enabled: true } },
      { path: "/privacy", prerender: { enabled: true } },
      { path: "/terms", prerender: { enabled: true } },
      { path: "/id", prerender: { enabled: true } },
      { path: "/id/gif-compressor", prerender: { enabled: true } },
      { path: "/id/compress-gif-for-discord", prerender: { enabled: true } },
      { path: "/id/gif-cropper", prerender: { enabled: true } },
      { path: "/id/gif-resizer", prerender: { enabled: true } },
      { path: "/id/gif-speed-changer", prerender: { enabled: true } },
      { path: "/id/gif-splitter", prerender: { enabled: true } },
      { path: "/id/gif-trimmer", prerender: { enabled: true } },
      { path: "/id/png-to-gif", prerender: { enabled: true } },
      { path: "/id/gif-to-png", prerender: { enabled: true } },
      { path: "/id/about", prerender: { enabled: true } },
      { path: "/id/contact", prerender: { enabled: true } },
      { path: "/id/privacy", prerender: { enabled: true } },
      { path: "/id/terms", prerender: { enabled: true } },
      { path: "/fr", prerender: { enabled: true } },
      { path: "/fr/gif-compressor", prerender: { enabled: true } },
      { path: "/fr/compress-gif-for-discord", prerender: { enabled: true } },
      { path: "/fr/gif-cropper", prerender: { enabled: true } },
      { path: "/fr/gif-resizer", prerender: { enabled: true } },
      { path: "/fr/gif-speed-changer", prerender: { enabled: true } },
      { path: "/fr/gif-splitter", prerender: { enabled: true } },
      { path: "/fr/gif-trimmer", prerender: { enabled: true } },
      { path: "/fr/png-to-gif", prerender: { enabled: true } },
      { path: "/fr/gif-to-png", prerender: { enabled: true } },
      { path: "/fr/about", prerender: { enabled: true } },
      { path: "/fr/contact", prerender: { enabled: true } },
      { path: "/fr/privacy", prerender: { enabled: true } },
      { path: "/fr/terms", prerender: { enabled: true } },
      { path: "/ja", prerender: { enabled: true } },
      { path: "/ja/gif-compressor", prerender: { enabled: true } },
      { path: "/ja/compress-gif-for-discord", prerender: { enabled: true } },
      { path: "/ja/gif-cropper", prerender: { enabled: true } },
      { path: "/ja/gif-resizer", prerender: { enabled: true } },
      { path: "/ja/gif-speed-changer", prerender: { enabled: true } },
      { path: "/ja/gif-splitter", prerender: { enabled: true } },
      { path: "/ja/gif-trimmer", prerender: { enabled: true } },
      { path: "/ja/png-to-gif", prerender: { enabled: true } },
      { path: "/ja/gif-to-png", prerender: { enabled: true } },
      { path: "/ja/about", prerender: { enabled: true } },
      { path: "/ja/contact", prerender: { enabled: true } },
      { path: "/ja/privacy", prerender: { enabled: true } },
      { path: "/ja/terms", prerender: { enabled: true } },
      { path: "/es", prerender: { enabled: true } },
      { path: "/es/gif-compressor", prerender: { enabled: true } },
      { path: "/es/compress-gif-for-discord", prerender: { enabled: true } },
      { path: "/es/gif-cropper", prerender: { enabled: true } },
      { path: "/es/gif-resizer", prerender: { enabled: true } },
      { path: "/es/gif-speed-changer", prerender: { enabled: true } },
      { path: "/es/gif-splitter", prerender: { enabled: true } },
      { path: "/es/gif-trimmer", prerender: { enabled: true } },
      { path: "/es/png-to-gif", prerender: { enabled: true } },
      { path: "/es/gif-to-png", prerender: { enabled: true } },
      { path: "/es/about", prerender: { enabled: true } },
      { path: "/es/contact", prerender: { enabled: true } },
      { path: "/es/privacy", prerender: { enabled: true } },
      { path: "/es/terms", prerender: { enabled: true } },
      { path: "/pt", prerender: { enabled: true } },
      { path: "/pt/gif-compressor", prerender: { enabled: true } },
      { path: "/pt/compress-gif-for-discord", prerender: { enabled: true } },
      { path: "/pt/gif-cropper", prerender: { enabled: true } },
      { path: "/pt/gif-resizer", prerender: { enabled: true } },
      { path: "/pt/gif-speed-changer", prerender: { enabled: true } },
      { path: "/pt/gif-splitter", prerender: { enabled: true } },
      { path: "/pt/gif-trimmer", prerender: { enabled: true } },
      { path: "/pt/png-to-gif", prerender: { enabled: true } },
      { path: "/pt/gif-to-png", prerender: { enabled: true } },
      { path: "/pt/about", prerender: { enabled: true } },
      { path: "/pt/contact", prerender: { enabled: true } },
      { path: "/pt/privacy", prerender: { enabled: true } },
      { path: "/pt/terms", prerender: { enabled: true } },
    ],
  },
});
