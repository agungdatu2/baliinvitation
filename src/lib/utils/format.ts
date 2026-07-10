export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Selisih hari ke tanggal acara, dibaca manusia: "H-7", "Hari ini", "H+3"
export function daysUntil(date: Date | string): { days: number; label: string } {
  const target = new Date(date);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - now.getTime()) / 86_400_000);
  if (days === 0) return { days, label: "Hari ini" };
  if (days > 0) return { days, label: `H-${days}` };
  return { days, label: `H+${Math.abs(days)}` };
}
