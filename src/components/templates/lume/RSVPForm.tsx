"use client";

import { useState } from "react";

interface RSVPFormProps {
  invitationId: string;
  guestName?: string;
  guestId?: string;
}

const ATTEND_OPTIONS = [
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
  { value: "belum_tahu", label: "Belum Tahu" },
];

export default function RSVPForm({ invitationId, guestName, guestId }: RSVPFormProps) {
  const [form, setForm] = useState({ guestName: guestName ?? "", attendance: "hadir", guestCount: 1, message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId, guestId, ...form }),
    });
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <section className="px-6 py-10 max-w-md mx-auto text-center">
        <div className="groove-glass rounded-2xl p-8">
          <p className="text-sm text-groove-ink/70">Terima kasih! RSVP kamu sudah kami terima.</p>
        </div>
      </section>
    );
  }

  const fieldClass =
    "w-full border-0 border-b border-groove-line bg-transparent py-2.5 text-sm text-groove-ink focus:outline-none focus:border-groove-moss transition-colors";

  return (
    <section className="px-6 py-10 max-w-md mx-auto">
      <div className="groove-glass rounded-2xl p-6 md:p-9">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-groove-moss mb-2">Konfirmasi Kehadiran</p>
        <h2 className="font-groove-display italic text-2xl" style={{ fontWeight: 500 }}>
          Kirimkan Doa Restu
        </h2>
      </div>
      <form onSubmit={submit} className="space-y-5 text-left">
        <div>
          <label className="block text-[0.68rem] uppercase tracking-widest text-groove-ink/60 mb-1.5">Nama Lengkap</label>
          <input
            required
            className={fieldClass}
            value={form.guestName}
            onChange={(e) => setForm({ ...form, guestName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[0.68rem] uppercase tracking-widest text-groove-ink/60 mb-2">Konfirmasi Kehadiran</label>
          <div className="flex gap-2">
            {ATTEND_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setForm({ ...form, attendance: opt.value })}
                className={`flex-1 py-2 rounded-full border text-xs tracking-wide transition ${
                  form.attendance === opt.value
                    ? "bg-groove-moss border-groove-moss text-groove-bg"
                    : "border-groove-line text-groove-ink/70"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[0.68rem] uppercase tracking-widest text-groove-ink/60 mb-1.5">Jumlah Tamu</label>
          <input
            type="number"
            min={1}
            className={fieldClass}
            value={form.guestCount}
            onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-[0.68rem] uppercase tracking-widest text-groove-ink/60 mb-1.5">Ucapan &amp; Doa</label>
          <textarea
            className={fieldClass}
            rows={3}
            placeholder="Tuliskan doa terbaikmu untuk kami..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-groove-stone text-groove-bg text-sm tracking-widest uppercase disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim RSVP"}
        </button>
      </form>
      </div>
    </section>
  );
}
