"use client";

import { useEffect, useRef, useState } from "react";

// Fade + blur + slide-up on scroll-into-view, staggered by `delay` — same motion
// language as most modern invitation templates, with a soft blur-to-sharp settle
// on top of the usual fade + translateY.
export default function Reveal({
  children,
  delay = 0,
  className = "",
  id,
  snap = true,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  id?: string;
  snap?: boolean;
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
      className={`${snap ? "snap-start" : ""} transition-all duration-[1400ms] ease-out ${visible ? "opacity-100 translate-y-0 blur-none" : "opacity-0 translate-y-6 blur-sm"} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
