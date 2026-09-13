import { z } from "zod";

export const testimonialSchema = z.object({
  authorName: z.string().min(1, "Nama wajib diisi"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  text: z.string().min(1, "Isi testimoni wajib diisi"),
  timeLabel: z.string().min(1, "Waktu wajib diisi (mis. \"2 minggu lalu\")"),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
