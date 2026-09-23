import { Eye, Users, Send, MailOpen, CheckCircle2, LucideIcon } from "lucide-react";
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
        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-lume-ink text-white text-sm font-medium shadow-sm hover:opacity-90 transition"
      >
        <Eye size={16} strokeWidth={1.75} />
        Preview Undangan
      </a>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Tamu" value={total} icon={Users} accent="bg-slate-100 text-slate-600" />
        <StatCard label="Terkirim" value={terkirim} icon={Send} accent="bg-blue-100 text-blue-600" />
        <StatCard label="Dibuka" value={dibuka} icon={MailOpen} accent="bg-lume-gold/15 text-lume-gold" />
        <StatCard label="Sudah RSVP" value={sudahRsvp} icon={CheckCircle2} accent="bg-green-100 text-green-600" />
      </div>

      <div className="rounded-xl border border-lume-line bg-white p-5 shadow-sm">
        <h2 className="font-serif text-lg text-lume-ink mb-4">Ringkasan RSVP</h2>
        <div className="grid grid-cols-3 divide-x divide-lume-line text-center">
          <div>
            <p className="text-2xl font-serif text-green-700">{hadir.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Hadir</p>
          </div>
          <div>
            <p className="text-2xl font-serif text-red-600">{tidakHadir}</p>
            <p className="text-xs text-gray-500 mt-0.5">Tidak Hadir</p>
          </div>
          <div>
            <p className="text-2xl font-serif text-lume-gold">{estimasiOrang}</p>
            <p className="text-xs text-gray-500 mt-0.5">Estimasi Orang</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: LucideIcon; accent: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-lume-line bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${accent}`}>
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-serif text-lume-ink leading-tight">{value}</p>
      </div>
    </div>
  );
}
