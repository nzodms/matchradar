"use client";

import { getHypeTier } from "@/lib/hype";
import { cn } from "@/lib/utils";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useId, useRef } from "react";

interface HypeScoreProps {
  score: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showTier?: boolean;
  className?: string;
}

const DIMS = {
  xs: { box: 40, stroke: 3.5, font: "text-sm", label: false },
  sm: { box: 58, stroke: 4.5, font: "text-xl", label: false },
  md: { box: 86, stroke: 5.5, font: "text-2xl", label: false },
  lg: { box: 112, stroke: 6.5, font: "text-[40px]", label: true },
  xl: { box: 150, stroke: 8, font: "text-6xl", label: true },
} as const;

/** Crisp circular hype ring — clean track, rounded accent arc, count-up. */
export function HypeScore({ score, size = "md", showTier = false, className }: HypeScoreProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const tier = getHypeTier(score);
  const color = `rgb(var(--${tier.accent}))`;
  const gid = useId().replace(/:/g, "");

  const { box, stroke, font, label } = DIMS[size];
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
        <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} className="-rotate-90">
          <defs>
            <linearGradient id={`g${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.65" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>
          <circle cx={box / 2} cy={box / 2} r={r} fill="none" stroke="rgb(var(--line) / 0.08)" strokeWidth={stroke} />
          <motion.circle
            cx={box / 2}
            cy={box / 2}
            r={r}
            fill="none"
            stroke={`url(#g${gid})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-display font-bold leading-none tabular", font)} style={{ color }}>
            <span ref={countRef}>{inView ? score : 0}</span>
          </span>
          {label && <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-faint">Hype</span>}
        </div>
      </div>
      {showTier && (
        <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
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
      className={cn("inline-flex items-baseline gap-0.5 rounded-lg px-1.5 py-0.5 font-display text-sm font-bold tabular", className)}
      style={{ color: `rgb(var(--${tier.accent}))`, backgroundColor: `rgb(var(--${tier.accent}) / 0.1)` }}
    >
      {score}
      <span className="text-[9px] font-semibold opacity-60">/100</span>
    </span>
  );
}
