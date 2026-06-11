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
      {/* ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-bg" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-radial-fade opacity-60" />
        <div className="absolute inset-0 bg-grid-faint bg-[size:48px_48px] opacity-[0.35]" />
      </div>

      {!bare && <RadarHeader back={back} title={title} />}

      <main className={cn("mx-auto max-w-lg px-4", bare ? "pb-10" : "pb-nav pt-4", className)}>
        {children}
      </main>

      {!bare && <BottomNavigation />}
    </div>
  );
}
