import { L } from "@/components/l";
import { useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  ChevronDown,
  Crop,
  Gauge,
  Images,
  Maximize2,
  Menu,
  Moon,
  Scissors,
  Sparkles,
  Split,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useT } from "@/i18n";

const tools = [
  { icon: Zap, key: "tool.compressor", href: "/gif-compressor" },
  { icon: Crop, key: "tool.cropper", href: "/gif-cropper" },
  { icon: Maximize2, key: "tool.resizer", href: "/gif-resizer" },
  { icon: Gauge, key: "tool.speed", href: "/gif-speed-changer" },
  { icon: Split, key: "tool.splitter", href: "/gif-splitter" },
  { icon: Scissors, key: "tool.trimmer", href: "/gif-trimmer" },
  { icon: Images, key: "tool.pngToGif", href: "/png-to-gif" },
  { icon: Sparkles, key: "tool.gifToPng", href: "/gif-to-png" },
];

const pages = [
  { key: "nav.about", href: "/about" },
  { key: "nav.contact", href: "/contact" },
];

export function SiteHeader() {
  const t = useT();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toolsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!toolsRef.current?.contains(e.target as Node)) setToolsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToolsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [toolsOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:h-18">
        <div className="flex min-w-0 items-center gap-6">
          <L
            to="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <Zap className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="text-primary">Zip</span>
              <span className="text-foreground">GIF</span>
            </span>
          </L>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            <div ref={toolsRef} className="relative">
              <button
                type="button"
                aria-expanded={toolsOpen}
                aria-haspopup="true"
                onClick={() => setToolsOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("nav.allTools")}
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {toolsOpen ? (
                <div className="absolute left-0 top-full z-50 mt-2 w-[36rem] rounded-2xl border border-border bg-popover p-3 shadow-2xl">
                  <ul className="grid grid-cols-2 gap-1">
                    {tools.map((tool) => (
                      <li key={tool.href}>
                        <L
                          to={tool.href}
                          onClick={() => setToolsOpen(false)}
                          activeProps={{ className: "bg-accent" }}
                          className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <tool.icon className="size-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-foreground">
                              {t(`${tool.key}.label`)}
                            </span>
                            <span className="block text-xs text-muted-foreground">{t(`${tool.key}.blurb`)}</span>
                          </span>
                        </L>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <L
              to="/gif-compressor"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              {t("nav.compressor")}
            </L>
            {pages.map((page) => (
              <L
                key={page.href}
                to={page.href}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                {t(page.key)}
              </L>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? t("nav.toLight") : t("nav.toDark")}
            className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {theme === "dark" ? (
              <Sun className="size-5" aria-hidden="true" />
            ) : (
              <Moon className="size-5" aria-hidden="true" />
            )}
          </button>

          <L
            to="/gif-compressor"
            className="group hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
          >
            {t("nav.cta")}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </L>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
            <span className="sr-only">{menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background lg:hidden"
        >
          <nav aria-label="Tools" className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <p className="px-1 pb-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {t("nav.tools")}
            </p>
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <L
                    to={tool.href}
                    onClick={() => setMenuOpen(false)}
                    activeProps={{ className: "bg-accent" }}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <tool.icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{t(`${tool.key}.label`)}</span>
                      <span className="block text-xs text-muted-foreground">{t(`${tool.key}.blurb`)}</span>
                    </span>
                  </L>
                </li>
              ))}
            </ul>

            <p className="mt-4 px-1 pb-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {t("nav.more")}
            </p>
            <ul className="grid grid-cols-2 gap-1">
              {pages.map((page) => (
                <li key={page.href}>
                  <L
                    to={page.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {t(page.key)}
                  </L>
                </li>
              ))}
            </ul>

            <L
              to="/gif-compressor"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground"
            >
              {t("nav.ctaMobile")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </L>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
