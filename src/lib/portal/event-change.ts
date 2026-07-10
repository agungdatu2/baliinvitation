export function isAutoApproveEnabled(): boolean {
  const raw = process.env.PORTAL_AUTO_APPROVE_EVENT_EDITS;
  if (raw === undefined) return true; // default true per spec
  return raw !== "false" && raw !== "0";
}

// Auto-approve ON: terapkan langsung ke Invitation.events, tapi tetap dicatat
// (status "approved") supaya admin bisa lihat riwayat. Auto-approve OFF: event lama
// tidak berubah sampai admin approve request-nya secara manual di /admin.
export function decideChangeRequestStatus(autoApprove: boolean): "approved" | "pending" {
  return autoApprove ? "approved" : "pending";
}

export function shouldApplyImmediately(autoApprove: boolean): boolean {
  return autoApprove;
}
