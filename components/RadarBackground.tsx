"use client";

import { cn } from "@/lib/utils";

interface RadarBackgroundProps {
  className?: string;
  /** Accent color token for the sweep. */
  accent?: "hype" | "danger" | "gold" | "electric" | "violet";
  intensity?: "soft" | "bold";
}

/**
 * Pure-CSS animated radar: concentric rings, rotating sweep, pulsing blips and
 * a faint pitch grid. GPU-cheap (transforms only) so it stays smooth on phones.
 */
export function RadarBackground({
  className,
  accent = "hype",
  intensity = "bold",
}: RadarBackgroundProps) {
  const color = `rgb(var(--${accent}))`;
  const isBold = intensity === "bold";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* faint terrain grid */}
      <div className="absolute inset-0 bg-grid-faint bg-[size:44px_44px] opacity-[0.5]" />

      {/* top glow */}
      <div
        className="absolute -top-1/3 left-1/2 h-[80%] w-[140%] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(ellipse at center, ${color}${isBold ? "26" : "14"}, transparent 65%)`,
        }}
      />

      {/* radar disc */}
      <div className="absolute left-1/2 top-0 h-[460px] w-[460px] -translate-x-1/2 -translate-y-[55%]">
        {/* rings */}
        {[1, 0.72, 0.46, 0.24].map((s, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{
              width: `${s * 100}%`,
              height: `${s * 100}%`,
              borderColor: `${color}${i === 0 ? "22" : "16"}`,
            }}
          />
        ))}

        {/* rotating sweep */}
        <div className="absolute inset-0 animate-radar-sweep">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${color}00 250deg, ${color}40 330deg, ${color}80 358deg, transparent 360deg)`,
              maskImage: "radial-gradient(circle, #000 64%, transparent 66%)",
              WebkitMaskImage: "radial-gradient(circle, #000 64%, transparent 66%)",
            }}
          />
        </div>

        {/* blips */}
        {BLIPS.map((b, i) => (
          <div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ left: b.x, top: b.y, background: color, boxShadow: `0 0 12px 2px ${color}` }}
          >
            <span
              className="absolute inset-0 animate-ping-ring rounded-full"
              style={{ background: color, animationDelay: b.delay }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const BLIPS = [
  { x: "62%", y: "40%", delay: "0s" },
  { x: "38%", y: "56%", delay: "0.9s" },
  { x: "54%", y: "30%", delay: "1.8s" },
  { x: "44%", y: "44%", delay: "2.5s" },
];
