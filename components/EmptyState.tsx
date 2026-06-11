"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "card flex flex-col items-center rounded-3xl border-dashed px-6 py-10 text-center",
        className,
      )}
    >
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-line/8 text-muted ring-1 ring-line/10">
        <Icon size={24} />
      </span>
      <p className="font-display text-base font-bold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
