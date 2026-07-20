"use client";

import { useState } from "react";
import { publicImageUrl } from "@/lib/image-url";
import type { Manufacturer, BusinessArea } from "@/db/schema";

export function ManufacturerForm({
  action,
  initial,
  businessAreas,
  selectedBusinessAreaIds = [],
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Manufacturer;
  businessAreas: BusinessArea[];
  selectedBusinessAreaIds?: string[];
}) {
  const [preview, setPreview] = useState<string | null>(
    initial?.logoPath ? publicImageUrl("partner-logos", initial.logoPath) : null
  );

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">슬러그 (URL용, 영문)</label>
          <input
            name="slug"
            defaultValue={initial?.slug}
            required
            placeholder="rexroth"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">제조사명</label>
          <input
            name="name"
            defaultValue={initial?.name}
            required
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">국가</label>
          <input
            name="country"
            defaultValue={initial?.country ?? ""}
            placeholder="Germany"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">웹사이트</label>
        <input
          name="websiteUrl"
          defaultValue={initial?.websiteUrl ?? ""}
          placeholder="https://"
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">소개 (한글)</label>
          <textarea
            name="descriptionKo"
            defaultValue={initial?.descriptionKo ?? ""}
            rows={4}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">소개 (영문)</label>
          <textarea
            name="descriptionEn"
            defaultValue={initial?.descriptionEn ?? ""}
            rows={4}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">사업 분야 (해당되는 항목 모두 선택)</label>
        <div className="flex flex-wrap gap-4">
          {businessAreas.map((ba) => (
            <label key={ba.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="businessAreaIds"
                value={ba.id}
                defaultChecked={selectedBusinessAreaIds.includes(ba.id)}
              />
              {ba.nameKo}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          로고{initial ? " (변경 시에만 업로드)" : ""}
        </label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="w-full text-sm"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className="mt-2 h-16 w-auto object-contain" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} />
          활성 (사이트에 표시)
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
