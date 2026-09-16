import { useState } from "react";
import { cn } from "@/lib/utils";
import { Compressor } from "@/components/tool/compressor";
import { TargetFit } from "@/components/tool/target-fit";

type Mode = "manual" | "target";

/**
 * Wraps the existing manual compressor with an optional target-size mode.
 * Both modes run entirely in the browser on the same WASM engine.
 */
export function CompressorModes() {
  const [mode, setMode] = useState<Mode>("manual");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Compression mode"
        className="mx-auto mb-5 flex w-full max-w-md rounded-xl border border-border bg-card p-1"
      >
        {(
          [
            ["manual", "Manual mode"],
            ["target", "Target file size"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            id={`mode-tab-${id}`}
            aria-selected={mode === id}
            aria-controls={`mode-panel-${id}`}
            onClick={() => setMode(id)}
            className={cn(
              "min-h-11 flex-1 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              mode === id ? "bg-primary text-primary-foreground" : "hover:bg-accent",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="mode-panel-manual"
        aria-labelledby="mode-tab-manual"
        hidden={mode !== "manual"}
      >
        <Compressor />
      </div>
      <div
        role="tabpanel"
        id="mode-panel-target"
        aria-labelledby="mode-tab-target"
        hidden={mode !== "target"}
        className="rounded-2xl border border-border bg-card p-5 sm:p-7"
      >
        {mode === "target" && <TargetFit />}
      </div>
    </div>
  );
}
