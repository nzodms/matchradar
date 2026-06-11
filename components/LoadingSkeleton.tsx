"use client";

import { cn } from "@/lib/utils";

/** Shimmering placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-line/8", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

/** Match-card shaped skeleton used while data loads. */
export function MatchCardSkeleton() {
  return (
    <div className="card rounded-3xl p-3.5">
      <div className="mb-3 flex justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col items-center gap-2">
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="h-8 w-12" />
        <div className="flex flex-1 flex-col items-center gap-2">
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <Skeleton className="mt-3 h-8 w-full" />
      <Skeleton className="mt-3 h-9 w-full" />
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="card rounded-3xl p-5">
      <Skeleton className="mb-4 h-4 w-40" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-28 w-28 rounded-full" />
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="mx-auto mt-4 h-4 w-56" />
      <Skeleton className="mt-4 h-16 w-full" />
      <Skeleton className="mt-4 h-12 w-full" />
    </div>
  );
}
