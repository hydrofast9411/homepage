"use server";

import { db } from "@/db/client";
import { certifications } from "@/db/schema";
import type { CertificationCategory } from "@/db/schema/certifications";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageVariants, deleteImageVariants } from "@/lib/images";

function parseCommon(formData: FormData) {
  return {
    titleKo: String(formData.get("titleKo") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim() || null,
    issuingBodyKo: String(formData.get("issuingBodyKo") ?? "").trim() || null,
    issuingBodyEn: String(formData.get("issuingBodyEn") ?? "").trim() || null,
    certNumber: String(formData.get("certNumber") ?? "").trim() || null,
    issueDate: String(formData.get("issueDate") ?? "").trim() || null,
    category: String(formData.get("category") ?? "certification") as CertificationCategory,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createCertification(formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.titleKo) throw new Error("제목(한글)을 입력해주세요.");

  const file = formData.get("image") as File | null;
  let imagePath: string | null = null;
  if (file && file.size > 0) {
    const { cardPath } = await uploadImageVariants("site-media", file);
    imagePath = cardPath;
  }

  await db.insert(certifications).values({ ...parsed, imagePath });
  revalidatePath("/admin/certifications");
  redirect("/admin/certifications");
}

export async function updateCertification(id: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.titleKo) throw new Error("제목(한글)을 입력해주세요.");

  const update: Partial<typeof certifications.$inferInsert> = { ...parsed };
  const file = formData.get("image") as File | null;

  if (file && file.size > 0) {
    const [existing] = await db.select().from(certifications).where(eq(certifications.id, id));
    const { cardPath } = await uploadImageVariants("site-media", file);
    update.imagePath = cardPath;
    if (existing?.imagePath) {
      await deleteImageVariants("site-media", existing.imagePath);
    }
  }

  await db.update(certifications).set(update).where(eq(certifications.id, id));
  revalidatePath("/admin/certifications");
  redirect("/admin/certifications");
}

export async function deleteCertification(id: string) {
  const [existing] = await db.select().from(certifications).where(eq(certifications.id, id));
  if (existing?.imagePath) {
    await deleteImageVariants("site-media", existing.imagePath);
  }
  await db.delete(certifications).where(eq(certifications.id, id));
  revalidatePath("/admin/certifications");
}
