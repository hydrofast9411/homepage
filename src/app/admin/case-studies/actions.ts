"use server";

import { db } from "@/db/client";
import { caseStudies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageVariants, deleteImageVariants } from "@/lib/images";

function parseCommon(formData: FormData) {
  const businessAreaId = String(formData.get("businessAreaId") ?? "");
  return {
    clientName: String(formData.get("clientName") ?? "").trim(),
    titleKo: String(formData.get("titleKo") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim() || null,
    descriptionKo: String(formData.get("descriptionKo") ?? "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
    aspectRatio: String(formData.get("aspectRatio") ?? "21-9"),
    businessAreaId: businessAreaId || null,
    isPublished: formData.get("isPublished") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createCaseStudy(formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.clientName || !parsed.titleKo) {
    throw new Error("고객사명과 제목(한글)을 입력해주세요.");
  }

  const file = formData.get("image") as File | null;
  let imagePath: string | null = null;
  if (file && file.size > 0) {
    const { cardPath } = await uploadImageVariants("case-study-images", file);
    imagePath = cardPath;
  }

  await db.insert(caseStudies).values({ ...parsed, imagePath });

  revalidatePath("/admin/case-studies");
  redirect("/admin/case-studies");
}

export async function updateCaseStudy(id: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.clientName || !parsed.titleKo) {
    throw new Error("고객사명과 제목(한글)을 입력해주세요.");
  }

  const update: Partial<typeof caseStudies.$inferInsert> = { ...parsed };
  const file = formData.get("image") as File | null;

  if (file && file.size > 0) {
    const [existing] = await db.select().from(caseStudies).where(eq(caseStudies.id, id));
    const { cardPath } = await uploadImageVariants("case-study-images", file);
    update.imagePath = cardPath;
    if (existing?.imagePath) {
      await deleteImageVariants("case-study-images", existing.imagePath);
    }
  }

  await db.update(caseStudies).set(update).where(eq(caseStudies.id, id));

  revalidatePath("/admin/case-studies");
  redirect("/admin/case-studies");
}

export async function deleteCaseStudy(id: string) {
  const [existing] = await db.select().from(caseStudies).where(eq(caseStudies.id, id));
  if (existing?.imagePath) {
    await deleteImageVariants("case-study-images", existing.imagePath);
  }
  await db.delete(caseStudies).where(eq(caseStudies.id, id));
  revalidatePath("/admin/case-studies");
}
