"use client";

import { useEffect, useState } from "react";
import { InvitationData } from "@/types/invitation";
import { buildGoogleCalendarUrl } from "@/lib/utils/calendar-link";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80";
const MARQUEE_REPEAT = 4;

function getTimeParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

// Section "Almost Time For Our Celebration" — layar penuh hitam: teks raksasa
// berjalan (marquee, "<heading> / <heading> / ...") di belakang, kartu foto
// portrait di tengah (menimpa teks), countdown 4 kolom dengan satuan 1 huruf di
// bawah, dan tombol lingkaran "Add to Calendar" di kanan bawah. Ukuran desktop
// diukur dari referensi lebar 2000px lalu dikonversi ke vw (foto 24.5vw, teks
// marquee 16.5vw, digit 6.25vw, lingkaran 10vw) supaya proporsinya sama di lebar
// layar berapa pun. Section NORMAL (bukan sticky) — datang setelah
// LoveStoryList yang juga normal flow.
export default function SaveTheDateSection({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const eventDateTime = new Date(data.eventDate);
  const [parts, setParts] = useState(() => getTimeParts(eventDateTime));

  useEffect(() => {
    const timer = setInterval(() => setParts(getTimeParts(eventDateTime)), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.eventDate]);

  const calendarUrl = buildGoogleCalendarUrl({
    title: `${data.groomNickname} & ${data.brideNickname}`,
    location: data.events?.[0]?.location,
    start: eventDateTime,
    end: new Date(eventDateTime.getTime() + 3 * 60 * 60 * 1000),
  });

  const track = Array.from({ length: MARQUEE_REPEAT }, () => t.saveTheDateHeading);
  const loopedTrack = [...track, ...track];

  const countdown: [string, number][] = [
    [t.days, parts.d],
    [t.hours, parts.h],
    [t.minutes, parts.m],
    [t.seconds, parts.s],
  ];

  return (
    // relative + z-50 SENGAJA — Hero (sticky, tanpa wrapper) otomatis menang
    // stacking di atas elemen statis manapun, jadi section ini butuh
    // position+z-index eksplisit supaya menang lawan Hero.
    <section className="relative z-50 h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
      {/* Marquee raksasa — wrapper tanpa overflow sendiri supaya descender
          huruf italic tidak terpotong. */}
      <div className="pointer-events-none absolute inset-x-0 top-[46%] -translate-y-1/2">
        <div
          className="flex w-max items-center gap-[0.35em] whitespace-nowrap font-nocturne-display text-[22vw] italic leading-none text-groove-bg/35 animate-nocturne-marquee md:text-[16.5vw]"
          style={{ animationDuration: "90s" }}
        >
          {loopedTrack.map((text, i) => (
            <span key={i} className="flex items-center gap-[0.35em]">
              {text}
              <span>/</span>
            </span>
          ))}
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.reverieSaveTheDateImage || DEFAULT_PHOTO}
        alt=""
        className="absolute left-1/2 top-[9%] aspect-[7/8] w-[52vw] -translate-x-1/2 object-cover md:top-[12.8%] md:w-[24.5vw]"
      />

      {/* Mobile: countdown + tombol ditumpuk di bawah. Desktop (md:contents):
          wrapper ini hilang dan kedua anak diposisikan absolut ke section. */}
      <div className="absolute inset-x-0 bottom-[5.6%] flex flex-col items-center gap-8 px-5 md:contents">
        <div className="grid w-full grid-cols-4 md:absolute md:bottom-[7.4%] md:left-[8.5vw] md:w-[79.4vw]">
          {countdown.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-center gap-[0.15em] md:justify-start">
              <span className="font-nocturne-display text-[11vw] leading-none tabular-nums text-groove-bg/75 md:text-[6.25vw]">
                {String(value).padStart(2, "0")}
              </span>
              <span className="font-groove-body text-[4vw] uppercase leading-none text-groove-bg/85 md:text-[3.1vw]">
                {label.charAt(0)}
              </span>
            </div>
          ))}
        </div>

        <a
          href={calendarUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-groove-bg/70 px-3 text-center font-groove-body text-xs leading-snug text-groove-bg/90 transition-colors hover:bg-groove-bg/10 md:absolute md:bottom-[5.6%] md:right-[8.5vw] md:h-[10.1vw] md:w-[10.1vw] md:px-[1.8vw] md:text-[1.1vw]"
        >
          {t.addToCalendar}
        </a>
      </div>
    </section>
  );
}
