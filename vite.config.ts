// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Static pre-rendering: every public route ships complete crawlable HTML.
    prerender: { enabled: true, crawlLinks: true, failOnError: false },
    pages: [
      { path: "/", prerender: { enabled: true } },
      { path: "/compress-gif-for-discord", prerender: { enabled: true } },
      { path: "/gif-cropper", prerender: { enabled: true } },
      { path: "/gif-resizer", prerender: { enabled: true } },
      { path: "/png-to-gif", prerender: { enabled: true } },
      { path: "/gif-to-png", prerender: { enabled: true } },
      { path: "/about", prerender: { enabled: true } },
      { path: "/privacy", prerender: { enabled: true } },
      { path: "/terms", prerender: { enabled: true } },
      { path: "/contact", prerender: { enabled: true } },
    ],
  },
});
