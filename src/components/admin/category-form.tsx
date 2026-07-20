"use client";

import { SpecFieldBuilder } from "./spec-field-builder";
import type { ProductCategory, BusinessArea } from "@/db/schema";

export function CategoryForm({
  action,
  initial,
  businessAreas,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: ProductCategory;
  businessAreas: BusinessArea[];
}) {
  return (
    <form action={action} className="flex max-w-3xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">슬러그 (URL용, 영문)</label>
          <input
            name="slug"
            defaultValue={initial?.slug}
            required
            placeholder="hydraulic-tensioners"
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
          <label className="mb-1 block text-sm font-medium">분류명 (한글)</label>
          <input
            name="nameKo"
            defaultValue={initial?.nameKo}
            required
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">분류명 (영문)</label>
          <input
            name="nameEn"
            defaultValue={initial?.nameEn ?? ""}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">아이콘 키</label>
          <input
            name="iconKey"
            defaultValue={initial?.iconKey ?? ""}
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

      <div className="mt-2 border-t border-[var(--color-border)] pt-4">
        <h2 className="mb-1 text-sm font-bold">스펙 양식</h2>
        <p className="mb-3 text-xs text-[var(--color-ink-soft)]">
          이 분류에 속하는 제품이 입력받을 항목을 정의합니다. 여기서 정의한 항목이 제품 등록 화면의
          입력폼과 상세페이지의 사양표에 그대로 사용됩니다.
        </p>
        <SpecFieldBuilder name="specSchema" initial={initial?.specSchema ?? []} />
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
