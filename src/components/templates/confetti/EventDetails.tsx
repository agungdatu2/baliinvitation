"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/confetti";
import { buildGoogleCalendarUrl } from "@/lib/utils/calendar-link";
import { Wave } from "./Decor";
import { formatEventDate, formatTimeRange } from "./format";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.25 },
  transition: { duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
});

function getParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

const TILE_COLORS = ["bg-confetti-pink", "bg-confetti-blue", "bg-confetti-yellow", "bg-confetti-lavender"];

// Section detail acara: countdown berwarna-warni + kartu jadwal & lokasi.
export default function EventDetails({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const target = new Date(data.eventDate);
  // Dihitung setelah mount (bukan di render pertama) supaya tidak beda dengan HTML server.
  const [parts, setParts] = useState<ReturnType<typeof getParts> | null>(null);

  useEffect(() => {
    const tick = () => setParts(getParts(new Date(data.eventDate)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [data.eventDate]);

  const events = data.events ?? [];
  const countdown: [string, number | null][] = [
    [t.days, parts?.d ?? null],
    [t.hours, parts?.h ?? null],
    [t.minutes, parts?.m ?? null],
    [t.seconds, parts?.s ?? null],
  ];

  return (
    <div>
      <Wave from="#fff8ee" fill="#ffeef3" />
      <section className="bg-[#ffeef3] px-6 py-16 text-center text-confetti-ink md:py-24">
        <motion.p {...fade(0)} className="font-groove-label text-xs uppercase tracking-[0.3em] text-confetti-ink/60">
          {t.saveTheDate}
        </motion.p>

        <motion.div {...fade(0.1)} className="mx-auto mt-6 grid max-w-xl grid-cols-4 gap-3 md:gap-5">
          {countdown.map(([label, value], i) => (
            <div key={label} className={`rounded-3xl ${TILE_COLORS[i]} px-2 py-5 shadow-md md:py-8`}>
              <div className="font-confetti-display text-3xl font-bold tabular-nums md:text-5xl">
                {value === null ? "--" : String(value).padStart(2, "0")}
              </div>
              <div className="mt-1 font-groove-label text-[0.6rem] uppercase tracking-widest text-confetti-ink/70 md:text-xs">
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6">
          {events.map((ev, i) => {
            const time = formatTimeRange(ev.timeStart, ev.timeEnd, data.language, ev.timezone);
            const start = new Date(target);
            return (
              <motion.div
                key={i}
                {...fade(0.1 + i * 0.1)}
                className="rounded-[2rem] border-4 border-white bg-white/80 p-7 text-left shadow-lg md:p-10"
              >
                {events.length > 1 && <h3 className="mb-5 font-confetti-display text-2xl font-bold">{ev.name}</h3>}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="font-groove-label text-[0.7rem] uppercase tracking-widest text-confetti-gold">{t.when}</p>
                    <p className="mt-1 font-confetti-display text-xl font-semibold">
                      {formatEventDate(ev.date, t.dateLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    {time && <p className="mt-1 font-groove-body text-base text-confetti-ink/80">{time}</p>}
                  </div>
                  <div>
                    <p className="font-groove-label text-[0.7rem] uppercase tracking-widest text-confetti-gold">{t.where}</p>
                    {ev.venueName && <p className="mt-1 font-confetti-display text-xl font-semibold">{ev.venueName}</p>}
                    {ev.location && <p className="mt-1 font-groove-body text-base text-confetti-ink/80">{ev.location}</p>}
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  {ev.mapsUrl && (
                    <a
                      href={ev.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-confetti-ink px-5 py-2.5 font-groove-label text-sm text-confetti-cream transition-transform hover:scale-105"
                    >
                      <MapPin size={16} /> {t.openMaps}
                    </a>
                  )}
                  <a
                    href={buildGoogleCalendarUrl({
                      title: data.hostName ? `${data.eventTitle ?? ""} ${data.hostName}`.trim() : data.eventTitle ?? "",
                      location: [ev.venueName, ev.location].filter(Boolean).join(", "),
                      start,
                      end: new Date(start.getTime() + 3 * 60 * 60 * 1000),
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-confetti-ink px-5 py-2.5 font-groove-label text-sm transition-transform hover:scale-105"
                  >
                    <CalendarPlus size={16} /> {t.addToCalendar}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
