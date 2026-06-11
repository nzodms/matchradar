"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { RadarHeader } from "./RadarHeader";

interface AppShellProps {
  children: ReactNode;
  back?: boolean;
  title?: string;
  /** Hide the bottom nav (e.g. immersive landing). */
  bare?: boolean;
  className?: string;
}

/**
 * Mobile-first frame: ambient background, sticky header, centered max-w-lg
 * column (reads like a phone app even on desktop), and the fixed bottom nav.
 */
export function AppShell({ children, back, title, bare, className }: AppShellProps) {
  return (
    <div className="relative min-h-[100dvh]">
      {/* ambient backdrop — one soft green wash + faint grain + bottom vignette */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-bg">
        <div
          className="absolute inset-x-0 top-0 h-[460px]"
          style={{ background: "radial-gradient(120% 72% at 50% -12%, rgb(var(--hype) / 0.09), transparent 60%)" }}
        />
        <div className="bg-noise absolute inset-0 opacity-[0.035]" />
        <div
          className="absolute inset-x-0 bottom-0 h-72"
          style={{ background: "linear-gradient(to top, rgb(var(--bg)), transparent)" }}
        />
      </div>

      {!bare && <RadarHeader back={back} title={title} />}

      <main className={cn("mx-auto max-w-lg px-4", bare ? "pb-10" : "pb-nav pt-4", className)}>
        {children}
      </main>

      {!bare && <BottomNavigation />}
    </div>
  );
}
