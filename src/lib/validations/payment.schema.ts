import { z } from "zod";

export const paymentSchema = z.object({
  invitationId: z.string().min(1, "Pilih undangan/client"),
  amount: z.coerce.number().int().positive("Nominal harus lebih dari 0"),
  paidAt: z.string().optional(),
  note: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
