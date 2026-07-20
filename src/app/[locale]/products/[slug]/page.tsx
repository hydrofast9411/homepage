import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { products, manufacturers, productCategories, productImages } from "@/db/schema";
import { eq, and, ne, or, asc, sql } from "drizzle-orm";
import { publicImageUrl } from "@/lib/image-url";
import { ProductCard, type ProductCardData } from "@/components/marketing/product-card";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";
import { SectionHeading } from "@/components/marketing/section-heading";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const [row] = await db
    .select({ product: products, manufacturer: manufacturers })
    .from(products)
    .leftJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
    .where(and(eq(products.slug, slug), eq(products.isPublished, true)));

  if (!row) return {};
  const name = locale === "ko" ? row.product.nameKo : row.product.nameEn ?? row.product.nameKo;
  const description =
    (locale === "ko" ? row.product.shortDescriptionKo : row.product.shortDescriptionEn) ??
    row.product.shortDescriptionKo ??
    undefined;
  const title = row.manufacturer ? `${name} — ${row.manufacturer.name}` : name;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: row.product.primaryImagePath
        ? [publicImageUrl("product-images", row.product.primaryImagePath)!]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const tCommon = await getTranslations("common");

  const [row] = await db
    .select({
      product: products,
      manufacturer: manufacturers,
      category: productCategories,
    })
    .from(products)
    .leftJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
    .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
    .where(and(eq(products.slug, slug), eq(products.isPublished, true)));

  if (!row) notFound();
  const { product, manufacturer, category } = row;

  const gallery = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(asc(productImages.sortOrder));

  const related = category
    ? await db
        .select({
          id: products.id,
          slug: products.slug,
          nameKo: products.nameKo,
          nameEn: products.nameEn,
          primaryImagePath: products.primaryImagePath,
          specs: products.specs,
          manufacturerName: manufacturers.name,
        })
        .from(products)
        .leftJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
        .where(
          and(
            eq(products.isPublished, true),
            ne(products.id, product.id),
            or(eq(products.categoryId, category.id), eq(products.manufacturerId, product.manufacturerId ?? sql`NULL`))
          )
        )
        .limit(4)
    : [];

  const name = locale === "ko" ? product.nameKo : product.nameEn ?? product.nameKo;
  const description = locale === "ko" ? product.descriptionKo : product.descriptionEn ?? product.descriptionKo;
  const specSchema = category?.specSchema ?? [];
  const specs = product.specs as Record<string, string | number | boolean>;

  const relatedCards: ProductCardData[] = related.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: locale === "ko" ? r.nameKo : r.nameEn ?? r.nameKo,
    manufacturerName: r.manufacturerName,
    primaryImagePath: r.primaryImagePath,
    teaser: null,
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
            {product.primaryImagePath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={publicImageUrl("product-images", product.primaryImagePath) ?? undefined}
                alt={name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {gallery.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={publicImageUrl("product-images", img.storagePath) ?? undefined}
                  alt=""
                  className="aspect-square w-full rounded-[var(--radius-card)] border border-[var(--color-border)] object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          {manufacturer && (
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-steel-light)]">
              {manufacturer.name}
            </span>
          )}
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">{name}</h1>
          {product.modelNo && (
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              {tCommon("model")}: {product.modelNo}
            </p>
          )}
          {description && <p className="mt-4 whitespace-pre-wrap text-[var(--color-ink-soft)]">{description}</p>}

          {specSchema.length > 0 && (
            <div className="mt-8 border-t border-[var(--color-border)] pt-6">
              <h2 className="mb-3 text-sm font-bold">{tCommon("specifications")}</h2>
              <table className="w-full text-sm">
                <tbody>
                  {[...specSchema]
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((field) => {
                      const value = specs[field.key];
                      if (value === undefined || value === null || value === "") return null;
                      const label = locale === "ko" ? field.labelKo : field.labelEn ?? field.labelKo;
                      let displayValue: string;
                      if (field.dataType === "select") {
                        const opt = field.options?.find((o) => o.value === String(value));
                        displayValue = opt ? (locale === "ko" ? opt.labelKo : opt.labelEn ?? opt.labelKo) : String(value);
                      } else if (field.dataType === "boolean") {
                        displayValue = value ? "Yes" : "No";
                      } else {
                        displayValue = `${value}${field.unit ? ` ${field.unit}` : ""}`;
                      }
                      return (
                        <tr key={field.key} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="py-2.5 pr-4 font-medium text-[var(--color-ink-soft)]">{label}</td>
                          <td className="py-2.5">{displayValue}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {relatedCards.length > 0 && (
        <section className="mt-20">
          <SectionHeading title={tCommon("relatedProducts")} />
          <RevealGrid className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {relatedCards.map((p) => (
              <RevealGridItem key={p.id}>
                <ProductCard product={p} />
              </RevealGridItem>
            ))}
          </RevealGrid>
        </section>
      )}
    </div>
  );
}
