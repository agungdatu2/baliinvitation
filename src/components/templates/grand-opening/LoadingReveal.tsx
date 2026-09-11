"use client";

import { useEffect, useState } from "react";

// Loading screen persis gaya PageLoader landing page (logo fade + scale-up,
// hold sebentar, fade-out) — bukan progress bar/persentase seperti tema Lume.
// Pakai logo brand client (data.hostLogo) kalau ada; kalau tidak, monogram
// generik biar tetap terasa "branded" bukan blank screen.
const REVEAL_DELAY_MS = 100;
const HOLD_MS = 900;
const FADE_MS = 600;

export default function LoadingReveal({ logo, onComplete }: { logo?: string; onComplete: () => void }) {
  const [logoVisible, setLogoVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const revealTimer = setTimeout(() => setLogoVisible(true), REVEAL_DELAY_MS);
    const fadeTimer = setTimeout(() => setFading(true), HOLD_MS);
    const hideTimer = setTimeout(onComplete, HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center groove-opening-gradient transition-opacity ease-out"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
    >
      <div
        className="transition-all duration-700 ease-out"
        style={{ opacity: logoVisible ? 1 : 0, transform: logoVisible ? "scale(1)" : "scale(0.85)" }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="w-32 sm:w-40 h-auto max-h-28 object-contain" />
        ) : (
          <MonogramIcon />
        )}
      </div>
    </div>
  );
}

function MonogramIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" stroke="url(#groove-monogram-gold)" strokeWidth="1.5" />
      <path
        d="M36 20 L40 32 L52 36 L40 40 L36 52 L32 40 L20 36 L32 32 Z"
        fill="url(#groove-monogram-gold)"
      />
      <defs>
        <linearGradient id="groove-monogram-gold" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8cd8a" />
          <stop offset="45%" stopColor="#c9a45c" />
          <stop offset="100%" stopColor="#8a6d2f" />
        </linearGradient>
      </defs>
    </svg>
  );
}
