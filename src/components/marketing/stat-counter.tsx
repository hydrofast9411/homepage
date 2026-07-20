"use client";

import { useCountUp } from "@/hooks/use-count-up";

export function StatCounter({
  target,
  suffix = "",
  label,
}: {
  target: number;
  suffix?: string;
  label: string;
}) {
  const { ref, value } = useCountUp(target);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <div className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-steel-light)]">
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-[var(--color-ink-soft)]">{label}</div>
    </div>
  );
}
