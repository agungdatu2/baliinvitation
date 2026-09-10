"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavLink {
  label: string;
  href: string;
}

export default function FullscreenNav({
  links,
  ctaHref,
  ctaLabel,
  contactPhoneLabel,
  contactPhoneHref,
  instagramHref,
}: {
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
  contactPhoneLabel: string;
  contactPhoneHref: string;
  instagramHref: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-white/90 hover:text-white text-sm tracking-[0.2em] uppercase transition-colors"
        aria-label="Buka menu"
      >
        Menu
      </button>

      <div
        className={`fixed inset-0 z-[90] bg-groove-bg transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center px-6 sm:px-10 py-5 sm:py-6">
          <Image src="/brand/logo.webp" alt="BaliInvitation" width={160} height={47} className="w-28 sm:w-32 h-auto" />
          <button
            onClick={() => setOpen(false)}
            className="text-groove-ink/70 hover:text-groove-ink text-sm tracking-[0.2em] uppercase transition-colors"
            aria-label="Tutup menu"
          >
            Tutup
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 h-[calc(100%-180px)]">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-groove-display text-4xl sm:text-6xl text-groove-ink hover:text-groove-primary transition-all"
              style={{
                fontWeight: 500,
                transitionDelay: open ? `${i * 60}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(12px)",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 pb-10">
          <a
            href={ctaHref}
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase tracking-[0.2em] text-groove-ink border-b border-groove-ink/40 pb-1 hover:border-groove-ink transition-colors"
          >
            {ctaLabel}
          </a>
          <div className="flex items-center gap-6 text-sm text-groove-ink/60 mt-2">
            <a href={contactPhoneHref} target="_blank" rel="noreferrer" className="hover:text-groove-ink transition-colors">
              {contactPhoneLabel}
            </a>
            <a href={instagramHref} target="_blank" rel="noreferrer" className="hover:text-groove-ink transition-colors">
              Instagram
            </a>
            <Link href="/admin" className="hover:text-groove-ink transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
