import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePortal } from "@/lib/portal/require-portal";
import { markGuestSent } from "@/lib/services/guests";
import { checkRateLimit } from "@/lib/utils/rate-limit";

// Dipanggil dari tombol "Kirim via WA" tepat sebelum window.open(wa.me/...) —
// throttled supaya tidak bisa dipakai spam-refresh status.
export async function POST(_req: NextRequest, { params }: { params: { token: string; guestId: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;

  const guest = await prisma.guest.findUnique({ where: { id: params.guestId } });
  if (!guest || guest.invitationId !== invitation.id) {
    return NextResponse.json({ error: "Tamu tidak ditemukan" }, { status: 404 });
  }

  const allowed = await checkRateLimit(`mark-sent:${params.guestId}`, { windowMs: 10_000, max: 3 });
  if (!allowed) {
    return NextResponse.json({ error: "Terlalu banyak percobaan, coba lagi sebentar" }, { status: 429 });
  }

  const updated = await markGuestSent(params.guestId);
  return NextResponse.json(updated);
}
