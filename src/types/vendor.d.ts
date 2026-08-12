declare module "gifsicle-wasm-browser";
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
