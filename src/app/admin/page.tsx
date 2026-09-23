import Link from "next/link";
import { Plus, Users, FilePenLine, BadgeCheck, CalendarClock, AlertTriangle, Eye, MessageSquareText, Settings2, LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatRupiah, daysUntil } from "@/lib/utils/format";
import { getPaymentStatus, PAYMENT_STATUS_LABEL, PAYMENT_STATUS_CLASS, PaymentStatus } from "@/lib/utils/payment-status";
import InvitationRowActions from "@/components/admin/InvitationRowActions";

export const dynamic = "force-dynamic";

const STATUS_DOT: Record<string, string> = {
  published: "bg-green-500",
  draft: "bg-gray-400",
};

const PAYMENT_DOT: Record<PaymentStatus, string> = {
  no_package: "bg-gray-400",
  unpaid: "bg-red-500",
  partial: "bg-amber-500",
  paid: "bg-green-500",
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const invitations = await prisma.invitation.findMany({
    orderBy: { eventDate: "asc" },
    include: { template: true, package: true, payments: true, _count: { select: { rsvps: true } } },
  });

  const statusFilter = searchParams.status;
  const filtered = statusFilter ? invitations.filter((inv) => inv.status === statusFilter) : invitations;

  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 86_400_000);
  const upcomingCount = invitations.filter((inv) => inv.eventDate >= now && inv.eventDate <= in30Days).length;
  const draftCount = invitations.filter((inv) => inv.status === "draft").length;
  const publishedCount = invitations.filter((inv) => inv.status === "published").length;
  const outstandingCount = invitations.filter((inv) => {
    const paid = inv.payments.reduce((sum, p) => sum + p.amount, 0);
    return getPaymentStatus(inv.totalPrice, paid) === "unpaid" || getPaymentStatus(inv.totalPrice, paid) === "partial";
  }).length;

  const [recentOpens, recentRsvps] = await Promise.all([
    prisma.invitationView.findMany({
      where: { guestId: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { guest: { select: { name: true } }, invitation: { select: { clientName: true, id: true } } },
    }),
    prisma.rSVP.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { invitation: { select: { clientName: true, id: true } } },
    }),
  ]);

  const activityFeed = [
    ...recentOpens.map((v) => ({
      key: `view-${v.id}`,
      type: "view" as const,
      createdAt: v.createdAt,
      text: `${v.guest?.name ?? "Tamu"} membuka undangan ${v.invitation.clientName}`,
      invitationId: v.invitation.id,
    })),
    ...recentRsvps.map((r) => ({
      key: `rsvp-${r.id}`,
      type: "rsvp" as const,
      createdAt: r.createdAt,
      text: `${r.guestName} mengisi RSVP untuk ${r.invitation.clientName}`,
      invitationId: r.invitation.id,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-lume-gold">Dashboard</p>
          <h1 className="font-serif text-2xl md:text-3xl text-lume-ink mt-1">Undangan Berjalan</h1>
          <p className="text-sm text-gray-500 mt-1">Ringkasan semua undangan client yang sedang berjalan.</p>
        </div>
        <Link
          href="/admin/invitations/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-lume-ink text-white text-sm font-medium shadow-sm hover:opacity-90 transition"
        >
          <Plus size={16} strokeWidth={2} />
          Buat Undangan
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Total Client" value={invitations.length} icon={Users} accent="bg-slate-100 text-slate-600" />
        <SummaryCard label="Draft" value={draftCount} icon={FilePenLine} accent="bg-gray-100 text-gray-600" />
        <SummaryCard label="Published" value={publishedCount} icon={BadgeCheck} accent="bg-green-100 text-green-600" />
        <SummaryCard label="Acara < 30 Hari" value={upcomingCount} icon={CalendarClock} accent="bg-lume-gold/15 text-lume-gold" />
      </div>

      {outstandingCount > 0 && (
        <div className="flex items-center gap-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <AlertTriangle size={18} className="shrink-0 text-amber-500" />
          <p>
            {outstandingCount} client masih ada tagihan belum lunas.{" "}
            <Link href="/admin/income" className="underline font-medium">
              Lihat di tab Income
            </Link>
          </p>
        </div>
      )}

      {activityFeed.length > 0 && (
        <div className="rounded-xl border border-lume-line bg-white p-4 mb-6 shadow-sm">
          <h2 className="font-medium text-lume-ink mb-2">Aktivitas Portal Terbaru</h2>
          <ul className="divide-y divide-lume-line/70">
            {activityFeed.map((a) => {
              const Icon = a.type === "rsvp" ? MessageSquareText : Eye;
              return (
                <li key={a.key}>
                  <Link
                    href={`/admin/invitations/${a.invitationId}`}
                    className="flex items-center gap-3 py-2.5 group -mx-2 px-2 rounded-lg hover:bg-lume-bg/50 transition-colors"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lume-bg text-lume-gold">
                      <Icon size={15} strokeWidth={1.75} />
                    </span>
                    <span className="text-sm text-gray-700 group-hover:text-lume-ink flex-1 min-w-0 truncate">{a.text}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {a.createdAt.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex gap-2 mb-4 text-sm">
        <FilterLink label="Semua" count={invitations.length} status={undefined} active={!statusFilter} />
        <FilterLink label="Draft" count={draftCount} status="draft" active={statusFilter === "draft"} />
        <FilterLink label="Published" count={publishedCount} status="published" active={statusFilter === "published"} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-lume-line bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-lume-bg/60 text-left text-[11px] uppercase tracking-wider text-gray-500">
              <th className="p-3 font-medium">Client</th>
              <th className="p-3 font-medium">Mempelai</th>
              <th className="p-3 font-medium">Tema</th>
              <th className="p-3 font-medium">Paket</th>
              <th className="p-3 font-medium">Acara</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Pembayaran</th>
              <th className="p-3 font-medium">RSVP</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lume-line">
            {filtered.map((inv) => {
              const paid = inv.payments.reduce((sum, p) => sum + p.amount, 0);
              const payStatus = getPaymentStatus(inv.totalPrice, paid);
              const { label: dayLabel } = daysUntil(inv.eventDate);
              return (
                <tr key={inv.id} className="hover:bg-lume-bg/40 transition-colors">
                  <td className="p-3">
                    <div className="font-medium text-lume-ink">{inv.clientName}</div>
                    {inv.clientPhone && <div className="text-xs text-gray-400 mt-0.5">{inv.clientPhone}</div>}
                  </td>
                  <td className="p-3 text-gray-700">
                    {inv.hostName || `${inv.groomNickname} & ${inv.brideNickname}`}
                  </td>
                  <td className="p-3 text-gray-700">{inv.template.name}</td>
                  <td className="p-3 text-gray-700">{inv.package ? inv.package.name : <span className="text-gray-400">-</span>}</td>
                  <td className="p-3">
                    <div className="text-gray-700">{new Date(inv.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div className="text-xs text-gray-400">{dayLabel}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        inv.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[inv.status] ?? "bg-gray-400"}`} />
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${PAYMENT_STATUS_CLASS[payStatus]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${PAYMENT_DOT[payStatus]}`} />
                      {PAYMENT_STATUS_LABEL[payStatus]}
                    </span>
                    {inv.totalPrice != null && (
                      <div className="text-xs text-gray-400 mt-1">
                        {formatRupiah(paid)} / {formatRupiah(inv.totalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-gray-700">{inv._count.rsvps}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/${inv.slug}`}
                        target="_blank"
                        title="Lihat undangan"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-lume-bg hover:text-lume-ink transition"
                      >
                        <Eye size={16} strokeWidth={1.75} />
                      </a>
                      <Link
                        href={`/admin/invitations/${inv.id}`}
                        title="Kelola undangan"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-lume-bg hover:text-lume-ink transition"
                      >
                        <Settings2 size={16} strokeWidth={1.75} />
                      </Link>
                      <InvitationRowActions id={inv.id} status={inv.status} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-10 text-center text-gray-400">
                  Belum ada undangan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-lume-line bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
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

function FilterLink({ label, count, status, active }: { label: string; count: number; status?: string; active: boolean }) {
  return (
    <Link
      href={status ? `/admin?status=${status}` : "/admin"}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
        active ? "bg-lume-ink text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
      <span className={`text-xs ${active ? "text-white/70" : "text-gray-400"}`}>{count}</span>
    </Link>
  );
}
