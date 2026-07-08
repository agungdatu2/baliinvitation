import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invitationSchema } from "@/lib/validations/invitation.schema";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: params.id },
    include: { template: true },
  });
  if (!invitation) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json(invitation);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = invitationSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const updated = await prisma.invitation.update({
    where: { id: params.id },
    data: {
      ...d,
      eventDate: d.eventDate ? new Date(d.eventDate) : undefined,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.invitation.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
