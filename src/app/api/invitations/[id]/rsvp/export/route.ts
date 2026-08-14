import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/utils/csv";
import { formatDate } from "@/lib/utils/format";

const ATTENDANCE_LABEL: Record<string, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  belum_tahu: "Belum Tahu",
};

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const [invitation, rsvps] = await Promise.all([
    prisma.invitation.findUnique({ where: { id: params.id }, select: { slug: true } }),
    prisma.rSVP.findMany({ where: { invitationId: params.id }, orderBy: { createdAt: "desc" } }),
  ]);
  if (!invitation) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  const csv = toCsv(
    ["Nama", "Kehadiran", "Jumlah Tamu", "Kirim Gift", "Ucapan", "Waktu Submit"],
    rsvps.map((r) => [
      r.guestName,
      ATTENDANCE_LABEL[r.attendance] ?? r.attendance,
      r.guestCount,
      r.sendingGift ? "Ya" : "Tidak",
      r.message ?? "",
      formatDate(r.createdAt),
    ])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvp-${invitation.slug}.csv"`,
    },
  });
}
