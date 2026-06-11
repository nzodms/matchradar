"use client";

import { getHeatLabel } from "@/lib/market";
import { cn } from "@/lib/utils";
import type { HeatLevel } from "@/types";
import { motion } from "framer-motion";

interface MatchHeatMeterProps {
  level: HeatLevel;
  showLabel?: boolean;
  className?: string;
}

/** 5-segment heat gauge — Tranquille to Chaud bouillant. */
export function MatchHeatMeter({ level, showLabel = true, className }: MatchHeatMeterProps) {
  const meta = getHeatLabel(level);
  const Icon = meta.icon;
  const color = `rgb(var(--${meta.accent}))`;

  return (
    <div className={cn("", className)}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">Niveau de chaleur</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color }}>
            <Icon size={12} strokeWidth={2.4} /> {meta.label}
          </span>
        </div>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((seg) => {
          const filled = seg <= meta.rank;
          return (
            <motion.span
              key={seg}
              initial={{ scaleX: 0.3, opacity: 0.4 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: seg * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-1.5 flex-1 origin-left rounded-full"
              style={{ background: filled ? color : "rgb(var(--line) / 0.1)" }}
            />
          );
        })}
      </div>
    </div>
  );
}
