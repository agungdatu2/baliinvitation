import { NextRequest, NextResponse } from "next/server";
import { guestBulkSchema } from "@/lib/validations/guest.schema";
import { bulkCreateGuests } from "@/lib/services/guests";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = guestBulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const result = await bulkCreateGuests(params.id, parsed.data.text);
  return NextResponse.json(result, { status: 201 });
}
