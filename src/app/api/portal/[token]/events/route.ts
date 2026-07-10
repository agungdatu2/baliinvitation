import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePortal } from "@/lib/portal/require-portal";
import { createEventChangeRequest } from "@/lib/services/event-change-requests";
import { EventItem } from "@/types/invitation";

const eventEditSchema = z.object({
  eventIndex: z.number().int().min(0),
  values: z.object({
    date: z.string().min(1).optional(),
    timeStart: z.string().min(1).optional(),
    timeEnd: z.string().optional(),
    location: z.string().min(1).optional(),
    mapsUrl: z.string().url().optional().or(z.literal("")),
  }),
});

export async function PATCH(req: NextRequest, { params }: { params: { token: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;

  if (!invitation.clientCanEditEvents) {
    return NextResponse.json({ error: "Edit acara sedang tidak diizinkan admin" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = eventEditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { eventIndex, values } = parsed.data;

  const events = (invitation.events as unknown as EventItem[]) ?? [];
  const oldValues = events[eventIndex];
  if (!oldValues) {
    return NextResponse.json({ error: "Acara tidak ditemukan" }, { status: 404 });
  }

  const { request, applied } = await createEventChangeRequest(invitation.id, eventIndex, oldValues, values);
  return NextResponse.json({
    request,
    applied,
    message: applied ? "Perubahan tersimpan" : "Perubahan menunggu konfirmasi admin",
  });
}
