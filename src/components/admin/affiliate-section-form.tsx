"use client";

import type { AffiliateSection } from "@/db/schema";

export function AffiliateSectionForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: AffiliateSection;
}) {
  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">섹션 키 (영문, 고유값)</label>
          <input
            name="sectionKey"
            defaultValue={initial?.sectionKey}
            required
            placeholder="gfrp-rebar-intro"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">레이아웃 변형</label>
          <input
            name="layoutVariant"
            defaultValue={initial?.layoutVariant ?? ""}
            placeholder="image-right / image-left / full-width"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">제목 (한글)</label>
          <input
            name="headingKo"
            defaultValue={initial?.headingKo ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">제목 (영문)</label>
          <input
            name="headingEn"
            defaultValue={initial?.headingEn ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">본문 (한글, 마크다운)</label>
          <textarea
            name="bodyKo"
            defaultValue={initial?.bodyKo ?? ""}
            rows={6}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">본문 (영문, 마크다운)</label>
          <textarea
            name="bodyEn"
            defaultValue={initial?.bodyEn ?? ""}
            rows={6}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">이미지 (변경 시에만 업로드)</label>
        <input type="file" name="image" accept="image/*" className="w-full text-sm" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">정렬 순서</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={initial?.sortOrder ?? 0}
          className="w-full max-w-[8rem] rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
        />
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
