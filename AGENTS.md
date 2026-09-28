<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Build the custom SSR entry with `createStartHandler(defaultStreamHandler)` directly; importing `@tanstack/react-start/server-entry` there can self-resolve in Node ESM prerender builds.

## Server redirects
- Locale URL cleanup lives in `localePathRedirect` (src/server.ts): /en/* 301s to the root English URL, trailing-slash locale URLs 301 to the slash-less form, and the handler must no-op when the URL is already clean (a self-301 is a redirect loop).
