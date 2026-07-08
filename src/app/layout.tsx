import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BaliInvitation - Undangan Digital",
  description: "Admin dashboard & undangan digital BaliInvitation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
