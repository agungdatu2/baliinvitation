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
    include: { template: true, package: true },
  });
}

// Package.activeMonths (kalau diisi admin) membuat undangan expired otomatis
// eventDate + N bulan — null berarti tidak pernah expired.
function isExpired(eventDate: Date, activeMonths: number | null | undefined) {
  if (!activeMonths) return false;
  const expiresAt = new Date(eventDate);
  expiresAt.setMonth(expiresAt.getMonth() + activeMonths);
  return new Date() > expiresAt;
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

  // Expired check dilewati untuk portal preview supaya admin/client tetap bisa
  // lihat isinya walau masa aktif paketnya sudah lewat.
  if (!isPortalPreview && isExpired(inv.eventDate, inv.package?.activeMonths)) {
    return (
      <div className="min-h-screen bg-groove-bg flex items-center justify-center px-6 text-center">
        <div>
          <p className="font-groove-label uppercase tracking-widest text-xs text-groove-secondary mb-3">
            BaliInvitation
          </p>
          <p className="font-groove-body text-groove-ink">
            Undangan ini sudah tidak aktif. Silakan hubungi mempelai untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

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
    language: inv.language as "id" | "en",
    templateKey: inv.template.key,
    clientName: inv.clientName,
    clientPhone: inv.clientPhone ?? undefined,
    clientNotes: inv.clientNotes ?? undefined,
    groomNickname: inv.groomNickname,
    groomFullName: inv.groomFullName,
    groomParents: inv.groomParents,
    groomInstagram: inv.groomInstagram ?? undefined,
    groomPhoto: inv.groomPhoto ?? undefined,
    brideNickname: inv.brideNickname,
    brideFullName: inv.brideFullName,
    brideParents: inv.brideParents,
    brideInstagram: inv.brideInstagram ?? undefined,
    bridePhoto: inv.bridePhoto ?? undefined,
    coverImage: inv.coverImage ?? undefined,
    quote: inv.quote ?? undefined,
    greeting: inv.greeting ?? undefined,
    musicUrl: inv.musicUrl ?? undefined,
    livestreamUrl: inv.livestreamUrl ?? undefined,
    livestreamNote: inv.livestreamNote ?? undefined,
    heroVideoUrl: inv.heroVideoUrl ?? undefined,
    reverieGateImage: inv.reverieGateImage ?? undefined,
    reverieSaveTheDateImage: inv.reverieSaveTheDateImage ?? undefined,
    eventDate: inv.eventDate.toISOString(),
    galleryImages: (inv.galleryImages as unknown as string[]) ?? [],
    loveStory: (inv.loveStory as unknown as InvitationData["loveStory"]) ?? [],
    events: (inv.events as unknown as InvitationData["events"]) ?? [],
    bankAccounts: (inv.bankAccounts as unknown as InvitationData["bankAccounts"]) ?? [],
    dressCode: (inv.dressCode as unknown as InvitationData["dressCode"]) ?? [],
    hasIntro: inv.package?.hasIntro ?? true,
    maxGalleryImages: inv.package?.maxGalleryImages ?? null,
  };

  return <Template data={data} guestName={guestName} guestId={guest?.id} />;
}
