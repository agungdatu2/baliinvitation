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
          style={{ left: itemWidth * i + itemWidth / 2 - 56 }}
        >
          {/* Banner "CHECKPOINT REACHED!" di atas castle */}
          <div className="mb-1 pixel-border bg-pixel-red text-pixel-ink px-2 py-1">
            <p className="font-pixel-display text-[7px] uppercase tracking-wide whitespace-nowrap">CHECKPOINT</p>
          </div>
          <div className="w-1 h-6 bg-pixel-line-light" />

          {/* Castle — dua menara samping + tembok tengah dengan gerbang */}
          <div className="relative flex items-end">
            <Tower />
            <div className="w-16 h-24 bg-pixel-panel pixel-border relative mx-[-2px]">
              <div className="absolute inset-x-0 top-0 h-2 flex justify-around">
                {[0, 1, 2].map((k) => (
                  <div key={k} className="w-2 h-2 bg-pixel-panel pixel-border" />
                ))}
              </div>
              <div className="absolute inset-x-3 bottom-0 top-8 bg-pixel-dirt" />
            </div>
            <Tower />
          </div>
          <p className="font-pixel-display text-[7px] text-pixel-ink/80 uppercase mt-1 max-w-[110px]">{ev.name}</p>
        </button>
      ))}

      {openIndex !== null && events[openIndex] && (
        <VenueModal event={events[openIndex]} title={`${data.groomNickname} & ${data.brideNickname}`} lang={data.language} onClose={() => setOpenIndex(null)} />
      )}
    </div>
  );
}

function Tower() {
  return (
    <div className="w-9 h-20 bg-pixel-panel pixel-border relative shrink-0">
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderBottom: "16px solid #e4364a",
        }}
      />
      <div className="absolute inset-x-0 top-1 h-1.5 flex justify-around px-0.5">
        {[0, 1].map((k) => (
          <div key={k} className="w-1.5 h-1.5 bg-pixel-panel pixel-border" />
        ))}
      </div>
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
