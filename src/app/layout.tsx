import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

// Dipakai tema "Lume" (redesign editorial/cliffside) — self-hosted otomatis oleh
// next/font, jadi tidak butuh <link> Google Fonts dan tidak ada risiko CDN gagal.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-groove-display",
  axes: ["opsz", "SOFT", "WONK"],
});
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-groove-body",
});

export const metadata: Metadata = {
  title: "BaliInvitation - Undangan Digital",
  description: "Admin dashboard & undangan digital BaliInvitation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
