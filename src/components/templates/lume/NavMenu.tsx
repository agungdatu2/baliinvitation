"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#hero", label: "Our Story" },
  { href: "#couple", label: "Couple" },
  { href: "#events", label: "Events" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#gallery", label: "Gallery" },
  { href: "#gift", label: "Gift" },
];

// Hamburger polos (tanpa background) di semua ukuran layar — warnanya berganti
// terang/gelap tergantung sedang di atas video hero (gelap) atau section konten
// (terang), supaya tetap terlihat tanpa perlu kotak/lingkaran di belakangnya.
export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const onScroll = () => setOverHero(window.scrollY < window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lineColor = overHero ? "bg-groove-bg" : "bg-groove-ink";
  const iconShadow = overHero ? "drop-shadow-md" : "";

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        className={`fixed top-6 right-6 md:top-8 md:right-8 z-40 w-8 h-6 ${iconShadow}`}
      >
        <span className="relative w-full h-full block">
          <span
            className={`absolute left-0 w-full h-px transition-all duration-300 ease-out ${lineColor} ${
              open ? "top-[11px] rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-[11px] w-full h-px transition-opacity duration-200 ${lineColor} ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 w-full h-px transition-all duration-300 ease-out ${lineColor} ${
              open ? "top-[11px] -rotate-45" : "top-[22px]"
            }`}
          />
        </span>
      </button>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-16 right-6 md:top-20 md:right-8 z-40 w-56 rounded-2xl groove-glass shadow-xl origin-top-right transition-all duration-300 ease-out ${
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col py-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-groove-label px-5 py-3 text-xs uppercase tracking-widest text-groove-ink/80 hover:text-groove-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
