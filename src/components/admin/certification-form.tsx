"use client";

import { useState } from "react";
import { publicImageUrl } from "@/lib/image-url";
import type { Certification } from "@/db/schema";

export function CertificationForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Certification;
}) {
  const [preview, setPreview] = useState<string | null>(
    initial?.imagePath ? publicImageUrl("site-media", initial.imagePath) : null
  );

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium">구분</label>
        <select
          name="category"
          defaultValue={initial?.category ?? "certification"}
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
        >
          <option value="patent">특허</option>
          <option value="certification">인증</option>
          <option value="award">수상</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">제목 (한글)</label>
          <input
            name="titleKo"
            defaultValue={initial?.titleKo}
            required
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">제목 (영문)</label>
          <input
            name="titleEn"
            defaultValue={initial?.titleEn ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">발급기관 (한글)</label>
          <input
            name="issuingBodyKo"
            defaultValue={initial?.issuingBodyKo ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">발급기관 (영문)</label>
          <input
            name="issuingBodyEn"
            defaultValue={initial?.issuingBodyEn ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">인증/특허 번호</label>
          <input
            name="certNumber"
            defaultValue={initial?.certNumber ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">발급일</label>
          <input
            type="date"
            name="issueDate"
            defaultValue={initial?.issueDate ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          이미지{initial ? " (변경 시에만 업로드)" : ""}
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="w-full text-sm"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className="mt-2 h-24 w-auto object-contain" />
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
