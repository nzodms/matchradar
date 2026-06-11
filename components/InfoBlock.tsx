"use client";

import { cn } from "@/lib/utils";
import type { AccentToken } from "@/types";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface InfoBlockProps {
  icon: LucideIcon;
  title: string;
  accent?: AccentToken;
  children: ReactNode;
  className?: string;
}

/** Titled content block used across the match detail page. */
export function InfoBlock({ icon: Icon, title, accent = "electric", children, className }: InfoBlockProps) {
  return (
    <div className={cn("glass rounded-3xl p-4", className)}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg ring-1 ring-line/10"
          style={{ background: `rgb(var(--${accent}) / 0.14)`, color: `rgb(var(--${accent}))` }}
        >
          <Icon size={15} />
        </span>
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">{title}</h3>
      </div>
      <div className="text-[14px] leading-relaxed text-muted">{children}</div>
    </div>
  );
}
