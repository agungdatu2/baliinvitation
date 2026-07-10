import { resolvePortalByToken } from "@/lib/portal/resolve-portal";
import { EventItem } from "@/types/invitation";
import EventsEditor from "@/components/portal/EventsEditor";

export const dynamic = "force-dynamic";

export default async function PortalEventsPage({ params }: { params: { token: string } }) {
  const { invitation } = await resolvePortalByToken(params.token);
  if (!invitation) return null;

  const events = (invitation.events as unknown as EventItem[]) ?? [];

  return (
    <EventsEditor
      token={params.token}
      events={events}
      clientCanEditEvents={invitation.clientCanEditEvents}
    />
  );
}
