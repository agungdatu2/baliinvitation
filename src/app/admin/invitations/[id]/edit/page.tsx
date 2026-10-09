import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InvitationForm from "@/components/admin/InvitationForm";
import type { InvitationFormValues } from "@/lib/validations/invitation.schema";
import { toBaliDatetimeLocal } from "@/lib/utils/timezone";

export const dynamic = "force-dynamic";


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
    showAsExample: invitation.showAsExample,
    templateKey: invitation.template.key,
    packageId: invitation.packageId ?? "",
    neverExpires: invitation.neverExpires,
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
    eventTitle: invitation.eventTitle ?? "",
    hostName: invitation.hostName ?? "",
    hostLogo: invitation.hostLogo ?? "",
    hostLogoSize: invitation.hostLogoSize as InvitationFormValues["hostLogoSize"],
    coverImage: invitation.coverImage ?? "",
    metaImage: invitation.metaImage ?? "",
    quote: invitation.quote ?? "",
    greeting: invitation.greeting ?? "",
    musicUrl: invitation.musicUrl ?? "",
    livestreamUrl: invitation.livestreamUrl ?? "",
    livestreamNote: invitation.livestreamNote ?? "",
    heroVideoUrl: invitation.heroVideoUrl ?? "",
    reverieGateImage: invitation.reverieGateImage ?? "",
    reverieSaveTheDateImage: invitation.reverieSaveTheDateImage ?? "",
    reverieFooterImage: invitation.reverieFooterImage ?? "",
    backgroundType: invitation.backgroundType as InvitationFormValues["backgroundType"],
    backgroundImage: invitation.backgroundImage ?? "",
    backgroundColor: invitation.backgroundColor ?? "",
    backgroundSlideshowImages: (invitation.backgroundSlideshowImages as string[]) ?? [],
    hiddenSections: (invitation.hiddenSections as string[]) ?? [],
    eventDate: toBaliDatetimeLocal(invitation.eventDate),
    galleryImages: (invitation.galleryImages as string[]) ?? [],
    loveStory: (invitation.loveStory as InvitationFormValues["loveStory"]) ?? [],
    events: (invitation.events as InvitationFormValues["events"]) ?? [],
    bankAccounts: (invitation.bankAccounts as InvitationFormValues["bankAccounts"]) ?? [],
    dressCode: (invitation.dressCode as InvitationFormValues["dressCode"]) ?? [],
  };

  return <InvitationForm invitationId={invitation.id} initialValues={initialValues} />;
}
