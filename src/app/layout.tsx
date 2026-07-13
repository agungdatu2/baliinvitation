import type { Metadata } from "next";
import { Bodoni_Moda, Libre_Baskerville, Inter } from "next/font/google";
import "./globals.css";

// Dipakai tema "Lume" (redesign fine-art/editorial paper) — self-hosted otomatis
// oleh next/font, jadi tidak butuh <link> Google Fonts dan tidak ada risiko CDN gagal.
const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic", "normal"],
  variable: "--font-groove-display",
});
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-groove-body",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-groove-label",
});

export const metadata: Metadata = {
  title: "BaliInvitation - Undangan Digital",
  description: "Admin dashboard & undangan digital BaliInvitation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${bodoniModa.variable} ${libreBaskerville.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
