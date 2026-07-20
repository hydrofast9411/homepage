import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { affiliates } from "@/db/schema";
import { asc } from "drizzle-orm";
import { SectionHeading } from "@/components/marketing/section-heading";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";
import { Link } from "@/i18n/navigation";
import { publicImageUrl } from "@/lib/image-url";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function AffiliatesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("affiliatesSection");
  const rows = await db.select().from(affiliates).orderBy(asc(affiliates.sortOrder));

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16">
      <SectionHeading title={t("sectionTitle")} align="center" />
      <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {rows.map((a) => (
          <RevealGridItem key={a.id}>
            <Link
              href={`/affiliates/${a.slug}`}
              className="group flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center transition-all hover:-translate-y-1 hover:border-[var(--color-steel-light)] hover:shadow-lg"
            >
              {a.logoPath && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={publicImageUrl("site-media", a.logoPath) ?? undefined} alt={a.nameKo} className="h-16 w-auto object-contain" />
              )}
              <h3 className="text-xl font-bold">{locale === "ko" ? a.nameKo : a.nameEn ?? a.nameKo}</h3>
              {a.taglineKo && <p className="text-sm text-[var(--color-ink-soft)]">{locale === "ko" ? a.taglineKo : a.taglineEn ?? a.taglineKo}</p>}
            </Link>
          </RevealGridItem>
        ))}
      </RevealGrid>
    </div>
  );
}
