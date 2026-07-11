import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invitationSchema } from "@/lib/validations/invitation.schema";
import { generatePortalToken } from "@/lib/utils/tokens";

// GET /api/invitations -> list semua undangan (untuk tabel dashboard admin)
export async function GET() {
  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      template: true,
      package: true,
      payments: true,
      _count: { select: { rsvps: true } },
    },
  });
  return NextResponse.json(invitations);
}

// POST /api/invitations -> buat undangan baru dari Form Admin
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = invitationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const existing = await prisma.invitation.findUnique({ where: { slug: d.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug sudah dipakai" }, { status: 409 });
  }

  const template = await prisma.template.findUnique({ where: { key: d.templateKey } });
  if (!template) {
    return NextResponse.json({ error: "Template tidak ditemukan" }, { status: 400 });
  }

  let packageId: string | undefined;
  let totalPrice: number | undefined;
  if (d.packageId) {
    const pkg = await prisma.package.findUnique({ where: { id: d.packageId } });
    if (!pkg) {
      return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 400 });
    }
    packageId = pkg.id;
    totalPrice = pkg.price;
  }

  const invitation = await prisma.invitation.create({
    data: {
      slug: d.slug,
      status: d.status,
      templateId: template.id,
      packageId,
      totalPrice,
      portalToken: generatePortalToken(),
      clientName: d.clientName,
      clientPhone: d.clientPhone,
      clientNotes: d.clientNotes,
      groomNickname: d.groomNickname,
      groomFullName: d.groomFullName,
      groomParents: d.groomParents,
      groomInstagram: d.groomInstagram,
      brideNickname: d.brideNickname,
      brideFullName: d.brideFullName,
      brideParents: d.brideParents,
      brideInstagram: d.brideInstagram,
      coverImage: d.coverImage,
      quote: d.quote,
      greeting: d.greeting,
      musicUrl: d.musicUrl,
      livestreamUrl: d.livestreamUrl,
      livestreamNote: d.livestreamNote,
      heroVideoUrl: d.heroVideoUrl,
      eventDate: new Date(d.eventDate),
      galleryImages: d.galleryImages,
      loveStory: d.loveStory,
      events: d.events,
      bankAccounts: d.bankAccounts,
    },
  });

  return NextResponse.json(invitation, { status: 201 });
}
