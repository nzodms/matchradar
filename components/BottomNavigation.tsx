"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CalendarDays, Newspaper, Radar, Rocket, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
}

const ITEMS: NavItem[] = [
  { href: "/", label: "Radar", icon: Radar, match: (p) => p === "/" || p.startsWith("/match") },
  { href: "/brief", label: "Brief", icon: Newspaper, match: (p) => p.startsWith("/brief") },
  { href: "/calendar", label: "Calendrier", icon: CalendarDays, match: (p) => p.startsWith("/calendar") },
  { href: "/favorites", label: "Favoris", icon: Star, match: (p) => p.startsWith("/favorites") },
  { href: "/events", label: "Prochainement", icon: Rocket, match: (p) => p.startsWith("/events") },
];

export function BottomNavigation() {
  const pathname = usePathname() || "/";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 safe-bottom">
      <div className="mx-auto max-w-lg px-3 pb-3">
        <div className="glass-strong flex items-center justify-around rounded-2xl px-1.5 py-1.5 shadow-card">
          {ITEMS.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="tap relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-hype/12 ring-1 ring-hype/30"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={active ? 2.6 : 2}
                  className={cn("relative transition-colors", active ? "text-hype" : "text-muted")}
                />
                <span
                  className={cn(
                    "relative text-[9.5px] font-bold tracking-tight transition-colors",
                    active ? "text-hype" : "text-faint",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
