import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah, daysUntil } from "@/lib/utils/format";
import { getPaymentStatus, PAYMENT_STATUS_LABEL, PAYMENT_STATUS_CLASS } from "@/lib/utils/payment-status";

export const dynamic = "force-dynamic";

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
      createdAt: v.createdAt,
      text: `${v.guest?.name ?? "Tamu"} membuka undangan ${v.invitation.clientName}`,
      invitationId: v.invitation.id,
    })),
    ...recentRsvps.map((r) => ({
      key: `rsvp-${r.id}`,
      createdAt: r.createdAt,
      text: `${r.guestName} mengisi RSVP untuk ${r.invitation.clientName}`,
      invitationId: r.invitation.id,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pt-6">
        <h1 className="text-2xl font-semibold">Undangan Berjalan</h1>
        <Link href="/admin/invitations/new" className="px-4 py-2 rounded-lg bg-lume-ink text-white text-sm">
          + Buat Undangan
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Total Client" value={invitations.length} />
        <SummaryCard label="Draft" value={draftCount} />
        <SummaryCard label="Published" value={publishedCount} />
        <SummaryCard label="Acara < 30 Hari" value={upcomingCount} />
      </div>

      {outstandingCount > 0 && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-6">
          {outstandingCount} client masih ada tagihan belum lunas.{" "}
          <Link href="/admin/income" className="underline">
            Lihat di tab Income
          </Link>
        </p>
      )}

      {activityFeed.length > 0 && (
        <div className="border rounded-lg bg-white p-4 mb-6">
          <h2 className="font-medium mb-3">Aktivitas Portal Terbaru</h2>
          <ul className="space-y-2 text-sm">
            {activityFeed.map((a) => (
              <li key={a.key} className="flex justify-between gap-4">
                <Link href={`/admin/invitations/${a.invitationId}`} className="text-gray-700 hover:underline">
                  {a.text}
                </Link>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {a.createdAt.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2 mb-4 text-sm">
        <FilterLink label="Semua" status={undefined} active={!statusFilter} />
        <FilterLink label="Draft" status="draft" active={statusFilter === "draft"} />
        <FilterLink label="Published" status="published" active={statusFilter === "published"} />
      </div>

      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Client</th>
              <th className="p-3">Mempelai</th>
              <th className="p-3">Tema</th>
              <th className="p-3">Paket</th>
              <th className="p-3">Acara</th>
              <th className="p-3">Status</th>
              <th className="p-3">Pembayaran</th>
              <th className="p-3">RSVP</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => {
              const paid = inv.payments.reduce((sum, p) => sum + p.amount, 0);
              const payStatus = getPaymentStatus(inv.totalPrice, paid);
              const { label: dayLabel } = daysUntil(inv.eventDate);
              return (
                <tr key={inv.id} className="border-t">
                  <td className="p-3">{inv.clientName}</td>
                  <td className="p-3">
                    {inv.groomNickname} & {inv.brideNickname}
                  </td>
                  <td className="p-3">{inv.template.name}</td>
                  <td className="p-3">{inv.package ? inv.package.name : <span className="text-gray-400">-</span>}</td>
                  <td className="p-3">
                    <div>{new Date(inv.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div className="text-xs text-gray-500">{dayLabel}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        inv.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${PAYMENT_STATUS_CLASS[payStatus]}`}>
                      {PAYMENT_STATUS_LABEL[payStatus]}
                    </span>
                    {inv.totalPrice != null && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {formatRupiah(paid)} / {formatRupiah(inv.totalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="p-3">{inv._count.rsvps}</td>
                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                    <a href={`/${inv.slug}`} target="_blank" className="text-blue-600">
                      Lihat
                    </a>
                    <Link href={`/admin/invitations/${inv.id}`} className="text-gray-600">
                      Kelola
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-400">
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

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-serif mt-1">{value}</p>
    </div>
  );
}

function FilterLink({ label, status, active }: { label: string; status?: string; active: boolean }) {
  return (
    <Link
      href={status ? `/admin?status=${status}` : "/admin"}
      className={`px-3 py-1.5 rounded-md ${active ? "bg-lume-ink text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
    >
      {label}
    </Link>
  );
}
