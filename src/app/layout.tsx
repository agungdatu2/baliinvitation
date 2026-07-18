import type { Metadata } from "next";
import { Cormorant, Hanken_Grotesk } from "next/font/google";
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
const symphonigraphy = localFont({
  src: "./fonts/SymphonigraphyRegular.otf",
  variable: "--font-reverie-display",
});

export const metadata: Metadata = {
  title: "BaliInvitation - Undangan Digital",
  description: "Admin dashboard & undangan digital BaliInvitation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${hankenGrotesk.variable} ${hankenGroteskLabel.variable} ${cormorantLoading.variable} ${symphonigraphy.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
