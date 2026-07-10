"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildWaLink, buildPortalLinkMessage } from "@/lib/utils/whatsapp";

export default function PortalSettingsPanel({
  invitationId,
  slug,
  clientName,
  clientPhone,
  portalToken,
  portalEnabled,
  clientCanEditEvents,
}: {
  invitationId: string;
  slug: string;
  clientName: string;
  clientPhone: string | null;
  portalToken: string;
  portalEnabled: boolean;
  clientCanEditEvents: boolean;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const portalLink = `${typeof window !== "undefined" ? window.location.origin : ""}/portal/${portalToken}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(portalLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const togglePortal = async (field: "portalEnabled" | "clientCanEditEvents", value: boolean) => {
    setBusy(true);
    await fetch(`/api/invitations/${invitationId}/portal`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setBusy(false);
    router.refresh();
  };

  const resetToken = async () => {
    if (!confirm("Reset link portal? Link lama tidak akan bisa dipakai lagi.")) return;
    setBusy(true);
    await fetch(`/api/invitations/${invitationId}/portal/reset-token`, { method: "POST" });
    setBusy(false);
    router.refresh();
  };

  const sendPortalLinkViaWa = () => {
    if (!clientPhone) return;
    const message = buildPortalLinkMessage({ clientName, portalLink });
    window.open(buildWaLink(clientPhone, message), "_blank");
  };

  return (
    <div>
      <h2 className="font-medium mb-3">Portal Client</h2>
      <div className="border rounded-lg bg-white p-4 space-y-4">
        <div className="flex gap-2">
          <input readOnly value={portalLink} className="input flex-1 text-xs" />
          <button onClick={copyLink} className="px-3 py-2 rounded-md bg-gray-100 text-xs shrink-0">
            {copied ? "Tersalin!" : "Salin"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={sendPortalLinkViaWa}
            disabled={!clientPhone}
            className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs disabled:opacity-40"
            title={clientPhone ? undefined : "Client belum punya no. HP tersimpan"}
          >
            Kirim link portal via WA
          </button>
          <button onClick={resetToken} disabled={busy} className="px-3 py-1.5 rounded-md bg-red-50 text-red-600 text-xs">
            Reset Link Portal
          </button>
          <a href={`/${slug}`} target="_blank" className="px-3 py-1.5 rounded-md bg-gray-100 text-xs">
            Lihat Undangan
          </a>
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-sm">
          <span>Portal aktif</span>
          <ToggleSwitch checked={portalEnabled} disabled={busy} onChange={(v) => togglePortal("portalEnabled", v)} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Client boleh edit jadwal acara</span>
          <ToggleSwitch checked={clientCanEditEvents} disabled={busy} onChange={(v) => togglePortal("clientCanEditEvents", v)} />
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`w-10 h-6 rounded-full transition relative ${checked ? "bg-lume-ink" : "bg-gray-300"}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}
