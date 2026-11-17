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
        "muse-loading": ["var(--font-muse-loading)", "Georgia", "serif"],
        "nocturne-display": ["var(--font-nocturne-display)", "Georgia", "serif"],
        "confetti-display": ["var(--font-confetti-display)", "ui-rounded", "system-ui", "sans-serif"],
      },
      colors: {
        // Dipakai admin dashboard (jangan ganti nilainya untuk redesign tema publik)
        lume: {
          bg: "#faf6ef",
          ink: "#2b2b2b",
          gold: "#b08d57",
          line: "#e4dcc9",
        },
        // Palet tema "Confetti" (ulang tahun anak): krem hangat + pastel titik-titik
        // baju polkadot + perak/emas dari balon & alas kue di foto client.
        confetti: {
          cream: "#fff8ee",
          ink: "#4b3a55",
          pink: "#f6b5c8",
          blue: "#a8d5f2",
          yellow: "#ffd978",
          lavender: "#cdb9f0",
          mint: "#bfe8d3",
          gold: "#c9a24d",
          silver: "#aab2bd",
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
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        // Konfeti melayang pelan (tema Confetti)
        confettiFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(8deg)" },
        },
        // Track nama pasangan diduplikasi 2x di Hero Nocturne, jadi geser -50%
        // pas balik ke posisi awal yang identik = loop mulus tanpa "lompat".
        "nocturne-marquee": { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out",
        "nocturne-marquee": "nocturne-marquee 28s linear infinite",
        "confetti-float": "confettiFloat 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
