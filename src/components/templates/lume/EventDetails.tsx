"use client";

import { useEffect, useState } from "react";
import { MapPin, CalendarPlus } from "lucide-react";
import { EventItem } from "@/types/invitation";
import { buildGoogleCalendarUrl } from "@/lib/utils/calendar-link";

function getTimeParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

export default function EventDetails({ events, title }: { events: EventItem[]; title: string }) {
  if (!events?.length) return null;
  return (
    <section className="groove-overlay-dark text-groove-bg">
      {/* max-w-5xl sama seperti semua section lain (mengikuti LoveStory) — supaya
          lebar section ini konsisten, bukan full-bleed edge-to-edge. */}
      <div className="max-w-5xl mx-auto px-6">
        {events.map((ev, i) => (
          <EventRow key={i} event={ev} title={title} last={i === events.length - 1} />
        ))}
      </div>
    </section>
  );
}

function EventRow({ event, title, last }: { event: EventItem; title: string; last: boolean }) {
  const eventDateTime = new Date(`${event.date}T${event.timeStart || "00:00"}`);
  const [parts, setParts] = useState(() => getTimeParts(eventDateTime));

  useEffect(() => {
    const t = setInterval(() => setParts(getTimeParts(eventDateTime)), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.date, event.timeStart]);

  const calendarUrl = buildGoogleCalendarUrl({
    title: `${event.name} - ${title}`,
    location: event.location,
    start: eventDateTime,
    end: new Date(eventDateTime.getTime() + 3 * 60 * 60 * 1000),
  });

  return (
    <div className={`grid md:grid-cols-2 ${last ? "" : "border-b border-groove-line-dark"}`}>
      <div className="py-10 md:py-14 md:pr-10 flex flex-col justify-center">
        <p className="font-groove-body text-lg text-groove-bg/90">
          {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="font-groove-body text-lg text-groove-bg/90 mb-4">
          AT {event.timeStart} {event.timezone}
        </p>
        {event.location && (
          <p className="font-groove-body text-sm text-groove-bg/70 leading-relaxed mb-5 max-w-sm">{event.location}</p>
        )}

        <div className="flex gap-5 mb-6">
          {[
            ["Hari", parts.d],
            ["Jam", parts.h],
            ["Menit", parts.m],
            ["Detik", parts.s],
          ].map(([label, value]) => (
            <div key={label as string} className="text-center">
              <div className="font-groove-display text-xl tabular-nums" style={{ fontWeight: 600 }}>
                {String(value).padStart(2, "0")}
              </div>
              <div className="font-groove-label text-[0.6rem] uppercase tracking-widest text-groove-bg/60 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {event.mapsUrl && (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="font-groove-label inline-flex items-center gap-1.5 bg-groove-stone/70 border border-groove-line-dark text-groove-bg text-xs uppercase tracking-widest px-6 py-2.5 rounded-md hover:bg-groove-stone transition"
            >
              <MapPin className="h-3.5 w-3.5" /> Google Maps
            </a>
          )}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noreferrer"
            className="font-groove-label inline-flex items-center gap-1.5 border border-groove-line-dark text-groove-bg text-xs uppercase tracking-widest px-6 py-2.5 rounded-md hover:bg-groove-bg hover:text-groove-stone transition"
          >
            <CalendarPlus className="h-3.5 w-3.5" /> Save The Date
          </a>
        </div>
      </div>

      <div className="py-10 md:py-14 md:pl-10 flex items-center">
        <h3 className="font-groove-display uppercase leading-[0.95] text-4xl md:text-5xl" style={{ fontWeight: 500 }}>
          {event.name}
        </h3>
      </div>
    </div>
  );
}
