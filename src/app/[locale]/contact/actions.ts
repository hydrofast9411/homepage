"use server";

import { db } from "@/db/client";
import { inquiries } from "@/db/schema";

export interface SubmitInquiryResult {
  success: boolean;
  error?: string;
}

export async function submitInquiry(formData: FormData): Promise<SubmitInquiryResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { success: false, error: "필수 항목을 모두 입력해주세요." };
  }

  await db.insert(inquiries).values({
    name,
    email,
    company: String(formData.get("company") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    businessAreaInterest: String(formData.get("businessAreaInterest") ?? "").trim() || null,
    message,
  });

  return { success: true };
}
