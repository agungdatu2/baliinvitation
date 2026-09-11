"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Loading screen persis gaya PageLoader landing page (logo fade + scale-up,
// hold sebentar, fade-out) — bukan progress bar/persentase seperti tema Lume.
// Selalu logo BaliInvitation (bukan logo brand client — itu tampil belakangan
// di gate & hero). Filter invert supaya logo (dasarnya gelap) kelihatan di atas
// background gradient gelap tema ini, beda dari PageLoader landing yang bg-nya terang.
const REVEAL_DELAY_MS = 100;
const HOLD_MS = 900;
const FADE_MS = 600;

export default function LoadingReveal({ onComplete }: { onComplete: () => void }) {
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
          filter: "brightness(0) invert(1)",
        }}
      />
    </div>
  );
}
