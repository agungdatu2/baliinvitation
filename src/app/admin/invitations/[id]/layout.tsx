import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import InvitationDetailNav from "@/components/admin/InvitationDetailNav";

export default async function InvitationDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const invitation = await prisma.invitation.findUnique({ where: { id: params.id } });
  if (!invitation) return notFound();

  const pendingChangeRequests = await prisma.eventChangeRequest.count({
    where: { invitationId: params.id, status: "pending" },
  });

  return (
    <div className="pt-6">
      <Link href="/admin" className="text-sm text-gray-500 mb-2 inline-block">
        &larr; Undangan Berjalan
      </Link>
      <h1 className="text-2xl font-semibold mb-1">{invitation.clientName}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {invitation.groomNickname} & {invitation.brideNickname} · /{invitation.slug}
      </p>
      <InvitationDetailNav id={params.id} pendingChangeRequests={pendingChangeRequests} />
      {children}
    </div>
  );
}
