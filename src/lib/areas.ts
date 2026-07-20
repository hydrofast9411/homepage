import { db } from "@/db/client";
import { businessAreas, type BusinessArea } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { contentImageUrl } from "@/lib/image-url";
import type { BusinessAreaContent } from "@/content/business-areas";

const DEFAULT_ACCENT = "#375cfb";

/**
 * Maps a persisted business_areas row into the `BusinessAreaContent` shape the
 * marketing components already consume, resolving stored image references to
 * public URLs. This is the single seam between the CMS/DB and the public UI.
 */
export function rowToAreaContent(row: BusinessArea): BusinessAreaContent {
  return {
    slug: row.slug,
    order: row.sortOrder,
    accent: row.accent || DEFAULT_ACCENT,
    index: row.areaIndex || "",
    name: { ko: row.nameKo, en: row.nameEn ?? undefined },
    nameEn: row.nameEn ?? "",
    tagline: { ko: row.taglineKo ?? "", en: row.taglineEn ?? undefined },
    summary: { ko: row.summaryKo ?? "", en: row.summaryEn ?? undefined },
    heroImage: contentImageUrl(row.heroImagePath) ?? "",
    cardImage: contentImageUrl(row.cardImagePath) ?? "",
    sections: row.contentJson ?? [],
  };
}

export async function getAllAreas(): Promise<BusinessAreaContent[]> {
  const rows = await db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder));
  return rows.map(rowToAreaContent);
}

export async function getAreaContent(slug: string): Promise<BusinessAreaContent | undefined> {
  const [row] = await db.select().from(businessAreas).where(eq(businessAreas.slug, slug));
  return row ? rowToAreaContent(row) : undefined;
}
