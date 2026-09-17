"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { buildGoogleCalendarUrl } from "@/lib/utils/calendar-link";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80";
const MARQUEE_REPEAT = 6;

function getTimeParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

// Section "Almost Time For Our Celebration" — teks raksasa berjalan (marquee,
// dipakai ulang keyframe animate-nocturne-marquee milik Hero) sebagai latar,
// kartu foto kecil portrait di tengah, countdown + link "Add to Calendar" di
// bawahnya. Section NORMAL (bukan sticky/tinggi-berlebih) — section ini datang
// SETELAH LoveStoryList yang juga normal flow, jadi tidak perlu trik
// -mt-[100svh]/z-index seperti section2 sticky sebelumnya.
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

  const marqueeText = t.saveTheDateHeading;
  const track = Array.from({ length: MARQUEE_REPEAT }, () => marqueeText);
  const loopedTrack = [...track, ...track];

  return (
    // relative + z-50 SENGAJA — Hero (sticky, tanpa wrapper, tetap "nempel"
    // selama hampir seluruh halaman) otomatis menang stacking di atas ELEMEN
    // STATIS manapun (elemen tanpa position eksplisit SELALU di lapisan
    // paling belakang, terlepas urutan DOM) — section2 setelah LoveStoryList
    // butuh position+z-index eksplisit supaya menang lawan Hero.
    <section className="relative z-50 overflow-hidden bg-black py-24 md:py-32">
      {/* Marquee raksasa — SAMA overflow-wrapping seperti Hero.tsx (tanpa
          overflow di wrapper marquee sendiri, diserahkan ke section ini yang
          jauh lebih tinggi, supaya descender huruf italic tidak terpotong). */}
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <div className="flex w-max items-center gap-10 whitespace-nowrap opacity-[0.08] animate-nocturne-marquee">
          {loopedTrack.map((word, i) => (
            <span key={i} className="font-nocturne-display italic text-6xl md:text-9xl leading-none text-groove-bg">
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center px-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.reverieSaveTheDateImage || DEFAULT_PHOTO}
          alt=""
          className="mb-10 aspect-[3/4] w-32 object-cover md:w-40"
        />

        <div className="mb-10 flex gap-6 md:gap-10">
          {[
            [t.days, parts.d],
            [t.hours, parts.h],
            [t.minutes, parts.m],
            [t.seconds, parts.s],
          ].map(([label, value]) => (
            <div key={label as string} className="text-center">
              <div className="font-nocturne-display text-3xl tabular-nums text-groove-bg md:text-5xl">
                {String(value).padStart(2, "0")}
              </div>
              <div className="mt-1 font-groove-label text-[0.6rem] uppercase tracking-widest text-groove-bg/60 md:text-xs">
                {label}
              </div>
            </div>
          ))}
        </div>

        <a
          href={calendarUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border-b border-groove-bg/60 pb-1 font-groove-label text-xs uppercase tracking-[0.2em] text-groove-bg/90 transition-colors hover:border-groove-bg hover:text-groove-bg"
        >
          {t.saveTheDate} <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
