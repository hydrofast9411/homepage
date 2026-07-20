import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { historyEvents, certifications } from "@/db/schema";
import { asc } from "drizzle-orm";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Timeline } from "@/components/marketing/timeline";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";
import { publicImageUrl } from "@/lib/image-url";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, { ko: string; en: string }> = {
  patent: { ko: "특허", en: "Patents" },
  certification: { ko: "인증", en: "Certifications" },
  award: { ko: "수상", en: "Awards" },
};

export default async function AboutPage() {
  const locale = (await getLocale()) as Locale;
  const tNav = await getTranslations("nav");

  const [history, certs] = await Promise.all([
    db.select().from(historyEvents).orderBy(asc(historyEvents.sortOrder)),
    db.select().from(certifications).orderBy(asc(certifications.sortOrder)),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16">
      <h1 className="mb-16 text-center text-3xl md:text-4xl font-bold tracking-tight">{tNav("about")}</h1>

      {history.length > 0 && (
        <section id="history" className="mb-24">
          <SectionHeading title={locale === "ko" ? "회사 연혁" : "Company History"} align="center" />
          <Timeline events={history} locale={locale} />
        </section>
      )}

      {certs.length > 0 && (
        <section id="certifications">
          <SectionHeading title={locale === "ko" ? "인증 및 특허" : "Certifications & Patents"} align="center" />
          <RevealGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {certs.map((c) => {
              const title = locale === "ko" ? c.titleKo : c.titleEn ?? c.titleKo;
              const label = CATEGORY_LABEL[c.category]?.[locale] ?? c.category;
              return (
                <RevealGridItem key={c.id}>
                  <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
                    {c.imagePath && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={publicImageUrl("site-media", c.imagePath) ?? undefined} alt={title} className="h-20 w-auto object-contain" />
                    )}
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-safety-orange)]">{label}</span>
                    <span className="text-sm font-medium">{title}</span>
                  </div>
                </RevealGridItem>
              );
            })}
          </RevealGrid>
        </section>
      )}
    </div>
  );
}
