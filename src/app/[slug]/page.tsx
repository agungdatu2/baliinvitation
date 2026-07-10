import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_REGISTRY } from "@/components/templates/registry";
import { InvitationData } from "@/types/invitation";
import { recordInvitationView, ViaParam } from "@/lib/portal/track-view";

export const dynamic = "force-dynamic";

// status ("draft" | "published") is only an internal completeness flag for the
// admin dashboard — it does not gate public access, so admins can preview a
// draft via its slug before flipping it to published.
async function getInvitation(slug: string) {
  return prisma.invitation.findUnique({
    where: { slug },
    include: { template: true },
  });
}

// ?g={guestCode} is the personalized/tracked link; ?to=Nama is the older untracked
// mass-broadcast link and keeps working as a fallback (spec section 2).
async function resolveGuest(invitationId: string, guestCode?: string) {
  if (!guestCode) return null;
  const guest = await prisma.guest.findUnique({ where: { guestCode } });
  if (!guest || guest.invitationId !== invitationId) return null;
  return guest;
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
  searchParams: { to?: string; g?: string; portal_preview?: string };
}) {
  const inv = await getInvitation(params.slug);
  if (!inv) return notFound();

  const Template = TEMPLATE_REGISTRY[inv.template.key];
  if (!Template) return notFound();

  // Portal's "Preview undangan" button opens this same page with ?portal_preview={token}
  // so the client can see their draft without it counting as a real guest view.
  const isPortalPreview = Boolean(searchParams.portal_preview) && searchParams.portal_preview === inv.portalToken;

  const guest = await resolveGuest(inv.id, searchParams.g);
  const viaParam: ViaParam = guest ? "guest" : searchParams.to ? "to" : "direct";
  if (!isPortalPreview) {
    await recordInvitationView({
      invitationId: inv.id,
      guest,
      viaParam,
      userAgent: headers().get("user-agent"),
    });
  }

  const guestName = guest?.name ?? (searchParams.to ? decodeURIComponent(searchParams.to) : undefined);

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

  return <Template data={data} guestName={guestName} guestId={guest?.id} />;
}
