import { Link } from "@/i18n/navigation";
import type { BusinessAreaContent } from "@/content/business-areas";
import type { Locale } from "@/i18n/routing";

/* eslint-disable @next/next/no-img-element */
export function AreaCard({ area, locale }: { area: BusinessAreaContent; locale: Locale }) {
  const name = locale === "ko" ? area.name.ko : area.name.en ?? area.name.ko;
  const summary = locale === "ko" ? area.summary.ko : area.summary.en ?? area.summary.ko;

  return (
    <Link
      href={`/business/${area.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{ borderTop: `3px solid ${area.accent}` }}
    >
      <div className="relative h-44 w-full overflow-hidden bg-[var(--color-surface-alt)]">
        <img
          src={area.cardImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-[var(--radius-card)] text-sm font-black text-white"
          style={{ backgroundColor: area.accent }}
        >
          {area.index}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: area.accent }}>
          {area.nameEn}
        </p>
        <h3 className="mt-1 text-lg font-bold leading-snug">{name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-[var(--color-ink-soft)]">{summary}</p>
        <span className="mt-4 inline-block text-sm font-semibold" style={{ color: area.accent }}>
          {locale === "ko" ? "자세히 보기 →" : "Learn more →"}
        </span>
      </div>
    </Link>
  );
}
