# Fix Hostinger prerender server handler

## Changes
- Replace the dynamic import of the configured server entry with TanStack Start’s canonical request handler API, avoiding the circular/self-referential module shape produced during Hostinger’s Node ESM build.
- Preserve the existing error page, canonical-domain redirect, and tag-manager injection.
- Keep both named and default `fetch` exports so the prerender plugin and deployed runtime can call the same handler.

## Verification
- Inspect the generated server bundle to confirm its exported `fetch` is callable.
- Run the production build and confirm all configured pages prerender without `handler.fetch` or `server.fetch` errors.
