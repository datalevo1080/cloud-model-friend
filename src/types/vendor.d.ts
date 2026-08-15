declare module "gifsicle-wasm-browser";
declare module "gifenc" {
  export type GifencPalette = number[][];
  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: {
      format?: "rgb565" | "rgb444" | "rgba4444";
      oneBitAlpha?: boolean | number;
      clearAlpha?: boolean;
      clearAlphaThreshold?: number;
      clearAlphaColor?: number;
    },
  ): GifencPalette;
  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: GifencPalette,
    format?: "rgb565" | "rgb444" | "rgba4444",
  ): Uint8Array;
  export function GIFEncoder(options?: { auto?: boolean; initialCapacity?: number }): {
    writeFrame: (
      index: Uint8Array,
      width: number,
      height: number,
      options?: {
        palette?: GifencPalette;
        first?: boolean;
        transparent?: boolean;
        transparentIndex?: number;
        delay?: number;
        repeat?: number;
        dispose?: number;
      },
    ) => void;
    finish: () => void;
    bytes: () => Uint8Array;
    reset: () => void;
  };
}
declare module "gifuct-js" {
  export function parseGIF(data: ArrayBuffer | Uint8Array): {
    lsd: { width: number; height: number };
  };
  export function decompressFrames(
    gif: ReturnType<typeof parseGIF>,
    buildImagePatches: boolean,
  ): {
    dims: { top: number; left: number; width: number; height: number };
    patch: Uint8ClampedArray;
    delay: number;
    disposalType: number;
  }[];
}
