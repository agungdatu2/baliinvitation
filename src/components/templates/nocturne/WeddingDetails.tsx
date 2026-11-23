"use client";

import { motion } from "motion/react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

// Format "08:00" -> { label: "8", period: "AM" }; menit ".30" hanya muncul kalau bukan :00.
function formatTime12(hhmm?: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm?.trim() ?? "");
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return { label: minute === "00" ? `${hour}` : `${hour}.${minute}`, period };
}

function formatTimeRange(timeStart: string, timeEnd: string | undefined) {
  const start = formatTime12(timeStart);
  if (!start) return null;
  const end = formatTime12(timeEnd);
  if (!end) return `${start.label} ${start.period}`;
  if (end.period === start.period) return `${start.label} - ${end.label} ${end.period}`;
  return `${start.label} ${start.period} - ${end.label} ${end.period}`;
}

// Fade-in tiap kali masuk layar (once: false — diputar ulang kalau user scroll
// keluar lalu kembali ke section ini). Tiap baris dapat delay kecil bertingkat
// supaya muncul berurutan, bukan serentak.
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.25 },
  transition: { duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
});

// Grid satu baris acara: nama+jam | alamat | panah. Ukuran desktop diukur dari
// referensi lebar 2000px lalu dikonversi ke vw supaya proporsinya sama di lebar
// layar berapa pun; di mobile ditumpuk.
const ROW_GRID = "grid items-center gap-3 py-8 md:grid-cols-[16.2vw_1fr_auto] md:gap-0 md:px-[0.6vw] md:py-[2vw]";

// Section "Wedding / Details" — latar abu terang (mengikuti referensi) dengan
// label kecil di kiri dan blok tanggal + daftar acara bergaris di kanan.
export default function WeddingDetails({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const events = data.events ?? [];
  if (!events.length) return null;

  // events[].date berupa "YYYY-MM-DD" — dipecah manual (bukan new Date lokal)
  // supaya tanggalnya tidak bergeser oleh zona waktu server/browser.
  const [year, month, day] = events[0].date.slice(0, 10).split("-");
  const dateNumeric = `${day}.${month}.${year}`;
  const dateHeading = new Date(`${year}-${month}-${day}T12:00:00Z`).toLocaleDateString(t.dateLocale, {
    weekday: "long",
    timeZone: "UTC",
  });

  let rowIndex = 0;
  const nextDelay = () => 0.15 + 0.12 * rowIndex++;

  return (
    // relative + z-50 SENGAJA — lihat komentar sama di SaveTheDateSection.tsx
    // (Hero sticky tanpa z-index menang lawan elemen statis manapun).
    <section className="relative z-50 bg-[#eaeaea] px-6 py-20 text-[#1c1c1c] md:px-0 md:py-[8vw] md:pl-[13.6vw]">
      <div className="md:grid md:grid-cols-[23.8vw_43.6vw] md:items-start">
        <motion.h2
          {...fadeIn(0)}
          className="font-groove-body text-2xl leading-snug md:text-[1.7vw] md:leading-[1.27]"
        >
          Wedding
          <br />/ Details
        </motion.h2>

        <div className="mt-10 md:mt-0">
          <motion.p
            {...fadeIn(0.1)}
            className="font-nocturne-display text-5xl leading-[1.15] md:text-[6vw] md:leading-[1.17]"
          >
            {dateHeading}
            <br />
            {dateNumeric}
          </motion.p>

          <div className="mt-10 md:mt-[4vw]">
            {events.map((ev, i) => {
              const timeLabel = formatTimeRange(ev.timeStart, ev.timeEnd);
              const address = [ev.venueName, ev.location].filter(Boolean).join(", ");
              return (
                <motion.div key={i} {...fadeIn(nextDelay())} className="border-b border-black/10 last:border-b-0">
                  <div className={ROW_GRID}>
                    <div className="font-nocturne-display text-lg leading-snug md:text-[1.2vw] md:leading-[1.38]">
                      <p>{ev.name}</p>
                      {timeLabel && <p>{timeLabel}</p>}
                    </div>
                    <p className="font-groove-body text-base leading-relaxed md:max-w-[19vw] md:text-[1.2vw] md:leading-[1.58]">
                      {address}
                    </p>
                    {ev.mapsUrl ? (
                      <a
                        href={ev.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="justify-self-start transition-opacity hover:opacity-60 md:justify-self-end"
                        aria-label={t.googleMaps}
                      >
                        <ArrowIcon />
                      </a>
                    ) : (
                      <span />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {data.dressCode && data.dressCode.length > 0 && (
              <motion.div {...fadeIn(nextDelay())} className="border-b border-black/10 last:border-b-0">
                <div className={ROW_GRID}>
                  <p className="font-nocturne-display text-lg leading-snug md:text-[1.2vw] md:leading-[1.38]">{t.dresscode}</p>
                  <div>
                    <p className="font-groove-body text-base leading-relaxed md:max-w-[19vw] md:text-[1.2vw] md:leading-[1.58]">
                      {t.dresscodeNote}
                    </p>
                    <div className="mt-4 flex items-center gap-3 md:mt-[1vw]">
                      {data.dressCode.map((item, i) => (
                        <span
                          key={i}
                          className="h-8 w-8 rounded-full border border-black/20 md:h-[2vw] md:w-[2vw]"
                          style={{ backgroundColor: item.hex }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                  <span />
                </div>
              </motion.div>
            )}

            {data.livestreamUrl && (
              <motion.div {...fadeIn(nextDelay())} className="border-b border-black/10 last:border-b-0">
                <div className={ROW_GRID}>
                  <p className="font-nocturne-display text-lg leading-snug md:text-[1.2vw] md:leading-[1.38]">
                    {t.liveStreamingTitle}
                  </p>
                  <p className="font-groove-body text-base leading-relaxed md:max-w-[19vw] md:text-[1.2vw] md:leading-[1.58]">
                    {data.livestreamNote}
                  </p>
                  <a
                    href={data.livestreamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="justify-self-start transition-opacity hover:opacity-60 md:justify-self-end"
                    aria-label={t.watchLive}
                  >
                    <ArrowIcon />
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 62 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto md:h-[1.2vw]">
      <path d="M0 12H60M60 12L49 1M60 12L49 23" stroke="currentColor" strokeWidth={1.6} />
    </svg>
  );
}
