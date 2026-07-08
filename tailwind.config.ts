import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      colors: {
        // Ganti palet ini per tema/template
        lume: {
          bg: "#faf6ef",
          ink: "#2b2b2b",
          gold: "#b08d57",
          line: "#e4dcc9",
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
