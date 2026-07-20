"use client";

import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import { buildGoogleCalendarUrl } from "@/lib/utils/calendar-link";
import { getDict, Lang } from "@/lib/i18n/lume";

// `section` di sini adalah key HIDEABLE_SECTIONS_BY_TEMPLATE.lume yang
// bersangkutan (null = tidak bisa di-hide) — dipakai buat filter link kalau
// section-nya disembunyikan client dari admin dashboard.
const LINK_HREFS = [
  { href: "#hero", key: "navHome", section: null },
  { href: "#couple", key: "navProfile", section: "couple" },
  { href: "#love-story", key: "navLoveStory", section: "loveStory" },
  { href: "#events", key: "navWeddingEvent", section: "events" },
  { href: "#rsvp", key: "navRsvp", section: "rsvp" },
  { href: "#gift", key: "navWeddingGift", section: "gift" },
  { href: "#gallery", key: "navGallery", section: "gallery" },
] as const;

interface NavMenuProps {
  groomNickname: string;
  brideNickname: string;
  eventDate: string;
  eventLocation?: string;
  hasMusic: boolean;
  musicPlaying: boolean;
  onToggleMusic: () => void;
  lang?: Lang;
  hiddenSections?: string[];
}

// Hamburger polos (tanpa background) di semua ukuran layar — warnanya berganti
// terang/gelap tergantung sedang di atas video hero (gelap) atau section konten
// (terang). Klik membuka panel penuh di sisi kanan (solid, bukan glass-blur).
export default function NavMenu({
  groomNickname,
  brideNickname,
  eventDate,
  eventLocation,
  hasMusic,
  musicPlaying,
  onToggleMusic,
  lang,
  hiddenSections,
}: NavMenuProps) {
  const t = getDict(lang);
  const hidden = new Set(hiddenSections ?? []);
  const visibleLinks = LINK_HREFS.filter((l) => !l.section || !hidden.has(l.section));
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const onScroll = () => setOverHero(window.scrollY < window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lineColor = overHero && !open ? "bg-groove-bg" : "bg-groove-ink";
  const iconShadow = overHero && !open ? "drop-shadow-md" : "";

  const start = new Date(eventDate);
  const calendarUrl = buildGoogleCalendarUrl({
    title: `${groomNickname} & ${brideNickname}`,
    location: eventLocation,
    start,
    end: new Date(start.getTime() + 3 * 60 * 60 * 1000),
  });

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.closeMenu : t.openMenu}
        aria-expanded={open}
        className={`fixed top-6 right-6 md:top-8 md:right-8 z-50 ${open ? "" : `w-8 h-6 ${iconShadow}`}`}
      >
        {open ? (
          <span className="bg-groove-stone text-groove-bg font-groove-label text-xs uppercase tracking-widest px-5 py-2.5 rounded-full">
            {t.close}
          </span>
        ) : (
          <span className="relative w-full h-full block">
            <span className={`absolute left-0 top-0 w-full h-px transition-all duration-300 ease-out ${lineColor}`} />
            <span className={`absolute left-0 top-[11px] w-full h-px transition-opacity duration-200 ${lineColor}`} />
            <span className={`absolute left-0 top-[22px] w-full h-px transition-all duration-300 ease-out ${lineColor}`} />
          </span>
        )}
      </button>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-groove-stone/20 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 z-40 h-full w-full sm:w-[380px] bg-groove-bg shadow-2xl transition-transform duration-500 ease-out flex flex-col justify-between p-8 md:p-10 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-4 mt-16">
          {visibleLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-groove-display text-2xl md:text-3xl text-groove-ink hover:text-groove-secondary transition-colors"
            >
              {t[l.key]}
            </a>
          ))}
          <p className="font-groove-body text-xs text-groove-ink/50 mt-4 max-w-[26ch]">{t.navHint}</p>
        </nav>

        <div className="flex items-stretch gap-2 rounded-xl border border-groove-line bg-groove-bg/60 p-1.5">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center text-center font-groove-label text-[10px] uppercase tracking-wider text-groove-ink/80 hover:text-groove-secondary transition-colors px-2 py-3"
          >
            {t.saveDateShort1}
            <br />
            {t.saveDateShort2}
          </a>
          {hasMusic && (
            <>
              <div className="w-px bg-groove-line" aria-hidden="true" />
              <button
                onClick={onToggleMusic}
                aria-label={musicPlaying ? t.pauseMusic : t.playMusic}
                className="w-14 flex items-center justify-center rounded-lg hover:bg-groove-line/40 transition-colors"
              >
                {musicPlaying ? (
                  <Pause className="h-4 w-4 text-groove-ink/80" />
                ) : (
                  <Play className="h-4 w-4 text-groove-ink/80 fill-current" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
