"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { TemplateProps } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import LoadingScreen from "./LoadingScreen";
import SplashGate from "./SplashGate";
import NavMenu from "./NavMenu";
import Hero from "./Hero";
import Verses from "./Verses";
import GroomSection from "./GroomSection";
import BrideSection from "./BrideSection";
import LoveStorySection from "./LoveStorySection";
import LoveStoryList from "./LoveStoryList";

// Tema baru "Nocturne" (dark & moody, layout beda dari Lume/Reverie/Muse) —
// sedang dibangun section per section bareng client. Baru ada LoadingScreen +
// SplashGate + NavMenu + Hero; section lain menyusul satu-satu.
export default function NocturneTemplate({ data, guestName }: TemplateProps) {
  const [showLoading, setShowLoading] = useState(Boolean(data.hasIntro));
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const visibleGalleryImages = data.maxGalleryImages
    ? data.galleryImages.slice(0, data.maxGalleryImages)
    : data.galleryImages;

  const t = getDict(data.language);
  const eventDateLabel = new Date(data.eventDate).toLocaleDateString(t.dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

  // Pause musik saat tab/window disembunyikan, lanjut lagi begitu balik — hanya
  // kalau musik memang lagi dinyalakan user (sama pola dengan Muse/Reverie).
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

  return (
    <main className="min-h-screen bg-groove-stone">
      <AnimatePresence mode="wait">
        {showLoading && (
          <LoadingScreen
            groomNickname={data.groomNickname}
            brideNickname={data.brideNickname}
            images={visibleGalleryImages}
            onComplete={() => setShowLoading(false)}
          />
        )}
      </AnimatePresence>

      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop />}

      {!showLoading && !opened && (
        <SplashGate
          groomNickname={data.groomNickname}
          brideNickname={data.brideNickname}
          eventDateLabel={eventDateLabel}
          guestName={guestName}
          backgroundImage={data.reverieGateImage}
          lang={data.language}
          onOpen={handleOpen}
        />
      )}

      {!showLoading && opened && (
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

          <Hero data={data} />
          <Verses data={data} />
          <GroomSection data={data} />
          <BrideSection data={data} />
          <LoveStorySection data={data} />
          <LoveStoryList data={data} />
        </div>
      )}
    </main>
  );
}
