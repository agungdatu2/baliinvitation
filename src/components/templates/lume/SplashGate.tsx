"use client";

import { useEffect, useState } from "react";
import HeroVideoBackground from "./HeroVideoBackground";

interface Props {
  groomNickname: string;
  brideNickname: string;
  eventDateLabel: string;
  guestName?: string;
  heroVideoUrl?: string;
  onOpen: () => void;
}

const EXIT_DURATION_MS = 600;

// Gate video-hero: nama tamu personal + tombol buka, di atas video venue (atau
// placeholder). Menggantikan gaya cover-cream-minimalis versi sebelumnya.
export default function SplashGate({ groomNickname, brideNickname, eventDateLabel, guestName, heroVideoUrl, onOpen }: Props) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setLoaded(true);
          return 100;
        }
        return p + 4;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setClosing(true);
    setTimeout(onOpen, EXIT_DURATION_MS);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 text-groove-bg transition-all duration-500 ease-in ${
        closing ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      <HeroVideoBackground src={heroVideoUrl} />

      <span aria-hidden="true" className="absolute top-6 left-6 w-8 h-8 border-t border-l border-groove-clay-light/60 z-10" />
      <span aria-hidden="true" className="absolute top-6 right-6 w-8 h-8 border-t border-r border-groove-clay-light/60 z-10" />
      <span aria-hidden="true" className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-groove-clay-light/60 z-10" />
      <span aria-hidden="true" className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-groove-clay-light/60 z-10" />

      <div className="relative z-10">
        <p className="uppercase tracking-[0.3em] text-xs text-groove-clay-light mb-4">The Wedding Of</p>
        <h1 className="font-groove-display italic text-5xl mb-2" style={{ fontWeight: 500 }}>
          {groomNickname} <span className="not-italic text-groove-clay-light">&amp;</span> {brideNickname}
        </h1>

        {!loaded ? (
          <div className="mt-8 w-40 mx-auto">
            <p className="text-sm text-groove-bg/70 mb-2 tabular-nums">{progress}%</p>
            <div className="h-px bg-groove-line-dark overflow-hidden">
              <div className="h-full bg-groove-clay-light transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-3 animate-fadeIn">
            <p className="text-sm text-groove-bg/80">{eventDateLabel}</p>
            <p className="text-sm text-groove-bg/60">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="font-groove-display font-semibold text-lg">{guestName || "Tamu Undangan"}</p>
            <p className="text-xs text-groove-bg/50 italic">*Mohon maaf apabila ada kesalahan penulisan nama/gelar</p>
            <button
              onClick={handleOpen}
              className="mt-4 px-8 py-2 rounded-full border border-groove-bg text-groove-bg hover:bg-groove-bg hover:text-groove-stone transition text-sm tracking-wider uppercase"
            >
              Buka Undangan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
