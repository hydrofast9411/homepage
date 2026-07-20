"use client";

import { useState } from "react";
import { publicImageUrl } from "@/lib/image-url";
import { ProductSpecFields } from "./product-spec-fields";
import type { Product, ProductCategory, Manufacturer, ProductImage } from "@/db/schema";
import { deleteGalleryImage } from "@/app/admin/products/actions";

export function ProductForm({
  action,
  initial,
  categories,
  manufacturersList,
  galleryImages = [],
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Product;
  categories: ProductCategory[];
  manufacturersList: Manufacturer[];
  galleryImages?: ProductImage[];
}) {
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(
    initial?.primaryImagePath ? publicImageUrl("product-images", initial.primaryImagePath) : null
  );

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">슬러그 (URL용, 영문)</label>
          <input
            name="slug"
            defaultValue={initial?.slug}
            required
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">모델명</label>
          <input
            name="modelNo"
            defaultValue={initial?.modelNo ?? ""}
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
          <label className="mb-1 block text-sm font-medium">제품 분류</label>
          <select
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          >
            <option value="">선택</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameKo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">제조사</label>
          <select
            name="manufacturerId"
            defaultValue={initial?.manufacturerId ?? ""}
            required
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          >
            <option value="">선택</option>
            {manufacturersList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">제품명 (한글)</label>
          <input
            name="nameKo"
            defaultValue={initial?.nameKo}
            required
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">제품명 (영문)</label>
          <input
            name="nameEn"
            defaultValue={initial?.nameEn ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">카드 요약 (한글, 검색결과에 표시)</label>
          <input
            name="shortDescriptionKo"
            defaultValue={initial?.shortDescriptionKo ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">카드 요약 (영문)</label>
          <input
            name="shortDescriptionEn"
            defaultValue={initial?.shortDescriptionEn ?? ""}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">상세 설명 (한글)</label>
          <textarea
            name="descriptionKo"
            defaultValue={initial?.descriptionKo ?? ""}
            rows={5}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">상세 설명 (영문)</label>
          <textarea
            name="descriptionEn"
            defaultValue={initial?.descriptionEn ?? ""}
            rows={5}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-4">
        <h2 className="mb-3 text-sm font-bold">제품 사양</h2>
        <ProductSpecFields
          fields={selectedCategory?.specSchema ?? []}
          initialSpecs={(initial?.specs as Record<string, string | number | boolean>) ?? {}}
        />
      </div>

      <div className="border-t border-[var(--color-border)] pt-4">
        <label className="mb-1 block text-sm font-medium">
          대표 이미지{initial ? " (변경 시에만 업로드)" : ""}
        </label>
        <input
          type="file"
          name="primaryImage"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPrimaryPreview(URL.createObjectURL(file));
          }}
          className="w-full text-sm"
        />
        {primaryPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primaryPreview} alt="preview" className="mt-2 h-32 w-32 rounded object-cover" />
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">갤러리 이미지 추가</label>
        <input type="file" name="galleryImages" accept="image/*" multiple className="w-full text-sm" />

        {galleryImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {galleryImages.map((img) => (
              <div key={img.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicImageUrl("product-images", img.storagePath) ?? undefined}
                  alt=""
                  className="h-20 w-20 rounded object-cover"
                />
                {initial && (
                  <button
                    type="button"
                    onClick={() => deleteGalleryImage(img.id, initial.id)}
                    className="absolute -right-1 -top-1 rounded-full bg-[var(--color-safety-orange)] px-1.5 text-xs text-white"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={initial?.isPublished ?? false} />
        게시하기 (체크 해제 시 사이트에 표시되지 않음)
      </label>

      <button
        type="submit"
        className="mt-2 rounded-[var(--radius-card)] bg-[var(--color-steel-light)] py-2 text-sm font-semibold text-white"
      >
        저장
      </button>
    </form>
  );
}
