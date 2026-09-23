"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheckBig, EyeOff, Copy, Trash2 } from "lucide-react";

const iconBtn = "inline-flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-40 disabled:pointer-events-none";

// Aksi cepat per baris di tabel "Undangan Berjalan" — publish/unpublish
// (langsung PATCH status, tanpa buka form edit penuh), duplikat (klon isi
// undangan dengan slug baru & daftar tamu kosong — dipakai untuk pesanan
// "split link" yang butuh dua tautan terpisah dengan isi mirip), dan hapus
// permanen (cascade ke Guest/RSVP/InvitationView/EventChangeRequest/Payment
// terkait, lihat onDelete: Cascade di schema.prisma).
export default function InvitationRowActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const setStatus = async (next: "draft" | "published") => {
    setBusy(true);
    await fetch(`/api/invitations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  };

  const duplicate = async () => {
    if (!confirm("Duplikat undangan ini? Isinya (foto, acara, dll) disalin dengan slug baru — daftar tamu tidak ikut disalin, isi manual untuk link ini.")) return;
    setBusy(true);
    const res = await fetch(`/api/invitations/${id}/duplicate`, { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      alert("Gagal menduplikat undangan");
      return;
    }
    const created = await res.json();
    router.push(`/admin/invitations/${created.id}/edit?duplicated=1`);
  };

  const remove = async () => {
    if (!confirm("Hapus undangan ini permanen? Semua data tamu, RSVP, dan riwayat kunjungan ikut terhapus.")) return;
    setBusy(true);
    const res = await fetch(`/api/invitations/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      alert("Gagal menghapus undangan");
      return;
    }
    router.refresh();
  };

  return (
    <>
      {status === "published" ? (
        <button
          onClick={() => setStatus("draft")}
          disabled={busy}
          title="Unpublish"
          className={`${iconBtn} text-amber-600 hover:bg-amber-50`}
        >
          <EyeOff size={16} strokeWidth={1.75} />
        </button>
      ) : (
        <button
          onClick={() => setStatus("published")}
          disabled={busy}
          title="Publish"
          className={`${iconBtn} text-green-600 hover:bg-green-50`}
        >
          <CircleCheckBig size={16} strokeWidth={1.75} />
        </button>
      )}
      <button onClick={duplicate} disabled={busy} title="Duplikat" className={`${iconBtn} text-indigo-600 hover:bg-indigo-50`}>
        <Copy size={16} strokeWidth={1.75} />
      </button>
      <button onClick={remove} disabled={busy} title="Hapus" className={`${iconBtn} text-red-600 hover:bg-red-50`}>
        <Trash2 size={16} strokeWidth={1.75} />
      </button>
    </>
  );
}
