import type { MetadataRoute } from "next";
import { db } from "@/db/client";
import { products, manufacturers, businessAreas } from "@/db/schema";
import { eq } from "drizzle-orm";

const STATIC_PATHS = [
  "",
  "/products",
  "/partners",
  "/cases",
  "/about",
  "/affiliates",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hydrofast.co.kr";
  const locales = ["ko", "en"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = locale === "ko" ? "" : `/${locale}`;
    for (const p of STATIC_PATHS) {
      entries.push({ url: `${siteUrl}${prefix}${p}`, changeFrequency: "weekly" });
    }
  }

  try {
    const [areaRows, productRows, manufacturerRows] = await Promise.all([
      db.select({ slug: businessAreas.slug }).from(businessAreas),
      db.select({ slug: products.slug }).from(products).where(eq(products.isPublished, true)),
      db.select({ slug: manufacturers.slug }).from(manufacturers).where(eq(manufacturers.isActive, true)),
    ]);

    for (const locale of locales) {
      const prefix = locale === "ko" ? "" : `/${locale}`;
      for (const area of areaRows) {
        entries.push({ url: `${siteUrl}${prefix}/business/${area.slug}`, changeFrequency: "monthly" });
      }
      for (const product of productRows) {
        entries.push({ url: `${siteUrl}${prefix}/products/${product.slug}`, changeFrequency: "weekly" });
      }
      for (const manufacturer of manufacturerRows) {
        entries.push({ url: `${siteUrl}${prefix}/partners/${manufacturer.slug}`, changeFrequency: "monthly" });
      }
    }
  } catch {
    // DB not reachable at build/request time (e.g. DATABASE_URL not yet configured) —
    // fall back to the static paths above rather than failing the whole sitemap.
  }

  return entries;
}
