import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string; rsvpId: string } }) {
  const rsvp = await prisma.rSVP.findUnique({ where: { id: params.rsvpId } });
  if (!rsvp || rsvp.invitationId !== params.id) {
    return NextResponse.json({ error: "RSVP tidak ditemukan" }, { status: 404 });
  }
  await prisma.rSVP.delete({ where: { id: params.rsvpId } });
  return NextResponse.json({ ok: true });
}
