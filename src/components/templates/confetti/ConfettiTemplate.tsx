"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Pause, Play } from "lucide-react";
import { TemplateProps } from "@/types/invitation";
import GateScreen from "./GateScreen";
import Hero from "./Hero";
import EventDetails from "./EventDetails";
import Gallery from "./Gallery";
import RSVPForm from "./RSVPForm";
import ClosingFooter from "./ClosingFooter";

// Tema "Confetti" — ulang tahun anak (kategori "ulang-tahun"): ceria, pastel,
// konfeti. Alur: gate (cover) -> hero -> detail acara + countdown -> galeri
// polaroid -> RSVP & ucapan -> penutup. Memakai field non-wedding generik:
// hostName = nama anak, eventTitle = judul/usia ("Ulang Tahun ke-1"),
// greeting = kata pengantar, quote = tanda tangan orang tua.
export default function ConfettiTemplate({ data, guestName, guestId }: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const visibleGalleryImages = data.maxGalleryImages ? data.galleryImages.slice(0, data.maxGalleryImages) : data.galleryImages;

  const handleOpen = () => {
    setOpened(true);
    audioRef.current?.play().then(() => setMusicPlaying(true)).catch(() => {});
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setMusicPlaying(true)).catch(() => {});
    else {
      audio.pause();
      setMusicPlaying(false);
    }
  };

  // Jeda musik saat tab disembunyikan, lanjut lagi kalau tadi memang menyala.
  useEffect(() => {
    const pause = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) audio.pause();
    };
    const resume = () => {
      const audio = audioRef.current;
      if (audio && musicPlaying && audio.paused) audio.play().catch(() => {});
    };
    const onVisibility = () => (document.hidden ? pause() : resume());
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [musicPlaying]);

  return (
    <main className="min-h-screen bg-confetti-cream font-groove-body text-confetti-ink">
      <AnimatePresence>{!opened && <GateScreen key="gate" data={data} guestName={guestName} onOpen={handleOpen} />}</AnimatePresence>

      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop />}
      {opened && data.musicUrl && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Pause music" : "Play music"}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-confetti-pink text-confetti-ink shadow-lg"
        >
          {musicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        </button>
      )}

      {opened && (
        <div className="animate-fadeIn">
          <Hero data={data} />
          <EventDetails data={data} />
          <Gallery data={data} images={visibleGalleryImages} />
          <RSVPForm invitationId={data.id ?? data.slug} guestName={guestName} guestId={guestId} lang={data.language} />
          <ClosingFooter data={data} />
        </div>
      )}
    </main>
  );
}
