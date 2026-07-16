import { z } from "zod";

export const packageSchema = z.object({
  name: z.string().min(1, "Nama paket wajib diisi"),
  price: z.coerce.number().int().min(0, "Harga tidak boleh negatif"),
  description: z.string().optional(),
  features: z.array(z.string().min(1)).default([]),
  hasIntro: z.boolean().default(true),
  maxGalleryImages: z.coerce.number().int().positive().optional().nullable(),
  activeMonths: z.coerce.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type PackageFormValues = z.infer<typeof packageSchema>;
