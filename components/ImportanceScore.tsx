"use client";

import { importanceLabel } from "@/lib/hype";
import { cn } from "@/lib/utils";
import type { AccentToken } from "@/types";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StatBarProps {
  value: number; // 0–100
  label: string;
  accent?: AccentToken;
  valueSuffix?: string;
  hint?: string;
  delay?: number;
}

/** Animated progress bar — trading/game flavour with a glowing fill. */
export function StatBar({ value, label, accent = "electric", valueSuffix, hint, delay = 0 }: StatBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const color = `rgb(var(--${accent}))`;

  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-muted">{label}</span>
        <span className="font-display text-sm font-bold tabular" style={{ color }}>
          {value}
          {valueSuffix ?? ""}
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-line/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 12px -1px ${color}`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {hint && <p className="mt-1 text-[11px] text-faint">{hint}</p>}
    </div>
  );
}

interface ImportanceScoreProps {
  score: number;
  className?: string;
}

/** Headline importance bar with derived label. */
export function ImportanceScore({ score, className }: ImportanceScoreProps) {
  const accent: AccentToken = score >= 90 ? "danger" : score >= 75 ? "gold" : "electric";
  return (
    <div className={cn("", className)}>
      <StatBar value={score} label="Importance du match" accent={accent} valueSuffix="/100" />
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-faint">
        {importanceLabel(score)}
      </p>
    </div>
  );
}
