"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface TabOption<T extends string> {
  key: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId?: string;
  className?: string;
}

/** Segmented control with an animated active pill. */
export function Tabs<T extends string>({ options, value, onChange, layoutId = "tabs", className }: TabsProps<T>) {
  return (
    <div className={cn("no-scrollbar flex gap-1 overflow-x-auto rounded-2xl border border-line/8 bg-surface/40 p-1", className)}>
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={cn(
              "tap relative shrink-0 rounded-xl px-3.5 py-2 text-[13px] font-bold transition-colors",
              active ? "text-bg" : "text-muted hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-hype shadow-glow-hype"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {opt.label}
              {opt.count != null && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular",
                    active ? "bg-bg/20 text-bg" : "bg-line/10 text-faint",
                  )}
                >
                  {opt.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
