"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { buildGoogleCalendarUrl } from "@/lib/utils/calendar-link";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80";

function getTimeParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

// Section "Save the Date" — foto kecil, judul italic, countdown ke eventDate, dan
// tombol "Save the Date" (link Google Calendar). Sengaja TANPA foto background
// sendiri (sama seperti LoveStory) — memakai FixedVideoBackground yang di-blur.
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

  return (
    <section className="relative h-[100lvh] flex flex-col items-center justify-center text-center text-groove-bg px-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.reverieSaveTheDateImage || DEFAULT_PHOTO}
        alt=""
        className="w-36 h-36 object-cover mb-8"
      />
      <h2
        className="font-reverie-display italic text-3xl md:text-4xl leading-tight max-w-xs mb-10"
        style={{ fontWeight: 400 }}
      >
        {t.saveTheDateHeading}
      </h2>

      <div className="flex gap-7 mb-10">
        {[
          [t.days, parts.d],
          [t.hours, parts.h],
          [t.minutes, parts.m],
          [t.seconds, parts.s],
        ].map(([label, value]) => (
          <div key={label as string} className="text-center">
            <div className="font-reverie-display text-3xl tabular-nums">{String(value).padStart(2, "0")}</div>
            <div className="font-reverie-display italic text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      <a
        href={calendarUrl}
        target="_blank"
        rel="noreferrer"
        className="font-groove-body inline-flex items-center gap-2 border border-groove-bg/70 text-groove-bg text-sm px-8 py-3 rounded-full hover:bg-groove-bg hover:text-groove-stone transition"
      >
        {t.saveTheDate.toUpperCase()} <ArrowRight className="h-4 w-4" />
      </a>
    </section>
  );
}
