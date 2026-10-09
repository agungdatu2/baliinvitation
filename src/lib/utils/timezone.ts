// Semua jam acara diinput admin sebagai waktu Bali (WITA, UTC+8, tanpa DST),
// BUKAN waktu server/browser — server Vercel jalan di UTC, jadi tanpa ini jam
// sore (>= 16:00 WITA) tergeser ke hari berikutnya saat ditampilkan.
export const BALI_TZ = "Asia/Makassar";
const BALI_OFFSET = "+08:00";

// "2026-10-18T17:00" (datetime-local, tanpa zona) -> Date untuk 17:00 WITA.
// String yang sudah punya zona (Z / +hh:mm) dibiarkan apa adanya.
export function parseBaliDateTime(value: string): Date {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(value);
  const withSeconds = /T\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
  return new Date(hasZone ? value : `${withSeconds}${BALI_OFFSET}`);
}

// Date -> "YYYY-MM-DDTHH:mm" dalam waktu Bali, untuk <input type="datetime-local">.
export function toBaliDatetimeLocal(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BALI_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
