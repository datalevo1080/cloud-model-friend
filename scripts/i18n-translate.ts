/**
 * Translates src/i18n/auto/en.json into every locale dictionary using the
 * Lovable AI gateway. Only missing keys are sent, so re-runs are cheap.
 *
 * Run: bun scripts/i18n-translate.ts [locale ...]
 */
import { readFileSync, writeFileSync } from "node:fs";

const MODEL = process.env["I18N_MODEL"] ?? "google/gemini-2.5-flash";
const KEY = process.env["LOVABLE_API_KEY"];
if (!KEY) throw new Error("LOVABLE_API_KEY missing");

const LANGS: Record<string, string> = {
  fr: "French (France)",
  ja: "Japanese",
  es: "Spanish (neutral Latin American)",
  pt: "Brazilian Portuguese",
  id: "Indonesian",
};

const CHUNK = 40;
const CONCURRENCY = 4;

/** Which dictionary family to translate: "auto" = extracted prose, "ui" = hand-keyed strings. */
const SET = (process.env["I18N_SET"] ?? "auto") === "ui" ? "ui" : "auto";
const DIR = SET === "ui" ? "src/i18n/locales" : "src/i18n/auto";

const en: Record<string, string> = JSON.parse(readFileSync(`${DIR}/en.json`, "utf8"));
const targets = process.argv.slice(2).filter((l) => l in LANGS);
const locales = targets.length ? targets : Object.keys(LANGS);

function systemPrompt(lang: string) {
  return `You translate UI and SEO copy for ZipGIF, a browser-based GIF toolkit, from English into ${lang}.

Rules:
- Natural phrasing a native speaker would write. Never word-for-word machine translation.
- Same tone as the source: short sentences, concrete, no hype, no exclamation marks.
- Use the search terms natives actually type for these tools (e.g. French "compresseur GIF", not a calque).
- NEVER translate: the brand name "ZipGIF", the author name "Shafiullah Tareen", measured numbers, file sizes, units, percentages, command-line flags, file extensions, URLs, email addresses, and technical product names (Discord, Gifsicle, WebAssembly, Twitch, Slack, GIF, PNG, MP4, WebP).
- Keep punctuation, capitalisation style and any trailing/leading dashes or arrows.
- If a string is not prose (a flag string, a number, a code snippet), return it unchanged.
- Translate dates into the local date format.

Input is a JSON object of id -> English string. Reply with ONLY a JSON object of the same ids -> translated string. No markdown, no commentary.`;
}

async function translateChunk(lang: string, chunk: [string, string][]): Promise<Record<string, string>> {
  const payload: Record<string, string> = {};
  chunk.forEach(([, value], i) => (payload[String(i)] = value));

  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt(lang) },
          { role: "user", content: JSON.stringify(payload) },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    const raw = json.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, "")) as Record<string, string>;
    const out: Record<string, string> = {};
    chunk.forEach(([key], i) => {
      const value = parsed[String(i)];
      if (typeof value === "string" && value.trim()) out[key] = value.trim();
    });
    return out;
  }
  throw new Error("gateway retries exhausted");
}

for (const locale of locales) {
  const path = `${DIR}/${locale}.json`;
  let existing: Record<string, string> = {};
  try {
    existing = JSON.parse(readFileSync(path, "utf8")) as Record<string, string>;
  } catch {
    existing = {};
  }
  const missing = Object.entries(en).filter(([key]) => !existing[key]);
  console.log(`[${SET}] ${locale}: ${missing.length} missing of ${Object.keys(en).length}`);

  const chunks: [string, string][][] = [];
  for (let i = 0; i < missing.length; i += CHUNK) chunks.push(missing.slice(i, i + CHUNK));
  if (!chunks.length) {
    const ordered: Record<string, string> = {};
    for (const key of Object.keys(en)) if (existing[key]) ordered[key] = existing[key];
    writeFileSync(path, `${JSON.stringify(ordered, null, 2)}\n`);
  }

  for (let i = 0; i < chunks.length; i += CONCURRENCY) {
    const batch = chunks.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map((c) => translateChunk(LANGS[locale]!, c)));
    for (const r of results) Object.assign(existing, r);
    const ordered: Record<string, string> = {};
    for (const key of Object.keys(en)) if (existing[key]) ordered[key] = existing[key];
    writeFileSync(path, `${JSON.stringify(ordered, null, 2)}\n`);
    console.log(`${locale}: ${Object.keys(ordered).length}/${Object.keys(en).length}`);
  }
}
