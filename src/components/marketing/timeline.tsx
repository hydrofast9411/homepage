"use client";

import { motion } from "framer-motion";
import type { HistoryEvent } from "@/db/schema";
import type { Locale } from "@/i18n/routing";

export function Timeline({ events, locale }: { events: HistoryEvent[]; locale: Locale }) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[var(--color-border)] md:block" />
      <div className="flex flex-col gap-8">
        {events.map((ev, i) => {
          const fromLeft = i % 2 === 0;
          const title = locale === "ko" ? ev.titleKo : ev.titleEn ?? ev.titleKo;
          const description = locale === "ko" ? ev.descriptionKo : ev.descriptionEn ?? ev.descriptionKo;

          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: fromLeft ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex md:w-1/2 ${fromLeft ? "md:mr-auto md:pr-10 md:text-right" : "md:ml-auto md:pl-10"}`}
            >
              <div
                className={`w-full rounded-[var(--radius-card)] border p-4 ${
                  ev.isHighlight
                    ? "border-[var(--color-safety-orange)] bg-[var(--color-surface)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]"
                }`}
              >
                <div className="text-sm font-bold text-[var(--color-steel-light)]">
                  {ev.year}
                  {ev.month ? `.${String(ev.month).padStart(2, "0")}` : ""}
                </div>
                <div className="mt-1 font-semibold">{title}</div>
                {description && <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{description}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
