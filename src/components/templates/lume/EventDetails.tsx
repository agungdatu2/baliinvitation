import { EventItem } from "@/types/invitation";

export default function EventDetails({ events }: { events: EventItem[] }) {
  if (!events?.length) return null;
  return (
    <section className="px-6 py-20 max-w-2xl mx-auto text-center">
      <p className="text-xs uppercase tracking-widest text-groove-moss mb-2">Rangkaian Acara</p>
      <h2 className="font-groove-display italic text-2xl mb-10" style={{ fontWeight: 500 }}>
        Kami Menantikan Kehadiranmu
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {events.map((ev, i) => (
          <div key={i} className="border border-groove-line rounded-sm p-6 text-left">
            <h3 className="font-groove-display text-lg mb-3" style={{ fontWeight: 600 }}>
              {ev.name}
            </h3>
            <p className="text-sm text-groove-ink/75">
              {new Date(ev.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="text-sm text-groove-ink/75 mb-3">
              Pukul {ev.timeStart} {ev.timezone} &ndash; {ev.timeEnd || "Selesai"}
            </p>
            <p className="text-sm text-groove-ink/75 mb-4">{ev.location}</p>
            {ev.mapsUrl && (
              <a
                href={ev.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-wide text-groove-moss border-b border-groove-moss"
              >
                Google Maps
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
