import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { packageSchema } from "@/lib/validations/package.schema";

// GET /api/packages -> list semua paket (untuk tab Paket & form undangan)
export async function GET() {
  const packages = await prisma.package.findMany({
    orderBy: { price: "asc" },
    include: { _count: { select: { invitations: true } } },
  });
  return NextResponse.json(packages);
}

// POST /api/packages -> buat paket baru
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = packageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const created = await prisma.package.create({
    data: {
      name: d.name,
      price: d.price,
      description: d.description,
      features: d.features,
      hasIntro: d.hasIntro,
      maxGalleryImages: d.maxGalleryImages,
      activeMonths: d.activeMonths,
      isActive: d.isActive,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
