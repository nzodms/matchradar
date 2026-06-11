"use client";

import { cn } from "@/lib/utils";

interface RadarBackgroundProps {
  className?: string;
  accent?: "hype" | "danger" | "gold" | "electric" | "violet";
  intensity?: "soft" | "bold";
}

/**
 * Subtle ambient radar — concentric rings + a slow sweep. Tasteful, low-contrast,
 * GPU-cheap (transforms only). Used sparingly behind hero/brand surfaces.
 */
export function RadarBackground({ className, accent = "hype", intensity = "soft" }: RadarBackgroundProps) {
  const color = `rgb(var(--${accent}))`;
  const glow = intensity === "bold" ? "18" : "10";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        className="absolute -top-1/4 left-1/2 h-[70%] w-[130%] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(ellipse at center, ${color}${glow}, transparent 65%)` }}
      />

      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-[58%] opacity-70">
        {[1, 0.68, 0.4].map((s, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ width: `${s * 100}%`, height: `${s * 100}%`, borderColor: `${color}14` }}
          />
        ))}

        <div className="absolute inset-0 animate-radar-sweep" style={{ animationDuration: "7s" }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${color}00 270deg, ${color}26 340deg, ${color}4d 358deg, transparent 360deg)`,
              maskImage: "radial-gradient(circle, #000 62%, transparent 64%)",
              WebkitMaskImage: "radial-gradient(circle, #000 62%, transparent 64%)",
            }}
          />
        </div>

        {BLIPS.map((b, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full"
            style={{ left: b.x, top: b.y, background: color }}
          >
            <span className="absolute inset-0 animate-ping-ring rounded-full" style={{ background: color, animationDelay: b.delay }} />
          </span>
        ))}
      </div>
    </div>
  );
}

const BLIPS = [
  { x: "60%", y: "42%", delay: "0s" },
  { x: "42%", y: "52%", delay: "1.6s" },
];
