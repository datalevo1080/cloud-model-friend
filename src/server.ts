import "./lib/error-capture";

import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// Build the framework request handler directly. Dynamically importing
// `@tanstack/react-start/server-entry` from a configured custom server entry
// can resolve back to this bundled module in Node ESM, leaving handler.fetch
// undefined (or creating a recursive handler) during prerendering.
const handleStartRequest = createStartHandler(defaultStreamHandler);

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const GTM_ID = 'GTM-TQZ4N4BM'

async function maybeInjectGtm(response: Response): Promise<Response> {
  try {
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) return response;
    // Only inject for successful HTML responses
    if (response.status >= 400) return response;

    const html = await response.clone().text();
    // If GTM already present, skip
    if (html.includes(GTM_ID)) return response;

    // Google Tag Manager, deferred until the page is idle or the visitor
    // interacts. Keeps ~110 KB of third-party JS off the critical path.
    const gtmHeadScript = `<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var loaded=false;function load(){if(loaded)return;loaded=true;var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);}['pointerdown','keydown','touchstart','scroll'].forEach(function(e){w.addEventListener(e,load,{once:true,passive:true})});function later(){w.setTimeout(load,9000)}if(d.readyState==='complete'){later()}else{w.addEventListener('load',later,{once:true})}})(window,document,'script','dataLayer','${GTM_ID}');</script>\n<!-- End Google Tag Manager -->`;

    const noscriptHtml = `<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id=${GTM_ID}\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->`;

    let newHtml = html;
    if (newHtml.includes('</head>')) {
      newHtml = newHtml.replace('</head>', `${gtmHeadScript}\n</head>`);
    }

    // insert noscript right after the opening <body ...>
    if (/<body([^>]*)>/i.test(newHtml)) {
      newHtml = newHtml.replace(/<body([^>]*)>/i, `<body$1>\n${noscriptHtml}`);
    }

    // Preserve headers but remove content-length to avoid mismatch
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(newHtml, { status: response.status, headers });
  } catch (err) {
    // If anything goes wrong, don't break the response — return original
    console.error('failed to inject GTM:', err);
    return response;
  }
}

/**
 * One canonical origin: https://zipgif.com. Any www request gets a single
 * permanent hop to the apex, path and query preserved. No chains, no JS.
 */
function canonicalHostRedirect(request: Request): Response | undefined {
  const url = new URL(request.url);
  if (url.hostname !== "www.zipgif.com") return undefined;
  url.hostname = "zipgif.com";
  url.protocol = "https:";
  url.port = "";
  return new Response(null, { status: 301, headers: { location: url.toString() } });
}

const LOCALE_PREFIX = /^\/(en|id|fr|ja|es|pt)(\/.*|$)/;

/**
 * English lives at the root (never /en), so /en and /en/* are dead URLs that
 * Google crawled and reported as 404s in Search Console. Localized pages also
 * 307'd on trailing slashes, which search engines treat as temporary. Both now
 * get one permanent 301 hop to the clean, canonical URL, path and query kept.
 */
function localePathRedirect(request: Request): Response | undefined {
  const url = new URL(request.url);
  const match = LOCALE_PREFIX.exec(url.pathname);
  if (!match) return undefined;

  const [, locale, rest = ""] = match;
  let cleanPath: string;
  if (locale === "en") {
    // /en -> / and /en/gif-compressor -> /gif-compressor
    cleanPath = rest && rest !== "/" ? rest : "/";
  } else if (rest === "" || rest === "/") {
    cleanPath = `/${locale}`;
  } else if (rest.endsWith("/")) {
    cleanPath = `/${locale}${rest.slice(0, -1)}`;
  } else {
    return undefined; // already a clean, live localized URL
  }

  if (cleanPath === url.pathname) return undefined; // never redirect to yourself
  url.pathname = cleanPath;
  return new Response(null, { status: 301, headers: { location: url.toString() } });
}

/** Hashed build files never change, so browsers may keep them for a year. */
function withCacheHeaders(request: Request, response: Response): Response {
  const path = new URL(request.url).pathname;
  if (response.status !== 200 || !/^\/assets\/|\.woff2$/.test(path)) return response;
  const headers = new Headers(response.headers);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(response.body, { status: 200, headers });
}

// Named export AND default export: the TanStack Start prerender plugin reads
// `server.fetch` off the module namespace, while the runtime uses the default
// export. Providing only one of them breaks the other.
export async function fetch(request: Request, env: unknown, ctx: unknown) {
  try {
      const redirect = canonicalHostRedirect(request) ?? localePathRedirect(request);
      if (redirect) return redirect;

      const response = withCacheHeaders(request, await handleStartRequest(request));

      const injected = await maybeInjectGtm(response);
      return await normalizeCatastrophicSsrResponse(injected);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
}

export default { fetch };
