import type { Metadata } from "next";
import { Instrument_Serif, Barlow } from "next/font/google";
import "./globals.css";

// Dipakai tema "Lume" (redesign cinematic/liquid-glass) — self-hosted otomatis oleh
// next/font, jadi tidak butuh <link> Google Fonts dan tidak ada risiko CDN gagal.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  variable: "--font-groove-display",
});
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-groove-body",
});

export const metadata: Metadata = {
  title: "BaliInvitation - Undangan Digital",
  description: "Admin dashboard & undangan digital BaliInvitation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${instrumentSerif.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
