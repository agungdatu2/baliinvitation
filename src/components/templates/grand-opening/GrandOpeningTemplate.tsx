"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { TemplateProps } from "@/types/invitation";
import { getDict } from "@/lib/i18n/grand-opening";
import FixedBackground from "./FixedBackground";
import LoadingReveal from "./LoadingReveal";
import GateScreen from "./GateScreen";
import EventDetails from "./EventDetails";
import RSVPForm from "./RSVPForm";
import ClosingFooter from "./ClosingFooter";
import Reveal from "./Reveal";

const GOLD_GRADIENT = "linear-gradient(135deg, #e8cd8a 0%, #c9a45c 45%, #8a6d2f 100%)";
// Ukuran logo brand client di hero — proporsinya lebih kecil dari gate (lihat
// GateScreen.tsx) karena hero juga punya headline besar di bawahnya.
const HERO_LOGO_SIZE_CLASS: Record<string, string> = {
  small: "w-14 h-14",
  medium: "w-20 h-20",
  large: "w-28 h-28",
};

// Orchestrator tema "Grand Opening" — dipakai untuk acara non-wedding (melaspas,
// grand opening bisnis, dll). Alurnya: loading branded (gaya PageLoader landing,
// bukan progress bar Lume) -> gate nama tamu -> konten (hero, detail acara +
// countdown + maps, ucapan penutup, RSVP + buku tamu).
export default function GrandOpeningTemplate({ data, guestName, guestId }: TemplateProps) {
  // Loading branded (gaya PageLoader landing) selalu tampil di tema ini — beda dari
  // Lume/Muse/Reverie, intro di sini bukan fitur upsell yang di-gate oleh Package.hasIntro.
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = getDict(data.language);

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

  // Pause musik saat tab/window disembunyikan, lanjut lagi begitu balik — sama
  // seperti tema Lume — hanya kalau musik memang lagi dinyalakan user.
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
    <main className="text-groove-bg font-groove-body min-h-screen">
      <FixedBackground
        type={data.backgroundType}
        videoSrc={data.heroVideoUrl}
        imageSrc={data.backgroundImage}
        slideshowImages={data.backgroundSlideshowImages}
        color={data.backgroundColor}
      />

      {loading && <LoadingReveal onComplete={() => setLoading(false)} />}

      {!loading && !opened && (
        <GateScreen
          eventTitle={data.eventTitle}
          hostName={data.hostName}
          hostLogo={data.hostLogo}
          hostLogoSize={data.hostLogoSize}
          guestName={guestName}
          lang={data.language}
          onOpen={handleOpen}
        />
      )}

      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop />}

      {opened && data.musicUrl && (
        <button
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Jeda musik" : "Putar musik"}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-full border border-groove-line-dark bg-groove-stone/70 backdrop-blur text-groove-bg hover:bg-groove-stone transition"
        >
          {musicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        </button>
      )}

      {opened && (
        <div className="animate-fadeIn groove-page-blur">
          {/* Hero — branding besar, bukan duplikat countdown (countdown lengkap
              ada di EventDetails di bawah) */}
          <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24">
            {data.hostLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.hostLogo}
                alt={data.hostName ?? ""}
                className={`${HERO_LOGO_SIZE_CLASS[data.hostLogoSize ?? "medium"]} object-contain mb-6`}
              />
            )}
            <p className="font-groove-label uppercase tracking-[0.3em] text-xs text-groove-primary-light mb-4">
              {t.invitationLabel}
            </p>
            <h1
              className="font-groove-display uppercase text-5xl sm:text-6xl md:text-7xl leading-none mb-4"
              style={{
                fontWeight: 700,
                backgroundImage: GOLD_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              {data.eventTitle}
            </h1>
            {data.hostName && (
              <p className="font-groove-display text-xl sm:text-2xl text-groove-bg" style={{ fontWeight: 500 }}>
                {data.hostName}
              </p>
            )}
          </section>

          {data.greeting && (
            <Reveal>
              <section className="flex flex-col items-center text-center py-16 px-6">
                <p className="font-groove-body text-sm sm:text-base text-groove-bg/80 max-w-xl mx-auto leading-relaxed">
                  {data.greeting}
                </p>
              </section>
            </Reveal>
          )}

          <Reveal>
            <EventDetails events={data.events} title={data.hostName ?? data.eventTitle ?? ""} lang={data.language} />
          </Reveal>

          <Reveal>
            <RSVPForm invitationId={data.id ?? data.slug} guestName={guestName} guestId={guestId} lang={data.language} />
          </Reveal>

          <ClosingFooter data={data} />
        </div>
      )}
    </main>
  );
}
