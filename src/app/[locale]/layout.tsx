import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { MotionProvider } from "@/components/motion-provider";
import { getAllAreas } from "@/lib/areas";
import "../globals.css";

const pretendard = localFont({
  src: "../../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HYDROFAST — Precision & Power in Hydraulic",
    template: "%s | HYDROFAST",
  },
  description:
    "HYDROFAST Co., Ltd. — hydraulic tensioning, high-pressure fluid & gas systems, total hydraulic engineering, and fire/safety solutions for Korean industry.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const areas = await getAllAreas();
  const navAreas = areas.map((a) => ({ slug: a.slug, nameKo: a.name.ko, nameEn: a.name.en ?? a.name.ko, accent: a.accent, index: a.index }));

  return (
    <html lang={locale} className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-surface)] text-[var(--color-ink)]">
        <NextIntlClientProvider>
          <MotionProvider>
            <SiteHeader areas={navAreas} />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
