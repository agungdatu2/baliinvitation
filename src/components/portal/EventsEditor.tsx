"use client";

import { useState } from "react";
import { CalendarClock, MapPin, Pencil, X, Info } from "lucide-react";
import { EventItem } from "@/types/invitation";

export default function EventsEditor({
  token,
  events,
  clientCanEditEvents,
}: {
  token: string;
  events: EventItem[];
  clientCanEditEvents: boolean;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<EventItem>>({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const startEdit = (index: number, event: EventItem) => {
    setEditingIndex(index);
    setForm({ date: event.date, timeStart: event.timeStart, timeEnd: event.timeEnd, location: event.location, mapsUrl: event.mapsUrl });
    setNotice(null);
  };

  const submit = async (index: number) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/portal/${token}/events`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventIndex: index, values: form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error || "Gagal menyimpan perubahan");
      } else {
        setNotice(data.message);
        setEditingIndex(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!clientCanEditEvents) {
    return (
      <div className="space-y-3">
        <p className="flex items-start gap-2 text-sm text-gray-600 bg-white border border-lume-line rounded-xl p-4 shadow-sm">
          <Info size={16} strokeWidth={1.75} className="shrink-0 mt-0.5 text-lume-gold" />
          Edit jadwal acara sedang tidak diaktifkan untuk Anda. Hubungi admin kalau perlu perubahan.
        </p>
        {events.map((e, i) => (
          <EventReadOnly key={i} event={e} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notice && (
        <p className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4">
          <Info size={16} strokeWidth={1.75} className="shrink-0 mt-0.5" />
          {notice}
        </p>
      )}
      {events.map((event, i) => (
        <div key={i} className="rounded-xl border border-lume-line bg-white p-4 shadow-sm">
          <p className="font-serif text-lg text-lume-ink mb-2">{event.name}</p>
          {editingIndex === i ? (
            <div className="space-y-2">
              <label className="block text-xs text-gray-600">
                Tanggal
                <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs text-gray-600">
                  Jam Mulai
                  <input className="input" value={form.timeStart} onChange={(e) => setForm({ ...form, timeStart: e.target.value })} />
                </label>
                <label className="block text-xs text-gray-600">
                  Jam Selesai
                  <input className="input" value={form.timeEnd ?? ""} onChange={(e) => setForm({ ...form, timeEnd: e.target.value })} />
                </label>
              </div>
              <label className="block text-xs text-gray-600">
                Lokasi
                <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </label>
              <label className="block text-xs text-gray-600">
                Link Google Maps
                <input className="input" value={form.mapsUrl ?? ""} onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })} />
              </label>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => submit(i)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-lume-ink text-white text-sm disabled:opacity-50 hover:opacity-90 transition"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200 transition"
                >
                  <X size={14} strokeWidth={1.75} />
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <EventReadOnly event={event} bare />
              <button
                onClick={() => startEdit(i, event)}
                title="Edit"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 shrink-0 transition"
              >
                <Pencil size={13} strokeWidth={1.75} />
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
      {events.length === 0 && <p className="text-center text-gray-400 text-sm py-6">Belum ada acara.</p>}
    </div>
  );
}

function EventReadOnly({ event, bare }: { event: EventItem; bare?: boolean }) {
  const body = (
    <div className="text-sm text-gray-600 space-y-1">
      <p className="flex items-center gap-1.5">
        <CalendarClock size={14} strokeWidth={1.75} className="shrink-0 text-lume-gold" />
        {event.date} · {event.timeStart}
        {event.timeEnd ? ` - ${event.timeEnd}` : ""}
      </p>
      <p className="flex items-start gap-1.5">
        <MapPin size={14} strokeWidth={1.75} className="shrink-0 mt-0.5 text-lume-gold" />
        <span>{event.location}</span>
      </p>
      {event.mapsUrl && (
        <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="inline-block text-blue-600 pl-5">
          Lihat di Maps
        </a>
      )}
    </div>
  );
  if (bare) return body;
  return (
    <div className="rounded-xl border border-lume-line bg-white p-4 shadow-sm">
      <p className="font-serif text-lg text-lume-ink mb-1">{event.name}</p>
      {body}
    </div>
  );
}
