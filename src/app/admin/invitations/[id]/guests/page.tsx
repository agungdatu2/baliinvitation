import { listGuests } from "@/lib/services/guests";
import { prisma } from "@/lib/prisma";
import AdminGuestManager from "@/components/admin/AdminGuestManager";

export const dynamic = "force-dynamic";

export default async function AdminInvitationGuestsPage({ params }: { params: { id: string } }) {
  const [guests, invitation] = await Promise.all([
    listGuests(params.id),
    prisma.invitation.findUnique({ where: { id: params.id }, select: { slug: true } }),
  ]);
  if (!invitation) return null;

  return (
    <AdminGuestManager
      invitationId={params.id}
      slug={invitation.slug}
      initialGuests={guests.map((g) => ({
        id: g.id,
        name: g.name,
        waNumber: g.waNumber,
        category: g.category,
        guestCode: g.guestCode,
        status: g.status,
      }))}
    />
  );
}
