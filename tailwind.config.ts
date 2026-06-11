import type { Config } from "tailwindcss";

/**
 * MatchRadar design system.
 * Dark-first, néon, sportif premium. Tokens are exposed as CSS variables in
 * globals.css so they can be themed per-event later (themeColor on SportEvent).
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        "bg-2": "rgb(var(--bg-2) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        pitch: "rgb(var(--pitch) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        hype: "rgb(var(--hype) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        electric: "rgb(var(--electric) / <alpha-value>)",
        violet: "rgb(var(--violet) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "glow-hype": "0 0 0 1px rgb(var(--hype) / 0.35), 0 0 28px -4px rgb(var(--hype) / 0.45)",
        "glow-danger": "0 0 0 1px rgb(var(--danger) / 0.35), 0 0 28px -4px rgb(var(--danger) / 0.45)",
        "glow-gold": "0 0 0 1px rgb(var(--gold) / 0.35), 0 0 28px -4px rgb(var(--gold) / 0.45)",
        "glow-electric": "0 0 0 1px rgb(var(--electric) / 0.35), 0 0 28px -4px rgb(var(--electric) / 0.45)",
        card: "0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 24px 48px -24px rgb(0 0 0 / 0.8)",
        "card-hover": "0 1px 0 0 rgb(255 255 255 / 0.08) inset, 0 30px 60px -20px rgb(0 0 0 / 0.9)",
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(ellipse at top, rgb(var(--electric) / 0.18), transparent 60%)",
        "pitch-lines": "repeating-linear-gradient(0deg, transparent, transparent 38px, rgb(var(--hype) / 0.05) 39px, transparent 40px)",
        "grid-faint": "linear-gradient(rgb(255 255 255 / 0.025) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.025) 1px, transparent 1px)",
      },
      keyframes: {
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "ping-ring": {
          "0%": { transform: "scale(0.6)", opacity: "0.7" },
          "80%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
        "float-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(800%)", opacity: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "radar-sweep": "radar-sweep 4s linear infinite",
        "ping-ring": "ping-ring 3s ease-out infinite",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        "shimmer": "shimmer 1.8s infinite",
        "float-up": "float-up 0.5s ease-out both",
        "scan": "scan 3.5s ease-in-out infinite",
        "marquee": "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
