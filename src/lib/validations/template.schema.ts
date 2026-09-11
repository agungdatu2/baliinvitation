import { z } from "zod";

export const templateSchema = z.object({
  key: z
    .string()
    .min(1, "Key wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Key hanya boleh huruf kecil, angka, dan tanda -"),
  name: z.string().min(1, "Nama tema wajib diisi"),
  thumbnail: z.string().optional(),
  isActive: z.boolean().default(true),
  // Konten kartu tema di landing page ("/") — lihat komentar di schema.prisma
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  isMostPopular: z.boolean().optional(),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;
