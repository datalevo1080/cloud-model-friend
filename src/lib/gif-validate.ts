/** Client-side file validation: magic bytes, size limits, folder expansion. */

export type SkipReason =
  | "not-gif"
  | "too-large"
  | "empty"
  | "too-many"
  | "duplicate"
  | "unreadable";

export type SkippedFile = { name: string; reason: SkipReason; detail: string };

const GIF87A = "GIF87a";
const GIF89A = "GIF89a";

/**
 * Reads the first 6 bytes and checks for a real GIF header. Extensions lie —
 * a .png renamed to .gif would otherwise crash the decoder.
 */
export async function hasGifMagicBytes(file: File): Promise<boolean> {
  try {
    const head = await file.slice(0, 6).arrayBuffer();
    if (head.byteLength < 6) return false;
    const sig = String.fromCharCode(...new Uint8Array(head));
    return sig === GIF87A || sig === GIF89A;
  } catch {
    return false;
  }
}

type FsEntry = {
  isFile: boolean;
  isDirectory: boolean;
  file?: (cb: (f: File) => void, err: (e: unknown) => void) => void;
  createReader?: () => { readEntries: (cb: (e: FsEntry[]) => void, err: (e: unknown) => void) => void };
};

function entryFile(entry: FsEntry): Promise<File | null> {
  return new Promise((resolve) => {
    if (!entry.file) return resolve(null);
    entry.file(
      (f) => resolve(f),
      () => resolve(null),
    );
  });
}

async function readDir(entry: FsEntry, depth: number, out: File[]): Promise<void> {
  const reader = entry.createReader?.();
  if (!reader || depth > 4) return;
  // readEntries returns at most 100 entries per call.
  for (;;) {
    const batch = await new Promise<FsEntry[]>((resolve) => {
      reader.readEntries(
        (e) => resolve(e),
        () => resolve([]),
      );
    });
    if (!batch.length) return;
    for (const child of batch) await walkEntry(child, depth + 1, out);
  }
}

async function walkEntry(entry: FsEntry, depth: number, out: File[]): Promise<void> {
  if (entry.isFile) {
    const f = await entryFile(entry);
    if (f) out.push(f);
  } else if (entry.isDirectory) {
    await readDir(entry, depth, out);
  }
}

/**
 * Flattens a drop into a plain file list, walking dropped folders where the
 * browser supports it and falling back to DataTransfer.files elsewhere.
 */
export async function filesFromDataTransfer(dt: DataTransfer): Promise<File[]> {
  const items = Array.from(dt.items ?? []);
  const entries = items
    .map((i) =>
      (i as DataTransferItem & { webkitGetAsEntry?: () => FsEntry | null }).webkitGetAsEntry?.(),
    )
    .filter(Boolean) as FsEntry[];

  if (!entries.length) return Array.from(dt.files ?? []);

  const out: File[] = [];
  for (const entry of entries) {
    try {
      await walkEntry(entry, 0, out);
    } catch {
      /* skip unreadable entries */
    }
  }
  return out.length ? out : Array.from(dt.files ?? []);
}

export function skipMessage(s: SkippedFile): string {
  return `"${s.name}" — ${s.detail}`;
}
