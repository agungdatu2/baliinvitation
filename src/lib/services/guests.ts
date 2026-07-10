import { prisma } from "@/lib/prisma";
import { generateGuestCode } from "@/lib/utils/tokens";
import { nextStatus } from "@/lib/utils/guest-status";
import { parseGuestBulkImport } from "@/lib/utils/bulk-import";

export function listGuests(invitationId: string) {
  return prisma.guest.findMany({ where: { invitationId }, orderBy: { createdAt: "asc" } });
}

// guestCode uniqueness collisions are astronomically unlikely (31^8 combinations)
// but retrying a couple of times costs nothing and makes the guarantee real.
export async function createGuest(
  invitationId: string,
  data: { name: string; waNumber?: string; category?: string }
) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.guest.create({
        data: {
          invitationId,
          name: data.name,
          waNumber: data.waNumber || undefined,
          category: data.category || "lainnya",
          guestCode: generateGuestCode(),
        },
      });
    } catch (err: any) {
      if (err?.code !== "P2002" || attempt === 2) throw err;
    }
  }
  throw new Error("Gagal membuat kode tamu unik");
}

export async function bulkCreateGuests(invitationId: string, text: string) {
  const { guests, errors } = parseGuestBulkImport(text);
  const created = [];
  for (const g of guests) {
    created.push(await createGuest(invitationId, g));
  }
  return { created, errors };
}

export function updateGuest(
  guestId: string,
  data: Partial<{ name: string; waNumber: string | null; category: string }>
) {
  return prisma.guest.update({ where: { id: guestId }, data });
}

export function deleteGuest(guestId: string) {
  return prisma.guest.delete({ where: { id: guestId } });
}

export async function markGuestSent(guestId: string) {
  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest) return null;
  return prisma.guest.update({
    where: { id: guestId },
    data: { status: nextStatus(guest.status, "sent"), sentAt: guest.sentAt ?? new Date() },
  });
}
