import Link from "next/link";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils/format";
import { buildInvoice, InvoiceStatus } from "@/lib/invoice";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "Lunas",
  partial: "Sebagian",
  unpaid: "Belum bayar",
  none: "Tanpa tagihan",
};
const STATUS_CLASS: Record<InvoiceStatus, string> = {
  paid: "bg-green-100 text-green-700",
  partial: "bg-amber-100 text-amber-700",
  unpaid: "bg-red-100 text-red-700",
  none: "bg-gray-100 text-gray-500",
};

export default async function InvoicesPage() {
  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      clientName: true,
      groomNickname: true,
      brideNickname: true,
      hostName: true,
      isAddon: true,
      coverVideoAddon: true,
      extraGalleryAddon: true,
      bilingualEnabled: true,
      neverExpires: true,
      totalPrice: true,
      package: { select: { name: true, price: true } },
      template: { select: { name: true } },
      payments: { select: { id: true, amount: true, paidAt: true, note: true } },
    },
  });

  const rows = invitations.map((inv) => ({
    inv,
    invoice: buildInvoice({ ...inv, templateName: inv.template.name.split(" - ")[0].trim() }),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-lume-ink">Invoice</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pilih undangan untuk membuat invoice yang siap dicetak atau disimpan sebagai PDF. Rinciannya otomatis dari paket, add-on, dan
          pembayaran yang sudah tercatat.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-lume-line bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3 font-medium">Client</th>
              <th className="p-3 font-medium">No. Invoice</th>
              <th className="p-3 text-right font-medium">Total</th>
              <th className="p-3 text-right font-medium">Dibayar</th>
              <th className="p-3 text-right font-medium">Sisa</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-lume-line/70">
            {rows.map(({ inv, invoice }) => (
              <tr key={inv.id} className="hover:bg-lume-bg/40">
                <td className="p-3">
                  <div className="font-medium text-lume-ink">{inv.clientName}</div>
                  <div className="text-xs text-gray-400">{inv.hostName || `${inv.groomNickname} & ${inv.brideNickname}`}</div>
                </td>
                <td className="p-3 tabular-nums text-gray-600">{invoice.number}</td>
                <td className="p-3 text-right tabular-nums">{invoice.status === "none" ? "-" : formatRupiah(invoice.total)}</td>
                <td className="p-3 text-right tabular-nums">{formatRupiah(invoice.paid)}</td>
                <td className="p-3 text-right tabular-nums">{invoice.status === "none" ? "-" : formatRupiah(invoice.balance)}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[invoice.status]}`}>
                    {STATUS_LABEL[invoice.status]}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/invoices/${inv.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-lume-line px-3 py-1.5 text-xs hover:bg-lume-bg/60"
                  >
                    <FileText size={14} /> Buka Invoice
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
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
