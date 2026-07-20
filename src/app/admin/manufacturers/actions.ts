"use server";

import { db } from "@/db/client";
import { manufacturers, manufacturerBusinessAreas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageVariants, deleteImageVariants } from "@/lib/images";

function parseCommon(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim() || null,
    websiteUrl: String(formData.get("websiteUrl") ?? "").trim() || null,
    descriptionKo: String(formData.get("descriptionKo") ?? "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

function parseBusinessAreaIds(formData: FormData) {
  return formData.getAll("businessAreaIds").map(String).filter(Boolean);
}

async function syncBusinessAreaLinks(manufacturerId: string, businessAreaIds: string[]) {
  await db.delete(manufacturerBusinessAreas).where(eq(manufacturerBusinessAreas.manufacturerId, manufacturerId));
  if (businessAreaIds.length > 0) {
    await db
      .insert(manufacturerBusinessAreas)
      .values(businessAreaIds.map((businessAreaId) => ({ manufacturerId, businessAreaId })));
  }
}

export async function createManufacturer(formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.name) throw new Error("슬러그와 이름을 입력해주세요.");

  const file = formData.get("logo") as File | null;
  let logoPath: string | null = null;
  if (file && file.size > 0) {
    const { cardPath } = await uploadImageVariants("partner-logos", file);
    logoPath = cardPath;
  }

  const [created] = await db.insert(manufacturers).values({ ...parsed, logoPath }).returning();
  await syncBusinessAreaLinks(created.id, parseBusinessAreaIds(formData));

  revalidatePath("/admin/manufacturers");
  redirect("/admin/manufacturers");
}

export async function updateManufacturer(id: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.name) throw new Error("슬러그와 이름을 입력해주세요.");

  const update: Partial<typeof manufacturers.$inferInsert> = { ...parsed, updatedAt: new Date() };
  const file = formData.get("logo") as File | null;

  if (file && file.size > 0) {
    const [existing] = await db.select().from(manufacturers).where(eq(manufacturers.id, id));
    const { cardPath } = await uploadImageVariants("partner-logos", file);
    update.logoPath = cardPath;
    if (existing?.logoPath) {
      await deleteImageVariants("partner-logos", existing.logoPath);
    }
  }

  await db.update(manufacturers).set(update).where(eq(manufacturers.id, id));
  await syncBusinessAreaLinks(id, parseBusinessAreaIds(formData));

  revalidatePath("/admin/manufacturers");
  redirect("/admin/manufacturers");
}

export async function deleteManufacturer(id: string) {
  const [existing] = await db.select().from(manufacturers).where(eq(manufacturers.id, id));
  if (existing?.logoPath) {
    await deleteImageVariants("partner-logos", existing.logoPath);
  }
  await db.delete(manufacturers).where(eq(manufacturers.id, id));
  revalidatePath("/admin/manufacturers");
}
