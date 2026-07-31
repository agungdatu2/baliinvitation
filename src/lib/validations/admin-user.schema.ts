import { z } from "zod";

export const adminUserSchema = z.object({
  email: z.string().email("Email tidak valid").transform((v) => v.toLowerCase().trim()),
  password: z.string().min(8, "Password minimal 8 karakter"),
  name: z.string().optional(),
});

export type AdminUserFormValues = z.infer<typeof adminUserSchema>;
