import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

const ATTENDANCE_LABEL: Record<string, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  belum_tahu: "Belum Tahu",
};

const ATTENDANCE_CLASS: Record<string, string> = {
  hadir: "bg-green-100 text-green-700",
  tidak_hadir: "bg-red-50 text-red-600",
  belum_tahu: "bg-amber-50 text-amber-700",
};

export default async function AdminInvitationRsvpPage({ params }: { params: { id: string } }) {
  const rsvps = await prisma.rSVP.findMany({ where: { invitationId: params.id }, orderBy: { createdAt: "desc" } });
  const estimasiOrang = rsvps.filter((r) => r.attendance === "hadir").reduce((s, r) => s + r.guestCount, 0);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg bg-white p-4 inline-block">
        <p className="text-xs text-gray-500">Estimasi Tamu Hadir</p>
        <p className="text-2xl font-serif mt-1">{estimasiOrang} orang</p>
      </div>

      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Kehadiran</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Ucapan</th>
              <th className="p-3">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((r) => (
              <tr key={r.id} className="border-t align-top">
                <td className="p-3">{r.guestName}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${ATTENDANCE_CLASS[r.attendance] ?? ""}`}>
                    {ATTENDANCE_LABEL[r.attendance] ?? r.attendance}
                  </span>
                </td>
                <td className="p-3">{r.guestCount}</td>
                <td className="p-3 text-gray-600 max-w-xs">{r.message || "-"}</td>
                <td className="p-3 text-gray-500 whitespace-nowrap">{formatDate(r.createdAt)}</td>
              </tr>
            ))}
            {rsvps.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Belum ada RSVP masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
