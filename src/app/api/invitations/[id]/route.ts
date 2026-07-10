import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invitationSchema } from "@/lib/validations/invitation.schema";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: params.id },
    include: { template: true, package: true, payments: true },
  });
  if (!invitation) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json(invitation);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = invitationSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { packageId, templateKey, ...d } = parsed.data;

  let packageUpdate: { packageId: string | null; totalPrice: number | null } | undefined;
  if (packageId !== undefined) {
    if (packageId === "") {
      packageUpdate = { packageId: null, totalPrice: null };
    } else {
      const pkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (!pkg) {
        return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 400 });
      }
      packageUpdate = { packageId: pkg.id, totalPrice: pkg.price };
    }
  }

  let templateId: string | undefined;
  if (templateKey) {
    const template = await prisma.template.findUnique({ where: { key: templateKey } });
    if (!template) {
      return NextResponse.json({ error: "Template tidak ditemukan" }, { status: 400 });
    }
    templateId = template.id;
  }

  const updated = await prisma.invitation.update({
    where: { id: params.id },
    data: {
      ...d,
      templateId,
      ...packageUpdate,
      eventDate: d.eventDate ? new Date(d.eventDate) : undefined,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.invitation.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
