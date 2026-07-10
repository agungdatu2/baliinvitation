import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { nextStatus } from "@/lib/utils/guest-status";

const rsvpSchema = z.object({
  invitationId: z.string().min(1),
  guestId: z.string().optional(),
  guestName: z.string().min(1, "Nama wajib diisi"),
  attendance: z.enum(["hadir", "tidak_hadir", "belum_tahu"]),
  guestCount: z.number().int().min(1).default(1),
  message: z.string().optional(),
});

// Dipanggil dari komponen RSVPForm di halaman publik undangan
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { guestId, ...rsvpData } = parsed.data;

  if (guestId) {
    const guest = await prisma.guest.findUnique({ where: { id: guestId } });
    if (!guest) {
      return NextResponse.json({ error: "Tamu tidak ditemukan" }, { status: 400 });
    }
    const existingRsvp = await prisma.rSVP.findUnique({ where: { guestId } });
    if (existingRsvp) {
      return NextResponse.json({ error: "Tamu ini sudah mengisi RSVP sebelumnya" }, { status: 409 });
    }
  }

  const rsvp = await prisma.rSVP.create({ data: { ...rsvpData, guestId } });

  if (guestId) {
    const guest = await prisma.guest.findUnique({ where: { id: guestId } });
    if (guest) {
      await prisma.guest.update({ where: { id: guestId }, data: { status: nextStatus(guest.status, "responded") } });
    }
  }

  return NextResponse.json(rsvp, { status: 201 });
}

// GET /api/rsvp?invitationId=xxx -> daftar ucapan & konfirmasi (ditampilkan di admin / wall of love)
export async function GET(req: NextRequest) {
  const invitationId = req.nextUrl.searchParams.get("invitationId");
  if (!invitationId) return NextResponse.json({ error: "invitationId wajib" }, { status: 400 });

  const rsvps = await prisma.rSVP.findMany({
    where: { invitationId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rsvps);
}
