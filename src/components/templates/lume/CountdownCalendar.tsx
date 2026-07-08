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
    <section className="text-center py-14 px-6 bg-lume-bg">
      <div className="flex justify-center gap-4 mb-6">
        {[
          ["D", parts.d],
          ["H", parts.h],
          ["M", parts.m],
          ["S", parts.s],
        ].map(([label, value]) => (
          <div key={label as string} className="w-16">
            <div className="text-2xl font-serif">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>
      <a
        href={calendarUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-block px-6 py-2 rounded-full border border-lume-ink text-sm hover:bg-lume-ink hover:text-white transition"
      >
        Tambahkan ke Kalender
      </a>
    </section>
  );
}
