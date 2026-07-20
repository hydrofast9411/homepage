import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { caseStudies } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { SectionHeading } from "@/components/marketing/section-heading";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("cases");

  const rows = await db.select().from(caseStudies).where(eq(caseStudies.isPublished, true)).orderBy(asc(caseStudies.sortOrder));

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16">
      <SectionHeading title={t("sectionTitle")} sub={t("sectionSub")} />
      <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((cs) => (
          <RevealGridItem key={cs.id}>
            <CaseStudyCard
              caseStudy={cs}
              title={locale === "ko" ? cs.titleKo : cs.titleEn ?? cs.titleKo}
              description={locale === "ko" ? cs.descriptionKo : cs.descriptionEn ?? cs.descriptionKo}
            />
          </RevealGridItem>
        ))}
      </RevealGrid>
    </div>
  );
}
