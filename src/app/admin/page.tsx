import { db } from "@/db/client";
import { businessAreas, manufacturers, products, inquiries } from "@/db/schema";
import { count } from "drizzle-orm";

async function getCounts() {
  const [[b], [m], [p], [i]] = await Promise.all([
    db.select({ n: count() }).from(businessAreas),
    db.select({ n: count() }).from(manufacturers),
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(inquiries),
  ]);
  return {
    businessAreas: b?.n ?? 0,
    manufacturers: m?.n ?? 0,
    products: p?.n ?? 0,
    inquiries: i?.n ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const cards = [
    { label: "사업 분야", value: counts.businessAreas, href: "/admin/business-areas" },
    { label: "제조사 · 파트너", value: counts.manufacturers, href: "/admin/manufacturers" },
    { label: "제품", value: counts.products, href: "/admin/products" },
    { label: "미확인 문의", value: counts.inquiries, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">대시보드</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-steel-light)] transition-colors"
          >
            <div className="text-3xl font-bold">{c.value}</div>
            <div className="mt-1 text-sm text-[var(--color-ink-soft)]">{c.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
