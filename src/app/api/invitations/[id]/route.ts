import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invitationSchema } from "@/lib/validations/invitation.schema";
import { parseBaliDateTime } from "@/lib/utils/timezone";
import { calcTotalPrice } from "@/lib/addons";

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

  // Total tagihan = paket + add-on yang dicentang. Hanya dihitung ulang kalau
  // payload menyentuh paket/add-on (toggle status saja TIDAK mengubah harga).
  const touchesPrice =
    packageId !== undefined ||
    [d.isAddon, d.coverVideoAddon, d.extraGalleryAddon, d.bilingualEnabled, d.neverExpires].some((v) => v !== undefined);

  let packageUpdate: { packageId: string | null; totalPrice: number | null } | undefined;
  if (touchesPrice) {
    const existing = await prisma.invitation.findUnique({
      where: { id: params.id },
      select: {
        packageId: true,
        isAddon: true,
        coverVideoAddon: true,
        extraGalleryAddon: true,
        bilingualEnabled: true,
        neverExpires: true,
      },
    });
    if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    const effectivePackageId = packageId !== undefined ? packageId || null : existing.packageId;
    let packagePrice: number | null = null;
    if (effectivePackageId) {
      const pkg = await prisma.package.findUnique({ where: { id: effectivePackageId } });
      if (!pkg) {
        return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 400 });
      }
      packagePrice = pkg.price;
    }
    packageUpdate = {
      packageId: effectivePackageId,
      totalPrice: calcTotalPrice(packagePrice, {
        isAddon: d.isAddon ?? existing.isAddon,
        coverVideoAddon: d.coverVideoAddon ?? existing.coverVideoAddon,
        extraGalleryAddon: d.extraGalleryAddon ?? existing.extraGalleryAddon,
        bilingualEnabled: d.bilingualEnabled ?? existing.bilingualEnabled,
        neverExpires: d.neverExpires ?? existing.neverExpires,
      }),
    };
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
      eventDate: d.eventDate ? parseBaliDateTime(d.eventDate) : undefined,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.invitation.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
