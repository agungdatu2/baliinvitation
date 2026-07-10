export type GuestStatus = "pending" | "sent" | "opened" | "responded";

const RANK: Record<GuestStatus, number> = {
  pending: 0,
  sent: 1,
  opened: 2,
  responded: 3,
};

export function isForwardTransition(current: string, target: GuestStatus): boolean {
  const currentRank = RANK[current as GuestStatus] ?? 0;
  return RANK[target] > currentRank;
}

// Status hanya boleh maju (pending -> sent -> opened -> responded), tidak pernah mundur —
// mis. RSVP yang sudah "responded" tidak boleh turun jadi "opened" hanya karena halaman dibuka lagi.
export function nextStatus(current: string, target: GuestStatus): GuestStatus {
  return isForwardTransition(current, target) ? target : (current as GuestStatus);
}

export const GUEST_STATUS_LABEL: Record<GuestStatus, string> = {
  pending: "Belum dikirim",
  sent: "Terkirim",
  opened: "Dibuka",
  responded: "Sudah RSVP",
};

export const GUEST_STATUS_CLASS: Record<GuestStatus, string> = {
  pending: "bg-gray-100 text-gray-500",
  sent: "bg-blue-50 text-blue-700",
  opened: "bg-amber-50 text-amber-700",
  responded: "bg-green-100 text-green-700",
};

export const GUEST_CATEGORY_LABEL: Record<string, string> = {
  keluarga: "Keluarga",
  teman: "Teman",
  rekan: "Rekan Kerja",
  lainnya: "Lainnya",
};
