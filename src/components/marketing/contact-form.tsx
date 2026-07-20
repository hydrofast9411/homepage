"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { submitInquiry } from "@/app/[locale]/contact/actions";
import type { BusinessArea } from "@/db/schema";

export function ContactForm({ businessAreas }: { businessAreas: BusinessArea[] }) {
  const t = useTranslations("contactPage");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitInquiry(formData);
      setResult(res);
    });
  }

  if (result?.success) {
    return (
      <p className="rounded-[var(--radius-card)] border border-[var(--color-steel-light)] bg-[var(--color-surface)] p-6 text-center text-sm">
        {t("formSuccess")}
      </p>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <input name="name" required placeholder={t("formName")} className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2.5 text-sm" />
        <input name="company" placeholder={t("formCompany")} className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2.5 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input type="email" name="email" required placeholder={t("formEmail")} className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2.5 text-sm" />
        <input name="phone" placeholder={t("formPhone")} className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2.5 text-sm" />
      </div>
      <select name="businessAreaInterest" className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2.5 text-sm">
        <option value="">{t("formBusinessArea")}</option>
        {businessAreas.map((ba) => (
          <option key={ba.id} value={ba.nameKo}>
            {ba.nameKo}
          </option>
        ))}
      </select>
      <textarea name="message" required rows={5} placeholder={t("formMessage")} className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2.5 text-sm" />

      {result?.error && <p className="text-sm text-[var(--color-safety-orange)]">{result.error}</p>}
      {result?.success === false && !result.error && <p className="text-sm text-[var(--color-safety-orange)]">{t("formError")}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-[var(--radius-card)] bg-[var(--color-steel-light)] py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "..." : t("formSubmit")}
      </button>
    </form>
  );
}
