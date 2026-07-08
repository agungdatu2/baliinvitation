"use client";

import { useState } from "react";

export default function RSVPForm({ invitationId }: { invitationId: string }) {
  const [form, setForm] = useState({ guestName: "", attendance: "hadir", guestCount: 1, message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId, ...form }),
    });
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return <p className="text-center py-14 text-sm text-gray-600">Terima kasih! RSVP kamu sudah kami terima.</p>;
  }

  return (
    <section className="px-6 py-14 max-w-md mx-auto">
      <p className="text-xs uppercase tracking-widest text-lume-gold mb-2 text-center">Konfirmasi Kehadiran</p>
      <h2 className="font-serif text-2xl mb-8 text-center">Kirimkan Doa Restu</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          required
          placeholder="Nama Lengkap"
          className="input"
          value={form.guestName}
          onChange={(e) => setForm({ ...form, guestName: e.target.value })}
        />
        <select
          className="input"
          value={form.attendance}
          onChange={(e) => setForm({ ...form, attendance: e.target.value })}
        >
          <option value="hadir">Hadir</option>
          <option value="tidak_hadir">Tidak Hadir</option>
          <option value="belum_tahu">Belum Tahu</option>
        </select>
        <input
          type="number"
          min={1}
          className="input"
          value={form.guestCount}
          onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
        />
        <textarea
          placeholder="Ucapan & Doa (opsional)"
          className="input"
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button disabled={loading} className="w-full py-3 rounded-full bg-lume-ink text-white text-sm disabled:opacity-50">
          {loading ? "Mengirim..." : "Kirim RSVP"}
        </button>
      </form>
    </section>
  );
}
