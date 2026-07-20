import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { products, manufacturers, productCategories, businessAreas } from "@/db/schema";
import type { SpecFieldDef } from "@/db/schema/product-categories";
import { eq, and, asc, sql, type SQL } from "drizzle-orm";
import { ProductCard, type ProductCardData } from "@/components/marketing/product-card";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

function buildTeaser(specSchema: SpecFieldDef[], specs: Record<string, unknown>, locale: Locale) {
  const teaserFields = specSchema.filter((f) => f.showInCardTeaser);
  const parts = teaserFields.map((f) => {
    const value = specs[f.key];
    if (value === undefined || value === null || value === "") return null;
    const label = locale === "ko" ? f.labelKo : f.labelEn ?? f.labelKo;
    if (f.dataType === "select") {
      const opt = f.options?.find((o) => o.value === String(value));
      const optLabel = opt ? (locale === "ko" ? opt.labelKo : opt.labelEn ?? opt.labelKo) : value;
      return `${label}: ${optLabel}`;
    }
    const unit = f.unit ? ` ${f.unit}` : "";
    return `${label}: ${value}${unit}`;
  });
  return parts.filter(Boolean).join(" · ") || null;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; manufacturer?: string; area?: string }>;
}) {
  const { q, category, manufacturer, area } = await searchParams;
  const locale = (await getLocale()) as Locale;
  const tCommon = await getTranslations("common");

  const [categories, manufacturersList, areas] = await Promise.all([
    db.select().from(productCategories).orderBy(asc(productCategories.sortOrder)),
    db.select().from(manufacturers).orderBy(asc(manufacturers.sortOrder)),
    db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder)),
  ]);

  const conditions: SQL[] = [eq(products.isPublished, true)];

  const categoryRow = category ? categories.find((c) => c.slug === category) : undefined;
  if (categoryRow) conditions.push(eq(products.categoryId, categoryRow.id));

  const manufacturerRow = manufacturer ? manufacturersList.find((m) => m.slug === manufacturer) : undefined;
  if (manufacturerRow) conditions.push(eq(products.manufacturerId, manufacturerRow.id));

  const areaRow = area ? areas.find((a) => a.slug === area) : undefined;
  if (areaRow) conditions.push(eq(products.businessAreaId, areaRow.id));

  const qLower = q?.trim().toLowerCase();
  if (qLower) {
    conditions.push(
      sql`(${products.searchText} ILIKE ${"%" + qLower + "%"} OR similarity(${products.searchText}, ${qLower}) > 0.15)`
    );
  }

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      nameKo: products.nameKo,
      nameEn: products.nameEn,
      primaryImagePath: products.primaryImagePath,
      specs: products.specs,
      manufacturerName: manufacturers.name,
      categorySpecSchema: productCategories.specSchema,
    })
    .from(products)
    .leftJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
    .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
    .where(and(...conditions))
    .orderBy(qLower ? sql`similarity(${products.searchText}, ${qLower}) DESC` : asc(products.sortOrder))
    .limit(60);

  const cards: ProductCardData[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: locale === "ko" ? row.nameKo : row.nameEn ?? row.nameKo,
    manufacturerName: row.manufacturerName,
    primaryImagePath: row.primaryImagePath,
    teaser: buildTeaser(row.categorySpecSchema ?? [], row.specs, locale),
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16">
      <SectionHeading title={tCommon("search")} />

      <form action="/products" className="mb-8 flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder={tCommon("searchPlaceholder")}
          className="min-w-[16rem] flex-1 rounded-[var(--radius-card)] border border-[var(--color-border)] px-4 py-3 text-sm"
        />
        <select name="category" defaultValue={category ?? ""} className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-3 text-sm">
          <option value="">{tCommon("filterByCategory")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {locale === "ko" ? c.nameKo : c.nameEn ?? c.nameKo}
            </option>
          ))}
        </select>
        <select name="manufacturer" defaultValue={manufacturer ?? ""} className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-3 text-sm">
          <option value="">{tCommon("filterByManufacturer")}</option>
          {manufacturersList.map((m) => (
            <option key={m.id} value={m.slug}>
              {m.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-[var(--radius-card)] bg-[var(--color-steel-light)] px-6 py-3 text-sm font-semibold text-white">
          {tCommon("search")}
        </button>
      </form>

      {cards.length === 0 ? (
        <p className="py-16 text-center text-[var(--color-ink-soft)]">{tCommon("noResults")}</p>
      ) : (
        <RevealGrid className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((product) => (
            <RevealGridItem key={product.id}>
              <ProductCard product={product} />
            </RevealGridItem>
          ))}
        </RevealGrid>
      )}

      <p className="mt-8 text-center text-xs text-[var(--color-ink-soft)]">
        <Link href="/partners">{tCommon("filterByManufacturer")} →</Link>
      </p>
    </div>
  );
}
