"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

const emptyForm = { email: "", password: "", name: "" };

export default function AdminUsersManager({ initialAdmins }: { initialAdmins: AdminUserRow[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const remove = async (a: AdminUserRow) => {
    if (!confirm(`Hapus akun admin "${a.email}"?`)) return;
    setBusyId(a.id);
    const res = await fetch(`/api/admin-users/${a.id}`, { method: "DELETE" });
    setBusyId(null);
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Gagal menghapus akun");
      return;
    }
    router.refresh();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.formErrors?.[0] || err.error || "Gagal menyimpan akun");
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
      <div className="border rounded-lg bg-white divide-y">
        {initialAdmins.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-lume-ink">
                {a.name || a.email}
                {a.id === currentUserId && <span className="ml-2 text-xs text-lume-gold">(kamu)</span>}
              </p>
              <p className="text-xs text-gray-400">{a.email}</p>
            </div>
            <button
              onClick={() => remove(a)}
              disabled={busyId === a.id || a.id === currentUserId}
              className="text-red-600 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Hapus
            </button>
          </div>
        ))}
        {initialAdmins.length === 0 && <p className="text-gray-400 text-sm px-4 py-3">Belum ada akun admin.</p>}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Tambah Admin
        </button>
      ) : (
        <form onSubmit={onSubmit} className="border rounded-lg bg-white p-4 space-y-3 max-w-sm">
          <h3 className="font-medium">Admin Baru</h3>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <label className="block text-sm">
            <span className="text-gray-700">Nama (opsional)</span>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Password (min. 8 karakter)</span>
            <input
              type="password"
              minLength={8}
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
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
