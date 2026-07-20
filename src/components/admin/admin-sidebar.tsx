"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SECTIONS = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/business-areas", label: "사업 분야" },
  { href: "/admin/categories", label: "제품 분류 · 스펙 양식" },
  { href: "/admin/manufacturers", label: "제조사 · 파트너" },
  { href: "/admin/products", label: "제품" },
  { href: "/admin/case-studies", label: "제작 사례" },
  { href: "/admin/client-logos", label: "고객사 로고" },
  { href: "/admin/history", label: "회사 연혁" },
  { href: "/admin/certifications", label: "인증 · 특허" },
  { href: "/admin/affiliates", label: "관계사" },
  { href: "/admin/settings", label: "사이트 설정" },
  { href: "/admin/inquiries", label: "문의 내역" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col">
      <div className="px-6 py-5 border-b border-[var(--color-border)] font-bold tracking-tight">
        <span className="text-[var(--color-steel-light)]">HYDRO</span>
        <span className="text-[var(--color-safety-orange)]">FAST</span>
        <div className="text-xs font-normal text-[var(--color-ink-soft)] mt-1">관리자</div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {SECTIONS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-2.5 text-sm ${
                active
                  ? "bg-[var(--color-surface-alt)] text-[var(--color-ink)] font-semibold border-r-2 border-[var(--color-safety-orange)]"
                  : "text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-alt)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--color-border)]">
        <button
          onClick={handleSignOut}
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] py-2 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
}
