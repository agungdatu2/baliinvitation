"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRsvpActions({ invitationId, rsvpId }: { invitationId: string; rsvpId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!confirm("Hapus RSVP ini?")) return;
    setBusy(true);
    await fetch(`/api/invitations/${invitationId}/rsvp/${rsvpId}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  };

  return (
    <button onClick={remove} disabled={busy} className="text-red-600 disabled:opacity-40">
      Hapus
    </button>
  );
}
