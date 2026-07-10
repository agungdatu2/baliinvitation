import { NextRequest, NextResponse } from "next/server";
import { guestSchema } from "@/lib/validations/guest.schema";
import { listGuests, createGuest } from "@/lib/services/guests";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const guests = await listGuests(params.id);
  return NextResponse.json(guests);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = guestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const guest = await createGuest(params.id, parsed.data);
  return NextResponse.json(guest, { status: 201 });
}
