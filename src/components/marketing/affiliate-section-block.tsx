"use client";

import { motion } from "framer-motion";
import { publicImageUrl } from "@/lib/image-url";
import type { AffiliateSection } from "@/db/schema";
import type { Locale } from "@/i18n/routing";

/** Renders one repeatable content block from an affiliate's page, alternating
 * image/text sides and slide direction so a sequence of sections doesn't feel
 * like the same template repeated. */
export function AffiliateSectionBlock({
  section,
  locale,
  reverse,
}: {
  section: AffiliateSection;
  locale: Locale;
  reverse: boolean;
}) {
  const heading = locale === "ko" ? section.headingKo : section.headingEn ?? section.headingKo;
  const body = locale === "ko" ? section.bodyKo : section.bodyEn ?? section.bodyKo;

  return (
    <div className={`mb-20 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${reverse ? "" : ""}`}>
      <motion.div
        initial={{ opacity: 0, x: reverse ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={reverse ? "lg:order-2" : ""}
      >
        {heading && <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>}
        {body && <p className="mt-4 whitespace-pre-wrap text-[var(--color-ink-soft)]">{body}</p>}
      </motion.div>

      {section.imagePath && (
        <motion.div
          initial={{ opacity: 0, x: reverse ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] ${reverse ? "lg:order-1" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={publicImageUrl("site-media", section.imagePath) ?? undefined} alt={heading ?? ""} className="h-full w-full object-cover" />
        </motion.div>
      )}
    </div>
  );
}
