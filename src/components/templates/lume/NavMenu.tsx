"use client";

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
  return (
    <nav className="sticky top-0 z-40 bg-lume-bg/90 backdrop-blur border-b border-lume-line">
      <div className="flex justify-center gap-4 overflow-x-auto px-4 py-3 text-[11px] uppercase tracking-widest text-lume-ink/70 no-scrollbar">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="whitespace-nowrap hover:text-lume-gold transition-colors">
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
