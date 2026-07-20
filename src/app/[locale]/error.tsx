"use client";

import { useEffect } from "react";

export default function LocaleError({
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
      <div className="font-bold tracking-tight text-lg">
        <span className="text-[var(--color-steel-light)]">HYDRO</span>
        <span className="text-[var(--color-safety-orange)]">FAST</span>
      </div>
      <h1 className="text-xl font-bold">일시적인 오류가 발생했습니다.</h1>
      <p className="max-w-md text-sm text-[var(--color-ink-soft)]">
        페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        <br />
        Something went wrong loading this page. Please try again shortly.
      </p>
      <button
        onClick={() => reset()}
        className="mt-2 rounded-[var(--radius-card)] bg-[var(--color-steel-light)] px-6 py-2.5 text-sm font-semibold text-white"
      >
        다시 시도 / Retry
      </button>
    </div>
  );
}
