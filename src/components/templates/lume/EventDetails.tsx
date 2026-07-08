import { EventItem } from "@/types/invitation";

export default function EventDetails({ events }: { events: EventItem[] }) {
  if (!events?.length) return null;
  return (
    <section className="px-6 py-14 max-w-2xl mx-auto text-center">
      <p className="text-xs uppercase tracking-widest text-lume-gold mb-2">Mari Menjadi Saksi Cinta Kami</p>
      <h2 className="font-serif text-2xl mb-8">Dengan penuh cinta, kami mengundang kehadiranmu</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((ev, i) => (
          <div key={i} className="border rounded-xl p-6">
            <h3 className="font-medium text-lg mb-2">{ev.name}</h3>
            <p className="text-sm text-gray-600">
              {new Date(ev.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Pukul {ev.timeStart} {ev.timezone} &ndash; {ev.timeEnd || "Selesai"}
            </p>
            <p className="text-sm text-gray-600 mb-4">{ev.location}</p>
            {ev.mapsUrl && (
              <a href={ev.mapsUrl} target="_blank" rel="noreferrer" className="text-xs text-lume-gold underline">
                Google Maps
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
