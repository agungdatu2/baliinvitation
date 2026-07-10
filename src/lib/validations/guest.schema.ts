import { z } from "zod";
import { GUEST_CATEGORIES } from "@/lib/utils/bulk-import";

export const guestSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  waNumber: z.string().optional(),
  category: z.enum(GUEST_CATEGORIES as [string, ...string[]]).default("lainnya"),
});

export type GuestFormValues = z.infer<typeof guestSchema>;

export const guestBulkSchema = z.object({
  text: z.string().min(1, "Tempel minimal satu nama"),
});
