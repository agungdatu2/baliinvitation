"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, CalendarDays, CircleCheck, Sparkles } from "lucide-react";

const DESKTOP_LINKS = [
  { href: "#hero", label: "Our Story" },
  { href: "#events", label: "Events" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#gift", label: "Gift" },
];

const MOBILE_LINKS = [
  { href: "#hero", label: "Story", icon: Heart },
  { href: "#events", label: "Schedule", icon: CalendarDays },
  { href: "#rsvp", label: "RSVP", icon: CircleCheck },
  { href: "#gallery", label: "Wishes", icon: Sparkles },
];

// Desktop: navbar atas yang shrink+sembunyi saat scroll ke bawah, muncul lagi saat
// scroll ke atas. Mobile: bottom-nav dengan ikon, pola umum aplikasi native.
export default function NavMenu({ groomNickname, brideNickname }: { groomNickname: string; brideNickname: string }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMobile, setActiveMobile] = useState("#hero");
  const lastScroll = useRef(0);

  const initials = `${groomNickname.charAt(0)}${brideNickname.charAt(0)}`.toUpperCase();

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 10);
      setHidden(current > lastScroll.current && current > 100);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`hidden md:flex fixed top-0 left-0 w-full z-40 justify-between items-center px-8 lg:px-16 py-4 groove-glass transition-all duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "shadow-md" : ""}`}
      >
        <span className="font-groove-display italic text-2xl text-groove-primary">{initials}</span>
        <nav className="flex gap-8">
          {DESKTOP_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-groove-label text-xs uppercase tracking-widest text-groove-ink/70 hover:text-groove-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-3 groove-glass rounded-t-3xl">
        {MOBILE_LINKS.map((l) => {
          const Icon = l.icon;
          const active = activeMobile === l.href;
          return (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setActiveMobile(l.href)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                active ? "text-groove-primary bg-groove-primary/10" : "text-groove-ink/60"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span className="font-groove-label text-[10px] uppercase tracking-tighter">{l.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
