"use client";

import { useState } from "react";
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
        <p className="text-sm text-gray-500 bg-gray-50 border border-lume-line rounded-lg p-3">
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
      {notice && <p className="text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3">{notice}</p>}
      {events.map((event, i) => (
        <div key={i} className="border border-lume-line rounded-lg bg-white p-4">
          <p className="font-serif text-lg mb-2">{event.name}</p>
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
                  className="px-4 py-2 rounded-lg bg-lume-ink text-white text-sm disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
                <button onClick={() => setEditingIndex(null)} className="px-4 py-2 rounded-lg bg-gray-100 text-sm">
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <EventReadOnly event={event} bare />
              <button onClick={() => startEdit(i, event)} className="text-xs text-blue-600 shrink-0">
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
    <div className="text-sm text-gray-600 space-y-0.5">
      <p>
        {event.date} · {event.timeStart}
        {event.timeEnd ? ` - ${event.timeEnd}` : ""}
      </p>
      <p>{event.location}</p>
      {event.mapsUrl && (
        <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="text-blue-600">
          Lihat di Maps
        </a>
      )}
    </div>
  );
  if (bare) return body;
  return (
    <div className="border border-lume-line rounded-lg bg-white p-4">
      <p className="font-serif text-lg mb-1">{event.name}</p>
      {body}
    </div>
  );
}
