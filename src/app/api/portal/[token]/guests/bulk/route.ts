import { NextRequest, NextResponse } from "next/server";
import { requirePortal } from "@/lib/portal/require-portal";
import { guestBulkSchema } from "@/lib/validations/guest.schema";
import { bulkCreateGuests } from "@/lib/services/guests";

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;

  const body = await req.json();
  const parsed = guestBulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const result = await bulkCreateGuests(invitation.id, parsed.data.text);
  return NextResponse.json(result, { status: 201 });
}
