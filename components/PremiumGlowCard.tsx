"use client";

import { cn } from "@/lib/utils";
import type { AccentToken } from "@/types";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface PremiumGlowCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  accent?: AccentToken;
  glow?: boolean;
  /** Animated luminous sweep across the top edge. */
  scan?: boolean;
  inset?: boolean;
  children?: ReactNode;
}

/**
 * Glassmorphism card with a tinted top-edge highlight and optional accent glow.
 * The base surface for featured cards, briefs and detail blocks.
 */
export const PremiumGlowCard = forwardRef<HTMLDivElement, PremiumGlowCardProps>(
  ({ accent = "hype", glow = false, scan = false, inset = true, className, children, style, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass relative overflow-hidden rounded-3xl",
          inset && "p-4",
          className,
        )}
        style={{
          boxShadow: glow
            ? `0 0 0 1px rgb(var(--${accent}) / 0.3), 0 28px 60px -28px rgb(var(--${accent}) / 0.35), 0 24px 48px -24px rgb(0 0 0 / 0.8)`
            : undefined,
          ...style,
        }}
        {...props}
      >
        {/* top edge light */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgb(var(--${accent}) / 0.7), transparent)`,
          }}
        />
        {/* corner glow */}
        {glow && (
          <span
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
            style={{ background: `rgb(var(--${accent}) / 0.18)` }}
          />
        )}
        {scan && (
          <span className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan bg-gradient-to-b from-white/10 to-transparent" />
        )}
        {children}
      </motion.div>
    );
  },
);

PremiumGlowCard.displayName = "PremiumGlowCard";
