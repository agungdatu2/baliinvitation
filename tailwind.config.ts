import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        script: ["var(--font-script)", "cursive"],
        "groove-display": ["var(--font-groove-display)", "Georgia", "serif"],
        "groove-body": ["var(--font-groove-body)", "system-ui", "sans-serif"],
      },
      colors: {
        // Dipakai admin dashboard (jangan ganti nilainya untuk redesign tema publik)
        lume: {
          bg: "#faf6ef",
          ink: "#2b2b2b",
          gold: "#b08d57",
          line: "#e4dcc9",
        },
        // Palet tema "Lume" versi redesign editorial/cliffside — dipakai
        // src/components/templates/lume/* saja, terpisah dari token admin di atas.
        groove: {
          bg: "#f6f2e8",
          ink: "#211f1a",
          stone: "#17140f",
          moss: "#4b5842",
          "moss-dark": "#3a4433",
          clay: "#8f6b52",
          "clay-light": "#b9967c",
          line: "#ded4bd",
          "line-dark": "rgba(237,231,216,0.22)",
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
