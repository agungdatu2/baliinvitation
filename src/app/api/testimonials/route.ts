import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations/testimonial.schema";

// GET /api/testimonials -> list semua testimoni (untuk admin, termasuk yang nonaktif)
export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(testimonials);
}

// POST /api/testimonials -> buat testimoni baru
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = testimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const created = await prisma.testimonial.create({
    data: {
      authorName: d.authorName,
      rating: d.rating,
      text: d.text,
      timeLabel: d.timeLabel,
      order: d.order,
      isActive: d.isActive,
    },
  });

  revalidatePath("/");
  return NextResponse.json(created, { status: 201 });
}
