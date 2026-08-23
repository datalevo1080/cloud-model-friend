import { makeRouteOptions } from "@/i18n/route-options";
import { useT } from "@/i18n";
import { LegalPage } from "@/components/legal-page";

export const options = makeRouteOptions("/terms", {
  head: () => ({
    meta: [
      { title: "Terms of Use — ZipGIF Free GIF Compressor" },
      {
        name: "description",
        content:
          "Plain-language terms for using ZipGIF, the free browser-based GIF compressor that never uploads your files.",
      },
      { property: "og:title", content: "Terms of Use — ZipGIF" },
      {
        property: "og:description",
        content: "Plain-language terms for the free, client-side ZipGIF compressor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://zipgif.com/terms" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/terms" }],
  }),
  component: Terms,
});

const SECTIONS = ["using", "content", "warranty", "liability", "acceptable", "changes"] as const;

function Terms() {
  const t = useT();

  return (
    <LegalPage title={t("terms.title")} subtitle={t("terms.subtitle")}>
      {SECTIONS.map((key) => (
        <div key={key}>
          <h2>{t(`terms.${key}.h2`)}</h2>
          <p>{t(`terms.${key}.p`)}</p>
        </div>
      ))}
    </LegalPage>
  );
}

export const Page = Terms;
