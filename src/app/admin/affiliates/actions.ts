"use server";

import { db } from "@/db/client";
import { affiliates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageVariants, deleteImageVariants } from "@/lib/images";

function parseCommon(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    nameKo: String(formData.get("nameKo") ?? "").trim(),
    nameEn: String(formData.get("nameEn") ?? "").trim() || null,
    taglineKo: String(formData.get("taglineKo") ?? "").trim() || null,
    taglineEn: String(formData.get("taglineEn") ?? "").trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createAffiliate(formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.nameKo) throw new Error("슬러그와 이름(한글)을 입력해주세요.");

  const logoFile = formData.get("logo") as File | null;
  const heroFile = formData.get("heroImage") as File | null;
  const logoPath = logoFile && logoFile.size > 0 ? (await uploadImageVariants("site-media", logoFile)).cardPath : null;
  const heroImagePath =
    heroFile && heroFile.size > 0 ? (await uploadImageVariants("site-media", heroFile)).detailPath : null;

  await db.insert(affiliates).values({ ...parsed, logoPath, heroImagePath });
  revalidatePath("/admin/affiliates");
  redirect("/admin/affiliates");
}

export async function updateAffiliate(id: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.nameKo) throw new Error("슬러그와 이름(한글)을 입력해주세요.");

  const update: Partial<typeof affiliates.$inferInsert> = { ...parsed };
  const [existing] = await db.select().from(affiliates).where(eq(affiliates.id, id));

  const logoFile = formData.get("logo") as File | null;
  if (logoFile && logoFile.size > 0) {
    update.logoPath = (await uploadImageVariants("site-media", logoFile)).cardPath;
    if (existing?.logoPath) await deleteImageVariants("site-media", existing.logoPath);
  }

  const heroFile = formData.get("heroImage") as File | null;
  if (heroFile && heroFile.size > 0) {
    update.heroImagePath = (await uploadImageVariants("site-media", heroFile)).detailPath;
    if (existing?.heroImagePath) await deleteImageVariants("site-media", existing.heroImagePath);
  }

  await db.update(affiliates).set(update).where(eq(affiliates.id, id));
  revalidatePath("/admin/affiliates");
  redirect("/admin/affiliates");
}

export async function deleteAffiliate(id: string) {
  const [existing] = await db.select().from(affiliates).where(eq(affiliates.id, id));
  if (existing?.logoPath) await deleteImageVariants("site-media", existing.logoPath);
  if (existing?.heroImagePath) await deleteImageVariants("site-media", existing.heroImagePath);
  await db.delete(affiliates).where(eq(affiliates.id, id));
  revalidatePath("/admin/affiliates");
}
