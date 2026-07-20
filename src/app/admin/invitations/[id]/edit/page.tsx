import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InvitationForm from "@/components/admin/InvitationForm";
import type { InvitationFormValues } from "@/lib/validations/invitation.schema";

export const dynamic = "force-dynamic";

// datetime-local butuh "YYYY-MM-DDTHH:mm" dalam waktu lokal (bukan UTC/toISOString,
// yang akan geser jam kalau timezone server/browser bukan UTC).
function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditInvitationPage({ params }: { params: { id: string } }) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: params.id },
    include: { template: true },
  });
  if (!invitation) return notFound();

  const initialValues: Partial<InvitationFormValues> = {
    slug: invitation.slug,
    status: invitation.status as "draft" | "published",
    language: invitation.language as "id" | "en",
    templateKey: invitation.template.key,
    packageId: invitation.packageId ?? "",
    clientName: invitation.clientName,
    clientPhone: invitation.clientPhone ?? "",
    clientNotes: invitation.clientNotes ?? "",
    groomNickname: invitation.groomNickname,
    groomFullName: invitation.groomFullName,
    groomParents: invitation.groomParents,
    groomInstagram: invitation.groomInstagram ?? "",
    groomPhoto: invitation.groomPhoto ?? "",
    brideNickname: invitation.brideNickname,
    brideFullName: invitation.brideFullName,
    brideParents: invitation.brideParents,
    brideInstagram: invitation.brideInstagram ?? "",
    bridePhoto: invitation.bridePhoto ?? "",
    coverImage: invitation.coverImage ?? "",
    quote: invitation.quote ?? "",
    greeting: invitation.greeting ?? "",
    musicUrl: invitation.musicUrl ?? "",
    livestreamUrl: invitation.livestreamUrl ?? "",
    livestreamNote: invitation.livestreamNote ?? "",
    heroVideoUrl: invitation.heroVideoUrl ?? "",
    reverieGateImage: invitation.reverieGateImage ?? "",
    reverieSaveTheDateImage: invitation.reverieSaveTheDateImage ?? "",
    hiddenSections: (invitation.hiddenSections as string[]) ?? [],
    eventDate: toDatetimeLocalValue(invitation.eventDate),
    galleryImages: (invitation.galleryImages as string[]) ?? [],
    loveStory: (invitation.loveStory as InvitationFormValues["loveStory"]) ?? [],
    events: (invitation.events as InvitationFormValues["events"]) ?? [],
    bankAccounts: (invitation.bankAccounts as InvitationFormValues["bankAccounts"]) ?? [],
    dressCode: (invitation.dressCode as InvitationFormValues["dressCode"]) ?? [],
  };

  return <InvitationForm invitationId={invitation.id} initialValues={initialValues} />;
}
