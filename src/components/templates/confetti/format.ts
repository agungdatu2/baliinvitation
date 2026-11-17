import { Lang } from "@/lib/i18n/confetti";

const TIME_RE = /^(\d{1,2}):(\d{2})$/;

function fmtTime(hhmm: string | undefined, lang: Lang | undefined) {
  const m = TIME_RE.exec(hhmm?.trim() ?? "");
  if (!m) return null;
  const hour = parseInt(m[1], 10);
  if (lang === "en") return `${hour % 12 || 12}:${m[2]} ${hour >= 12 ? "PM" : "AM"}`;
  return `${String(hour).padStart(2, "0")}.${m[2]}`;
}

// "16:30","18:00" -> "16.30 - 18.00 WITA" (id) / "4:30 PM - 6:00 PM WITA" (en).
// Jam selesai yang bukan jam (mis. "Selesai") diabaikan.
export function formatTimeRange(timeStart: string, timeEnd: string | undefined, lang: Lang | undefined, tz?: string) {
  const start = fmtTime(timeStart, lang);
  if (!start) return "";
  const end = fmtTime(timeEnd, lang);
  return `${end ? `${start} - ${end}` : start} ${tz ?? "WITA"}`.trim();
}

// events[].date berupa "YYYY-MM-DD" — dipecah manual supaya tanggalnya tidak
// bergeser oleh zona waktu server/browser.
export function formatEventDate(dateStr: string, locale: string, opts: Intl.DateTimeFormatOptions) {
  const [y, m, d] = dateStr.slice(0, 10).split("-");
  return new Date(`${y}-${m}-${d}T12:00:00Z`).toLocaleDateString(locale, { ...opts, timeZone: "UTC" });
}
