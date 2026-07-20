"use server";

import { db } from "@/db/client";
import { productCategories } from "@/db/schema";
import type { SpecFieldDef } from "@/db/schema/product-categories";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseCommon(formData: FormData) {
  const businessAreaId = String(formData.get("businessAreaId") ?? "");
  const specSchemaRaw = String(formData.get("specSchema") ?? "[]");

  let specSchema: SpecFieldDef[] = [];
  try {
    specSchema = JSON.parse(specSchemaRaw);
  } catch {
    throw new Error("스펙 양식 데이터가 올바르지 않습니다.");
  }

  // Reject duplicate/blank keys — each key becomes a JSONB key on every product
  // in this category, so it must be unique and non-empty.
  const keys = specSchema.map((f) => f.key).filter(Boolean);
  if (keys.length !== new Set(keys).size) {
    throw new Error("스펙 항목의 키(영문)는 중복될 수 없습니다.");
  }
  if (specSchema.some((f) => !f.key || !f.labelKo)) {
    throw new Error("모든 스펙 항목에는 키와 한글 라벨이 필요합니다.");
  }

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    businessAreaId: businessAreaId || null,
    nameKo: String(formData.get("nameKo") ?? "").trim(),
    nameEn: String(formData.get("nameEn") ?? "").trim() || null,
    descriptionKo: String(formData.get("descriptionKo") ?? "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
    iconKey: String(formData.get("iconKey") ?? "").trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    specSchema,
  };
}

export async function createCategory(formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.nameKo) throw new Error("슬러그와 이름(한글)을 입력해주세요.");

  await db.insert(productCategories).values(parsed);
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.slug || !parsed.nameKo) throw new Error("슬러그와 이름(한글)을 입력해주세요.");

  await db
    .update(productCategories)
    .set({ ...parsed, updatedAt: new Date() })
    .where(eq(productCategories.id, id));

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await db.delete(productCategories).where(eq(productCategories.id, id));
  revalidatePath("/admin/categories");
}
