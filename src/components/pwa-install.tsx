import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "zipgif-install-dismissed";

/**
 * Install prompt for the ZipGIF PWA. Compression still runs entirely in the
 * browser once installed — the app just gets its own window and an offline UI.
 */
export function PwaInstall() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPromptEvent);
      setHidden(false);
    };
    const onInstalled = () => {
      setPrompt(null);
      setHidden(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (hidden || !prompt) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setHidden(true);
  };

  return (
    <div
      role="region"
      aria-label="Install ZipGIF"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-lift sm:left-auto sm:right-4 sm:mx-0"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Download className="size-5" aria-hidden="true" />
      </span>
      <p className="min-w-0 flex-1 text-sm">
        <span className="block font-semibold">Install ZipGIF</span>
        <span className="block text-muted-foreground">
          Works offline and opens in its own window. GIFs still never leave your device.
        </span>
      </p>
      <button
        type="button"
        onClick={() => {
          void prompt.prompt().then(() => prompt.userChoice.finally(() => setHidden(true)));
        }}
        className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Install
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
