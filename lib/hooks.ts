"use client";

import { useCallback, useEffect, useState } from "react";

/** True only after client mount — gates time-relative UI to avoid hydration drift. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Copy-to-clipboard with a transient "copied" flag for button feedback. */
export function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Legacy fallback for older mobile webviews.
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        setCopied(true);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), timeout);
    return () => clearTimeout(t);
  }, [copied, timeout]);

  return { copied, copy };
}

/** Persisted boolean/state in localStorage (favorites, onboarding, tz…). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}
