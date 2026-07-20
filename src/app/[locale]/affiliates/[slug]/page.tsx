import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { db } from "@/db/client";
import { affiliates, affiliateSections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { publicImageUrl } from "@/lib/image-url";
import type { Locale } from "@/i18n/routing";
import { AffiliateSectionBlock } from "@/components/marketing/affiliate-section-block";

export const dynamic = "force-dynamic";

export default async function AffiliateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;

  const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.slug, slug));
  if (!affiliate) notFound();

  const sections = await db
    .select()
    .from(affiliateSections)
    .where(eq(affiliateSections.affiliateId, affiliate.id))
    .orderBy(asc(affiliateSections.sortOrder));

  const name = locale === "ko" ? affiliate.nameKo : affiliate.nameEn ?? affiliate.nameKo;
  const tagline = locale === "ko" ? affiliate.taglineKo : affiliate.taglineEn ?? affiliate.taglineKo;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        {affiliate.heroImagePath && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicImageUrl("site-media", affiliate.heroImagePath) ?? undefined}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        <div className="relative mx-auto max-w-[1400px] px-6 py-24 text-center">
          {affiliate.logoPath && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={publicImageUrl("site-media", affiliate.logoPath) ?? undefined} alt={name} className="mx-auto mb-6 h-16 w-auto object-contain" />
          )}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{name}</h1>
          {tagline && <p className="mt-4 text-[var(--color-ink-soft)]">{tagline}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-16">
        {sections.map((section, i) => (
          <AffiliateSectionBlock key={section.id} section={section} locale={locale} reverse={i % 2 === 1} />
        ))}
      </div>
    </div>
  );
}
