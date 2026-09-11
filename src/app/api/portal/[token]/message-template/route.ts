import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePortal } from "@/lib/portal/require-portal";
import { prisma } from "@/lib/prisma";

const messageTemplateSchema = z.object({
  // "" (dikosongkan client) berarti "pakai template default lagi" — disimpan sebagai
  // null, bukan string kosong, supaya konsisten dengan getInvitation() ?? checks lain.
  messageTemplate: z.string().max(2000, "Maksimal 2000 karakter").optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { token: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;

  const body = await req.json();
  const parsed = messageTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const trimmed = parsed.data.messageTemplate?.trim();
  const updated = await prisma.invitation.update({
    where: { id: invitation.id },
    data: { messageTemplate: trimmed || null },
  });
  return NextResponse.json({ messageTemplate: updated.messageTemplate });
}
