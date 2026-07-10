import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePortal } from "@/lib/portal/require-portal";
import { guestSchema } from "@/lib/validations/guest.schema";
import { updateGuest, deleteGuest } from "@/lib/services/guests";

async function assertGuestBelongsToInvitation(guestId: string, invitationId: string) {
  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  return guest && guest.invitationId === invitationId;
}

export async function PATCH(req: NextRequest, { params }: { params: { token: string; guestId: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;
  if (!(await assertGuestBelongsToInvitation(params.guestId, invitation.id))) {
    return NextResponse.json({ error: "Tamu tidak ditemukan" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = guestSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await updateGuest(params.guestId, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { token: string; guestId: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;
  if (!(await assertGuestBelongsToInvitation(params.guestId, invitation.id))) {
    return NextResponse.json({ error: "Tamu tidak ditemukan" }, { status: 404 });
  }

  await deleteGuest(params.guestId);
  return NextResponse.json({ ok: true });
}
