import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { businessAreas, productCategories, manufacturers, manufacturerBusinessAreas, caseStudies } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { SectionHeading } from "@/components/marketing/section-heading";
import { PartnerCard } from "@/components/marketing/partner-card";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";
import { Link } from "@/i18n/navigation";
import { publicImageUrl } from "@/lib/image-url";
import type { Locale } from "@/i18n/routing";

// Deliberately no generateStaticParams: the catalog changes via the admin CMS
// continuously, so these render dynamically per-request rather than being
// prerendered at build time (which would also require DB access at build time).
export const dynamic = "force-dynamic";

export default async function BusinessAreaPage({
  params,
}: {
  params: Promise<{ areaSlug: string }>;
}) {
  const { areaSlug } = await params;
  const locale = (await getLocale()) as Locale;
  const tCommon = await getTranslations("common");

  const [area] = await db.select().from(businessAreas).where(eq(businessAreas.slug, areaSlug));
  if (!area) notFound();

  const [categories, manufacturerLinks, relatedCases] = await Promise.all([
    db.select().from(productCategories).where(eq(productCategories.businessAreaId, area.id)).orderBy(asc(productCategories.sortOrder)),
    db
      .select({ manufacturer: manufacturers })
      .from(manufacturerBusinessAreas)
      .innerJoin(manufacturers, eq(manufacturerBusinessAreas.manufacturerId, manufacturers.id))
      .where(eq(manufacturerBusinessAreas.businessAreaId, area.id)),
    db.select().from(caseStudies).where(eq(caseStudies.businessAreaId, area.id)).orderBy(asc(caseStudies.sortOrder)),
  ]);

  const name = locale === "ko" ? area.nameKo : area.nameEn ?? area.nameKo;
  const description = locale === "ko" ? area.descriptionKo : area.descriptionEn ?? area.descriptionKo;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        {area.heroImagePath && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicImageUrl("site-media", area.heroImagePath) ?? undefined}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        <div className="relative mx-auto max-w-[1400px] px-6 py-24">
          <h1 className="max-w-2xl text-3xl md:text-5xl font-bold tracking-tight">{name}</h1>
          {description && <p className="mt-4 max-w-2xl whitespace-pre-wrap text-[var(--color-ink-soft)]">{description}</p>}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeading title={tCommon("filterByCategory")} />
          <RevealGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <RevealGridItem key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="block rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--color-steel-light)] hover:shadow-lg"
                >
                  <h3 className="font-bold">{locale === "ko" ? cat.nameKo : cat.nameEn ?? cat.nameKo}</h3>
                  {cat.descriptionKo && (
                    <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                      {locale === "ko" ? cat.descriptionKo : cat.descriptionEn ?? cat.descriptionKo}
                    </p>
                  )}
                </Link>
              </RevealGridItem>
            ))}
          </RevealGrid>
        </section>
      )}

      {manufacturerLinks.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeading title={tCommon("filterByManufacturer")} />
          <RevealGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {manufacturerLinks.map(({ manufacturer }) => (
              <RevealGridItem key={manufacturer.id}>
                <PartnerCard manufacturer={manufacturer} />
              </RevealGridItem>
            ))}
          </RevealGrid>
        </section>
      )}

      {relatedCases.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeading title="Case Studies" />
          <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCases.map((cs) => (
              <RevealGridItem key={cs.id}>
                <CaseStudyCard
                  caseStudy={cs}
                  title={locale === "ko" ? cs.titleKo : cs.titleEn ?? cs.titleKo}
                  description={locale === "ko" ? cs.descriptionKo : cs.descriptionEn ?? cs.descriptionKo}
                />
              </RevealGridItem>
            ))}
          </RevealGrid>
        </section>
      )}
    </div>
  );
}
