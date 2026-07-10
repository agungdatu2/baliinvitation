import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePortalToken } from "@/lib/utils/tokens";

// POST /api/invitations/[id]/portal/reset-token -> "Reset link portal" (kalau link bocor)
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const updated = await prisma.invitation.update({
    where: { id: params.id },
    data: { portalToken: generatePortalToken() },
  });
  return NextResponse.json(updated);
}
