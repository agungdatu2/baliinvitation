"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface TemplateRow {
  id: string;
  key: string;
  name: string;
  thumbnail: string | null;
  isActive: boolean;
  _count: { invitations: number };
}

export default function ThemesManager({ initialTemplates }: { initialTemplates: TemplateRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ key: "", name: "", thumbnail: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleActive = async (t: TemplateRow) => {
    setBusyId(t.id);
    await fetch(`/api/templates/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    setBusyId(null);
    router.refresh();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.formErrors?.[0] || err.error || "Gagal menyimpan tema");
      }
      setForm({ key: "", name: "", thumbnail: "" });
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
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {initialTemplates.map((t) => (
          <div key={t.id} className="border rounded-lg bg-white p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-lg">{t.name}</h3>
                <p className="text-xs text-gray-500 font-mono">{t.key}</p>
              </div>
              <button
                onClick={() => toggleActive(t)}
                disabled={busyId === t.id}
                className={`text-xs px-2 py-1 rounded-full ${
                  t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.isActive ? "Aktif" : "Nonaktif"}
              </button>
            </div>
            {t.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.thumbnail} alt={t.name} className="mt-3 rounded-md w-full h-32 object-cover" />
            )}
            <p className="text-xs text-gray-500 mt-3">{t._count.invitations} undangan pakai tema ini</p>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Daftarkan Tema Baru
        </button>
      ) : (
        <form onSubmit={onSubmit} className="border rounded-lg bg-white p-4 space-y-3 max-w-md">
          <h3 className="font-medium">Tema Baru</h3>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <label className="block text-sm">
            <span className="text-gray-700">Key (contoh: rose)</span>
            <input
              className="input"
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Nama Tampilan</span>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Thumbnail URL (opsional)</span>
            <input
              className="input"
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            />
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
