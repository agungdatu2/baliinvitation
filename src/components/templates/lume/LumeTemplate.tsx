"use client";

import { useRef, useState } from "react";
import { TemplateProps } from "@/types/invitation";
import SplashGate from "./SplashGate";
import HeroGreeting from "./HeroGreeting";
import CoupleProfile from "./CoupleProfile";
import LoveStory from "./LoveStory";
import Gallery from "./Gallery";
import CountdownCalendar from "./CountdownCalendar";
import EventDetails from "./EventDetails";
import RSVPForm from "./RSVPForm";
import WeddingGift from "./WeddingGift";
import ClosingFooter from "./ClosingFooter";

// Orchestrator utama tema "Lume" — struktur & fitur mengikuti alur
// tamubali.com/lume: splash % -> gate nama tamu -> buka -> konten lengkap.
// Semua data & gambar 100% dinamis dari `data` (hasil input Form Admin),
// bukan hardcode, sehingga template ini dipakai ulang untuk semua client.
export default function LumeTemplate({ data, guestName }: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = () => {
    setOpened(true);
    audioRef.current?.play().catch(() => {});
  };

  const eventDateLabel = new Date(data.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="bg-lume-bg text-lume-ink font-serif">
      {!opened && (
        <SplashGate
          groomNickname={data.groomNickname}
          brideNickname={data.brideNickname}
          eventDateLabel={eventDateLabel}
          guestName={guestName}
          onOpen={handleOpen}
        />
      )}

      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop />}

      {opened && (
        <div className="animate-fadeIn">
          <HeroGreeting data={data} />
          <Gallery images={data.galleryImages.slice(0, 2)} variant="grid" />
          <CoupleProfile data={data} />
          <LoveStory data={data} />
          <Gallery images={data.galleryImages} variant="grid" />
          <CountdownCalendar
            eventDate={data.eventDate}
            title={`${data.groomNickname} & ${data.brideNickname}`}
            location={data.events?.[0]?.location}
          />
          <EventDetails events={data.events} />
          <RSVPForm invitationId={data.id ?? data.slug} />
          <Gallery images={data.galleryImages} variant="strip" />
          <WeddingGift accounts={data.bankAccounts} />
          <ClosingFooter data={data} />
        </div>
      )}
    </main>
  );
}
