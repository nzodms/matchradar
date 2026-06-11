"use client";

import { motion } from "framer-motion";

/**
 * Subtle cross-fade between routes for a native-app feel.
 * Opacity-only on purpose — a transform here would break the fixed bottom nav.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
