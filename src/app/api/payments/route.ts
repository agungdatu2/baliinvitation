import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentSchema } from "@/lib/validations/payment.schema";

// GET /api/payments -> list semua pembayaran (untuk tab Income)
export async function GET() {
  const payments = await prisma.payment.findMany({
    orderBy: { paidAt: "desc" },
    include: { invitation: { select: { clientName: true, groomNickname: true, brideNickname: true, slug: true } } },
  });
  return NextResponse.json(payments);
}

// POST /api/payments -> catat pembayaran baru dari client
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = paymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const invitation = await prisma.invitation.findUnique({ where: { id: d.invitationId } });
  if (!invitation) {
    return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 400 });
  }

  const created = await prisma.payment.create({
    data: {
      invitationId: d.invitationId,
      amount: d.amount,
      paidAt: d.paidAt ? new Date(d.paidAt) : undefined,
      note: d.note,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
