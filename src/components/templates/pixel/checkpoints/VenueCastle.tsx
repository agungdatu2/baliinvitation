"use client";

import { useEffect, useState } from "react";
import { MapPin, CalendarPlus } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import { buildGoogleCalendarUrl } from "@/lib/utils/calendar-link";
import { playSelect } from "../sfx";
import CheckpointModal from "../CheckpointModal";

interface Zone {
  x: number;
  width: number;
}

// Checkpoint "Venue" — castle pixel per acara, klik untuk modal jadwal +
// tombol buka peta & simpan ke kalender.
export default function VenueCastle({
  zone,
  itemWidth,
  data,
  onModalOpenChange,
}: {
  zone: Zone;
  itemWidth: number;
  data: InvitationData;
  onModalOpenChange: (open: boolean) => void;
}) {
  const t = getDict(data.language);
  const events = data.events ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    onModalOpenChange(openIndex !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  return (
    <div className="absolute bottom-16" style={{ left: zone.x, width: zone.width }}>
      <p
        className="absolute -top-10 font-pixel-display text-[9px] text-pixel-yellow uppercase tracking-widest"
        style={{ left: 12 }}
      >
        {t.pixelLevelSelect}
      </p>
      {events.map((ev, i) => (
        <button
          key={i}
          onClick={() => {
            playSelect();
            setOpenIndex(i);
          }}
          className="absolute bottom-0 flex flex-col items-center"
          style={{ left: itemWidth * i + itemWidth / 2 - 40 }}
        >
          <div className="w-20 h-24 bg-pixel-panel pixel-border relative">
            <div className="absolute -top-3 left-1 w-3 h-3 bg-pixel-panel pixel-border" />
            <div className="absolute -top-3 right-1 w-3 h-3 bg-pixel-panel pixel-border" />
            <div className="absolute inset-x-4 bottom-0 top-10 bg-pixel-bg" />
          </div>
          <p className="font-pixel-display text-[7px] text-pixel-ink/80 uppercase mt-1 max-w-[90px]">{ev.name}</p>
        </button>
      ))}

      {openIndex !== null && events[openIndex] && (
        <VenueModal event={events[openIndex]} title={`${data.groomNickname} & ${data.brideNickname}`} lang={data.language} onClose={() => setOpenIndex(null)} />
      )}
    </div>
  );
}

function VenueModal({
  event,
  title,
  lang,
  onClose,
}: {
  event: InvitationData["events"][number];
  title: string;
  lang?: InvitationData["language"];
  onClose: () => void;
}) {
  const t = getDict(lang);
  const eventDateTime = new Date(`${event.date}T${event.timeStart || "00:00"}`);
  const calendarUrl = buildGoogleCalendarUrl({
    title: `${event.name} - ${title}`,
    location: event.location,
    start: eventDateTime,
    end: new Date(eventDateTime.getTime() + 3 * 60 * 60 * 1000),
  });

  return (
    <CheckpointModal title={event.name} onClose={onClose}>
      <p className="font-pixel-body text-lg text-pixel-ink/90">
        {new Date(event.date).toLocaleDateString(t.dateLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </p>
      <p className="font-pixel-body text-lg text-pixel-ink/90 mb-3">
        {t.at} {event.timeStart} {event.timezone}
      </p>
      {event.location && <p className="font-pixel-body text-base text-pixel-ink/70 leading-relaxed mb-4">{event.location}</p>}
      <div className="flex flex-wrap gap-3">
        {event.mapsUrl && (
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="font-pixel-display inline-flex items-center gap-1.5 bg-pixel-blue text-pixel-ink text-[9px] uppercase tracking-widest px-4 py-2.5 pixel-border"
          >
            <MapPin className="h-3.5 w-3.5" /> {t.googleMaps}
          </a>
        )}
        <a
          href={calendarUrl}
          target="_blank"
          rel="noreferrer"
          className="font-pixel-display inline-flex items-center gap-1.5 bg-pixel-bg text-pixel-ink text-[9px] uppercase tracking-widest px-4 py-2.5 pixel-border"
        >
          <CalendarPlus className="h-3.5 w-3.5" /> {t.saveTheDate}
        </a>
      </div>
    </CheckpointModal>
  );
}
