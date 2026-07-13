"use client";

import { useRef, useState } from "react";
import { TemplateProps } from "@/types/invitation";
import FixedVideoBackground from "./FixedVideoBackground";
import SplashGate from "./SplashGate";
import NavMenu from "./NavMenu";
import HeroGreeting from "./HeroGreeting";
import Verse from "./Verse";
import CoupleProfile from "./CoupleProfile";
import LoveStory from "./LoveStory";
import Gallery from "./Gallery";
import CountdownCalendar from "./CountdownCalendar";
import EventDetails from "./EventDetails";
import LiveStreaming from "./LiveStreaming";
import DressCode from "./DressCode";
import RSVPForm from "./RSVPForm";
import WeddingGift from "./WeddingGift";
import ClosingFooter from "./ClosingFooter";
import Reveal from "./Reveal";
import SectionDivider from "./SectionDivider";

// Orchestrator utama tema "Lume" — struktur & fitur mengikuti alur
// tamubali.com/lume: splash % -> gate nama tamu -> buka -> konten lengkap.
// Semua data & gambar 100% dinamis dari `data` (hasil input Form Admin),
// bukan hardcode, sehingga template ini dipakai ulang untuk semua client.
export default function LumeTemplate({ data, guestName, guestId }: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = () => {
    setOpened(true);
    audioRef.current?.play().then(() => setMusicPlaying(true)).catch(() => {});
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setMusicPlaying(false);
    }
  };

  const eventDateLabel = new Date(data.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="text-groove-ink font-groove-body">
      <FixedVideoBackground src={data.heroVideoUrl} />

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
          <NavMenu
            groomNickname={data.groomNickname}
            brideNickname={data.brideNickname}
            eventDate={data.eventDate}
            eventLocation={data.events?.[0]?.location}
            hasMusic={Boolean(data.musicUrl)}
            musicPlaying={musicPlaying}
            onToggleMusic={toggleMusic}
          />

          <div id="hero">
            <HeroGreeting data={data} />
          </div>

          <Reveal>
            <Verse quote={data.quote} />
          </Reveal>

          <SectionDivider />
          <Reveal id="couple">
            <CoupleProfile data={data} />
          </Reveal>

          <SectionDivider />
          <Reveal id="love-story">
            <LoveStory data={data} />
          </Reveal>

          <SectionDivider />
          <Reveal>
            <CountdownCalendar
              eventDate={data.eventDate}
              title={`${data.groomNickname} & ${data.brideNickname}`}
              location={data.events?.[0]?.location}
            />
          </Reveal>
          <Reveal id="events">
            <EventDetails events={data.events} />
          </Reveal>
          <Reveal>
            <LiveStreaming url={data.livestreamUrl} note={data.livestreamNote} />
          </Reveal>
          <Reveal>
            <DressCode items={data.dressCode} />
          </Reveal>

          <SectionDivider />
          <Reveal id="rsvp">
            <RSVPForm invitationId={data.id ?? data.slug} guestName={guestName} guestId={guestId} />
          </Reveal>

          <SectionDivider />
          <div id="gallery">
            <Reveal>
              <Gallery images={data.galleryImages} variant="grid" />
            </Reveal>
          </div>
          <Gallery images={data.galleryImages} variant="strip" />

          <SectionDivider />
          <Reveal id="gift">
            <WeddingGift accounts={data.bankAccounts} />
          </Reveal>

          <ClosingFooter data={data} />
        </div>
      )}
    </main>
  );
}
