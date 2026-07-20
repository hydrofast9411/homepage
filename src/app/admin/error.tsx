"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-bold">오류가 발생했습니다</h1>
      <p className="max-w-md text-sm text-[var(--color-ink-soft)]">
        {error.message.includes("DATABASE_URL")
          ? "DATABASE_URL 환경변수가 설정되지 않았습니다. Vercel 프로젝트 설정에서 확인해주세요."
          : "관리자 페이지를 불러오는 중 문제가 발생했습니다."}
      </p>
      <pre className="max-w-lg overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-left text-xs text-[var(--color-ink-soft)]">
        {error.message}
      </pre>
      <button
        onClick={() => reset()}
        className="mt-2 rounded-[var(--radius-card)] bg-[var(--color-steel-light)] px-6 py-2.5 text-sm font-semibold text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
