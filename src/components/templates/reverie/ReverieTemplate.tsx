"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Play, Pause } from "lucide-react";
import { TemplateProps } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import FixedVideoBackground from "./FixedVideoBackground";
import LoadingScreen from "./LoadingScreen";
import SplashGate from "./SplashGate";
import NavMenu from "./NavMenu";
import HeroGreeting from "./HeroGreeting";
import PrayerSection from "./PrayerSection";
import GroomSection from "./GroomSection";
import BrideSection from "./BrideSection";
import SaveTheDateSection from "./SaveTheDateSection";
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
  const [showLoading, setShowLoading] = useState(Boolean(data.hasIntro));
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

  // scroll-snap (Hero -> PrayerSection -> section-section berikutnya) cuma aktif
  // setelah undangan dibuka — sebelum itu (loading/gate) bukan alur multi-section
  // yang perlu snap. Class-nya di-toggle ke <html> karena scroll-snap-type harus
  // dipasang di elemen yang benar-benar scroll (viewport), bukan div wrapper biasa.
  useEffect(() => {
    if (opened) document.documentElement.classList.add("reverie-snap-scroll");
    return () => document.documentElement.classList.remove("reverie-snap-scroll");
  }, [opened]);

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
  // fallback placeholder kalau galeri masih kosong. Placeholder-nya foto
  // siluet pasangan warna hangat golden-hour (Unsplash, resolusi tinggi)
  // supaya lebih related & tidak sekadar foto acak Picsum.
  const stickyPhoto =
    visibleGalleryImages?.find((src) => !/\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(src)) ??
    "https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=1400&q=85";

  return (
    <main className="text-groove-ink font-groove-body">
      <FixedVideoBackground src={data.heroVideoUrl} />

      {/* LoadingScreen tetap fullscreen (bukan bagian kolom split) — baru
          setelah ini selesai, layout split sticky+scrollable mulai tampil,
          termasuk untuk tahap gate "Dear, [nama tamu]" sebelum dibuka. */}
      <AnimatePresence mode="wait">
        {showLoading && (
          <LoadingScreen
            label={t.weddingInvitationLabel}
            loadingText={t.loadingLabel}
            images={visibleGalleryImages}
            onComplete={() => setShowLoading(false)}
          />
        )}
      </AnimatePresence>

      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop />}

      {!showLoading && (
        <div className="animate-fadeIn">
          {opened && (
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
          )}

          {/* Layout desktop dibagi kolom kiri 70% (foto besar sticky mengikuti
              scroll) dan kolom kanan 30% (scroll normal). Berlaku dari tahap
              gate (sebelum dibuka) sampai footer — bukan cuma setelah dibuka —
              supaya panel sticky sudah kelihatan sejak awal. Mobile tetap satu
              kolom penuh (panel sticky disembunyikan). */}
          {/* items-stretch (default) sengaja TIDAK dioverride ke items-start: kolom
              sticky harus ikut meregang setinggi kolom scrollable supaya panel
              sticky di dalamnya (h-screen) punya ruang scroll untuk benar-benar
              "nempel", bukan cuma setinggi 100vh lalu ikut scroll normal. */}
          <div className="md:flex">
            <div className="hidden md:block md:w-[70%]">
              <div className="relative md:sticky md:top-0 md:h-screen overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stickyPhoto} alt="" className="h-full w-full object-cover" />

                {/* Nama mempelai + tombol play/pause lagu latar, overlay di bawah foto sticky. */}
                <div className="absolute inset-x-0 bottom-0 pt-24 pb-10 px-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black/55 via-black/10 to-transparent">
                  <p className="font-reverie-display uppercase tracking-[0.35em] text-sm text-white">
                    {data.groomNickname} &amp; {data.brideNickname}
                  </p>
                  {data.musicUrl && (
                    <button
                      onClick={toggleMusic}
                      aria-label={musicPlaying ? t.pauseMusic : t.playMusic}
                      className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    >
                      {musicPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 fill-current" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="md:w-[30%]">
              {!opened ? (
                <SplashGate
                  groomNickname={data.groomNickname}
                  brideNickname={data.brideNickname}
                  eventDateLabel={eventDateLabel}
                  guestName={guestName}
                  backgroundImage={data.reverieGateImage}
                  lang={data.language}
                  onOpen={handleOpen}
                />
              ) : (
                <>
                  <Reveal id="hero">
                    <HeroGreeting data={data} />
                  </Reveal>

                  {/* Section "Doa" — foto background sendiri (bukan FixedVideoBackground),
                      full-viewport, sengaja DI LUAR .groove-page-blur karena sudah punya
                      foto opaque sendiri (tidak butuh video di belakangnya blur-blur lagi). */}
                  <Reveal>
                    <PrayerSection data={data} />
                  </Reveal>

                  {/* Section "The Groom" & "The Bride" — foto masing-masing full-viewport
                      sendiri, sama pola dengan PrayerSection (di luar .groove-page-blur).
                      Menggantikan CoupleProfile (kartu ganda kecil) sepenuhnya. */}
                  <div id="couple">
                    <Reveal>
                      <GroomSection data={data} />
                    </Reveal>
                    <Reveal>
                      <BrideSection data={data} />
                    </Reveal>
                  </div>

                  {/* Satu wrapper backdrop-blur untuk semua section setelah hero, supaya
                      gate & hero lihat video tajam tapi tidak ada garis putus di antar
                      section (lihat .groove-page-blur di globals.css). */}
                  <div className="groove-page-blur">
                    <Reveal id="save-the-date">
                      <SaveTheDateSection data={data} />
                    </Reveal>

                    <Reveal id="love-story">
                      <LoveStory data={data} />
                    </Reveal>

                    <Reveal id="events">
                      <EventDetails events={data.events} lang={data.language} />
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
