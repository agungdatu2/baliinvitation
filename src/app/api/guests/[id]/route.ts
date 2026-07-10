import { NextRequest, NextResponse } from "next/server";
import { guestSchema } from "@/lib/validations/guest.schema";
import { updateGuest, deleteGuest } from "@/lib/services/guests";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = guestSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await updateGuest(params.id, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await deleteGuest(params.id);
  return NextResponse.json({ ok: true });
}
