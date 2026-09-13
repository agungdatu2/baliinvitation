import { prisma } from "@/lib/prisma";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Testimoni</h1>
      </div>
      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
