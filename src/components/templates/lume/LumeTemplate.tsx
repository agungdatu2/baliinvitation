"use client";

import { useEffect, useRef, useState } from "react";
import { TemplateProps } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import FixedVideoBackground from "./FixedVideoBackground";
import SplashGate from "./SplashGate";
import NavMenu from "./NavMenu";
import HeroGreeting from "./HeroGreeting";
import CoupleProfile from "./CoupleProfile";
import LoveStory from "./LoveStory";
import Gallery from "./Gallery";
import EventDetails from "./EventDetails";
import LiveStreaming from "./LiveStreaming";
import DressCode from "./DressCode";
import RSVPForm from "./RSVPForm";
import WeddingGift from "./WeddingGift";
import ClosingFooter from "./ClosingFooter";
import Reveal from "./Reveal";

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

  // Pause musik saat tab/window disembunyikan (pindah tab, minimize, atau pindah
  // ke app lain), lanjut lagi begitu balik — hanya kalau musik memang lagi
  // dinyalakan user (musicPlaying), bukan resume paksa kalau user sendiri yang
  // pause. visibilitychange sudah cover tab-switch & minimize; window blur/focus
  // dipasang juga sebagai fallback untuk kasus pindah app yang kadang tidak selalu
  // memicu visibilitychange di semua browser/OS.
  useEffect(() => {
    const pauseIfPlaying = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) audio.pause();
    };
    const resumeIfWasPlaying = () => {
      const audio = audioRef.current;
      if (audio && musicPlaying && audio.paused) audio.play().catch(() => {});
    };
    const handleVisibility = () => (document.hidden ? pauseIfPlaying() : resumeIfWasPlaying());

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", pauseIfPlaying);
    window.addEventListener("focus", resumeIfWasPlaying);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", pauseIfPlaying);
      window.removeEventListener("focus", resumeIfWasPlaying);
    };
  }, [musicPlaying]);

  // Section yang di-hide client dari admin dashboard (lihat HIDEABLE_SECTIONS_BY_TEMPLATE)
  // — hero & footer sengaja tidak bisa di-hide, jadi tidak dicek di sini.
  const hidden = new Set(data.hiddenSections ?? []);

  const t = getDict(data.language);
  const eventDateLabel = new Date(data.eventDate).toLocaleDateString(t.dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Batas galeri dari paket (kalau ada) berlaku konsisten di ring foto splash,
  // section Gallery, dan foto WeddingGift — semua pakai array yang sama.
  const visibleGalleryImages = data.maxGalleryImages
    ? data.galleryImages.slice(0, data.maxGalleryImages)
    : data.galleryImages;

  return (
    <main className="text-groove-ink font-groove-body">
      <FixedVideoBackground src={data.heroVideoUrl} />

      {!opened && (
        <SplashGate
          groomNickname={data.groomNickname}
          brideNickname={data.brideNickname}
          eventDateLabel={eventDateLabel}
          guestName={guestName}
          images={visibleGalleryImages}
          showIntro={data.hasIntro}
          lang={data.language}
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
            lang={data.language}
            hiddenSections={data.hiddenSections}
          />

          <div id="hero">
            <HeroGreeting data={data} />
          </div>

          {/* Satu wrapper backdrop-blur untuk semua section setelah hero, supaya
              gate & hero lihat video tajam tapi tidak ada garis putus di antar
              section (lihat .groove-page-blur di globals.css). */}
          <div className="groove-page-blur">
            {!hidden.has("couple") && (
              <Reveal id="couple">
                <CoupleProfile data={data} />
              </Reveal>
            )}

            {!hidden.has("loveStory") && (
              <Reveal id="love-story">
                <LoveStory data={data} />
              </Reveal>
            )}

            {!hidden.has("events") && (
              <Reveal id="events">
                <EventDetails
                  events={data.events}
                  title={`${data.groomNickname} & ${data.brideNickname}`}
                  lang={data.language}
                />
              </Reveal>
            )}
            {!hidden.has("liveStreaming") && (
              <Reveal>
                <LiveStreaming url={data.livestreamUrl} note={data.livestreamNote} lang={data.language} />
              </Reveal>
            )}
            {!hidden.has("dressCode") && (
              <Reveal>
                <DressCode items={data.dressCode} lang={data.language} />
              </Reveal>
            )}

            {!hidden.has("rsvp") && (
              <Reveal id="rsvp">
                <RSVPForm
                  invitationId={data.id ?? data.slug}
                  guestName={guestName}
                  guestId={guestId}
                  lang={data.language}
                />
              </Reveal>
            )}

            {!hidden.has("gallery") && (
              <div id="gallery">
                <Reveal>
                  <Gallery images={visibleGalleryImages} lang={data.language} />
                </Reveal>
              </div>
            )}

            {!hidden.has("gift") && (
              <Reveal id="gift">
                <WeddingGift
                  accounts={data.bankAccounts}
                  image={visibleGalleryImages?.find((src) => !/\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(src))}
                  lang={data.language}
                />
              </Reveal>
            )}

            <ClosingFooter data={data} />
          </div>
        </div>
      )}
    </main>
  );
}
