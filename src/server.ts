import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

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

    const gtmHeadScript = `<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','${GTM_ID}');</script>\n<!-- End Google Tag Manager -->`;

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

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);

      const injected = await maybeInjectGtm(response);
      return await normalizeCatastrophicSsrResponse(injected);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
