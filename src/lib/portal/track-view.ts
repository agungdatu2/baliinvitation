import { prisma } from "@/lib/prisma";
import { isBotUserAgent } from "@/lib/utils/bot-detect";
import { nextStatus } from "@/lib/utils/guest-status";

export type ViaParam = "guest" | "to" | "direct";

interface GuestForView {
  id: string;
  status: string;
  firstOpenedAt: Date | null;
}

// Link-preview crawlers (WhatsApp, dst.) fetch the page the instant a link is shared —
// skip recording those as a view / flipping guest status, or every guest would show
// "opened" before anyone actually looked at it.
export async function recordInvitationView(params: {
  invitationId: string;
  guest: GuestForView | null;
  viaParam: ViaParam;
  userAgent: string | null;
}) {
  if (isBotUserAgent(params.userAgent)) return;

  await prisma.invitationView.create({
    data: { invitationId: params.invitationId, guestId: params.guest?.id, viaParam: params.viaParam },
  });

  if (!params.guest) return;

  const target = nextStatus(params.guest.status, "opened");
  if (target !== params.guest.status || !params.guest.firstOpenedAt) {
    await prisma.guest.update({
      where: { id: params.guest.id },
      data: { status: target, firstOpenedAt: params.guest.firstOpenedAt ?? new Date() },
    });
  }
}
