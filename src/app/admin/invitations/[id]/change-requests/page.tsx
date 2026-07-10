import { listChangeRequests } from "@/lib/services/event-change-requests";
import { EventItem } from "@/types/invitation";
import ChangeRequestsManager from "@/components/admin/ChangeRequestsManager";

export const dynamic = "force-dynamic";

export default async function ChangeRequestsPage({ params }: { params: { id: string } }) {
  const requests = await listChangeRequests(params.id);

  return (
    <ChangeRequestsManager
      requests={requests.map((r) => ({
        id: r.id,
        eventIndex: r.eventIndex,
        oldValues: r.oldValues as unknown as Partial<EventItem>,
        newValues: r.newValues as unknown as Partial<EventItem>,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      }))}
    />
  );
}
