import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { templateSchema } from "@/lib/validations/template.schema";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = templateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.template.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}
