"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

const BUSINESS_AREA_LINK = { href: "/business/bolting-torque", key: "boltingTorque" } as const;
const NAV_LINKS = [
  { href: "/products", key: "products" },
  { href: "/partners", key: "partners" },
  { href: "/cases", key: "cases" },
  { href: "/about", key: "about" },
] as const;

export function SiteHeader() {
  const tNav = useTranslations("nav");
  const tBiz = useTranslations("businessAreas");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link
            href={BUSINESS_AREA_LINK.href}
            className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
          >
            {tBiz(BUSINESS_AREA_LINK.key)}
          </Link>
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
          <Link href={BUSINESS_AREA_LINK.href} className="text-sm font-medium">
            {tBiz(BUSINESS_AREA_LINK.key)}
          </Link>
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
