"use client";

import { useState } from "react";
import { publicImageUrl } from "@/lib/image-url";
import { BlockEditor } from "@/components/admin/block-editor";
import type { BusinessArea } from "@/db/schema";

const inputCls =
  "w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm";

function previewUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return publicImageUrl("site-media", path);
}

export function BusinessAreaForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: BusinessArea;
}) {
  const [heroPreview, setHeroPreview] = useState<string | null>(previewUrl(initial?.heroImagePath));
  const [cardPreview, setCardPreview] = useState<string | null>(previewUrl(initial?.cardImagePath));

  return (
    <form action={action} className="flex max-w-4xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">슬러그 (URL용, 영문)</label>
          <input name="slug" defaultValue={initial?.slug} required placeholder="bolting-torque" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">번호 (예: 01)</label>
          <input name="areaIndex" defaultValue={initial?.areaIndex ?? ""} placeholder="01" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">이름 (한글)</label>
          <input name="nameKo" defaultValue={initial?.nameKo} required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">이름 (영문)</label>
          <input name="nameEn" defaultValue={initial?.nameEn ?? ""} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">테마 색상 (Accent)</label>
          <input name="accent" defaultValue={initial?.accent ?? "#375cfb"} placeholder="#375cfb" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">미리보기</label>
          <div
            className="h-9 w-16 rounded-[var(--radius-card)] border border-[var(--color-border)]"
            style={{ backgroundColor: initial?.accent ?? "#375cfb" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">태그라인 (한글)</label>
          <input name="taglineKo" defaultValue={initial?.taglineKo ?? ""} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">태그라인 (영문)</label>
          <input name="taglineEn" defaultValue={initial?.taglineEn ?? ""} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">한 줄 요약 (한글)</label>
          <textarea name="summaryKo" defaultValue={initial?.summaryKo ?? ""} rows={2} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">한 줄 요약 (영문)</label>
          <textarea name="summaryEn" defaultValue={initial?.summaryEn ?? ""} rows={2} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">히어로 이미지{initial ? " (변경 시에만 업로드)" : ""}</label>
          <input
            type="file"
            name="heroImage"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setHeroPreview(URL.createObjectURL(file));
            }}
            className="w-full text-sm"
          />
          {heroPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroPreview} alt="hero preview" className="mt-2 h-28 w-auto rounded object-cover" />
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">카드 이미지{initial ? " (변경 시에만 업로드)" : ""}</label>
          <input
            type="file"
            name="cardImage"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setCardPreview(URL.createObjectURL(file));
            }}
            className="w-full text-sm"
          />
          {cardPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cardPreview} alt="card preview" className="mt-2 h-28 w-auto rounded object-cover" />
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">정렬 순서</label>
        <input type="number" name="sortOrder" defaultValue={initial?.sortOrder ?? 0} className="w-full max-w-[8rem] rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm" />
      </div>

      <div className="mt-4 border-t border-[var(--color-border)] pt-4">
        <h2 className="mb-1 text-base font-bold">상세 페이지 콘텐츠</h2>
        <p className="mb-4 text-xs text-[var(--color-ink-soft)]">
          사업 분야 상세 페이지(/business/슬러그)에 표시되는 섹션과 블록을 편집합니다.
        </p>
        <BlockEditor name="contentJson" initial={initial?.contentJson ?? []} />
      </div>

      <button
        type="submit"
        className="mt-4 rounded-[var(--radius-card)] bg-[var(--color-steel-light)] py-2 text-sm font-semibold text-white"
      >
        저장
      </button>
    </form>
  );
}
