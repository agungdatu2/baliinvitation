import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invitationSchema } from "@/lib/validations/invitation.schema";

// GET /api/invitations -> list semua undangan (untuk tabel dashboard admin)
export async function GET() {
  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: { template: true, _count: { select: { rsvps: true } } },
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

  const invitation = await prisma.invitation.create({
    data: {
      slug: d.slug,
      status: d.status,
      templateId: template.id,
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
      eventDate: new Date(d.eventDate),
      galleryImages: d.galleryImages,
      loveStory: d.loveStory,
      events: d.events,
      bankAccounts: d.bankAccounts,
    },
  });

  return NextResponse.json(invitation, { status: 201 });
}
