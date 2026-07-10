import { resolvePortalByToken } from "@/lib/portal/resolve-portal";
import { listGuests } from "@/lib/services/guests";
import GuestManager from "@/components/portal/GuestManager";

export const dynamic = "force-dynamic";

export default async function PortalGuestsPage({ params }: { params: { token: string } }) {
  const { invitation } = await resolvePortalByToken(params.token);
  if (!invitation) return null;

  const guests = await listGuests(invitation.id);
  const eventDateLabel = new Date(invitation.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <GuestManager
      token={params.token}
      slug={invitation.slug}
      groomNickname={invitation.groomNickname}
      brideNickname={invitation.brideNickname}
      eventDateLabel={eventDateLabel}
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
