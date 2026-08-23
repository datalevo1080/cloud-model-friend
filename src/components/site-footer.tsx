import { L } from "@/components/l";
import { Facebook, Linkedin, Mail, Zap } from "lucide-react";

const tools = [
  { label: "GIF Compressor", href: "/gif-compressor" as const },
  { label: "GIF Cropper", href: "/gif-cropper" as const },
  { label: "GIF Resizer", href: "/gif-resizer" as const },
  { label: "GIF Speed Changer", href: "/gif-speed-changer" as const },
];

const moreTools = [
  { label: "GIF Splitter", href: "/gif-splitter" as const },
  { label: "GIF Trimmer", href: "/gif-trimmer" as const },
  { label: "PNG to GIF", href: "/png-to-gif" as const },
  { label: "GIF to PNG", href: "/gif-to-png" as const },
];

const company = [
  { label: "Compress GIF for Discord", href: "/compress-gif-for-discord" as const },
  { label: "About", href: "/about" as const },
  { label: "Contact", href: "/contact" as const },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shafiullah-tareen-507857268",
    Icon: Linkedin,
  },
  { label: "Facebook", href: "https://www.facebook.com/shafi.sami.336", Icon: Facebook },
  { label: "Email", href: "mailto:shafitareen431@gmail.com", Icon: Mail },
];

export function SiteFooter() {
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
              Every GIF tool. Zero uploads. Everything runs inside your browser, so your files
              never leave your device.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
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

          <FooterColumn title="Tools" links={tools} />
          <FooterColumn title="More tools" links={moreTools} />
          <FooterColumn title="Company" links={company} />
        </div>

        <div className="mt-14 h-px w-full bg-border" />

        <div className="mt-6 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ZipGIF. Built by Shafiullah Tareen.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <L to="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </L>
            <L to="/terms" className="underline hover:text-foreground">
              Terms
            </L>
            <L to="/contact" className="underline hover:text-foreground">
              Contact
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
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <nav aria-label={title} className="mt-4 flex flex-col gap-3 text-sm">
        {links.map((l) => (
          <L
            key={l.label}
            to={l.href}
            className="text-muted-foreground hover:text-foreground"
          >
            {l.label}
          </L>
        ))}
      </nav>
    </div>
  );
}
