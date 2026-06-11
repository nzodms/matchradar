"use client";

import { cn } from "@/lib/utils";
import type { Team } from "@/types";

interface TeamCrestProps {
  team: Team;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right" | "center";
  showRank?: boolean;
  className?: string;
}

const FLAG_SIZE = {
  sm: "h-8 w-8 text-lg",
  md: "h-11 w-11 text-2xl",
  lg: "h-16 w-16 text-4xl",
} as const;

const NAME_SIZE = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} as const;

/** Flag medallion + team name. Uses the team color as a soft halo. */
export function TeamCrest({ team, size = "md", align = "center", showRank, className }: TeamCrestProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        align === "center" && "flex-col gap-1.5 text-center",
        align === "right" && "flex-row-reverse text-right",
        className,
      )}
    >
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full ring-1 ring-line/10",
          FLAG_SIZE[size],
        )}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${team.color}33, rgb(var(--surface)))`,
        }}
      >
        <span className="drop-shadow">{team.flag}</span>
      </span>
      <div className={cn("min-w-0", align === "center" && "w-full")}>
        <p className={cn("truncate font-display font-bold leading-tight text-ink", NAME_SIZE[size])}>
          {team.name}
        </p>
        {showRank && team.fifaRank && (
          <p className="text-[10px] font-medium uppercase tracking-wide text-faint">
            FIFA #{team.fifaRank}
          </p>
        )}
      </div>
    </div>
  );
}
