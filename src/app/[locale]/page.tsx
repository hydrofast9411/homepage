import { getTranslations } from "next-intl/server";
import { HomeHero } from "@/components/marketing/home-hero";

export default async function HomePage() {
  const t = await getTranslations("hero");

  return (
    <HomeHero
      kicker={t("kicker")}
      title={t("title")}
      desc={t("desc")}
      ctaProducts={t("ctaProducts")}
      ctaContact={t("ctaContact")}
    />
  );
}
