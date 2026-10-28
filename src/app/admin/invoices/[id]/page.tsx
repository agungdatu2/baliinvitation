import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InvoiceView from "@/components/admin/InvoiceView";
import { buildInvoice } from "@/lib/invoice";
import { BALI_TZ } from "@/lib/utils/timezone";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const inv = await prisma.invitation.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      createdAt: true,
      clientName: true,
      clientPhone: true,
      groomNickname: true,
      brideNickname: true,
      hostName: true,
      eventDate: true,
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
  if (!inv) return notFound();

  const invoice = buildInvoice({ ...inv, templateName: inv.template.name.split(" - ")[0].trim() });
  const eventLabel = inv.eventDate.toLocaleDateString("id-ID", {
    timeZone: BALI_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <Link href="/admin/invoices" className="mb-3 inline-block text-sm text-gray-500 print:hidden">
        &larr; Invoice
      </Link>
      <InvoiceView
        invoice={invoice}
        client={{ name: inv.clientName, phone: inv.clientPhone ?? "" }}
        event={{ title: inv.hostName || `${inv.groomNickname} & ${inv.brideNickname}`, dateLabel: eventLabel }}
      />
    </div>
  );
}
