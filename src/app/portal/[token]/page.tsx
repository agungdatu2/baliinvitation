import { resolvePortalByToken } from "@/lib/portal/resolve-portal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PortalDashboard({ params }: { params: { token: string } }) {
  const { invitation } = await resolvePortalByToken(params.token);
  if (!invitation) return null; // layout already handles the invalid/disabled/expired states

  const [guests, rsvps] = await Promise.all([
    prisma.guest.findMany({ where: { invitationId: invitation.id } }),
    prisma.rSVP.findMany({ where: { invitationId: invitation.id } }),
  ]);

  const total = guests.length;
  const terkirim = guests.filter((g) => g.status !== "pending").length;
  const dibuka = guests.filter((g) => g.status === "opened" || g.status === "responded").length;
  const sudahRsvp = guests.filter((g) => g.status === "responded").length;

  const hadir = rsvps.filter((r) => r.attendance === "hadir");
  const tidakHadir = rsvps.filter((r) => r.attendance === "tidak_hadir").length;
  const estimasiOrang = hadir.reduce((sum, r) => sum + r.guestCount, 0);

  const previewUrl = `/${invitation.slug}?portal_preview=${params.token}`;

  return (
    <div className="space-y-6">
      <a
        href={previewUrl}
        target="_blank"
        rel="noreferrer"
        className="block text-center w-full py-3 rounded-lg bg-lume-ink text-white text-sm"
      >
        Preview Undangan
      </a>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Tamu" value={total} />
        <StatCard label="Terkirim" value={terkirim} />
        <StatCard label="Dibuka" value={dibuka} />
        <StatCard label="Sudah RSVP" value={sudahRsvp} />
      </div>

      <div className="border border-lume-line rounded-lg bg-white p-4">
        <h2 className="font-serif text-lg mb-3">Ringkasan RSVP</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-serif text-green-700">{hadir.length}</p>
            <p className="text-xs text-gray-500">Hadir</p>
          </div>
          <div>
            <p className="text-2xl font-serif text-red-600">{tidakHadir}</p>
            <p className="text-xs text-gray-500">Tidak Hadir</p>
          </div>
          <div>
            <p className="text-2xl font-serif text-lume-gold">{estimasiOrang}</p>
            <p className="text-xs text-gray-500">Estimasi Orang</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-lume-line rounded-lg bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-serif mt-1">{value}</p>
    </div>
  );
}
