"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  UserPlus,
  Upload,
  Copy,
  Link2,
  MessageCircle,
  Pencil,
  Trash2,
  Check,
  X,
  Eye,
  LucideIcon,
} from "lucide-react";
import { GUEST_STATUS_LABEL, GUEST_STATUS_CLASS, GUEST_CATEGORY_LABEL, GuestStatus } from "@/lib/utils/guest-status";
import { GUEST_CATEGORIES, GuestCategory, parseGuestBulkImport } from "@/lib/utils/bulk-import";
import { buildWaLink, buildGuestInvitationMessage, renderMessageTemplate } from "@/lib/utils/whatsapp";
import { formatDate } from "@/lib/utils/format";
import MessageTemplateEditor from "./MessageTemplateEditor";

interface GuestRow {
  id: string;
  name: string;
  waNumber: string | null;
  category: string;
  guestCode: string;
  status: string;
  firstOpenedAt: string | null;
  viewCount: number;
}

const emptyForm = { name: "", waNumber: "", category: "lainnya" as GuestCategory };

const GUEST_STATUS_DOT: Record<GuestStatus, string> = {
  pending: "bg-gray-400",
  sent: "bg-blue-500",
  opened: "bg-amber-500",
  responded: "bg-green-500",
};

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?"
  );
}

export default function GuestManager({
  token,
  slug,
  invitationTitle,
  eventTitle,
  isWedding = true,
  eventDateLabel,
  initialGuests,
  initialMessageTemplate,
}: {
  token: string;
  slug: string;
  invitationTitle: string; // "Groom & Bride" (wedding) atau hostName (non-wedding)
  eventTitle?: string; // "Grand Opening"/"Melaspas" dst — cuma dipakai non-wedding
  isWedding?: boolean;
  eventDateLabel: string;
  initialGuests: GuestRow[];
  initialMessageTemplate?: string; // template custom client, "" = pakai default
}) {
  const router = useRouter();
  const [messageTemplate, setMessageTemplate] = useState(initialMessageTemplate ?? "");
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
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const guestLink = (guestCode: string) =>
    `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}?g=${guestCode}`;

  // Dipakai bareng oleh "Kirim via WA" (buka wa.me) dan "Salin Pesan" (copy manual
  // — buat tamu yang nomornya belum diisi, jadi client tetap bisa kirim sendiri
  // lewat WhatsApp/kontak apapun tanpa perlu isi nomor ke sistem dulu).
  const buildMessage = (guest: GuestRow) =>
    messageTemplate.trim()
      ? renderMessageTemplate(messageTemplate, { nama: guest.name, link: guestLink(guest.guestCode) })
      : buildGuestInvitationMessage({
          guestName: guest.name,
          title: invitationTitle,
          eventTitle,
          isWedding,
          eventDateLabel,
          link: guestLink(guest.guestCode),
        });

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
    window.open(buildWaLink(guest.waNumber, buildMessage(guest)), "_blank");
    router.refresh();
  };

  // Buat tamu yang nomor WA-nya belum/tidak diisi — copy pesan lengkap (sudah
  // terisi nama & link) supaya client bisa paste sendiri ke WhatsApp/kontak
  // manapun. Tetap tandai "Sudah dikirim" sama seperti "Kirim via WA", karena
  // niatnya sama-sama untuk langsung dikirim ke tamu itu.
  const copyMessage = async (guest: GuestRow) => {
    await navigator.clipboard.writeText(buildMessage(guest));
    setCopiedMessageId(guest.id);
    setTimeout(() => setCopiedMessageId(null), 1500);
    setBusyId(guest.id);
    await fetch(`/api/portal/${token}/guests/${guest.id}/mark-sent`, { method: "POST" });
    setBusyId(null);
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
      <MessageTemplateEditor token={token} initialValue={messageTemplate} onSaved={setMessageTemplate} />

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
        <div className="relative flex-1 min-w-[140px]">
          <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            className="input !mt-0 pl-9"
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setShowAddForm((v) => !v)} className="btn-add inline-flex items-center gap-1.5">
          <UserPlus size={14} strokeWidth={1.75} />
          Tambah Tamu
        </button>
        <button onClick={() => setShowBulk((v) => !v)} className="btn-add inline-flex items-center gap-1.5">
          <Upload size={14} strokeWidth={1.75} />
          Import Banyak Tamu
        </button>
        <button onClick={copyAllLinks} className="btn-add inline-flex items-center gap-1.5">
          <Copy size={14} strokeWidth={1.75} />
          {copiedId === "all" ? "Tersalin!" : "Salin Semua Link"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={submitAdd} className="rounded-xl border border-lume-line bg-white p-4 shadow-sm space-y-3">
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
            <button type="submit" disabled={submitting} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-lume-ink text-white text-sm disabled:opacity-50 hover:opacity-90 transition">
              <Check size={14} strokeWidth={1.75} />
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200 transition">
              <X size={14} strokeWidth={1.75} />
              Batal
            </button>
          </div>
        </form>
      )}

      {showBulk && (
        <div className="rounded-xl border border-lume-line bg-white p-4 shadow-sm space-y-3">
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
            <button onClick={runBulkPreview} disabled={!bulkText.trim()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-lume-ink text-white text-sm disabled:opacity-50 hover:opacity-90 transition">
              <Eye size={14} strokeWidth={1.75} />
              Preview
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">{bulkPreview.guests.length} tamu siap diimpor.</p>
              {bulkPreview.errors.length > 0 && (
                <p className="text-sm text-red-600">{bulkPreview.errors.length} baris dilewati (nama kosong).</p>
              )}
              <ul className="text-sm text-gray-600 max-h-40 overflow-y-auto border border-lume-line rounded-lg p-2">
                {bulkPreview.guests.map((g, i) => (
                  <li key={i}>
                    {g.name} {g.waNumber ? `— ${g.waNumber}` : ""} ({GUEST_CATEGORY_LABEL[g.category]})
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button onClick={confirmBulkImport} disabled={bulkSubmitting} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-lume-ink text-white text-sm disabled:opacity-50 hover:opacity-90 transition">
                  <Check size={14} strokeWidth={1.75} />
                  {bulkSubmitting ? "Mengimpor..." : "Konfirmasi Import"}
                </button>
                <button onClick={() => setBulkPreview(null)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200 transition">
                  <Pencil size={14} strokeWidth={1.75} />
                  Ubah
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((g) => (
          <div key={g.id} className="rounded-xl border border-lume-line bg-white p-4 shadow-sm">
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
                  <button onClick={() => submitEdit(g.id)} disabled={busyId === g.id} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-lume-ink text-white text-xs hover:opacity-90 transition">
                    <Check size={13} strokeWidth={1.75} />
                    Simpan
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 text-xs hover:bg-gray-200 transition">
                    <X size={13} strokeWidth={1.75} />
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lume-gold/15 text-lume-gold text-xs font-semibold">
                  {initials(g.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-lume-ink truncate">{g.name}</p>
                      <p className="text-xs text-gray-500">
                        {GUEST_CATEGORY_LABEL[g.category] ?? g.category} {g.waNumber ? `· ${g.waNumber}` : ""}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${GUEST_STATUS_CLASS[g.status as GuestStatus] ?? ""}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${GUEST_STATUS_DOT[g.status as GuestStatus] ?? "bg-gray-400"}`} />
                      {GUEST_STATUS_LABEL[g.status as GuestStatus] ?? g.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {g.firstOpenedAt ? `Dibuka ${formatDate(g.firstOpenedAt)}` : "Belum dibuka"} · {g.viewCount} kunjungan
                  </p>
                  <div className="flex flex-wrap gap-0.5 mt-2 -ml-2">
                    <ActionPill icon={Link2} onClick={() => copyLink(g)}>
                      {copiedId === g.id ? "Tersalin!" : "Salin Link"}
                    </ActionPill>
                    <ActionPill icon={Copy} onClick={() => copyMessage(g)} disabled={busyId === g.id}>
                      {copiedMessageId === g.id ? "Tersalin!" : "Salin Pesan"}
                    </ActionPill>
                    {g.waNumber && (
                      <ActionPill icon={MessageCircle} tone="green" onClick={() => sendViaWa(g)} disabled={busyId === g.id}>
                        Kirim via WA
                      </ActionPill>
                    )}
                    <ActionPill
                      icon={Pencil}
                      onClick={() => {
                        setEditingId(g.id);
                        setEditForm({ name: g.name, waNumber: g.waNumber ?? "", category: g.category as GuestCategory });
                      }}
                    >
                      Edit
                    </ActionPill>
                    <ActionPill icon={Trash2} tone="red" onClick={() => removeGuest(g.id)} disabled={busyId === g.id}>
                      Hapus
                    </ActionPill>
                  </div>
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

function ActionPill({
  icon: Icon,
  tone = "default",
  disabled,
  onClick,
  children,
}: {
  icon: LucideIcon;
  tone?: "default" | "green" | "red";
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "green" ? "text-green-700 hover:bg-green-50" : tone === "red" ? "text-red-600 hover:bg-red-50" : "text-blue-600 hover:bg-blue-50";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition disabled:opacity-40 ${toneClass}`}
    >
      <Icon size={13} strokeWidth={1.75} />
      {children}
    </button>
  );
}
