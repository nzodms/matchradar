"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastTone = "success" | "info";
interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastApi {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 pb-[calc(6rem+env(safe-area-inset-bottom))] px-4">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="glass-strong pointer-events-auto flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-card"
            >
              <span
                className={
                  t.tone === "success"
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-hype/15 text-hype"
                    : "flex h-6 w-6 items-center justify-center rounded-full bg-electric/15 text-electric"
                }
              >
                {t.tone === "success" ? <Check size={14} strokeWidth={3} /> : <Info size={14} />}
              </span>
              <span className="text-sm font-semibold text-ink">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
