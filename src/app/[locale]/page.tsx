import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { businessAreas, caseStudies, clientLogos, manufacturers } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { HomeHero } from "@/components/marketing/home-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { BusinessAreaCard } from "@/components/marketing/business-area-card";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { StatCounter } from "@/components/marketing/stat-counter";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const [tHero, tBiz, tCases, tClients, tCommon] = await Promise.all([
    getTranslations("hero"),
    getTranslations("businessAreas"),
    getTranslations("cases"),
    getTranslations("clients"),
    getTranslations("common"),
  ]);

  const [areas, highlightCases, logos, partnerBrands] = await Promise.all([
    db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder)),
    db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.isPublished, true))
      .orderBy(desc(caseStudies.createdAt))
      .limit(6),
    db.select().from(clientLogos).where(eq(clientLogos.isPublished, true)).orderBy(asc(clientLogos.sortOrder)),
    db.select().from(manufacturers).where(eq(manufacturers.isActive, true)).orderBy(asc(manufacturers.sortOrder)),
  ]);

  return (
    <>
      <HomeHero
        kicker={tHero("kicker")}
        title={tHero("title")}
        desc={tHero("desc")}
        ctaProducts={tHero("ctaProducts")}
        ctaContact={tHero("ctaContact")}
      />

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-alt)] py-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-3 gap-8 px-6">
          <StatCounter target={28} suffix="+" label={tHero("statYears")} />
          <StatCounter target={6900} suffix=" bar" label={tHero("statPressure")} />
          <StatCounter target={partnerBrands.length} suffix="+" label={tHero("statPartners")} />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20">
        <SectionHeading title={tBiz("sectionTitle")} />
        <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => (
            <RevealGridItem key={area.id}>
              <BusinessAreaCard
                area={area}
                name={locale === "ko" ? area.nameKo : area.nameEn ?? area.nameKo}
                summary={(locale === "ko" ? area.summaryKo : area.summaryEn ?? area.summaryKo) ?? ""}
              />
            </RevealGridItem>
          ))}
        </RevealGrid>
      </section>

      {highlightCases.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-20">
          <SectionHeading title={tCases("sectionTitle")} sub={tCases("sectionSub")} />
          <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlightCases.map((cs) => (
              <RevealGridItem key={cs.id}>
                <CaseStudyCard
                  caseStudy={cs}
                  title={locale === "ko" ? cs.titleKo : cs.titleEn ?? cs.titleKo}
                  description={locale === "ko" ? cs.descriptionKo : cs.descriptionEn ?? cs.descriptionKo}
                />
              </RevealGridItem>
            ))}
          </RevealGrid>
          <div className="mt-8 text-center">
            <Link href="/cases" className="text-sm font-semibold text-[var(--color-steel-light)]">
              {tCommon("viewAll")} →
            </Link>
          </div>
        </section>
      )}

      {partnerBrands.length > 0 && (
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-alt)] py-16">
          <div className="mx-auto max-w-[1400px] px-6">
            <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
              Overseas Partners
            </h2>
          </div>
          <LogoMarquee logos={partnerBrands.filter((m) => m.logoPath).map((m) => ({ id: m.id, name: m.name, logoPath: m.logoPath! }))} bucket="partner-logos" />
        </section>
      )}

      {logos.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-[1400px] px-6">
            <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
              {tClients("sectionTitle")}
            </h2>
          </div>
          <LogoMarquee logos={logos.map((l) => ({ id: l.id, name: l.name, logoPath: l.logoPath }))} bucket="client-logos" />
        </section>
      )}
    </>
  );
}
