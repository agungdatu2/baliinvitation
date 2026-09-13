import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations/testimonial.schema";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.testimonial.update({
    where: { id: params.id },
    data: parsed.data,
  });
  revalidatePath("/");
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.testimonial.delete({ where: { id: params.id } });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
