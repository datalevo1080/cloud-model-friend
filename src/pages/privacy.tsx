import { makeRouteOptions } from "@/i18n/route-options";
import { useT } from "@/i18n";
import { LegalPage } from "@/components/legal-page";

export const options = makeRouteOptions("/privacy", {
  head: () => ({
    meta: [
      { title: "Privacy Policy — ZipGIF Never Uploads Your Files" },
      {
        name: "description",
        content:
          "ZipGIF's privacy policy: no file uploads, no accounts, no tracking pixels. GIF compression happens entirely on your device.",
      },
      { property: "og:title", content: "Privacy Policy — ZipGIF" },
      {
        property: "og:description",
        content: "No uploads, no accounts, no tracking pixels. Your GIFs stay on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://zipgif.com/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/privacy" }],
  }),
  component: Privacy,
});

const SECTIONS = ["files", "accounts", "cookies", "logs", "children", "changes"] as const;

function Privacy() {
  const t = useT();

  return (
    <LegalPage title={t("privacy.title")} subtitle={t("privacy.subtitle")}>
      {SECTIONS.map((key) => (
        <div key={key}>
          <h2>{t(`privacy.${key}.h2`)}</h2>
          <p>{t(`privacy.${key}.p`)}</p>
        </div>
      ))}
    </LegalPage>
  );
}

export const Page = Privacy;
