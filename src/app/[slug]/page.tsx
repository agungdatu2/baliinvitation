import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_REGISTRY } from "@/components/templates/registry";
import { InvitationData } from "@/types/invitation";

export const dynamic = "force-dynamic";

async function getInvitation(slug: string) {
  const inv = await prisma.invitation.findUnique({
    where: { slug },
    include: { template: true },
  });
  if (!inv || inv.status !== "published") return null;
  return inv;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const inv = await getInvitation(params.slug);
  if (!inv) return {};
  return {
    title: `The Wedding of ${inv.groomNickname} & ${inv.brideNickname}`,
    description: inv.greeting ?? undefined,
    openGraph: { images: inv.coverImage ? [inv.coverImage] : [] },
  };
}

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { to?: string };
}) {
  const inv = await getInvitation(params.slug);
  if (!inv) return notFound();

  const Template = TEMPLATE_REGISTRY[inv.template.key];
  if (!Template) return notFound();

  const data: InvitationData = {
    id: inv.id,
    slug: inv.slug,
    status: inv.status as "draft" | "published",
    templateKey: inv.template.key,
    clientName: inv.clientName,
    clientPhone: inv.clientPhone ?? undefined,
    clientNotes: inv.clientNotes ?? undefined,
    groomNickname: inv.groomNickname,
    groomFullName: inv.groomFullName,
    groomParents: inv.groomParents,
    groomInstagram: inv.groomInstagram ?? undefined,
    brideNickname: inv.brideNickname,
    brideFullName: inv.brideFullName,
    brideParents: inv.brideParents,
    brideInstagram: inv.brideInstagram ?? undefined,
    coverImage: inv.coverImage ?? undefined,
    quote: inv.quote ?? undefined,
    greeting: inv.greeting ?? undefined,
    musicUrl: inv.musicUrl ?? undefined,
    eventDate: inv.eventDate.toISOString(),
    galleryImages: (inv.galleryImages as unknown as string[]) ?? [],
    loveStory: (inv.loveStory as unknown as InvitationData["loveStory"]) ?? [],
    events: (inv.events as unknown as InvitationData["events"]) ?? [],
    bankAccounts: (inv.bankAccounts as unknown as InvitationData["bankAccounts"]) ?? [],
  };

  return <Template data={data} guestName={searchParams.to ? decodeURIComponent(searchParams.to) : undefined} />;
}
