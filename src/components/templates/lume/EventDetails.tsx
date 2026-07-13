import { MapPin, PartyPopper } from "lucide-react";
import { EventItem } from "@/types/invitation";

export default function EventDetails({ events }: { events: EventItem[] }) {
  if (!events?.length) return null;
  return (
    <section className="groove-overlay py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-groove-label uppercase tracking-widest text-xs text-groove-primary mb-2">Rangkaian Acara</p>
          <h2 className="font-groove-display italic text-2xl" style={{ fontWeight: 400 }}>
            Kami Menantikan Kehadiranmu
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {events.map((ev, i) => (
            <div key={i} className="border border-groove-line rounded-lg p-6 flex flex-col items-center text-center">
              <PartyPopper className="h-9 w-9 text-groove-primary mb-3" strokeWidth={1.5} />
              <h3 className="font-groove-display text-lg mb-3" style={{ fontWeight: 600 }}>
                {ev.name}
              </h3>
              <p className="font-groove-body text-sm text-groove-ink/75">
                {new Date(ev.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="font-groove-body text-sm text-groove-ink/75 mb-3">
                Pukul {ev.timeStart} {ev.timezone} &ndash; {ev.timeEnd || "Selesai"}
              </p>
              <p className="font-groove-body text-sm text-groove-ink/75 mb-4">{ev.location}</p>
              {ev.mapsUrl && (
                <a
                  href={ev.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-groove-label inline-flex items-center gap-1.5 bg-groove-primary text-groove-bg text-xs uppercase tracking-widest px-6 py-2.5 rounded-full"
                >
                  <MapPin className="h-3.5 w-3.5" /> Google Maps
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
