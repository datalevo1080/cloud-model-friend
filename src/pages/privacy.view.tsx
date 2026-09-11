import { useT } from "@/i18n";
import { LegalPage } from "@/components/legal-page";

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

export default Privacy;
