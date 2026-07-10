import { prisma } from "@/lib/prisma";
import PortalSettingsPanel from "@/components/admin/PortalSettingsPanel";

export const dynamic = "force-dynamic";

export default async function InvitationRingkasanPage({ params }: { params: { id: string } }) {
  const [invitation, guests, views] = await Promise.all([
    prisma.invitation.findUnique({ where: { id: params.id } }),
    prisma.guest.findMany({ where: { invitationId: params.id } }),
    prisma.invitationView.findMany({ where: { invitationId: params.id } }),
  ]);
  if (!invitation) return null;

  const totalGuests = guests.length;
  const sentCount = guests.filter((g) => g.status !== "pending").length;
  const openedCount = guests.filter((g) => g.status === "opened" || g.status === "responded").length;
  const respondedCount = guests.filter((g) => g.status === "responded").length;
  const pct = (n: number) => (totalGuests > 0 ? Math.round((n / totalGuests) * 100) : 0);

  const trackedViews = views.filter((v) => v.viaParam === "guest").length;
  const untrackedViews = views.filter((v) => v.viaParam !== "guest").length;

  return (
    <div className="space-y-8">
      <PortalSettingsPanel
        invitationId={invitation.id}
        slug={invitation.slug}
        clientName={invitation.clientName}
        clientPhone={invitation.clientPhone}
        portalToken={invitation.portalToken}
        portalEnabled={invitation.portalEnabled}
        clientCanEditEvents={invitation.clientCanEditEvents}
      />

      <div>
        <h2 className="font-medium mb-3">Funnel Tamu</h2>
        <div className="border rounded-lg bg-white p-4 space-y-3">
          <FunnelRow label="Total Tamu" count={totalGuests} percent={100} />
          <FunnelRow label="Terkirim" count={sentCount} percent={pct(sentCount)} />
          <FunnelRow label="Dibuka" count={openedCount} percent={pct(openedCount)} />
          <FunnelRow label="Sudah RSVP" count={respondedCount} percent={pct(respondedCount)} />
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-3">Kunjungan Halaman Undangan</h2>
        <div className="border rounded-lg bg-white p-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-serif">{trackedViews}</p>
            <p className="text-xs text-gray-500">Tracked (via link tamu)</p>
          </div>
          <div>
            <p className="text-2xl font-serif">{untrackedViews}</p>
            <p className="text-xs text-gray-500">Untracked (?to= / direct)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FunnelRow({ label, count, percent }: { label: string; count: number; percent: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="tabular-nums text-gray-500">
          {count} ({percent}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full bg-lume-gold" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
