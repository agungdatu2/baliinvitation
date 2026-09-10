"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Layar loading singkat pas landing page pertama dibuka — logo muncul lalu
// fade-out, mengungkap hero di baliknya (bukan spinner/progress bar, cuma
// jeda singkat biar terasa seperti "reveal", bukan loading beneran).
const HOLD_MS = 900;
const FADE_MS = 600;

export default function PageLoader() {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const fadeTimer = setTimeout(() => setFading(true), HOLD_MS);
    const hideTimer = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = "";
    }, HOLD_MS + FADE_MS);
    return () => {
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
      <Image src="/brand/logo.webp" alt="BaliInvitation" width={220} height={65} priority className="w-40 sm:w-52 h-auto" />
    </div>
  );
}
