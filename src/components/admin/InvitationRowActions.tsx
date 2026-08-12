"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Aksi cepat per baris di tabel "Undangan Berjalan" — publish/unpublish
// (langsung PATCH status, tanpa buka form edit penuh) dan hapus permanen
// (cascade ke Guest/RSVP/InvitationView/EventChangeRequest/Payment terkait,
// lihat onDelete: Cascade di schema.prisma).
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
        <button onClick={() => setStatus("draft")} disabled={busy} className="text-amber-600 disabled:opacity-40">
          Unpublish
        </button>
      ) : (
        <button onClick={() => setStatus("published")} disabled={busy} className="text-green-600 disabled:opacity-40">
          Publish
        </button>
      )}
      <button onClick={remove} disabled={busy} className="text-red-600 disabled:opacity-40">
        Hapus
      </button>
    </>
  );
}
