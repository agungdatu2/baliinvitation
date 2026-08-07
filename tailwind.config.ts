import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        script: ["var(--font-script)", "cursive"],
        "groove-display": ["var(--font-groove-display)", "Georgia", "serif"],
        "groove-body": ["var(--font-groove-body)", "Georgia", "serif"],
        "groove-label": ["var(--font-groove-label)", "system-ui", "sans-serif"],
        "loading-display": ["var(--font-loading-display)", "Georgia", "serif"],
        "reverie-display": ["var(--font-reverie-display)", "Georgia", "serif"],
        "pixel-display": ["var(--font-pixel-display)", "monospace"],
        "pixel-body": ["var(--font-pixel-body)", "monospace"],
      },
      colors: {
        // Dipakai admin dashboard (jangan ganti nilainya untuk redesign tema publik)
        lume: {
          bg: "#faf6ef",
          ink: "#2b2b2b",
          gold: "#b08d57",
          line: "#e4dcc9",
        },
        // Palet tema "Lume" versi redesign fine-art/editorial (kertas hangat + emas
        // pudar) — dipakai src/components/templates/lume/* saja, terpisah dari
        // token admin di atas.
        groove: {
          bg: "#faf7ef",
          ink: "#211e1a",
          stone: "#2a2722",
          primary: "#8a6d2f",
          "primary-light": "#c9a45c",
          secondary: "#6b5d4f",
          line: "#ded4bd",
          "line-dark": "rgba(250,247,240,0.22)",
        },
        // Palet tema "Pixel" (8-bit/retro game) — warna cerah ala NES/arcade di
        // atas background gelap, dipakai src/components/templates/pixel/* saja.
        pixel: {
          bg: "#0d0221",
          panel: "#1a1a2e",
          ink: "#f8f8f8",
          red: "#e4364a",
          blue: "#3b8ef2",
          yellow: "#f7d51d",
          green: "#3ac162",
          purple: "#9b4de0",
          line: "#2f2f4a",
          "line-light": "#4a4a6a",
        },
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: { fadeIn: "fadeIn 0.8s ease-in-out" },
    },
  },
  plugins: [],
};
export default config;
