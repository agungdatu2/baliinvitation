"use client";

import { useEffect, useState } from "react";
import { CONTENT_REVEAL_DELAY_MS, CONTENT_REVEAL_DURATION_MS } from "./PageLoader";

// Fade+slide-up konten di baliknya PageLoader — dipicu di waktu yang sama
// persis dengan saat PageLoader mulai fade-out, supaya kelihatan seperti satu
// transisi menyambung (bukan: loader hilang duluan, baru konten "nyusul").
export default function RevealOnLoad({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), CONTENT_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDuration: `${CONTENT_REVEAL_DURATION_MS}ms` }}
    >
      {children}
    </div>
  );
}
