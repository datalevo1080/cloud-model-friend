/**
 * Extracts every user-facing English string from the page/component sources
 * into src/i18n/auto/en.json. Run: bun scripts/i18n-extract.ts
 *
 * Sources of truth:
 *  - JSX text nodes (normalised exactly the way the JSX transform normalises them)
 *  - text-bearing JSX attributes (placeholder, title, alt, aria-label, label)
 *  - string literals in content objects (q, a, label, title, description, ...)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const ROOTS = ["src/pages", "src/components", "src/routes"];
const SKIP = /\/(ui|__tests__)\//;

const ATTRS = new Set(["placeholder", "title", "alt", "aria-label", "label", "aria-placeholder"]);
const OBJECT_KEYS = new Set([
  "q",
  "a",
  "label",
  "title",
  "description",
  "text",
  "body",
  "heading",
  "hint",
  "tip",
  "note",
  "answer",
  "question",
  "caption",
  "summary",
  "eyebrow",
  "blurb",
  "detail",
  "name",
  "step",
  "value",
]);

function walkFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkFiles(full, out);
    } else if (/\.tsx?$/.test(full) && !SKIP.test(`/${full}/`)) {
      out.push(full);
    }
  }
  return out;
}

const ENTITIES: Record<string, string> = {
  "&nbsp;": "\u00a0",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&mdash;": "\u2014",
  "&ndash;": "\u2013",
  "&times;": "\u00d7",
  "&hellip;": "\u2026",
};

function decodeEntities(value: string): string {
  return value.replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m] ?? m);
}

/** Same normalisation the JSX transform applies to JSXText. */
function normaliseJsxText(raw: string): string | null {
  const lines = raw.split("\n");
  const kept: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]!;
    if (i > 0) line = line.replace(/^[ \t]+/, "");
    if (i < lines.length - 1) line = line.replace(/[ \t]+$/, "");
    if (line) kept.push(line);
  }
  const joined = decodeEntities(kept.join(" "));
  return joined.trim() ? joined : null;
}

function translatable(value: string): boolean {
  const v = value.trim();
  if (v.length < 3) return false;
  if (!/[A-Za-z]/.test(v)) return false;
  if (/^[A-Z_]+$/.test(v)) return false;
  if (/^https?:|^\/|^#|^[a-z-]+\/[a-z-]+$/i.test(v)) return false;
  if (/^[a-z0-9.-]+@[a-z0-9.-]+$/i.test(v)) return false;
  return true;
}

const found = new Map<string, string[]>();
const add = (value: string, file: string) => {
  const key = value.trim();
  if (!translatable(key)) return;
  const list = found.get(key) ?? [];
  if (!list.includes(file)) list.push(file);
  found.set(key, list);
};

for (const root of ROOTS) {
  for (const file of walkFiles(root)) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );

    const visit = (node: ts.Node) => {
      if (ts.isJsxText(node)) {
        const text = normaliseJsxText(node.text);
        if (text) add(text, file);
      } else if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name)) {
        if (ATTRS.has(node.name.text) && node.initializer) {
          if (ts.isStringLiteral(node.initializer)) add(node.initializer.text, file);
          else if (
            ts.isJsxExpression(node.initializer) &&
            node.initializer.expression &&
            ts.isStringLiteral(node.initializer.expression)
          ) {
            add(node.initializer.expression.text, file);
          }
        }
      } else if (ts.isPropertyAssignment(node)) {
        const name = ts.isIdentifier(node.name)
          ? node.name.text
          : ts.isStringLiteral(node.name)
            ? node.name.text
            : "";
        if (OBJECT_KEYS.has(name) && ts.isStringLiteral(node.initializer)) {
          add(node.initializer.text, file);
        }
      }
      if (ts.isJsxExpression(node) && node.expression && !ts.isJsxAttribute(node.parent)) {
        const collect = (inner: ts.Node) => {
          if (ts.isCallExpression(inner)) {
            const callee = inner.expression.getText(source);
            if (/^(cn|clsx|cva|t|useT)$/.test(callee)) return;
          }
          if (ts.isStringLiteral(inner)) add(inner.text, file);
          ts.forEachChild(inner, collect);
        };
        collect(node.expression);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
}

const sorted = [...found.keys()].sort((a, b) => a.localeCompare(b));
const dict: Record<string, string> = {};
for (const key of sorted) dict[key] = key;

writeFileSync("src/i18n/auto/en.json", `${JSON.stringify(dict, null, 2)}\n`);
console.log(`extracted ${sorted.length} strings`);
