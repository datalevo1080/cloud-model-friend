export type CompressMethod = {
  /** lossy LZW level, 5-200 */
  lossy: number;
  /** palette size, 0 = keep */
  colors: 0 | 32 | 64 | 128 | 256;
  /** 1 = keep all frames, 2 = drop every 2nd, 3 = drop every 3rd */
  frameStep: 1 | 2 | 3;
  /** drop detected duplicate frames */
  dropDuplicates: boolean;
  /** optimize transparency (-O3 vs -O1) */
  optimizeTransparency: boolean;
};

export type GifAnalysis = {
  width: number;
  height: number;
  frameCount: number;
  fps: number;
  durationMs: number;
  /** 0..1 share of frames that are near-identical to the previous one */
  duplicateShare: number;
  /** indices of frames considered duplicates of their predecessor */
  duplicateIndices: number[];
  /** 0..1 estimated palette density (unique colors / 256) */
  paletteDensity: number;
  /** 0..1 average pixel change between consecutive frames */
  motionAverage: number;
  /** 0..1 variance of motion between frames */
  motionVariance: number;
  /** the file's frame data ended early — analysed on a best-effort basis */
  truncated?: boolean;
  /** only header metadata was recoverable */
  partial?: boolean;

};

export type SmartPlan = {
  method: CompressMethod;
  explanation: string;
};

export type FileStatus = "ready" | "analyzing" | "queued" | "processing" | "done" | "error";

export type GifItem = {
  id: string;
  file: File;
  url: string;
  size: number;
  status: FileStatus;
  progress: number;
  statusText: string;
  analysis?: GifAnalysis;
  plan?: SmartPlan;
  resultBlob?: Blob;
  resultUrl?: string;
  resultSize?: number;
  error?: string;
  /** non-blocking note shown on the card (memory hints, truncated files) */
  warning?: string;
  /** compression made it bigger, so the original was kept */
  keptOriginal?: boolean;
};


export const MAX_FILES = 20;
export const MAX_BYTES = 200 * 1024 * 1024;
