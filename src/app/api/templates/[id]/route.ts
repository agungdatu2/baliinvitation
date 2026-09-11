import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
  // Landing page ("/") di-cache ISR 1 jam (revalidate=3600) — tanpa ini, toggle
  // Most Popular/Aktif/konten tema dari admin baru kelihatan di publik sejam
  // kemudian, bukan langsung.
  revalidatePath("/");
  return NextResponse.json(updated);
}
