"use server";

import { db } from "@/db/client";
import { inquiries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function markInquiryRead(id: string, isRead: boolean) {
  await db.update(inquiries).set({ isRead }).where(eq(inquiries.id, id));
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(id: string) {
  await db.delete(inquiries).where(eq(inquiries.id, id));
  revalidatePath("/admin/inquiries");
}
