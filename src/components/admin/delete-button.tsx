"use client";

import { useTransition } from "react";

export function DeleteButton({
  id,
  onDelete,
  label = "삭제",
  confirmMessage = "정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
}: {
  id: string;
  onDelete: (id: string) => Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          await onDelete(id);
        });
      }}
      className="text-[var(--color-safety-orange)] disabled:opacity-50"
    >
      {isPending ? "삭제 중..." : label}
    </button>
  );
}
