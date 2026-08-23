import { L } from "@/components/l";
import { Facebook, Linkedin, Mail, Zap } from "lucide-react";
import { useT } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

const tools = [
  { key: "tool.compressor.label", href: "/gif-compressor" },
  { key: "tool.cropper.label", href: "/gif-cropper" },
  { key: "tool.resizer.label", href: "/gif-resizer" },
  { key: "tool.speed.label", href: "/gif-speed-changer" },
];

const moreTools = [
  { key: "tool.splitter.label", href: "/gif-splitter" },
  { key: "tool.trimmer.label", href: "/gif-trimmer" },
  { key: "tool.pngToGif.label", href: "/png-to-gif" },
  { key: "tool.gifToPng.label", href: "/gif-to-png" },
];

const company = [
  { key: "nav.home", href: "/" },
  { key: "footer.discord", href: "/compress-gif-for-discord" },
  { key: "footer.about", href: "/about" },
  { key: "footer.contact", href: "/contact" },
];

const socials = [
  {
    labelKey: "social.linkedin",
    href: "https://www.linkedin.com/in/shafiullah-tareen-507857268",
    Icon: Linkedin,
  },
  { labelKey: "social.facebook", href: "https://www.facebook.com/shafi.sami.336", Icon: Facebook },
  { labelKey: "social.email", href: "mailto:shafitareen431@gmail.com", Icon: Mail },
];

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <L to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="text-primary">Zip</span>
                <span className="text-foreground">GIF</span>
              </span>
            </L>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
{t("brand.blurb")}
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socials.map(({ labelKey, href, Icon }) => (
                <a
                  key={labelKey}
                  href={href}
                  aria-label={t(labelKey)}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex size-11 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title={t("footer.tools")} links={tools} />
          <FooterColumn title={t("footer.moreTools")} links={moreTools} />
          <FooterColumn title={t("footer.company")} links={company} />
        </div>

        <div className="mt-14 h-px w-full bg-border" />

        <div className="mt-6">
          <LanguageSwitcher />
        </div>

        <div className="mt-6 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t("brand.name")}. {t("footer.builtBy")}.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <L to="/privacy" className="underline hover:text-foreground">
              {t("footer.privacy")}
            </L>
            <L to="/terms" className="underline hover:text-foreground">
              {t("footer.terms")}
            </L>
            <L to="/contact" className="underline hover:text-foreground">
              {t("footer.contact")}
            </L>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ key: string; href: string }>;
}) {
  const t = useT();
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <nav aria-label={title} className="mt-4 flex flex-col gap-3 text-sm">
        {links.map((l) => (
          <L
            key={l.key}
            to={l.href}
            className="text-muted-foreground hover:text-foreground"
          >
            {t(l.key)}
          </L>
        ))}
      </nav>
    </div>
  );
}
