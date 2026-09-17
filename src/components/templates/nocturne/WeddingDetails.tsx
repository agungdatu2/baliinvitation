import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

// Format "15:00" -> { label: "3.00", period: "PM" }.
function formatTime12(hhmm?: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm?.trim() ?? "");
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return { label: `${hour}.${minute}`, period };
}

function formatTimeRange(timeStart: string, timeEnd: string | undefined) {
  const start = formatTime12(timeStart);
  if (!start) return null;
  const end = formatTime12(timeEnd);
  if (!end) return `${start.label} ${start.period}`;
  if (end.period === start.period) return `${start.label} - ${end.label} ${end.period}`;
  return `${start.label} ${start.period} - ${end.label} ${end.period}`;
}

// Section "Wedding / Details" — gabungan jadwal acara + dress code + livestream
// jadi SATU section yang mengalir dengan garis pembatas tipis antar baris,
// persis pola referensi (groovepublic.com/claire) — bedanya di sini tetap
// gelap/hitam (bukan krem terang) supaya konsisten dengan identitas Nocturne
// yang sudah dibangun sejak awal.
export default function WeddingDetails({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const events = data.events ?? [];
  if (!events.length) return null;

  const dateHeading = new Date(events[0].date).toLocaleDateString(t.dateLocale, {
    weekday: "long",
  });
  const dateNumeric = new Date(events[0].date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    // relative + z-50 SENGAJA — lihat komentar sama di SaveTheDateSection.tsx
    // (Hero sticky tanpa z-index menang lawan elemen statis manapun).
    <section className="relative z-50 bg-black px-6 py-24 text-groove-bg md:px-16 md:py-32">
      <div className="mx-auto max-w-2xl md:max-w-3xl">
        <h2 className="font-nocturne-display text-3xl leading-tight text-groove-bg/90 md:text-5xl">
          Wedding
          <br />
          <span className="text-groove-bg/70">/ Details</span>
        </h2>

        <p className="mt-10 font-nocturne-display text-4xl text-groove-bg md:text-6xl">
          {dateHeading}
          <br />
          {dateNumeric}
        </p>

        <div className="mt-14 divide-y divide-groove-bg/15">
          {events.map((ev, i) => {
            const timeLabel = formatTimeRange(ev.timeStart, ev.timeEnd);
            return (
              <div key={i} className="grid gap-4 py-8 md:grid-cols-2 md:gap-10">
                <div>
                  <p className="font-nocturne-display text-xl text-groove-bg md:text-2xl">{ev.name}</p>
                  {timeLabel && <p className="mt-1 font-nocturne-display text-xl text-groove-bg/70 md:text-2xl">{timeLabel}</p>}
                </div>
                <div>
                  {ev.venueName && <p className="font-groove-body text-sm text-groove-bg/85">{ev.venueName}</p>}
                  {ev.location && (
                    <p className="mt-1 font-groove-body text-sm leading-relaxed text-groove-bg/60">{ev.location}</p>
                  )}
                  {ev.mapsUrl && (
                    <a
                      href={ev.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-groove-bg/80 transition-colors hover:text-groove-bg"
                      aria-label={t.googleMaps}
                    >
                      <ArrowIcon />
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {data.dressCode && data.dressCode.length > 0 && (
            <div className="grid gap-4 py-8 md:grid-cols-2 md:gap-10">
              <div>
                <p className="font-nocturne-display text-xl text-groove-bg md:text-2xl">{t.dresscode}</p>
              </div>
              <div>
                <p className="font-groove-body text-sm leading-relaxed text-groove-bg/60">{t.dresscodeNote}</p>
                <div className="mt-4 flex items-center gap-3">
                  {data.dressCode.map((item, i) => (
                    <span
                      key={i}
                      className="h-10 w-10 rounded-full border border-groove-bg/30"
                      style={{ backgroundColor: item.hex }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {data.livestreamUrl && (
            <div className="grid gap-4 py-8 md:grid-cols-2 md:gap-10">
              <div>
                <p className="font-nocturne-display text-xl text-groove-bg md:text-2xl">{t.liveStreamingTitle}</p>
              </div>
              <div>
                {data.livestreamNote && (
                  <p className="font-groove-body text-sm leading-relaxed text-groove-bg/60">{data.livestreamNote}</p>
                )}
                <a
                  href={data.livestreamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-groove-bg/80 transition-colors hover:text-groove-bg"
                  aria-label={t.watchLive}
                >
                  <ArrowIcon />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10H30M30 10L21 1M30 10L21 19" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}
