"use server";

import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function upsertSetting(formData: FormData) {
  const settingKey = String(formData.get("settingKey") ?? "").trim();
  if (!settingKey) throw new Error("설정 키를 입력해주세요.");

  const valueKo = String(formData.get("valueKo") ?? "").trim() || null;
  const valueEn = String(formData.get("valueEn") ?? "").trim() || null;

  const existing = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, settingKey));

  if (existing.length > 0) {
    await db.update(siteSettings).set({ valueKo, valueEn }).where(eq(siteSettings.settingKey, settingKey));
  } else {
    await db.insert(siteSettings).values({ settingKey, valueKo, valueEn });
  }

  revalidatePath("/admin/settings");
}

export async function deleteSetting(settingKey: string) {
  await db.delete(siteSettings).where(eq(siteSettings.settingKey, settingKey));
  revalidatePath("/admin/settings");
}
