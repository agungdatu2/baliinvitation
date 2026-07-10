"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventItem } from "@/types/invitation";

interface ChangeRequestRow {
  id: string;
  eventIndex: number;
  oldValues: Partial<EventItem>;
  newValues: Partial<EventItem>;
  status: string;
  createdAt: string;
}

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-50 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  approved: "Disetujui",
  rejected: "Ditolak",
};

const FIELD_LABEL: Record<string, string> = {
  date: "Tanggal",
  timeStart: "Jam Mulai",
  timeEnd: "Jam Selesai",
  location: "Lokasi",
  mapsUrl: "Link Maps",
};

export default function ChangeRequestsManager({ requests }: { requests: ChangeRequestRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const act = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    await fetch(`/api/change-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusyId(null);
    router.refresh();
  };

  if (requests.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-10">Belum ada pengajuan perubahan acara dari client.</p>;
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <div key={r.id} className="border rounded-lg bg-white p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-500">
              Acara #{r.eventIndex + 1} · {new Date(r.createdAt).toLocaleString("id-ID")}
            </p>
            <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_CLASS[r.status] ?? ""}`}>
              {STATUS_LABEL[r.status] ?? r.status}
            </span>
          </div>
          <ul className="text-sm space-y-1">
            {Object.entries(r.newValues).map(([key, value]) => (
              <li key={key}>
                <span className="text-gray-500">{FIELD_LABEL[key] ?? key}:</span>{" "}
                <span className="line-through text-gray-400">{String((r.oldValues as any)[key] ?? "-")}</span>{" "}
                &rarr; <span className="font-medium">{String(value)}</span>
              </li>
            ))}
          </ul>
          {r.status === "pending" && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => act(r.id, "approve")}
                disabled={busyId === r.id}
                className="px-3 py-1.5 rounded-md bg-lume-ink text-white text-xs"
              >
                Setujui
              </button>
              <button
                onClick={() => act(r.id, "reject")}
                disabled={busyId === r.id}
                className="px-3 py-1.5 rounded-md bg-gray-100 text-xs"
              >
                Tolak
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
