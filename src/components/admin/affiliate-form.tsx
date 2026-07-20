"use client";

import type { Affiliate } from "@/db/schema";

export function AffiliateForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Affiliate;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">슬러그</label>
          <input
            name="slug"
            defaultValue={initial?.slug}
            required
            placeholder="dongshin"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">정렬 순서</label>
          <input
            type="number"
            name="sortOrder"
            defaultValue={initial?.sortOrder ?? 0}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">이름 (한글)</label>
          <input
            name="nameKo"
            defaultValue={initial?.nameKo}
            required
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">이름 (영문)</label>
          <input
            name="nameEn"
            defaultValue={initial?.nameEn ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">태그라인 (한글)</label>
          <input
            name="taglineKo"
            defaultValue={initial?.taglineKo ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">태그라인 (영문)</label>
          <input
            name="taglineEn"
            defaultValue={initial?.taglineEn ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">로고 (변경 시에만 업로드)</label>
        <input type="file" name="logo" accept="image/*" className="w-full text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">히어로 이미지 (변경 시에만 업로드)</label>
        <input type="file" name="heroImage" accept="image/*" className="w-full text-sm" />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-[var(--radius-card)] bg-[var(--color-steel-light)] py-2 text-sm font-semibold text-white"
      >
        저장
      </button>
    </form>
  );
}
