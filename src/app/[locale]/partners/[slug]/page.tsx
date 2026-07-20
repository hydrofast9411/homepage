import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { manufacturers, products, productCategories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { publicImageUrl } from "@/lib/image-url";
import { ProductCard, type ProductCardData } from "@/components/marketing/product-card";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";
import { SectionHeading } from "@/components/marketing/section-heading";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("partners");
  const tCommon = await getTranslations("common");

  const [manufacturer] = await db.select().from(manufacturers).where(eq(manufacturers.slug, slug));
  if (!manufacturer) notFound();

  const productRows = await db
    .select({
      id: products.id,
      slug: products.slug,
      nameKo: products.nameKo,
      nameEn: products.nameEn,
      primaryImagePath: products.primaryImagePath,
      specs: products.specs,
      categorySpecSchema: productCategories.specSchema,
    })
    .from(products)
    .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
    .where(and(eq(products.manufacturerId, manufacturer.id), eq(products.isPublished, true)));

  const cards: ProductCardData[] = productRows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: locale === "ko" ? row.nameKo : row.nameEn ?? row.nameKo,
    manufacturerName: manufacturer.name,
    primaryImagePath: row.primaryImagePath,
    teaser: null,
  }));

  const description = locale === "ko" ? manufacturer.descriptionKo : manufacturer.descriptionEn ?? manufacturer.descriptionKo;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16">
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        {manufacturer.logoPath && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicImageUrl("partner-logos", manufacturer.logoPath) ?? undefined}
            alt={manufacturer.name}
            className="h-16 w-auto object-contain"
          />
        )}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{manufacturer.name}</h1>
        {manufacturer.country && <p className="text-sm text-[var(--color-ink-soft)]">{manufacturer.country}</p>}
        {description && <p className="max-w-2xl whitespace-pre-wrap text-[var(--color-ink-soft)]">{description}</p>}
        {manufacturer.websiteUrl && (
          <a href={manufacturer.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-steel-light)]">
            {tCommon("website")} ↗
          </a>
        )}
      </div>

      {cards.length > 0 && (
        <>
          <SectionHeading title={t("productsFrom")} align="center" />
          <RevealGrid className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {cards.map((p) => (
              <RevealGridItem key={p.id}>
                <ProductCard product={p} />
              </RevealGridItem>
            ))}
          </RevealGrid>
        </>
      )}
    </div>
  );
}
