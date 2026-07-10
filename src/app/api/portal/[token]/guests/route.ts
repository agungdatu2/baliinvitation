import { NextRequest, NextResponse } from "next/server";
import { requirePortal } from "@/lib/portal/require-portal";
import { guestSchema } from "@/lib/validations/guest.schema";
import { listGuests, createGuest } from "@/lib/services/guests";

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;
  const guests = await listGuests(invitation.id);
  return NextResponse.json(guests);
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;

  const body = await req.json();
  const parsed = guestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const guest = await createGuest(invitation.id, parsed.data);
  return NextResponse.json(guest, { status: 201 });
}
