"use client";

import { useEffect } from "react";

// Catches errors that occur above/outside both [locale]/error.tsx and
// admin/error.tsx (e.g. a throw inside the root layout itself, such as a
// missing env var read at layout render time). Must render its own
// <html>/<body> since it replaces the entire tree when triggered.
export default function GlobalError({
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
    <html lang="ko">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>일시적인 오류가 발생했습니다 / Something went wrong</h1>
          <p style={{ maxWidth: 480, color: "#666", fontSize: "0.875rem" }}>
            페이지를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: "0.5rem",
              borderRadius: 6,
              background: "#375CFB",
              color: "white",
              padding: "0.625rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            다시 시도 / Retry
          </button>
        </div>
      </body>
    </html>
  );
}
