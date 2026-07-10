import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { approveChangeRequest, rejectChangeRequest } from "@/lib/services/event-change-requests";

const actionSchema = z.object({ action: z.enum(["approve", "reject"]) });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated =
    parsed.data.action === "approve" ? await approveChangeRequest(params.id) : await rejectChangeRequest(params.id);
  return NextResponse.json(updated);
}
