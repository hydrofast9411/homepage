"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export function AboutHero({
  kicker,
  title,
  tagline,
  bgImage,
}: {
  kicker: string;
  title: string;
  tagline: string;
  bgImage: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-steel)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(120deg, rgba(31,58,99,0.95) 0%, rgba(31,58,99,0.75) 50%, rgba(55,92,251,0.45) 100%)" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:py-36 text-white">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-safety-orange)]"
        >
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="mt-4 max-w-3xl text-3xl md:text-5xl font-bold tracking-tight"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="mt-4 text-lg font-medium tracking-wide opacity-90"
        >
          {tagline}
        </motion.p>
      </div>
    </section>
  );
}
