export type PaymentStatus = "no_package" | "unpaid" | "partial" | "paid";

export function getPaymentStatus(totalPrice: number | null, paidAmount: number): PaymentStatus {
  if (totalPrice == null) return "no_package";
  if (paidAmount <= 0) return "unpaid";
  if (paidAmount >= totalPrice) return "paid";
  return "partial";
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  no_package: "Belum ada paket",
  unpaid: "Belum bayar",
  partial: "DP",
  paid: "Lunas",
};

export const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  no_package: "bg-gray-100 text-gray-500",
  unpaid: "bg-red-50 text-red-600",
  partial: "bg-amber-50 text-amber-700",
  paid: "bg-green-100 text-green-700",
};
