"use client";

import { MotionConfig } from "framer-motion";

/**
 * Wraps the whole app once so every Framer Motion animation respects
 * prefers-reduced-motion automatically, without per-component checks.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
