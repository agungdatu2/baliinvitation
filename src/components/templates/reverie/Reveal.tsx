"use client";

import { useEffect, useRef, useState } from "react";

// Fade + blur on scroll-into-view, staggered by `delay`. Sengaja TANPA
// translateY (slide-up) — section-section ini juga snap-start di dalam
// scroll-snap-type: y mandatory (lihat globals.css), dan translateY yang
// animasi bareng waktu browser lagi animasi snap-scroll bikin dua gerakan
// beda arah kejadian hampir bersamaan, kerasa seperti "halaman ngebug/
// scroll sendiri". Fade+blur saja tidak menggeser posisi konten sama sekali,
// jadi tidak lagi bentrok dengan animasi snap.
export default function Reveal({
  children,
  delay = 0,
  className = "",
  id,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Re-arms every time the section crosses the viewport edge (both scrolling down
    // and back up), instead of firing once and staying revealed forever.
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`snap-start transition-all duration-[1400ms] ease-out ${visible ? "opacity-100 blur-none" : "opacity-0 blur-sm"} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
