"use client";

import { FlaskConical } from "lucide-react";

/**
 * Discreet dev-only banner: shown when no data provider is configured AND the
 * app runs outside production. Disappears entirely once real APIs are wired
 * (SPORTS_API_KEY & co) or in production builds.
 */
export function DemoDataBadge() {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-medium text-faint/80">
      <FlaskConical size={11} />
      Données de démonstration — environnement de développement
    </p>
  );
}
