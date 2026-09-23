"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function PortalRsvpActions({ token, rsvpId }: { token: string; rsvpId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!confirm("Hapus RSVP ini?")) return;
    setBusy(true);
    await fetch(`/api/portal/${token}/rsvp/${rsvpId}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  };

  return (
    <button
      onClick={remove}
      disabled={busy}
      title="Hapus"
      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 disabled:opacity-40 transition"
    >
      <Trash2 size={13} strokeWidth={1.75} />
      Hapus
    </button>
  );
}
