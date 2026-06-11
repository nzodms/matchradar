"use client";

import { cn } from "@/lib/utils";

/** MatchRadar mark — a small live radar dish + neon wordmark. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-xl bg-hype/15 ring-1 ring-hype/40" />
        {[0.78, 0.5, 0.26].map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full border border-hype/40"
            style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
          />
        ))}
        <span className="absolute inset-0 animate-radar-sweep rounded-xl"
          style={{
            background: "conic-gradient(from 0deg, transparent 280deg, rgb(var(--hype) / 0.55) 350deg, transparent 360deg)",
            maskImage: "radial-gradient(circle, #000 60%, transparent 62%)",
            WebkitMaskImage: "radial-gradient(circle, #000 60%, transparent 62%)",
          }}
        />
        <span className="relative h-1.5 w-1.5 rounded-full bg-hype shadow-[0_0_8px_2px_rgb(var(--hype))]" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight text-ink">
          Match<span className="text-hype">Radar</span>
        </span>
      )}
    </div>
  );
}
