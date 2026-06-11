"use client";

import { DEFAULT_TZ } from "@/lib/datetime";
import { useLocalStorage } from "@/lib/hooks";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { ToastProvider } from "./Toast";

/* ───────────────────────── Favorites ───────────────────────── */

interface FavoritesApi {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  ready: boolean;
}

const FavoritesContext = createContext<FavoritesApi | null>(null);

export function useFavorites(): FavoritesApi {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within <Providers>");
  return ctx;
}

/* ───────────────────────── Timezone ───────────────────────── */

interface TimezoneApi {
  tzId: string;
  setTzId: (id: string) => void;
}

const TimezoneContext = createContext<TimezoneApi | null>(null);

export function useTimezone(): TimezoneApi {
  const ctx = useContext(TimezoneContext);
  if (!ctx) throw new Error("useTimezone must be used within <Providers>");
  return ctx;
}

/* ───────────────────────── Root provider ───────────────────────── */

export function Providers({ children }: { children: ReactNode }) {
  const [favorites, setFavorites, ready] = useLocalStorage<string[]>(
    "mr.favorites",
    ["fra", "mar"],
  );
  const [tzId, setTzId] = useLocalStorage<string>("mr.tz", DEFAULT_TZ.id);

  const toggle = useCallback(
    (id: string) => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    },
    [setFavorites],
  );

  const favApi = useMemo<FavoritesApi>(
    () => ({
      favorites,
      isFavorite: (id: string) => favorites.includes(id),
      toggle,
      ready,
    }),
    [favorites, toggle, ready],
  );

  const tzApi = useMemo<TimezoneApi>(() => ({ tzId, setTzId }), [tzId, setTzId]);

  return (
    <FavoritesContext.Provider value={favApi}>
      <TimezoneContext.Provider value={tzApi}>
        <ToastProvider>{children}</ToastProvider>
      </TimezoneContext.Provider>
    </FavoritesContext.Provider>
  );
}
