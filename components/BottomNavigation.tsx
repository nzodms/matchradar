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
  { href: "/events", label: "Events", icon: Rocket, match: (p) => p.startsWith("/events") },
];

export function BottomNavigation() {
  const pathname = usePathname() || "/";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 safe-bottom">
      <div className="mx-auto max-w-lg px-4 pb-3">
        <div className="glass-strong flex items-center gap-1 rounded-[1.6rem] p-1.5 shadow-elevated">
          {ITEMS.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="tap relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-2xl bg-hype/12"
                    transition={{ type: "spring", stiffness: 480, damping: 38 }}
                  />
                )}
                <Icon
                  size={21}
                  strokeWidth={active ? 2.6 : 2}
                  className={cn("relative transition-colors", active ? "text-hype" : "text-faint")}
                />
                <span
                  className={cn(
                    "relative text-[9.5px] font-semibold tracking-tight transition-colors",
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
