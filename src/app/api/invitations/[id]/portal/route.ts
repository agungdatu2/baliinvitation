import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const portalSettingsSchema = z.object({
  portalEnabled: z.boolean().optional(),
  clientCanEditEvents: z.boolean().optional(),
});

// PATCH /api/invitations/[id]/portal -> toggle portal on/off atau izin edit acara client
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = portalSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.invitation.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(updated);
}
