import type { Metadata } from "next";
import { Cormorant, Hanken_Grotesk, Press_Start_2P, VT323 } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Dipakai tema "Lume" (redesign fine-art/editorial paper) — self-hosted otomatis
// oleh next/font, jadi tidak butuh <link> Google Fonts dan tidak ada risiko CDN gagal.
// Heading: Cormorant. Body/label: Hanken Grotesk sebagai placeholder sementara
// pengganti "Lausanne" (font berbayar, bukan di Google Fonts) — ganti ke Lausanne
// via next/font/local begitu file .woff2 lisensinya tersedia.
const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic", "normal"],
  variable: "--font-groove-display",
});
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-groove-body",
});
const hankenGroteskLabel = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-groove-label",
});
// Dipakai khusus LoadingScreen (gate video-hero) — typeface terpisah dari display utama.
const cormorantLoading = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic", "normal"],
  variable: "--font-loading-display",
});
// Dipakai khusus tema "Reverie" untuk heading (font-reverie-display) — terpisah dari
// --font-groove-display supaya tema Lume tidak ikut berubah.
const vogue = localFont({
  src: "./fonts/Vogue.otf",
  variable: "--font-reverie-display",
});
// Dipakai khusus tema "Pixel" (8-bit/retro game) — Press Start 2P untuk
// judul/label (blocky, cuma weight 400), VT323 untuk body text (pixel-ish
// tapi jauh lebih terbaca di ukuran paragraf dibanding Press Start 2P).
const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixel-display",
});
const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixel-body",
});

export const metadata: Metadata = {
  title: "BaliInvitation - Undangan Digital",
  description: "Admin dashboard & undangan digital BaliInvitation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${hankenGrotesk.variable} ${hankenGroteskLabel.variable} ${cormorantLoading.variable} ${vogue.variable} ${pressStart2P.variable} ${vt323.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
