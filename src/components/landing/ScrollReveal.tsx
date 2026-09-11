"use client";

import { useEffect, useRef, useState } from "react";

// Fade + slide-up saat section masuk viewport — dipakai landing page publik
// (bukan undangan tema, jadi aman pakai translateY tanpa konflik scroll-snap,
// beda dari Reveal.tsx milik tema Reverie).
export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  slide = true,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  // Kartu kaca (backdrop-filter) di atas video/gambar bergerak: animasikan transform
  // di ancestor-nya bikin blur "ngebug" (flicker/robek) pas reveal di Safari & Chrome.
  // Set false supaya elemen itu cuma fade opacity, tanpa translateY.
  slide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ease-out ${slide ? "transition-transform" : ""} ${visible ? `opacity-100 ${slide ? "translate-y-0" : ""}` : `opacity-0 ${slide ? "translate-y-8" : ""}`} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
