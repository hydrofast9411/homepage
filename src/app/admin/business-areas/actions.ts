"use server";

import { db } from "@/db/client";
import { businessAreas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageVariants, deleteImageVariants } from "@/lib/images";
import type { ContentSection } from "@/content/business-areas";

function parseContentJson(formData: FormData): ContentSection[] {
  const raw = String(formData.get("contentJson") ?? "").trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ContentSection[]) : [];
  } catch {
    throw new Error("콘텐츠 데이터 형식이 올바르지 않습니다.");
  }
}

function parseCommon(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    nameKo: String(formData.get("nameKo") ?? "").trim(),
    nameEn: String(formData.get("nameEn") ?? "").trim() || null,
    summaryKo: String(formData.get("summaryKo") ?? "").trim() || null,
    summaryEn: String(formData.get("summaryEn") ?? "").trim() || null,
    descriptionKo: String(formData.get("descriptionKo") ?? "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
    taglineKo: String(formData.get("taglineKo") ?? "").trim() || null,
    taglineEn: String(formData.get("taglineEn") ?? "").trim() || null,
    accent: String(formData.get("accent") ?? "").trim() || null,
    areaIndex: String(formData.get("areaIndex") ?? "").trim() || null,
    iconKey: String(formData.get("iconKey") ?? "").trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    contentJson: parseContentJson(formData),
  };
}

export async function createBusinessArea(formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.nameKo) throw new Error("슬러그와 이름(한글)을 입력해주세요.");

  const heroFile = formData.get("heroImage") as File | null;
  let heroImagePath: string | null = null;
  if (heroFile && heroFile.size > 0) {
    const { detailPath } = await uploadImageVariants("site-media", heroFile);
    heroImagePath = detailPath;
  }

  const cardFile = formData.get("cardImage") as File | null;
  let cardImagePath: string | null = null;
  if (cardFile && cardFile.size > 0) {
    const { cardPath } = await uploadImageVariants("site-media", cardFile);
    cardImagePath = cardPath;
  }

  await db.insert(businessAreas).values({ ...parsed, heroImagePath, cardImagePath });
  revalidatePath("/admin/business-areas");
  redirect("/admin/business-areas");
}

export async function updateBusinessArea(id: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.nameKo) throw new Error("슬러그와 이름(한글)을 입력해주세요.");

  const update: Partial<typeof businessAreas.$inferInsert> = { ...parsed, updatedAt: new Date() };
  const heroFile = formData.get("heroImage") as File | null;
  const cardFile = formData.get("cardImage") as File | null;

  if ((heroFile && heroFile.size > 0) || (cardFile && cardFile.size > 0)) {
    const [existing] = await db.select().from(businessAreas).where(eq(businessAreas.id, id));
    if (heroFile && heroFile.size > 0) {
      const { detailPath } = await uploadImageVariants("site-media", heroFile);
      update.heroImagePath = detailPath;
      // Only delete a prior upload if it was a stored path (not a seeded "/content/…" asset).
      if (existing?.heroImagePath && !existing.heroImagePath.startsWith("/")) {
        await deleteImageVariants("site-media", existing.heroImagePath);
      }
    }
    if (cardFile && cardFile.size > 0) {
      const { cardPath } = await uploadImageVariants("site-media", cardFile);
      update.cardImagePath = cardPath;
      if (existing?.cardImagePath && !existing.cardImagePath.startsWith("/")) {
        await deleteImageVariants("site-media", existing.cardImagePath);
      }
    }
  }

  await db.update(businessAreas).set(update).where(eq(businessAreas.id, id));
  revalidatePath("/admin/business-areas");
  redirect("/admin/business-areas");
}

export async function deleteBusinessArea(id: string) {
  const [existing] = await db.select().from(businessAreas).where(eq(businessAreas.id, id));
  if (existing?.heroImagePath) {
    await deleteImageVariants("site-media", existing.heroImagePath);
  }
  await db.delete(businessAreas).where(eq(businessAreas.id, id));
  revalidatePath("/admin/business-areas");
}
