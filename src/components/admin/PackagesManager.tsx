"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatRupiah } from "@/lib/utils/format";

interface PackageRow {
  id: string;
  name: string;
  price: number;
  description: string | null;
  features: string[];
  hasIntro: boolean;
  maxGalleryImages: number | null;
  activeMonths: number | null;
  isActive: boolean;
  _count: { invitations: number };
}

const emptyForm = {
  name: "",
  price: "",
  description: "",
  features: "",
  hasIntro: true,
  maxGalleryImages: "",
  activeMonths: "",
};

export default function PackagesManager({ initialPackages }: { initialPackages: PackageRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleActive = async (p: PackageRow) => {
    setBusyId(p.id);
    await fetch(`/api/packages/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    setBusyId(null);
    router.refresh();
  };

  const remove = async (p: PackageRow) => {
    if (!confirm(`Hapus paket "${p.name}"?`)) return;
    setBusyId(p.id);
    await fetch(`/api/packages/${p.id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          description: form.description || undefined,
          features: form.features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
          hasIntro: form.hasIntro,
          maxGalleryImages: form.maxGalleryImages ? Number(form.maxGalleryImages) : null,
          activeMonths: form.activeMonths ? Number(form.activeMonths) : null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.formErrors?.[0] || err.error || "Gagal menyimpan paket");
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
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {initialPackages.map((p) => (
          <div key={p.id} className="border rounded-lg bg-white p-4 flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="font-serif text-lg">{p.name}</h3>
              <button
                onClick={() => toggleActive(p)}
                disabled={busyId === p.id}
                className={`text-xs px-2 py-1 rounded-full ${
                  p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {p.isActive ? "Aktif" : "Nonaktif"}
              </button>
            </div>
            <p className="text-xl font-medium text-lume-gold mt-1">{formatRupiah(p.price)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Intro: {p.hasIntro ? "Ya" : "Tidak"} · Galeri maks: {p.maxGalleryImages ?? "Unlimited"} · Aktif:{" "}
              {p.activeMonths ? `${p.activeMonths} bulan` : "Tidak pernah expired"}
            </p>
            {p.description && <p className="text-sm text-gray-600 mt-2">{p.description}</p>}
            {p.features.length > 0 && (
              <ul className="text-sm text-gray-600 mt-3 space-y-1 flex-1">
                {p.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-lume-gold">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-500">
              <span>{p._count.invitations} client pakai paket ini</span>
              <button onClick={() => remove(p)} disabled={busyId === p.id} className="text-red-600">
                Hapus
              </button>
            </div>
          </div>
        ))}
        {initialPackages.length === 0 && <p className="text-gray-400 text-sm">Belum ada paket.</p>}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Tambah Paket
        </button>
      ) : (
        <form onSubmit={onSubmit} className="border rounded-lg bg-white p-4 space-y-3 max-w-md">
          <h3 className="font-medium">Paket Baru</h3>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <label className="block text-sm">
            <span className="text-gray-700">Nama Paket</span>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Harga (Rp)</span>
            <input
              type="number"
              min={0}
              className="input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Deskripsi (opsional)</span>
            <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Fitur (satu per baris)</span>
            <textarea
              className="input"
              rows={4}
              placeholder={"Undangan digital\nUnlimited tamu\nRSVP online"}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.hasIntro}
              onChange={(e) => setForm({ ...form, hasIntro: e.target.checked })}
            />
            <span className="text-gray-700">Tampilkan intro/splash</span>
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Maks. Foto Galeri (kosongkan = unlimited)</span>
            <input
              type="number"
              min={1}
              className="input"
              value={form.maxGalleryImages}
              onChange={(e) => setForm({ ...form, maxGalleryImages: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Masa Aktif dalam bulan (kosongkan = tidak pernah expired)</span>
            <input
              type="number"
              min={1}
              className="input"
              value={form.activeMonths}
              onChange={(e) => setForm({ ...form, activeMonths: e.target.value })}
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
