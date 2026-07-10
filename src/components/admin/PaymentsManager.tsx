"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatRupiah, formatDate } from "@/lib/utils/format";

interface PaymentRow {
  id: string;
  amount: number;
  paidAt: string;
  note: string | null;
  invitation: { clientName: string; groomNickname: string; brideNickname: string };
}

interface InvitationOption {
  id: string;
  label: string;
}

const emptyForm = { invitationId: "", amount: "", paidAt: "", note: "" };

export default function PaymentsManager({
  initialPayments,
  invitationOptions,
}: {
  initialPayments: PaymentRow[];
  invitationOptions: InvitationOption[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: form.invitationId,
          amount: Number(form.amount),
          paidAt: form.paidAt || undefined,
          note: form.note || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.formErrors?.[0] || err.error || "Gagal mencatat pembayaran");
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

  const remove = async (id: string) => {
    if (!confirm("Hapus catatan pembayaran ini?")) return;
    setBusyId(id);
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Catat Pembayaran
        </button>
      ) : (
        <form onSubmit={onSubmit} className="border rounded-lg bg-white p-4 space-y-3 max-w-md">
          <h3 className="font-medium">Pembayaran Baru</h3>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <label className="block text-sm">
            <span className="text-gray-700">Client / Undangan</span>
            <select
              className="input"
              value={form.invitationId}
              onChange={(e) => setForm({ ...form, invitationId: e.target.value })}
              required
            >
              <option value="">Pilih client...</option>
              {invitationOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Nominal (Rp)</span>
            <input
              type="number"
              min={1}
              className="input"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Tanggal Bayar (opsional, default hari ini)</span>
            <input type="date" className="input" value={form.paidAt} onChange={(e) => setForm({ ...form, paidAt: e.target.value })} />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Catatan (opsional)</span>
            <input className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
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

      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Client</th>
              <th className="p-3">Nominal</th>
              <th className="p-3">Catatan</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {initialPayments.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 tabular-nums">{formatDate(p.paidAt)}</td>
                <td className="p-3">
                  {p.invitation.clientName}
                  <span className="text-gray-400"> — {p.invitation.groomNickname} & {p.invitation.brideNickname}</span>
                </td>
                <td className="p-3 tabular-nums">{formatRupiah(p.amount)}</td>
                <td className="p-3 text-gray-500">{p.note || "-"}</td>
                <td className="p-3 text-right">
                  <button onClick={() => remove(p.id)} disabled={busyId === p.id} className="text-red-600">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {initialPayments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Belum ada pembayaran tercatat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
