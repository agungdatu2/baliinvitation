import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePortal } from "@/lib/portal/require-portal";
import { toCsv } from "@/lib/utils/csv";
import { formatDate } from "@/lib/utils/format";

const ATTENDANCE_LABEL: Record<string, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  belum_tahu: "Belum Tahu",
};

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const { invitation, error } = await requirePortal(params.token);
  if (error) return error;

  const rsvps = await prisma.rSVP.findMany({ where: { invitationId: invitation.id }, orderBy: { createdAt: "desc" } });

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
