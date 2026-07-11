"use client";

import { useEffect, useState } from "react";
import { buildGoogleCalendarUrl } from "@/lib/utils/calendar-link";

function getTimeParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

export default function CountdownCalendar({
  eventDate,
  title,
  location,
}: {
  eventDate: string;
  title: string;
  location?: string;
}) {
  const target = new Date(eventDate);
  const [parts, setParts] = useState(getTimeParts(target));

  useEffect(() => {
    const t = setInterval(() => setParts(getTimeParts(target)), 1000);
    return () => clearInterval(t);
  }, [eventDate]);

  const calendarUrl = buildGoogleCalendarUrl({
    title,
    location,
    start: target,
    end: new Date(target.getTime() + 3 * 60 * 60 * 1000),
  });

  return (
    <section className="text-center py-20 px-6 bg-groove-stone text-groove-bg">
      <p className="text-xs uppercase tracking-widest text-groove-clay-light mb-2">Menghitung Hari</p>
      <h2 className="font-groove-display italic text-2xl mb-8" style={{ fontWeight: 500 }}>
        Hingga Hari Bahagia
      </h2>
      <div className="flex justify-center gap-6 mb-8 flex-wrap">
        {[
          ["Hari", parts.d],
          ["Jam", parts.h],
          ["Menit", parts.m],
          ["Detik", parts.s],
        ].map(([label, value]) => (
          <div key={label as string} className="w-16">
            <div className="font-groove-display text-3xl tabular-nums" style={{ fontWeight: 600 }}>
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-[0.65rem] uppercase tracking-widest text-groove-clay-light mt-1">{label}</div>
          </div>
        ))}
      </div>
      <a
        href={calendarUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-block px-8 py-2.5 rounded-full border border-groove-line-dark text-sm tracking-wide uppercase hover:bg-groove-bg hover:text-groove-stone transition"
      >
        Tambahkan ke Kalender
      </a>
    </section>
  );
}
