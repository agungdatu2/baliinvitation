import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { templateSchema } from "@/lib/validations/template.schema";

// GET /api/templates -> list semua tema (untuk tab Tema & form undangan)
export async function GET() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { invitations: true } } },
  });
  return NextResponse.json(templates);
}

// POST /api/templates -> daftarkan tema baru (komponen React-nya dibuat terpisah di registry.ts)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = templateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const existing = await prisma.template.findUnique({ where: { key: d.key } });
  if (existing) {
    return NextResponse.json({ error: "Key tema sudah dipakai" }, { status: 409 });
  }

  const created = await prisma.template.create({
    data: { key: d.key, name: d.name, thumbnail: d.thumbnail, isActive: d.isActive },
  });

  return NextResponse.json(created, { status: 201 });
}
