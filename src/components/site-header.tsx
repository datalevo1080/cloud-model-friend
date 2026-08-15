import { Link } from "@tanstack/react-router";
import { Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "@/lib/theme";

const nav = [
  { label: "GIF Compressor", href: "/" as const, active: true },
  { label: "GIF Cropper", href: "/gif-cropper" as const },
  { label: "GIF Resizer", href: "/gif-resizer" as const },
  { label: "GIF Speed Changer", href: "/gif-speed-changer" as const },
  { label: "GIF Splitter", href: "/gif-splitter" as const },
  { label: "GIF Trimmer", href: "/gif-trimmer" as const },
  { label: "PNG to GIF", href: "/png-to-gif" as const },
  { label: "GIF to PNG", href: "/gif-to-png" as const },
];

export function SiteHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" aria-hidden="true" />
          </span>
          <span>
            <span className="text-primary">Zip</span>
            <span className="text-foreground">GIF</span>
          </span>
        </Link>

        <nav aria-label="Tools" className="ml-2 hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              activeOptions={{ exact: true }}
              activeProps={{
                "aria-current": "page",
                className: "bg-accent text-accent-foreground",
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="ml-auto inline-flex size-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-accent"
        >
          {theme === "dark" ? (
            <Sun className="size-5" aria-hidden="true" />
          ) : (
            <Moon className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
