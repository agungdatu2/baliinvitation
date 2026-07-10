import { prisma } from "@/lib/prisma";

export type PortalAccessResult = "ok" | "invalid" | "disabled" | "expired";

// Portal ditutup otomatis N hari setelah hari-H — bukan diminta eksplisit di spec,
// tapi "invitation not expired" perlu definisi konkret. 30 hari dianggap cukup untuk
// urusan pasca-acara (ucapan terakhir, dst).
export const PORTAL_EXPIRY_GRACE_DAYS = 30;

export interface PortalInvitationLike {
  portalEnabled: boolean;
  eventDate: Date;
}

export function evaluatePortalAccess(invitation: PortalInvitationLike | null): PortalAccessResult {
  if (!invitation) return "invalid";
  if (!invitation.portalEnabled) return "disabled";

  const expiresAt = new Date(invitation.eventDate);
  expiresAt.setDate(expiresAt.getDate() + PORTAL_EXPIRY_GRACE_DAYS);
  if (new Date() > expiresAt) return "expired";

  return "ok";
}

export async function resolvePortalByToken(token: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { portalToken: token },
    include: { template: true, package: true },
  });
  const access = evaluatePortalAccess(invitation);
  return { invitation: access === "ok" ? invitation : null, access };
}
