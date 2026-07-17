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

// Orchestrator utama tema "Reverie" — diturunkan (duplikat) dari "Lume", lalu
// diubah section demi section sesuai arahan. Semua data & gambar 100% dinamis
// dari `data` (hasil input Form Admin), bukan hardcode.
export default function ReverieTemplate({ data, guestName, guestId }: TemplateProps) {
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

  // Foto besar di panel sticky kanan (desktop) — foto pertama yang bukan video,
  // fallback placeholder kalau galeri masih kosong.
  const stickyPhoto =
    visibleGalleryImages?.find((src) => !/\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(src)) ??
    "https://picsum.photos/seed/reverie-sticky/900/1400";

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
          />

          {/* Dari sini (Hero dst) layout desktop dibagi kolom kiri 65% (foto
              besar sticky mengikuti scroll) dan kolom kanan 35% (scroll
              normal, berisi section-section yang sudah ada). Mobile tetap
              satu kolom penuh seperti sebelumnya (panel sticky disembunyikan,
              dan karena cuma satu yang tampil, urutan DOM kolom kanan duluan
              tidak berpengaruh ke mobile). */}
          {/* items-stretch (default) sengaja TIDAK dioverride ke items-start: kolom
              sticky harus ikut meregang setinggi kolom scrollable supaya panel
              sticky di dalamnya (h-screen) punya ruang scroll untuk benar-benar
              "nempel", bukan cuma setinggi 100vh lalu ikut scroll normal. */}
          <div className="md:flex">
            <div className="hidden md:block md:w-[65%]">
              <div className="md:sticky md:top-0 md:h-screen overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stickyPhoto} alt="" className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="md:w-[35%]">
              <div id="hero">
                <HeroGreeting data={data} />
              </div>

              {/* Satu wrapper backdrop-blur untuk semua section setelah hero, supaya
                  gate & hero lihat video tajam tapi tidak ada garis putus di antar
                  section (lihat .groove-page-blur di globals.css). */}
              <div className="groove-page-blur">
                <Reveal id="couple">
                  <CoupleProfile data={data} />
                </Reveal>

                <Reveal id="love-story">
                  <LoveStory data={data} />
                </Reveal>

                <Reveal id="events">
                  <EventDetails
                    events={data.events}
                    title={`${data.groomNickname} & ${data.brideNickname}`}
                    lang={data.language}
                  />
                </Reveal>
                <Reveal>
                  <LiveStreaming url={data.livestreamUrl} note={data.livestreamNote} lang={data.language} />
                </Reveal>
                <Reveal>
                  <DressCode items={data.dressCode} lang={data.language} />
                </Reveal>

                <Reveal id="rsvp">
                  <RSVPForm
                    invitationId={data.id ?? data.slug}
                    guestName={guestName}
                    guestId={guestId}
                    lang={data.language}
                  />
                </Reveal>

                <div id="gallery">
                  <Reveal>
                    <Gallery images={visibleGalleryImages} lang={data.language} />
                  </Reveal>
                </div>

                <Reveal id="gift">
                  <WeddingGift
                    accounts={data.bankAccounts}
                    image={visibleGalleryImages?.find((src) => !/\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(src))}
                    lang={data.language}
                  />
                </Reveal>

                <ClosingFooter data={data} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
