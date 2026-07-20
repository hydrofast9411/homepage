"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export type NavArea = { slug: string; nameKo: string; nameEn: string; accent: string; index: string };

const NAV_LINKS = [
  { href: "/products", key: "products" },
  { href: "/partners", key: "partners" },
  { href: "/cases", key: "cases" },
  { href: "/about", key: "about" },
] as const;

export function SiteHeader({ areas }: { areas: NavArea[] }) {
  const tNav = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bizOpen, setBizOpen] = useState(false);

  const areaName = (a: NavArea) => (locale === "ko" ? a.nameKo : a.nameEn);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -76, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--color-surface)]/95 backdrop-blur border-[var(--color-border)]"
          : "bg-transparent border-transparent"
      }`}
      style={{ height: "var(--nav-height)" }}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-lg">
          <span className="text-[var(--color-steel-light)]">HYDRO</span>
          <span className="text-[var(--color-safety-orange)]">FAST</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => setBizOpen(true)}
            onMouseLeave={() => setBizOpen(false)}
          >
            <button
              type="button"
              onClick={() => setBizOpen((v) => !v)}
              className="flex items-center gap-1 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
            >
              {tNav("businessAreas")}
              <span className={`text-[10px] transition-transform ${bizOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            <AnimatePresence>
              {bizOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full w-80 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-xl"
                >
                  {areas.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/business/${a.slug}`}
                      className="flex items-center gap-3 rounded-[var(--radius-card)] px-3 py-2.5 hover:bg-[var(--color-surface-alt)]"
                    >
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-card)] text-xs font-black text-white"
                        style={{ backgroundColor: a.accent }}
                      >
                        {a.index}
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-ink)]">{areaName(a)}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
            >
              {tNav(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="rounded-[var(--radius-card)] bg-[var(--color-safety-orange)] px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {tNav("contact")}
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 bg-[var(--color-ink)] transition-transform ${
              menuOpen ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[var(--color-ink)] transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[var(--color-ink)] transition-transform ${
              menuOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
              {tNav("businessAreas")}
            </span>
            {areas.map((a) => (
              <Link key={a.slug} href={`/business/${a.slug}`} className="flex items-center gap-2 py-1 text-sm font-medium">
                <span className="text-xs font-black" style={{ color: a.accent }}>
                  {a.index}
                </span>
                {areaName(a)}
              </Link>
            ))}
          </div>
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium">
              {tNav(item.key)}
            </Link>
          ))}
          <Link href="/contact" className="text-sm font-semibold text-[var(--color-safety-orange)]">
            {tNav("contact")}
          </Link>
          <LocaleSwitcher />
        </motion.nav>
      )}
    </motion.header>
  );
}

function LocaleSwitcher() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const nextLocale = locale === "ko" ? "en" : "ko";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      className="text-sm font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
    >
      {t("langToggle")}
    </button>
  );
}
