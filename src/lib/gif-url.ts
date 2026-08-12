/**
 * Fetches a GIF from a direct URL entirely client-side.
 * The request goes straight from the visitor's browser to the image host —
 * ZipGIF has no server and never sees the URL or the bytes.
 */
import { MAX_BYTES } from "./gif-types";

export class UrlFetchError extends Error {}

const GIF_SIGS = ["GIF87a", "GIF89a"];

function fileNameFromUrl(url: URL): string {
  const last = url.pathname.split("/").filter(Boolean).pop() ?? "image.gif";
  const clean = decodeURIComponent(last).replace(/[^\w.-]+/g, "-").slice(0, 80);
  return /\.gif$/i.test(clean) ? clean : `${clean || "image"}.gif`;
}

export async function fetchGifFromUrl(raw: string, signal?: AbortSignal): Promise<File> {
  const trimmed = raw.trim();
  if (!trimmed) throw new UrlFetchError("Paste a direct link to a .gif file first.");

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    throw new UrlFetchError("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UrlFetchError("Only http and https links can be fetched.");
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), { mode: "cors", credentials: "omit", signal: signal ?? null });
  } catch {
    throw new UrlFetchError(
      "Couldn't fetch that link from your browser. The host blocks cross-origin requests (CORS) — download the GIF and drop the file in instead.",
    );
  }
  if (!res.ok) {
    throw new UrlFetchError(`The link returned HTTP ${res.status}. Check that it still works.`);
  }

  const declared = Number(res.headers.get("content-length") ?? 0);
  if (declared && declared > MAX_BYTES) {
    throw new UrlFetchError("That GIF is over the 200 MB limit.");
  }

  const buffer = await res.arrayBuffer();
  if (buffer.byteLength === 0) throw new UrlFetchError("The link returned an empty file.");
  if (buffer.byteLength > MAX_BYTES) {
    throw new UrlFetchError("That GIF is over the 200 MB limit.");
  }

  const sig = String.fromCharCode(...new Uint8Array(buffer.slice(0, 6)));
  if (!GIF_SIGS.includes(sig)) {
    throw new UrlFetchError(
      "That link isn't a GIF image. Use a direct link that ends in .gif, not a page that shows one.",
    );
  }

  return new File([buffer], fileNameFromUrl(url), { type: "image/gif" });
}
