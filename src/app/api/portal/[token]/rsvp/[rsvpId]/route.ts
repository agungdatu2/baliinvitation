import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePortal } from "@/lib/portal/require-portal";

export async function DELETE(_req: NextRequest, { params }: { params: { token: string; rsvpId: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;

  const rsvp = await prisma.rSVP.findUnique({ where: { id: params.rsvpId } });
  if (!rsvp || rsvp.invitationId !== invitation.id) {
    return NextResponse.json({ error: "RSVP tidak ditemukan" }, { status: 404 });
  }
  await prisma.rSVP.delete({ where: { id: params.rsvpId } });
  return NextResponse.json({ ok: true });
}
