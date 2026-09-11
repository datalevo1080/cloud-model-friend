import { useT } from "@/i18n";
import { LegalPage } from "@/components/legal-page";

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

export default Terms;
