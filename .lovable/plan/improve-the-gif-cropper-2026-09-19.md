# Improve the GIF cropper

## What will change
- Keep the existing `/gif-cropper` page design, URL, metadata, and long-form copy intact.
- Update crop choices to Freeform, Square 1:1, Circle Preview, Discord Emoji, Profile Picture, 16:9, and 4:3.
- Make Circle Preview show a round mask in the editor while clearly exporting a normal rectangular GIF.
- Keep exact X, Y, width, and height fields synchronized with drag and touch movement, with strict source-bound clamping.
- Add one-step undo while preserving the current reset behavior.
- Show original and completed crop dimensions and measured file sizes, plus the existing visual comparison and download.
- Add concise contextual links to the GIF resizer and GIF compressor without rewriting page copy.

## Technical details
- Extend crop preset definitions with preview mode and optional recommended square dimensions; presets will never upscale or pad the source.
- Track the previous crop rectangle before preset, auto-trim, reset, field, keyboard, or drag changes so Undo restores the last committed selection.
- Preserve the existing browser-only GIF crop pipeline, which expands optimized frames before cropping and retains animation timing and transparency.
- Keep pointer controls touch-safe and verify the crop remains within source bounds.

## Verification
- Run focused crop utility tests and check the project build signal.
- Exercise animated, transparent, and small GIFs in the browser.
- Verify every preset and exact field on desktop, then simulate touch dragging on a mobile viewport.
- Confirm completed outputs show measured rectangular dimensions and file sizes, including Circle Preview.
