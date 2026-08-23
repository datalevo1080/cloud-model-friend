/**
 * One-command i18n sync.
 *
 *   bun scripts/i18n-sync.ts            # every locale
 *   bun scripts/i18n-sync.ts fr ja      # only these locales
 *
 * Steps:
 *   1. extract  — walk the codebase and refresh src/i18n/auto/en.json
 *   2. ui       — fill src/i18n/locales/<locale>.json (hand-keyed chrome + meta)
 *   3. auto     — fill src/i18n/auto/<locale>.json (extracted page prose)
 *
 * Only missing keys are sent to the gateway, so re-runs after a content edit
 * are cheap. Safe to run as often as you like.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const locales = process.argv.slice(2);

function run(label: string, args: string[], env: Record<string, string> = {}) {
  console.log(`\n=== ${label} ===`);
  const res = spawnSync("bun", args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  if (res.status !== 0) {
    console.error(`${label} failed with code ${res.status}`);
    process.exit(res.status ?? 1);
  }
}

run("extract", ["scripts/i18n-extract.ts"]);
run("translate: ui strings", ["scripts/i18n-translate.ts", ...locales], { I18N_SET: "ui" });
run("translate: page prose", ["scripts/i18n-translate.ts", ...locales], { I18N_SET: "auto" });

console.log("\n=== coverage ===");
for (const set of ["locales", "auto"] as const) {
  const en = Object.keys(
    JSON.parse(readFileSync(`src/i18n/${set}/en.json`, "utf8")) as Record<string, string>,
  ).length;
  const row = ["fr", "ja", "es", "pt", "id"].map((l) => {
    const n = Object.keys(
      JSON.parse(readFileSync(`src/i18n/${set}/${l}.json`, "utf8")) as Record<string, string>,
    ).length;
    return `${l} ${n}/${en}`;
  });
  console.log(`${set.padEnd(8)} ${row.join("  ")}`);
}
