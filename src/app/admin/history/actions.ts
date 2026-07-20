"use server";

import { db } from "@/db/client";
import { historyEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseCommon(formData: FormData) {
  return {
    year: Number(formData.get("year") ?? 0),
    month: formData.get("month") ? Number(formData.get("month")) : null,
    titleKo: String(formData.get("titleKo") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim() || null,
    descriptionKo: String(formData.get("descriptionKo") ?? "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
    isHighlight: formData.get("isHighlight") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createHistoryEvent(formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.year || !parsed.titleKo) throw new Error("연도와 제목(한글)을 입력해주세요.");
  await db.insert(historyEvents).values(parsed);
  revalidatePath("/admin/history");
  redirect("/admin/history");
}

export async function updateHistoryEvent(id: string, formData: FormData) {
  const parsed = parseCommon(formData);
  if (!parsed.year || !parsed.titleKo) throw new Error("연도와 제목(한글)을 입력해주세요.");
  await db.update(historyEvents).set(parsed).where(eq(historyEvents.id, id));
  revalidatePath("/admin/history");
  redirect("/admin/history");
}

export async function deleteHistoryEvent(id: string) {
  await db.delete(historyEvents).where(eq(historyEvents.id, id));
  revalidatePath("/admin/history");
}
