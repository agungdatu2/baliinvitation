import { resolvePortalByToken } from "@/lib/portal/resolve-portal";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

const ATTENDANCE_LABEL: Record<string, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  belum_tahu: "Belum Tahu",
};

const ATTENDANCE_BAR_CLASS: Record<string, string> = {
  hadir: "bg-green-600",
  tidak_hadir: "bg-red-500",
  belum_tahu: "bg-amber-500",
};

export default async function PortalRsvpPage({ params }: { params: { token: string } }) {
  const { invitation } = await resolvePortalByToken(params.token);
  if (!invitation) return null;

  const rsvps = await prisma.rSVP.findMany({
    where: { invitationId: invitation.id },
    orderBy: { createdAt: "desc" },
  });

  const total = rsvps.length;
  const estimasiOrang = rsvps.filter((r) => r.attendance === "hadir").reduce((s, r) => s + r.guestCount, 0);
  const breakdown = ["hadir", "tidak_hadir", "belum_tahu"].map((key) => ({
    key,
    count: rsvps.filter((r) => r.attendance === key).length,
  }));

  return (
    <div className="space-y-6">
      <div className="border border-lume-line rounded-lg bg-white p-4 text-center">
        <p className="text-xs text-gray-500">Estimasi Tamu Hadir</p>
        <p className="text-3xl font-serif text-lume-gold mt-1">{estimasiOrang} orang</p>
      </div>

      <div className="border border-lume-line rounded-lg bg-white p-4 space-y-3" role="img" aria-label="Breakdown RSVP berdasarkan kehadiran">
        {breakdown.map((b) => (
          <div key={b.key}>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{ATTENDANCE_LABEL[b.key]}</span>
              <span className="tabular-nums">{b.count}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${ATTENDANCE_BAR_CLASS[b.key]}`}
                style={{ width: total > 0 ? `${Math.max((b.count / total) * 100, b.count > 0 ? 4 : 0)}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {rsvps.map((r) => (
          <div key={r.id} className="border border-lume-line rounded-lg bg-white p-3">
            <div className="flex justify-between items-start">
              <p className="font-medium">{r.guestName}</p>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  r.attendance === "hadir"
                    ? "bg-green-100 text-green-700"
                    : r.attendance === "tidak_hadir"
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-700"
                }`}
              >
                {ATTENDANCE_LABEL[r.attendance] ?? r.attendance}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {r.guestCount} orang · {formatDate(r.createdAt)}
            </p>
            {r.message && <p className="text-sm text-gray-700 mt-2 italic">&ldquo;{r.message}&rdquo;</p>}
          </div>
        ))}
        {rsvps.length === 0 && <p className="text-center text-gray-400 text-sm py-6">Belum ada RSVP masuk.</p>}
      </div>
    </div>
  );
}
