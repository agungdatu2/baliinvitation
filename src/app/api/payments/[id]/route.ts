import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentSchema } from "@/lib/validations/payment.schema";
import { parseBaliDateTime } from "@/lib/utils/timezone";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = paymentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const existing = await prisma.payment.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Pembayaran tidak ditemukan" }, { status: 404 });

  const invitation = await prisma.invitation.findUnique({ where: { id: d.invitationId } });
  if (!invitation) return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 400 });

  const updated = await prisma.payment.update({
    where: { id: params.id },
    data: {
      invitationId: d.invitationId,
      amount: d.amount,
      // Tengah hari WITA supaya tanggalnya sama di zona waktu mana pun.
      paidAt: d.paidAt ? parseBaliDateTime(`${d.paidAt}T12:00`) : undefined,
      note: d.note?.trim() ? d.note.trim() : null,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.payment.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
