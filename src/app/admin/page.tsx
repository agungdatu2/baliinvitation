import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: { template: true, _count: { select: { rsvps: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard Undangan</h1>
        <Link href="/admin/invitations/new" className="px-4 py-2 rounded-lg bg-lume-ink text-white text-sm">
          + Buat Undangan
        </Link>
      </div>

      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Client</th>
            <th className="p-3">Mempelai</th>
            <th className="p-3">Template</th>
            <th className="p-3">Slug</th>
            <th className="p-3">Status</th>
            <th className="p-3">RSVP</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv) => (
            <tr key={inv.id} className="border-t">
              <td className="p-3">{inv.clientName}</td>
              <td className="p-3">{inv.groomNickname} & {inv.brideNickname}</td>
              <td className="p-3">{inv.template.name}</td>
              <td className="p-3 font-mono text-xs">/{inv.slug}</td>
              <td className="p-3">
                <span className={`px-2 py-0.5 rounded-full text-xs ${inv.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {inv.status}
                </span>
              </td>
              <td className="p-3">{inv._count.rsvps}</td>
              <td className="p-3 text-right space-x-2">
                <a href={`/${inv.slug}`} target="_blank" className="text-blue-600">Lihat</a>
                <Link href={`/admin/invitations/${inv.id}/edit`} className="text-gray-600">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
