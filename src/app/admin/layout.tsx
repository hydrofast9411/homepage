import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { AdminShell } from "@/components/admin/admin-shell";

const pretendard = localFont({
  src: "../../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HYDROFAST 관리자",
  robots: { index: false, follow: false },
};

// Every /admin page queries the DB per-request (session-gated, data changes
// constantly) — force-dynamic here cascades to all nested routes so the build
// never attempts to statically prerender them (which would run DB queries at
// build time, before DATABASE_URL/Vercel env vars are necessarily available).
export const dynamic = "force-dynamic";

// /admin is its own root layout (Korean-only chrome, single admin) — deliberately
// separate from src/app/[locale]/layout.tsx, not wrapped in next-intl.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--color-surface-alt)] text-[var(--color-ink)]">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
