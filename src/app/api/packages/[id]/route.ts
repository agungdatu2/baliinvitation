import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { packageSchema } from "@/lib/validations/package.schema";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = packageSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.package.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.package.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
