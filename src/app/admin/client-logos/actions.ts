"use server";

import { db } from "@/db/client";
import { clientLogos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageVariants, deleteImageVariants } from "@/lib/images";

function parseCommon(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    isPublished: formData.get("isPublished") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createClientLogo(formData: FormData) {
  const { name, isPublished, sortOrder } = parseCommon(formData);
  const file = formData.get("logo") as File | null;

  if (!name) throw new Error("고객사명을 입력해주세요.");
  if (!file || file.size === 0) throw new Error("로고 이미지를 업로드해주세요.");

  const { cardPath } = await uploadImageVariants("client-logos", file);

  await db.insert(clientLogos).values({
    name,
    logoPath: cardPath,
    isPublished,
    sortOrder,
  });

  revalidatePath("/admin/client-logos");
  redirect("/admin/client-logos");
}

export async function updateClientLogo(id: string, formData: FormData) {
  const { name, isPublished, sortOrder } = parseCommon(formData);
  const file = formData.get("logo") as File | null;

  if (!name) throw new Error("고객사명을 입력해주세요.");

  const update: Partial<typeof clientLogos.$inferInsert> = { name, isPublished, sortOrder };

  if (file && file.size > 0) {
    const [existing] = await db.select().from(clientLogos).where(eq(clientLogos.id, id));
    const { cardPath } = await uploadImageVariants("client-logos", file);
    update.logoPath = cardPath;
    if (existing?.logoPath) {
      await deleteImageVariants("client-logos", existing.logoPath);
    }
  }

  await db.update(clientLogos).set(update).where(eq(clientLogos.id, id));

  revalidatePath("/admin/client-logos");
  redirect("/admin/client-logos");
}

export async function deleteClientLogo(id: string) {
  const [existing] = await db.select().from(clientLogos).where(eq(clientLogos.id, id));
  if (existing?.logoPath) {
    await deleteImageVariants("client-logos", existing.logoPath);
  }
  await db.delete(clientLogos).where(eq(clientLogos.id, id));
  revalidatePath("/admin/client-logos");
}
