import { z } from "zod";

export const templateSchema = z.object({
  key: z
    .string()
    .min(1, "Key wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Key hanya boleh huruf kecil, angka, dan tanda -"),
  name: z.string().min(1, "Nama tema wajib diisi"),
  thumbnail: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;
