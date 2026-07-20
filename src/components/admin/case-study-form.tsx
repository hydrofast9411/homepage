"use client";

import { useState } from "react";
import { publicImageUrl } from "@/lib/image-url";
import type { CaseStudy, BusinessArea } from "@/db/schema";

const ASPECT_RATIOS = ["21-9", "16-10", "4-3", "9-16", "1-1"];

export function CaseStudyForm({
  action,
  initial,
  businessAreas,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: CaseStudy;
  businessAreas: BusinessArea[];
}) {
  const [preview, setPreview] = useState<string | null>(
    initial?.imagePath ? publicImageUrl("case-study-images", initial.imagePath) : null
  );

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">고객사명</label>
          <input
            name="clientName"
            defaultValue={initial?.clientName}
            required
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">사업 분야</label>
          <select
            name="businessAreaId"
            defaultValue={initial?.businessAreaId ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          >
            <option value="">선택 안함</option>
            {businessAreas.map((ba) => (
              <option key={ba.id} value={ba.id}>
                {ba.nameKo}
              </option>
            ))}
          </select>
        </div>
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
          <label className="mb-1 block text-sm font-medium">설명 (한글)</label>
          <textarea
            name="descriptionKo"
            defaultValue={initial?.descriptionKo ?? ""}
            rows={3}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">설명 (영문)</label>
          <textarea
            name="descriptionEn"
            defaultValue={initial?.descriptionEn ?? ""}
            rows={3}
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
          <img src={preview} alt="preview" className="mt-2 h-32 w-auto rounded object-cover" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">이미지 비율</label>
          <select
            name="aspectRatio"
            defaultValue={initial?.aspectRatio ?? "21-9"}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          >
            {ASPECT_RATIOS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
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
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" name="isPublished" defaultChecked={initial?.isPublished ?? true} />
          게시하기
        </label>
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
