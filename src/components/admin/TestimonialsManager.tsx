"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";

interface TestimonialRow {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  timeLabel: string;
  order: number;
  isActive: boolean;
}

const emptyForm = {
  authorName: "",
  rating: "5",
  text: "",
  timeLabel: "",
  order: "0",
};

export default function TestimonialsManager({ initialTestimonials }: { initialTestimonials: TestimonialRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleActive = async (t: TestimonialRow) => {
    setBusyId(t.id);
    await fetch(`/api/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    setBusyId(null);
    router.refresh();
  };

  const remove = async (t: TestimonialRow) => {
    if (!confirm(`Hapus testimoni dari "${t.authorName}"?`)) return;
    setBusyId(t.id);
    await fetch(`/api/testimonials/${t.id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: form.authorName,
          rating: Number(form.rating),
          text: form.text,
          timeLabel: form.timeLabel,
          order: Number(form.order) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.formErrors?.[0] || err.error || "Gagal menyimpan testimoni");
      }
      setForm(emptyForm);
      setShowForm(false);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {initialTestimonials.map((t) => (
          <div key={t.id} className="border rounded-lg bg-white p-4 flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="font-serif text-lg">{t.authorName}</h3>
              <button
                onClick={() => toggleActive(t)}
                disabled={busyId === t.id}
                className={`text-xs px-2 py-1 rounded-full ${
                  t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.isActive ? "Tampil" : "Disembunyikan"}
              </button>
            </div>
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
              ))}
              <span className="text-xs text-gray-400 ml-2">{t.timeLabel}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2 flex-1">{t.text}</p>
            <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-500">
              <span>Urutan: {t.order}</span>
              <button onClick={() => remove(t)} disabled={busyId === t.id} className="text-red-600">
                Hapus
              </button>
            </div>
          </div>
        ))}
        {initialTestimonials.length === 0 && <p className="text-gray-400 text-sm">Belum ada testimoni.</p>}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Tambah Testimoni
        </button>
      ) : (
        <form onSubmit={onSubmit} className="border rounded-lg bg-white p-4 space-y-3 max-w-md">
          <h3 className="font-medium">Testimoni Baru</h3>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <label className="block text-sm">
            <span className="text-gray-700">Nama</span>
            <input className="input" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} required />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Rating (1-5)</span>
            <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Isi Testimoni</span>
            <textarea className="input" rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Waktu (tempel apa adanya dari Google, mis. "2 minggu lalu")</span>
            <input className="input" value={form.timeLabel} onChange={(e) => setForm({ ...form, timeLabel: e.target.value })} required />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Urutan tampil (kecil dulu, opsional)</span>
            <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-lume-ink text-white text-sm disabled:opacity-50">
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-sm">
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
