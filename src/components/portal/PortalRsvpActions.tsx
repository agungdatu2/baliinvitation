"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <button onClick={remove} disabled={busy} className="text-red-600 text-xs disabled:opacity-40">
      Hapus
    </button>
  );
}
