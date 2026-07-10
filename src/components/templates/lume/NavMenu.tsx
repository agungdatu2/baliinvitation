"use client";

import { useState } from "react";

const LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#couple", label: "Couple" },
  { href: "#love-story", label: "Love Story" },
  { href: "#events", label: "Events" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#gallery", label: "Gallery" },
  { href: "#gift", label: "Gift" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        className="fixed top-4 right-4 z-40 w-11 h-11 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm flex items-center justify-center transition-colors"
      >
        <span className="relative w-5 h-4 block">
          <span
            className={`absolute left-0 w-5 h-px bg-lume-ink transition-all duration-300 ease-out ${
              open ? "top-[7px] rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] w-5 h-px bg-lume-ink transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 w-5 h-px bg-lume-ink transition-all duration-300 ease-out ${
              open ? "top-[7px] -rotate-45" : "top-[14px]"
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
        className={`fixed top-20 right-4 z-40 w-52 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl origin-top-right transition-all duration-300 ease-out ${
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col py-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-5 py-3 text-xs uppercase tracking-widest text-lume-ink/80 hover:bg-white/50 hover:text-lume-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
