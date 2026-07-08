// Generate link "Tambahkan ke Kalender" (Google Calendar), sama seperti fitur di tamubali.com/lume
export function buildGoogleCalendarUrl(opts: {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}) {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(opts.start)}/${fmt(opts.end)}`,
    details: opts.description ?? "",
    location: opts.location ?? "",
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}
