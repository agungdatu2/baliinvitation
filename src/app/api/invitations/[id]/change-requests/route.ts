import { NextRequest, NextResponse } from "next/server";
import { listChangeRequests } from "@/lib/services/event-change-requests";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const requests = await listChangeRequests(params.id);
  return NextResponse.json(requests);
}
