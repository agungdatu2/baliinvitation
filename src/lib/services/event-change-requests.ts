import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EventItem } from "@/types/invitation";
import { isAutoApproveEnabled, decideChangeRequestStatus, shouldApplyImmediately } from "@/lib/portal/event-change";

// events tersimpan sebagai Json[] langsung di Invitation (bukan tabel Event terpisah),
// jadi "menerapkan" perubahan berarti menimpa satu elemen array itu di posisi eventIndex.
async function applyEventValues(invitationId: string, eventIndex: number, newValues: Partial<EventItem>) {
  const inv = await prisma.invitation.findUnique({ where: { id: invitationId } });
  if (!inv) throw new Error("Invitation tidak ditemukan");
  const events = ((inv.events as unknown as EventItem[]) ?? []).slice();
  if (!events[eventIndex]) throw new Error("Event tidak ditemukan di index tersebut");
  events[eventIndex] = { ...events[eventIndex], ...newValues };
  await prisma.invitation.update({
    where: { id: invitationId },
    data: { events: events as unknown as Prisma.InputJsonValue },
  });
}

export async function createEventChangeRequest(
  invitationId: string,
  eventIndex: number,
  oldValues: EventItem,
  newValues: Partial<EventItem>
) {
  const autoApprove = isAutoApproveEnabled();
  const status = decideChangeRequestStatus(autoApprove);

  const request = await prisma.eventChangeRequest.create({
    data: {
      invitationId,
      eventIndex,
      oldValues: oldValues as unknown as Prisma.InputJsonValue,
      newValues: newValues as unknown as Prisma.InputJsonValue,
      status,
    },
  });

  if (shouldApplyImmediately(autoApprove)) {
    await applyEventValues(invitationId, eventIndex, newValues);
  }

  return { request, applied: shouldApplyImmediately(autoApprove) };
}

export function listChangeRequests(invitationId: string) {
  return prisma.eventChangeRequest.findMany({ where: { invitationId }, orderBy: { createdAt: "desc" } });
}

export async function approveChangeRequest(id: string) {
  const cr = await prisma.eventChangeRequest.findUnique({ where: { id } });
  if (!cr) throw new Error("Change request tidak ditemukan");
  if (cr.status === "pending") {
    await applyEventValues(cr.invitationId, cr.eventIndex, cr.newValues as unknown as Partial<EventItem>);
  }
  return prisma.eventChangeRequest.update({ where: { id }, data: { status: "approved" } });
}

export function rejectChangeRequest(id: string) {
  return prisma.eventChangeRequest.update({ where: { id }, data: { status: "rejected" } });
}
