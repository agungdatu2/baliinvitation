"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GUEST_STATUS_LABEL, GUEST_STATUS_CLASS, GUEST_CATEGORY_LABEL, GuestStatus } from "@/lib/utils/guest-status";
import { GUEST_CATEGORIES, GuestCategory, parseGuestBulkImport } from "@/lib/utils/bulk-import";
import { buildWaLink, buildGuestInvitationMessage } from "@/lib/utils/whatsapp";

interface GuestRow {
  id: string;
  name: string;
  waNumber: string | null;
  category: string;
  guestCode: string;
  status: string;
}

const emptyForm = { name: "", waNumber: "", category: "lainnya" as GuestCategory };

export default function GuestManager({
  token,
  slug,
  groomNickname,
  brideNickname,
  eventDateLabel,
  initialGuests,
}: {
  token: string;
  slug: string;
  groomNickname: string;
  brideNickname: string;
  eventDateLabel: string;
  initialGuests: GuestRow[];
}) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkPreview, setBulkPreview] = useState<ReturnType<typeof parseGuestBulkImport> | null>(null);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const guestLink = (guestCode: string) =>
    `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}?g=${guestCode}`;

  const filtered = useMemo(() => {
    return initialGuests.filter((g) => {
      if (statusFilter !== "all" && g.status !== statusFilter) return false;
      if (categoryFilter !== "all" && g.category !== categoryFilter) return false;
      if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [initialGuests, statusFilter, categoryFilter, search]);

  const copyLink = async (guest: GuestRow) => {
    await navigator.clipboard.writeText(guestLink(guest.guestCode));
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const copyAllLinks = async () => {
    const text = initialGuests.map((g) => `${g.name}: ${guestLink(g.guestCode)}`).join("\n");
    await navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const sendViaWa = async (guest: GuestRow) => {
    if (!guest.waNumber) return;
    setBusyId(guest.id);
    await fetch(`/api/portal/${token}/guests/${guest.id}/mark-sent`, { method: "POST" });
    setBusyId(null);
    const message = buildGuestInvitationMessage({
      guestName: guest.name,
      groomNickname,
      brideNickname,
      eventDateLabel,
      link: guestLink(guest.guestCode),
    });
    window.open(buildWaLink(guest.waNumber, message), "_blank");
    router.refresh();
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/${token}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.formErrors?.[0] || err.error || "Gagal menambah tamu");
      }
      setForm(emptyForm);
      setShowAddForm(false);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async (id: string) => {
    setBusyId(id);
    await fetch(`/api/portal/${token}/guests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setBusyId(null);
    setEditingId(null);
    router.refresh();
  };

  const removeGuest = async (id: string) => {
    if (!confirm("Hapus tamu ini?")) return;
    setBusyId(id);
    await fetch(`/api/portal/${token}/guests/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  };

  const runBulkPreview = () => {
    setBulkPreview(parseGuestBulkImport(bulkText));
  };

  const confirmBulkImport = async () => {
    setBulkSubmitting(true);
    await fetch(`/api/portal/${token}/guests/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: bulkText }),
    });
    setBulkSubmitting(false);
    setBulkText("");
    setBulkPreview(null);
    setShowBulk(false);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-sm">
        <select className="input !mt-0 w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Semua Status</option>
          {(["pending", "sent", "opened", "responded"] as GuestStatus[]).map((s) => (
            <option key={s} value={s}>
              {GUEST_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <select className="input !mt-0 w-auto" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Semua Kategori</option>
          {GUEST_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {GUEST_CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
        <input
          className="input !mt-0 flex-1 min-w-[140px]"
          placeholder="Cari nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setShowAddForm((v) => !v)} className="btn-add">
          + Tambah Tamu
        </button>
        <button onClick={() => setShowBulk((v) => !v)} className="btn-add">
          + Import Banyak Tamu
        </button>
        <button onClick={copyAllLinks} className="btn-add">
          {copiedId === "all" ? "Tersalin!" : "Salin Semua Link"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={submitAdd} className="border border-lume-line rounded-lg bg-white p-4 space-y-3">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <input className="input" placeholder="Nama tamu" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="No WA (opsional)" value={form.waNumber} onChange={(e) => setForm({ ...form, waNumber: e.target.value })} />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as GuestCategory })}>
            {GUEST_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {GUEST_CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-lume-ink text-white text-sm disabled:opacity-50">
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-sm">
              Batal
            </button>
          </div>
        </form>
      )}

      {showBulk && (
        <div className="border border-lume-line rounded-lg bg-white p-4 space-y-3">
          <p className="text-sm text-gray-600">
            Tempel satu nama per baris, atau format <code>nama, no_wa, kategori</code>.
          </p>
          <textarea
            className="input"
            rows={5}
            placeholder={"Budi Santoso\nSiti, 08123456789, keluarga"}
            value={bulkText}
            onChange={(e) => {
              setBulkText(e.target.value);
              setBulkPreview(null);
            }}
          />
          {!bulkPreview ? (
            <button onClick={runBulkPreview} disabled={!bulkText.trim()} className="px-4 py-2 rounded-lg bg-lume-ink text-white text-sm disabled:opacity-50">
              Preview
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">{bulkPreview.guests.length} tamu siap diimpor.</p>
              {bulkPreview.errors.length > 0 && (
                <p className="text-sm text-red-600">{bulkPreview.errors.length} baris dilewati (nama kosong).</p>
              )}
              <ul className="text-sm text-gray-600 max-h-40 overflow-y-auto border border-lume-line rounded p-2">
                {bulkPreview.guests.map((g, i) => (
                  <li key={i}>
                    {g.name} {g.waNumber ? `— ${g.waNumber}` : ""} ({GUEST_CATEGORY_LABEL[g.category]})
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button onClick={confirmBulkImport} disabled={bulkSubmitting} className="px-4 py-2 rounded-lg bg-lume-ink text-white text-sm disabled:opacity-50">
                  {bulkSubmitting ? "Mengimpor..." : "Konfirmasi Import"}
                </button>
                <button onClick={() => setBulkPreview(null)} className="px-4 py-2 rounded-lg bg-gray-100 text-sm">
                  Ubah
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((g) => (
          <div key={g.id} className="border border-lume-line rounded-lg bg-white p-3">
            {editingId === g.id ? (
              <div className="space-y-2">
                <input className="input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <input className="input" value={editForm.waNumber} onChange={(e) => setEditForm({ ...editForm, waNumber: e.target.value })} placeholder="No WA" />
                <select className="input" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value as GuestCategory })}>
                  {GUEST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {GUEST_CATEGORY_LABEL[c]}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => submitEdit(g.id)} disabled={busyId === g.id} className="px-3 py-1.5 rounded-md bg-lume-ink text-white text-xs">
                    Simpan
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-md bg-gray-100 text-xs">
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{g.name}</p>
                  <p className="text-xs text-gray-500">
                    {GUEST_CATEGORY_LABEL[g.category] ?? g.category} {g.waNumber ? `· ${g.waNumber}` : ""}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${GUEST_STATUS_CLASS[g.status as GuestStatus] ?? ""}`}>
                    {GUEST_STATUS_LABEL[g.status as GuestStatus] ?? g.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-xs items-end shrink-0">
                  <button onClick={() => copyLink(g)} className="text-blue-600">
                    {copiedId === g.id ? "Tersalin!" : "Salin Link"}
                  </button>
                  {g.waNumber && (
                    <button onClick={() => sendViaWa(g)} disabled={busyId === g.id} className="text-green-700">
                      Kirim via WA
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(g.id);
                      setEditForm({ name: g.name, waNumber: g.waNumber ?? "", category: g.category as GuestCategory });
                    }}
                    className="text-gray-600"
                  >
                    Edit
                  </button>
                  <button onClick={() => removeGuest(g.id)} disabled={busyId === g.id} className="text-red-600">
                    Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 text-sm py-6">Belum ada tamu.</p>}
      </div>
    </div>
  );
}
