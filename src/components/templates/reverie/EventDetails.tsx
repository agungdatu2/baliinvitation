import { MapPin } from "lucide-react";
import { EventItem } from "@/types/invitation";
import { getDict, Lang } from "@/lib/i18n/lume";

// Format "15:00" -> { label: "3.00", period: "PM" }. Return null kalau formatnya
// tidak dikenali (mis. field kosong) supaya caller bisa fallback dengan aman.
function formatTime12(hhmm?: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm?.trim() ?? "");
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return { label: `${hour}.${minute}`, period };
}

// Gabung timeStart-timeEnd jadi satu baris seperti referensi ("9.00 - 10.00 AM"),
// AM/PM cuma ditulis sekali di akhir kalau kedua waktu ada di periode yang sama.
function formatTimeRange(timeStart: string, timeEnd: string | undefined, atLabel: string) {
  const start = formatTime12(timeStart);
  if (!start) return null;
  const end = formatTime12(timeEnd);
  if (!end) return `${atLabel} ${start.label} ${start.period}`;
  if (end.period === start.period) return `${atLabel} ${start.label} - ${end.label} ${end.period}`;
  return `${atLabel} ${start.label} ${start.period} - ${end.label} ${end.period}`;
}

// Section jadwal acara — satu heading tanggal besar (italic, diambil dari acara
// pertama) di atas, lalu tiap acara ditampilkan ringkas: nama + jam, nama venue
// (italic), alamat, tombol Google Maps. Sengaja tanpa countdown/calendar-button
// mengikuti referensi desain yang diberikan (minimal, bukan dashboard-style).
export default function EventDetails({ events, lang }: { events: EventItem[]; lang?: Lang }) {
  if (!events?.length) return null;
  const t = getDict(lang);

  const heading = new Date(events[0].date).toLocaleDateString(t.dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative z-10 text-groove-bg px-6 md:px-14 py-24">
      <div className="max-w-md">
        <p className="font-groove-display italic text-3xl md:text-4xl leading-tight mb-8">{heading}</p>
        <div className="h-px bg-groove-bg/40 mb-10" />

        <div className="space-y-8">
          {events.map((ev, i) => {
            const timeLabel = formatTimeRange(ev.timeStart, ev.timeEnd, t.eventTimeAtLabel);
            return (
              <div key={i}>
                <h3 className="font-groove-display leading-snug text-lg md:text-xl" style={{ fontWeight: 500 }}>
                  {ev.name}
                  {timeLabel && (
                    <>
                      <br />
                      {timeLabel}
                    </>
                  )}
                </h3>
                {ev.venueName && (
                  <p className="font-groove-display italic text-sm mt-2.5">{ev.venueName}</p>
                )}
                {ev.location && (
                  <p className="font-groove-body text-xs text-groove-bg/80 leading-relaxed mt-1.5 max-w-sm">
                    {ev.location}
                  </p>
                )}
                {ev.mapsUrl && (
                  <a
                    href={ev.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-groove-label mt-4 inline-flex items-center gap-1.5 bg-groove-stone/70 border border-groove-line-dark text-groove-bg text-[0.65rem] uppercase tracking-widest px-5 py-2 rounded-md hover:bg-groove-stone transition"
                  >
                    <MapPin className="h-3 w-3" /> {t.googleMaps}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
