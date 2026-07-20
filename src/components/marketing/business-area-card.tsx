import { Link } from "@/i18n/navigation";
import { publicImageUrl } from "@/lib/image-url";
import type { BusinessArea } from "@/db/schema";

export function BusinessAreaCard({ area, name, summary }: { area: BusinessArea; name: string; summary: string }) {
  return (
    <Link
      href={`/business/${area.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:-translate-y-1 hover:border-[var(--color-steel-light)] hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-[var(--color-surface-alt)]">
        {area.heroImagePath && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicImageUrl("site-media", area.heroImagePath) ?? undefined}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{summary}</p>
      </div>
    </Link>
  );
}
