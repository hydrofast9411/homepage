"use client";

import { useState } from "react";
import { publicImageUrl } from "@/lib/image-url";
import type { ClientLogo } from "@/db/schema";

export function ClientLogoForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: ClientLogo;
}) {
  const [preview, setPreview] = useState<string | null>(
    initial?.logoPath ? publicImageUrl("client-logos", initial.logoPath) : null
  );

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium">고객사명</label>
        <input
          name="name"
          defaultValue={initial?.name}
          required
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          로고 이미지{initial ? " (변경 시에만 업로드)" : ""}
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

      <div>
        <label className="mb-1 block text-sm font-medium">정렬 순서</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={initial?.sortOrder ?? 0}
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={initial?.isPublished ?? true} />
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
