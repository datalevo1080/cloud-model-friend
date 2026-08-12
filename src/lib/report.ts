import { savingsPercent } from "./format";
import type { GifItem } from "./gif-types";

const escape = (value: string | number) => {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const REPORT_HEADERS = [
  "File name",
  "Original size (bytes)",
  "Compressed size (bytes)",
  "Savings (%)",
  "Bytes saved",
  "Mode",
  "Confidence",
  "Notes",
] as const;

/** Builds the CSV report for every finished GIF in the queue. */
export function buildCsvReport(items: GifItem[]): string {
  const rows = items
    .filter((i) => i.status === "done" && i.resultSize !== undefined)
    .map((i) => [
      i.file.name,
      i.size,
      i.resultSize!,
      savingsPercent(i.size, i.resultSize!),
      Math.max(0, i.size - i.resultSize!),
      i.reportMode ?? "—",
      i.reportConfidence ?? "—",
      i.keptOriginal ? "Already optimized — original kept" : i.statusText,
    ]);

  return [REPORT_HEADERS, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
}

export function downloadCsvReport(items: GifItem[]): boolean {
  const csv = buildCsvReport(items);
  if (csv.split("\r\n").length < 2) return false;
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zipgif-report.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return true;
}
