"use client";

import { getBadge } from "@/lib/badges";
import { cn } from "@/lib/utils";
import type { AccentToken, BadgeKey } from "@/types";

const SIZES = {
  sm: "h-[22px] gap-1 px-2 text-[10px]",
  md: "h-7 gap-1.5 px-2.5 text-[11px]",
} as const;

const ICON_SIZE = { sm: 10, md: 12 } as const;

interface PillProps {
  accent: AccentToken;
  label: string;
  icon?: React.ReactNode;
  size?: keyof typeof SIZES;
  pulse?: boolean;
  glow?: boolean;
  className?: string;
}

/** Quiet, premium status pill. Subtle tint + hairline, no glow by default. */
export function Pill({ accent, label, icon, size = "md", pulse, glow, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-wide tabular",
        SIZES[size],
        className,
      )}
      style={{
        color: `rgb(var(--${accent}))`,
        backgroundColor: `rgb(var(--${accent}) / 0.1)`,
        borderColor: `rgb(var(--${accent}) / 0.26)`,
        boxShadow: glow ? `0 0 18px -6px rgb(var(--${accent}) / 0.5)` : undefined,
      }}
    >
      {pulse && <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full" style={{ backgroundColor: `rgb(var(--${accent}))` }} />}
      {icon}
      {label}
    </span>
  );
}

interface MatchStatusBadgeProps {
  badge: BadgeKey;
  size?: keyof typeof SIZES;
  glow?: boolean;
}

export function MatchStatusBadge({ badge, size = "md", glow = false }: MatchStatusBadgeProps) {
  const meta = getBadge(badge);
  const Icon = meta.icon;
  return (
    <Pill
      accent={meta.accent}
      label={meta.label}
      size={size}
      pulse={meta.pulse}
      glow={glow}
      icon={!meta.pulse ? <Icon size={ICON_SIZE[size]} strokeWidth={2.4} /> : undefined}
    />
  );
}
