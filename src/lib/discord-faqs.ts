/** Visible FAQ copy for /compress-gif-for-discord. The FAQPage JSON-LD is generated
 *  from this same array so the structured data always matches the page. */
export const discordFaqs = [
  {
    q: "How do I compress a GIF to under 10 MB for Discord?",
    a: "Pick the Under 10 MB Upload preset and drop your GIF in. The tool tries optimization first, then gradually reduces colours, size and frames until the file fits. Everything runs in your browser, so nothing is uploaded anywhere.",
  },
  {
    q: "How do I make a GIF under 256 KB for a Discord emoji?",
    a: "Use the Under 256 KB Emoji preset. Discord also caps emoji at 128×128 pixels, so the preset resizes to that too. Most GIFs fit after colour reduction and a little lossy compression.",
  },
  {
    q: "What if my GIF still won't reach 256 KB?",
    a: "Long or photographic GIFs sometimes can't get that small without falling apart. Try trimming the clip shorter with the GIF trimmer or cropping to just the action with the GIF cropper, then compress again.",
  },
  {
    q: "Are my GIFs uploaded to a server?",
    a: "No. Compression happens on your own device with a WebAssembly build of Gifsicle. Your file never leaves your browser, and the tool works offline after the first visit.",
  },
  {
    q: "Does compressing a GIF for Discord reduce its quality?",
    a: "It can, but the tool always starts with invisible savings and only increases compression until the target is met. Use the compare slider to check the result before you download it.",
  },
  {
    q: "Is this Discord GIF compressor free?",
    a: "Yes. No account, no signup, no watermark and no daily limit. Because the work happens on your device instead of our servers, we can keep it free.",
  },
];
