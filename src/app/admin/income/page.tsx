import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils/format";
import IncomeChart from "@/components/admin/IncomeChart";
import PaymentsManager from "@/components/admin/PaymentsManager";

export const dynamic = "force-dynamic";

const MONTH_LABEL = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default async function IncomePage() {
  const [payments, invitations] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { paidAt: "desc" },
      include: { invitation: { select: { clientName: true, groomNickname: true, brideNickname: true } } },
    }),
    prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, clientName: true, groomNickname: true, brideNickname: true, totalPrice: true, payments: { select: { amount: true } } },
    }),
  ]);

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);

  const now = new Date();
  const thisMonthIncome = payments
    .filter((p) => p.paidAt.getMonth() === now.getMonth() && p.paidAt.getFullYear() === now.getFullYear())
    .reduce((sum, p) => sum + p.amount, 0);

  const outstanding = invitations.reduce((sum, inv) => {
    if (inv.totalPrice == null) return sum;
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    return sum + Math.max(0, inv.totalPrice - paid);
  }, 0);

  // 6 bulan terakhir termasuk bulan berjalan
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const chartData = months.map(({ year, month }) => ({
    label: MONTH_LABEL[month],
    value: payments
      .filter((p) => p.paidAt.getFullYear() === year && p.paidAt.getMonth() === month)
      .reduce((sum, p) => sum + p.amount, 0),
  }));

  return (
    <div className="pt-6 space-y-8">
      <h1 className="text-2xl font-semibold">Income</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="border rounded-lg bg-white p-4">
          <p className="text-xs text-gray-500">Total Income</p>
          <p className="text-2xl font-serif mt-1">{formatRupiah(totalIncome)}</p>
        </div>
        <div className="border rounded-lg bg-white p-4">
          <p className="text-xs text-gray-500">Bulan Ini</p>
          <p className="text-2xl font-serif mt-1">{formatRupiah(thisMonthIncome)}</p>
        </div>
        <div className="border rounded-lg bg-white p-4">
          <p className="text-xs text-gray-500">Outstanding</p>
          <p className="text-2xl font-serif mt-1 text-amber-700">{formatRupiah(outstanding)}</p>
        </div>
      </div>

      <div className="border rounded-lg bg-white p-4">
        <h2 className="font-medium mb-4">Income 6 Bulan Terakhir</h2>
        <IncomeChart data={chartData} />
      </div>

      <div>
        <h2 className="font-medium mb-3">Riwayat & Catat Pembayaran</h2>
        <PaymentsManager
          initialPayments={payments.map((p) => ({
            id: p.id,
            amount: p.amount,
            paidAt: p.paidAt.toISOString(),
            note: p.note,
            invitation: p.invitation,
          }))}
          invitationOptions={invitations.map((inv) => ({
            id: inv.id,
            label: `${inv.clientName} (${inv.groomNickname} & ${inv.brideNickname})`,
          }))}
        />
      </div>
    </div>
  );
}
