"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
      <div className="mb-6 font-bold tracking-tight text-lg">
        <span className="text-[var(--color-steel-light)]">HYDRO</span>
        <span className="text-[var(--color-safety-orange)]">FAST</span>
        <span className="ml-2 text-sm font-normal text-[var(--color-ink-soft)]">관리자 로그인</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">이메일</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">비밀번호</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-[var(--color-safety-orange)]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-[var(--radius-card)] bg-[var(--color-steel-light)] py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
