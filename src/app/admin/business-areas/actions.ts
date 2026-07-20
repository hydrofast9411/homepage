"use server";

import { db } from "@/db/client";
import { businessAreas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageVariants, deleteImageVariants } from "@/lib/images";

function parseCommon(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    nameKo: String(formData.get("nameKo") ?? "").trim(),
    nameEn: String(formData.get("nameEn") ?? "").trim() || null,
    summaryKo: String(formData.get("summaryKo") ?? "").trim() || null,
    summaryEn: String(formData.get("summaryEn") ?? "").trim() || null,
    descriptionKo: String(formData.get("descriptionKo") ?? "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
    iconKey: String(formData.get("iconKey") ?? "").trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createBusinessArea(formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.nameKo) throw new Error("슬러그와 이름(한글)을 입력해주세요.");

  const file = formData.get("heroImage") as File | null;
  let heroImagePath: string | null = null;
  if (file && file.size > 0) {
    const { detailPath } = await uploadImageVariants("site-media", file);
    heroImagePath = detailPath;
  }

  await db.insert(businessAreas).values({ ...parsed, heroImagePath });
  revalidatePath("/admin/business-areas");
  redirect("/admin/business-areas");
}

export async function updateBusinessArea(id: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.nameKo) throw new Error("슬러그와 이름(한글)을 입력해주세요.");

  const update: Partial<typeof businessAreas.$inferInsert> = { ...parsed, updatedAt: new Date() };
  const file = formData.get("heroImage") as File | null;

  if (file && file.size > 0) {
    const [existing] = await db.select().from(businessAreas).where(eq(businessAreas.id, id));
    const { detailPath } = await uploadImageVariants("site-media", file);
    update.heroImagePath = detailPath;
    if (existing?.heroImagePath) {
      await deleteImageVariants("site-media", existing.heroImagePath);
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
