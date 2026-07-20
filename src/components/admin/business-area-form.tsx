"use client";

import { useState } from "react";
import { publicImageUrl } from "@/lib/image-url";
import type { BusinessArea } from "@/db/schema";

export function BusinessAreaForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: BusinessArea;
}) {
  const [preview, setPreview] = useState<string | null>(
    initial?.heroImagePath ? publicImageUrl("site-media", initial.heroImagePath) : null
  );

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">슬러그 (URL용, 영문)</label>
          <input
            name="slug"
            defaultValue={initial?.slug}
            required
            placeholder="bolting-torque"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">아이콘 키</label>
          <input
            name="iconKey"
            defaultValue={initial?.iconKey ?? ""}
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
          <label className="mb-1 block text-sm font-medium">한 줄 요약 (한글)</label>
          <input
            name="summaryKo"
            defaultValue={initial?.summaryKo ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">한 줄 요약 (영문)</label>
          <input
            name="summaryEn"
            defaultValue={initial?.summaryEn ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">상세 설명 (한글, 마크다운)</label>
          <textarea
            name="descriptionKo"
            defaultValue={initial?.descriptionKo ?? ""}
            rows={6}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">상세 설명 (영문, 마크다운)</label>
          <textarea
            name="descriptionEn"
            defaultValue={initial?.descriptionEn ?? ""}
            rows={6}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          히어로 이미지{initial ? " (변경 시에만 업로드)" : ""}
        </label>
        <input
          type="file"
          name="heroImage"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="w-full text-sm"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className="mt-2 h-32 w-auto rounded object-cover" />
        )}
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
