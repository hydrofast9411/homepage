"use client";

import { motion, type Variants } from "framer-motion";
import type {
  BusinessAreaContent,
  ContentBlock,
  ContentImage,
  ContentSection,
  Loc,
} from "@/content/business-areas";
import type { Locale } from "@/i18n/routing";
import { contentImageUrl } from "@/lib/image-url";

const ease = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

function useT(locale: Locale) {
  return (l?: Loc) => (l ? (locale === "ko" ? l.ko : l.en ?? l.ko) : "");
}

/* eslint-disable @next/next/no-img-element */
export function BusinessContent({ area, locale }: { area: BusinessAreaContent; locale: Locale }) {
  const t = useT(locale);

  return (
    <div className="flex flex-col">
      {area.sections.map((section, i) => (
        <Section key={i} section={section} accent={area.accent} t={t} shaded={i % 2 === 1} />
      ))}
    </div>
  );
}

function Section({
  section,
  accent,
  t,
  shaded,
}: {
  section: ContentSection;
  accent: string;
  t: (l?: Loc) => string;
  shaded: boolean;
}) {
  return (
    <section className={shaded ? "bg-[var(--color-surface-alt)]" : ""}>
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
        {(section.kicker || section.heading) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease }}
            className="mb-10"
          >
            {section.kicker && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
                {t(section.kicker)}
              </p>
            )}
            {section.heading && (
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className="border-l-4 pl-4" style={{ borderColor: accent }}>
                  {t(section.heading)}
                </span>
              </h2>
            )}
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-8%" }}
          className="flex flex-col gap-14"
        >
          {section.blocks.map((block, i) => (
            <motion.div key={i} variants={item}>
              <Block block={block} accent={accent} t={t} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Img({ image, t, className = "" }: { image: ContentImage; t: (l?: Loc) => string; className?: string }) {
  const caption = t(image.caption);
  return (
    <figure className={`group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}>
      <img
        src={contentImageUrl(image.src)}
        alt={caption || ""}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-xs font-medium text-white">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Block({ block, accent, t }: { block: ContentBlock; accent: string; t: (l?: Loc) => string }) {
  switch (block.kind) {
    case "feature": {
      const layout = block.imageLayout ?? "row";
      const hasImages = block.images && block.images.length > 0;
      return (
        <div className={`grid gap-8 ${hasImages ? "lg:grid-cols-2 lg:items-center" : ""}`}>
          <div className={block.reverse ? "lg:order-2" : ""}>
            {block.badge && (
              <span
                className="mb-3 inline-block rounded-[var(--radius-pill)] px-3 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: accent }}
              >
                {t(block.badge)}
              </span>
            )}
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">{t(block.title)}</h3>
            {block.body && (
              <p className="mt-3 leading-relaxed text-[var(--color-ink-soft)]">{t(block.body)}</p>
            )}
            {block.pills && (
              <div className="mt-4 flex flex-wrap gap-2">
                {block.pills.map((p, i) => (
                  <span
                    key={i}
                    className="rounded-[var(--radius-card)] border px-3 py-1 text-sm font-semibold"
                    style={{ borderColor: accent, color: accent }}
                  >
                    {t(p)}
                  </span>
                ))}
              </div>
            )}
          </div>
          {hasImages && (
            <div className={block.reverse ? "lg:order-1" : ""}>
              {layout === "single" ? (
                <Img image={block.images![0]} t={t} className="aspect-[4/3]" />
              ) : layout === "grid" ? (
                <div className="grid grid-cols-2 gap-3">
                  {block.images!.map((im, i) => (
                    <Img key={i} image={im} t={t} className="aspect-[4/3]" />
                  ))}
                </div>
              ) : (
                <div className={`grid gap-3 ${block.images!.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                  {block.images!.map((im, i) => (
                    <Img key={i} image={im} t={t} className="aspect-[3/4]" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    case "gallery": {
      const cols = block.columns ?? 3;
      const gridClass =
        cols === 4
          ? "grid-cols-2 md:grid-cols-4"
          : cols === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-2 md:grid-cols-3";
      return (
        <div>
          {(block.title || block.subtitle) && (
            <div className="mb-5">
              {block.title && (
                <h3 className="text-lg font-bold">
                  <span className="border-l-4 pl-3" style={{ borderColor: accent }}>
                    {t(block.title)}
                  </span>
                </h3>
              )}
              {block.subtitle && <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{t(block.subtitle)}</p>}
            </div>
          )}
          <div className={`grid gap-3 ${gridClass}`}>
            {block.images.map((im, i) => (
              <Img key={i} image={im} t={t} className="aspect-[4/3]" />
            ))}
          </div>
        </div>
      );
    }

    case "specTable":
      return (
        <div>
          {block.title && (
            <h3 className="mb-4 text-lg font-bold">
              <span className="border-l-4 pl-3" style={{ borderColor: accent }}>
                {t(block.title)}
              </span>
            </h3>
          )}
          <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ backgroundColor: accent }}>
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left font-bold text-white">
                      {t(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className={ri % 2 ? "bg-[var(--color-surface-alt)]" : "bg-[var(--color-surface)]"}
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`border-t border-[var(--color-border)] px-4 py-3 ${
                          ci === 0 ? "font-semibold" : "text-[var(--color-ink-soft)]"
                        }`}
                      >
                        {t(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "compare": {
      const Col = ({ col, highlight }: { col: { title: Loc; rows: { label: Loc; value: Loc }[] }; highlight?: boolean }) => (
        <div
          className="flex-1 overflow-hidden rounded-[var(--radius-card)] border"
          style={highlight ? { borderColor: accent } : { borderColor: "var(--color-border)" }}
        >
          <div
            className="px-5 py-3 text-center text-lg font-bold"
            style={highlight ? { backgroundColor: accent, color: "#fff" } : { backgroundColor: "var(--color-surface-alt)" }}
          >
            {t(col.title)}
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {col.rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-[var(--color-ink-soft)]">{t(r.label)}</span>
                <span className="text-right font-bold" style={highlight ? { color: accent } : undefined}>
                  {t(r.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
      return (
        <div>
          {block.title && (
            <h3 className="mb-2 text-lg font-bold">
              <span className="border-l-4 pl-3" style={{ borderColor: accent }}>
                {t(block.title)}
              </span>
            </h3>
          )}
          {block.note && <p className="mb-5 text-sm text-[var(--color-ink-soft)]">{t(block.note)}</p>}
          <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
            <Col col={block.left} />
            <div className="hidden items-center text-xl font-black text-[var(--color-ink-soft)] md:flex">VS</div>
            <Col col={block.right} highlight={block.right.highlight} />
          </div>
        </div>
      );
    }

    case "bullets":
      return (
        <div>
          {block.title && (
            <h3 className="mb-4 text-lg font-bold">
              <span className="border-l-4 pl-3" style={{ borderColor: accent }}>
                {t(block.title)}
              </span>
            </h3>
          )}
          <ul className="grid gap-2 sm:grid-cols-2">
            {block.items.map((it, i) => (
              <li key={i} className="flex gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                <span className="text-sm leading-relaxed">{t(it)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "brands":
      return (
        <div>
          {block.title && (
            <h3 className="mb-4 text-lg font-bold">
              <span className="border-l-4 pl-3" style={{ borderColor: accent }}>
                {t(block.title)}
              </span>
            </h3>
          )}
          <div className="flex flex-wrap gap-3">
            {block.items.map((brand, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold"
              >
                {brand.country && <span aria-hidden>{brand.country}</span>}
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      );

    case "figure":
      return (
        <div>
          {block.title && (
            <h3 className="mb-4 text-lg font-bold">
              <span className="border-l-4 pl-3" style={{ borderColor: accent }}>
                {t(block.title)}
              </span>
            </h3>
          )}
          <figure className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <img src={contentImageUrl(block.src)} alt={t(block.caption) || t(block.title)} loading="lazy" className="mx-auto w-full max-w-3xl" />
            {block.caption && (
              <figcaption className="border-t border-[var(--color-border)] px-4 py-3 text-center text-sm text-[var(--color-ink-soft)]">
                {t(block.caption)}
              </figcaption>
            )}
          </figure>
        </div>
      );

    default:
      return null;
  }
}
