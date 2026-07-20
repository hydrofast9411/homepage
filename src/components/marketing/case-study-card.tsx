import { publicImageUrl } from "@/lib/image-url";
import type { CaseStudy } from "@/db/schema";

export function CaseStudyCard({
  caseStudy,
  title,
  description,
}: {
  caseStudy: CaseStudy;
  title: string;
  description: string | null;
}) {
  const aspect = caseStudy.aspectRatio.replace("-", "/");

  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="relative w-full overflow-hidden bg-[var(--color-surface-alt)]" style={{ aspectRatio: aspect }}>
        {caseStudy.imagePath && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicImageUrl("case-study-images", caseStudy.imagePath) ?? undefined}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/80">{caseStudy.clientName}</div>
          <div className="mt-1 text-sm font-bold leading-snug">{title}</div>
          {description && <p className="mt-1 text-xs text-white/80">{description}</p>}
        </div>
      </div>
    </div>
  );
}
