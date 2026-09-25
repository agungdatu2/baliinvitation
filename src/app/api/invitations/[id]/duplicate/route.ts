import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePortalToken } from "@/lib/utils/tokens";

async function nextAvailableSlug(base: string) {
  let n = 2;
  let candidate = `${base}-${n}`;
  while (await prisma.invitation.findUnique({ where: { slug: candidate } })) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

// POST /api/invitations/[id]/duplicate -> klon undangan, dipakai untuk
// pesanan "split link" (client minta dua tautan terpisah dengan isi yang
// sama/mirip, mis. beda daftar tamu keluarga mempelai pria vs wanita).
// Cuma ISI kontennya yang disalin — slug & portalToken baru (harus unik),
// status balik ke draft. Guests/RSVP/payments/views/eventChangeRequests
// SENGAJA tidak ikut disalin: itu riwayat milik undangan asal, bukan bagian
// dari "isi" yang mau digandakan — undangan hasil duplikat mulai dari
// daftar tamu kosong supaya admin bisa isi tamu yang berbeda untuk link ini.
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const original = await prisma.invitation.findUnique({ where: { id: params.id } });
  if (!original) {
    return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
  }

  const slug = await nextAvailableSlug(original.slug);

  const duplicate = await prisma.invitation.create({
    data: {
      slug,
      status: "draft",
      language: original.language,
      bilingualEnabled: original.bilingualEnabled,
      showAsExample: false,
      templateId: original.templateId,
      packageId: original.packageId ?? undefined,
      totalPrice: original.totalPrice ?? undefined,
      neverExpires: original.neverExpires,
      portalToken: generatePortalToken(),
      portalEnabled: original.portalEnabled,
      clientCanEditEvents: original.clientCanEditEvents,
      portalNeverExpires: original.portalNeverExpires,
      messageTemplate: original.messageTemplate ?? undefined,
      clientName: original.clientName,
      clientPhone: original.clientPhone ?? undefined,
      clientNotes: original.clientNotes ?? undefined,
      groomNickname: original.groomNickname,
      groomFullName: original.groomFullName,
      groomParents: original.groomParents,
      groomInstagram: original.groomInstagram ?? undefined,
      groomPhoto: original.groomPhoto ?? undefined,
      brideNickname: original.brideNickname,
      brideFullName: original.brideFullName,
      brideParents: original.brideParents,
      brideInstagram: original.brideInstagram ?? undefined,
      bridePhoto: original.bridePhoto ?? undefined,
      eventTitle: original.eventTitle ?? undefined,
      eventTitleEn: original.eventTitleEn ?? undefined,
      hostName: original.hostName ?? undefined,
      hostLogo: original.hostLogo ?? undefined,
      hostLogoSize: original.hostLogoSize,
      coverImage: original.coverImage ?? undefined,
      metaImage: original.metaImage ?? undefined,
      quote: original.quote ?? undefined,
      quoteEn: original.quoteEn ?? undefined,
      greeting: original.greeting ?? undefined,
      greetingEn: original.greetingEn ?? undefined,
      musicUrl: original.musicUrl ?? undefined,
      livestreamUrl: original.livestreamUrl ?? undefined,
      livestreamNote: original.livestreamNote ?? undefined,
      heroVideoUrl: original.heroVideoUrl ?? undefined,
      backgroundType: original.backgroundType,
      backgroundImage: original.backgroundImage ?? undefined,
      backgroundColor: original.backgroundColor ?? undefined,
      backgroundSlideshowImages: original.backgroundSlideshowImages ?? [],
      reverieGateImage: original.reverieGateImage ?? undefined,
      reverieSaveTheDateImage: original.reverieSaveTheDateImage ?? undefined,
      reverieFooterImage: original.reverieFooterImage ?? undefined,
      hiddenSections: original.hiddenSections ?? [],
      dressCode: original.dressCode ?? undefined,
      eventDate: original.eventDate,
      galleryImages: original.galleryImages ?? [],
      galleryStyle: original.galleryStyle,
      loveStory: original.loveStory ?? [],
      events: original.events ?? [],
      bankAccounts: original.bankAccounts ?? [],
    },
  });

  return NextResponse.json(duplicate, { status: 201 });
}
