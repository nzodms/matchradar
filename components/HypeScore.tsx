"use client";

import { getHypeTier } from "@/lib/hype";
import { cn } from "@/lib/utils";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Flame } from "lucide-react";
import { useEffect, useRef } from "react";

interface HypeScoreProps {
  score: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showTier?: boolean;
  className?: string;
}

const DIMS = {
  xs: { box: 40, stroke: 4, font: "text-sm" },
  sm: { box: 56, stroke: 5, font: "text-lg" },
  md: { box: 84, stroke: 6, font: "text-2xl" },
  lg: { box: 116, stroke: 8, font: "text-4xl" },
  xl: { box: 152, stroke: 10, font: "text-6xl" },
} as const;

/** Animated circular hype ring with count-up and tier color/glow. */
export function HypeScore({ score, size = "md", showTier = false, className }: HypeScoreProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const tier = getHypeTier(score);
  const color = `rgb(var(--${tier.accent}))`;

  const { box, stroke, font } = DIMS[size];
  const r = (box - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  const progress = useMotionValue(0);
  const dashOffset = useTransform(progress, (p) => circumference * (1 - p));
  const count = useTransform(progress, (p) => Math.round(p * score));

  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(progress, 1, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    const unsub = count.on("change", (v) => {
      if (countRef.current) countRef.current.textContent = String(v);
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, progress, count, score]);

  return (
    <div ref={ref} className={cn("relative inline-flex flex-col items-center", className)}>
      <div className="relative" style={{ width: box, height: box }}>
        <svg width={box} height={box} className="-rotate-90">
          <circle
            cx={box / 2}
            cy={box / 2}
            r={r}
            fill="none"
            stroke="rgb(var(--line) / 0.1)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={box / 2}
            cy={box / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffset, filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-display font-bold leading-none tabular", font)} style={{ color }}>
            <span ref={countRef}>{inView ? score : 0}</span>
          </span>
          {(size === "lg" || size === "xl") && (
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-faint">
              / 100 hype
            </span>
          )}
        </div>
      </div>
      {showTier && (
        <span
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide"
          style={{ color }}
        >
          <Flame size={12} strokeWidth={2.6} />
          {tier.label}
        </span>
      )}
    </div>
  );
}

/** Compact inline hype number for dense lists. */
export function HypeChip({ score, className }: { score: number; className?: string }) {
  const tier = getHypeTier(score);
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-0.5 rounded-lg px-1.5 py-0.5 font-display text-sm font-bold tabular",
        className,
      )}
      style={{ color: `rgb(var(--${tier.accent}))`, backgroundColor: `rgb(var(--${tier.accent}) / 0.12)` }}
    >
      {score}
      <span className="text-[9px] font-semibold opacity-60">/100</span>
    </span>
  );
}
