"use server";

import { db } from "@/db/client";
import { products, productImages, productCategories, manufacturers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageVariants, deleteImageVariants } from "@/lib/images";
import { parseSpecsFromFormData } from "@/lib/spec-schema";
import { buildSearchText } from "@/lib/search";

async function buildProductRow(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const manufacturerId = String(formData.get("manufacturerId") ?? "") || null;

  const [category] = categoryId
    ? await db.select().from(productCategories).where(eq(productCategories.id, categoryId))
    : [null];
  const [manufacturer] = manufacturerId
    ? await db.select().from(manufacturers).where(eq(manufacturers.id, manufacturerId))
    : [null];

  const specSchema = category?.specSchema ?? [];
  const specs = parseSpecsFromFormData(specSchema, formData);

  const common = {
    slug: String(formData.get("slug") ?? "").trim(),
    modelNo: String(formData.get("modelNo") ?? "").trim() || null,
    manufacturerId,
    categoryId,
    businessAreaId: category?.businessAreaId ?? null,
    nameKo: String(formData.get("nameKo") ?? "").trim(),
    nameEn: String(formData.get("nameEn") ?? "").trim() || null,
    shortDescriptionKo: String(formData.get("shortDescriptionKo") ?? "").trim() || null,
    shortDescriptionEn: String(formData.get("shortDescriptionEn") ?? "").trim() || null,
    descriptionKo: String(formData.get("descriptionKo") ?? "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
    specs,
    isPublished: formData.get("isPublished") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };

  if (!common.slug || !common.nameKo) {
    throw new Error("슬러그와 제품명(한글)을 입력해주세요.");
  }

  const searchText = buildSearchText({
    nameKo: common.nameKo,
    nameEn: common.nameEn,
    shortDescriptionKo: common.shortDescriptionKo,
    shortDescriptionEn: common.shortDescriptionEn,
    modelNo: common.modelNo,
    manufacturerName: manufacturer?.name ?? null,
    categoryNameKo: category?.nameKo ?? null,
    categoryNameEn: category?.nameEn ?? null,
    specs,
    specSchema,
  });

  return { ...common, searchText };
}

async function attachGalleryImages(productId: string, formData: FormData) {
  const files = formData.getAll("galleryImages").filter((f): f is File => f instanceof File && f.size > 0);
  const existingCount = (
    await db.select().from(productImages).where(eq(productImages.productId, productId))
  ).length;

  for (let i = 0; i < files.length; i++) {
    const { cardPath } = await uploadImageVariants("product-images", files[i]);
    await db.insert(productImages).values({
      productId,
      storagePath: cardPath,
      sortOrder: existingCount + i,
      isPrimary: false,
    });
  }
}

export async function createProduct(formData: FormData) {
  const row = await buildProductRow(formData);

  const file = formData.get("primaryImage") as File | null;
  let primaryImagePath: string | null = null;
  if (file && file.size > 0) {
    const { cardPath } = await uploadImageVariants("product-images", file);
    primaryImagePath = cardPath;
  }

  const [created] = await db.insert(products).values({ ...row, primaryImagePath }).returning();
  await attachGalleryImages(created.id, formData);

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const row = await buildProductRow(formData);
  const update: Partial<typeof products.$inferInsert> = { ...row, updatedAt: new Date() };

  const file = formData.get("primaryImage") as File | null;
  if (file && file.size > 0) {
    const [existing] = await db.select().from(products).where(eq(products.id, id));
    const { cardPath } = await uploadImageVariants("product-images", file);
    update.primaryImagePath = cardPath;
    if (existing?.primaryImagePath) {
      await deleteImageVariants("product-images", existing.primaryImagePath);
    }
  }

  await db.update(products).set(update).where(eq(products.id, id));
  await attachGalleryImages(id, formData);

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const [existing] = await db.select().from(products).where(eq(products.id, id));
  const images = await db.select().from(productImages).where(eq(productImages.productId, id));

  if (existing?.primaryImagePath) {
    await deleteImageVariants("product-images", existing.primaryImagePath);
  }
  for (const img of images) {
    await deleteImageVariants("product-images", img.storagePath);
  }

  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
}

export async function deleteGalleryImage(imageId: string, productId: string) {
  const [existing] = await db.select().from(productImages).where(eq(productImages.id, imageId));
  if (existing) {
    await deleteImageVariants("product-images", existing.storagePath);
    await db.delete(productImages).where(eq(productImages.id, imageId));
  }
  revalidatePath(`/admin/products/${productId}/edit`);
}
