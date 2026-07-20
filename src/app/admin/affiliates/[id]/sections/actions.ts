"use server";

import { db } from "@/db/client";
import { affiliateSections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageVariants, deleteImageVariants } from "@/lib/images";

function parseCommon(formData: FormData) {
  return {
    sectionKey: String(formData.get("sectionKey") ?? "").trim(),
    headingKo: String(formData.get("headingKo") ?? "").trim() || null,
    headingEn: String(formData.get("headingEn") ?? "").trim() || null,
    bodyKo: String(formData.get("bodyKo") ?? "").trim() || null,
    bodyEn: String(formData.get("bodyEn") ?? "").trim() || null,
    layoutVariant: String(formData.get("layoutVariant") ?? "").trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createAffiliateSection(affiliateId: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.sectionKey) throw new Error("섹션 키를 입력해주세요.");

  const file = formData.get("image") as File | null;
  const imagePath = file && file.size > 0 ? (await uploadImageVariants("site-media", file)).detailPath : null;

  await db.insert(affiliateSections).values({ ...parsed, affiliateId, imagePath });
  revalidatePath(`/admin/affiliates/${affiliateId}/sections`);
  redirect(`/admin/affiliates/${affiliateId}/sections`);
}

export async function updateAffiliateSection(affiliateId: string, sectionId: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.sectionKey) throw new Error("섹션 키를 입력해주세요.");

  const update: Partial<typeof affiliateSections.$inferInsert> = { ...parsed };
  const file = formData.get("image") as File | null;

  if (file && file.size > 0) {
    const [existing] = await db.select().from(affiliateSections).where(eq(affiliateSections.id, sectionId));
    update.imagePath = (await uploadImageVariants("site-media", file)).detailPath;
    if (existing?.imagePath) await deleteImageVariants("site-media", existing.imagePath);
  }

  await db.update(affiliateSections).set(update).where(eq(affiliateSections.id, sectionId));
  revalidatePath(`/admin/affiliates/${affiliateId}/sections`);
  redirect(`/admin/affiliates/${affiliateId}/sections`);
}

export async function deleteAffiliateSection(affiliateId: string, sectionId: string) {
  const [existing] = await db.select().from(affiliateSections).where(eq(affiliateSections.id, sectionId));
  if (existing?.imagePath) await deleteImageVariants("site-media", existing.imagePath);
  await db.delete(affiliateSections).where(eq(affiliateSections.id, sectionId));
  revalidatePath(`/admin/affiliates/${affiliateId}/sections`);
}
