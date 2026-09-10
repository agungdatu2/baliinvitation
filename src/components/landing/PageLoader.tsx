"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Layar loading singkat pas landing page pertama dibuka — logo reveal
// (fade + scale-up) lalu holdsebentar, lalu seluruh layar fade-out,
// mengungkap hero di baliknya (bukan spinner/progress bar beneran, cuma
// jeda singkat biar terasa seperti "reveal"). REVEAL_DELAY_MS sengaja
// dipakai juga oleh RevealOnLoad supaya konten hero mulai fade-in TEPAT
// saat loader ini mulai fade-out, bukan nyusul telat.
const REVEAL_DELAY_MS = 100; // jeda kecil biar transition logo kepicu (bukan langsung full opacity)
const HOLD_MS = 900;
const FADE_MS = 600;
export const CONTENT_REVEAL_DELAY_MS = HOLD_MS;
export const CONTENT_REVEAL_DURATION_MS = FADE_MS + 300;

export default function PageLoader() {
  const [logoVisible, setLogoVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const revealTimer = setTimeout(() => setLogoVisible(true), REVEAL_DELAY_MS);
    const fadeTimer = setTimeout(() => setFading(true), HOLD_MS);
    const hideTimer = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = "";
    }, HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-groove-bg transition-opacity ease-out"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
    >
      <Image
        src="/brand/logo.webp"
        alt="BaliInvitation"
        width={220}
        height={65}
        priority
        className="w-40 sm:w-52 h-auto transition-all duration-700 ease-out"
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible ? "scale(1)" : "scale(0.85)",
        }}
      />
    </div>
  );
}
