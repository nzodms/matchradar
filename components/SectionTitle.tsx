"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionTitle({ eyebrow, title, action, className }: SectionTitleProps) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}
