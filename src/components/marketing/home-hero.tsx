"use client";

import { motion, type Variants } from "framer-motion";
import { Link } from "@/i18n/navigation";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const line: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HomeHero({
  kicker,
  title,
  desc,
  ctaProducts,
  ctaContact,
}: {
  kicker: string;
  title: string;
  desc: string;
  ctaProducts: string;
  ctaContact: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(55,92,251,0.08),transparent_60%)]" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-[1400px] px-6 py-28 md:py-36"
      >
        <motion.p
          variants={line}
          className="mb-4 text-xs font-semibold tracking-[0.2em] text-[var(--color-safety-orange)] uppercase"
        >
          {kicker}
        </motion.p>
        <motion.h1
          variants={line}
          className="max-w-3xl text-4xl md:text-6xl font-bold leading-tight tracking-tight text-[var(--color-ink)]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <motion.p variants={line} className="mt-6 max-w-xl text-lg text-[var(--color-ink-soft)]">
          {desc}
        </motion.p>
        <motion.div variants={line} className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/products"
            className="rounded-[var(--radius-card)] bg-[var(--color-steel-light)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {ctaProducts}
          </Link>
          <Link
            href="/contact"
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
          >
            {ctaContact}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
