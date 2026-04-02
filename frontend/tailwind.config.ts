import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        surface: "#111118",
        border: "#2A2AFF",
        accent: "#FFD700",
        primary: "#FF6B00",
        mint: "#00FFAA",
        danger: "#FF2D55",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
        display: ["var(--font-display)", "Orbitron", "sans-serif"],
        data: ["var(--font-data)", "Share Tech Mono", "monospace"],
      },
      borderRadius: {
        pill: "999px",
        card: "4px",
      },
      boxShadow: {
        glow: "0 0 12px #FF6B0066",
        "glow-mint": "0 0 10px #00FFAA55",
        "glow-gold": "0 0 8px #FFD70066",
      },
      keyframes: {
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

