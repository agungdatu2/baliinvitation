"use client";

import { useEffect, useState } from "react";

interface Props {
  groomNickname: string;
  brideNickname: string;
  eventDateLabel: string;
  guestName?: string;
  onOpen: () => void;
}

const EXIT_DURATION_MS = 600;

// Gate transparan di atas video-hero yang fixed di belakang seluruh halaman
// (lihat FixedVideoBackground/LumeTemplate) — nama tamu personal + tombol buka.
export default function SplashGate({ groomNickname, brideNickname, eventDateLabel, guestName, onOpen }: Props) {
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
      <div className="absolute inset-0 bg-gradient-to-b from-groove-stone/10 via-groove-stone/20 to-groove-stone/45" />

      <span aria-hidden="true" className="absolute top-6 left-6 w-8 h-8 border-t border-l border-groove-primary-light/60 z-10" />
      <span aria-hidden="true" className="absolute top-6 right-6 w-8 h-8 border-t border-r border-groove-primary-light/60 z-10" />
      <span aria-hidden="true" className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-groove-primary-light/60 z-10" />
      <span aria-hidden="true" className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-groove-primary-light/60 z-10" />

      <div className="relative z-10 groove-glass-dark rounded-2xl px-8 py-10 md:px-14 md:py-14 mx-4">
        <p className="font-groove-label uppercase tracking-[0.3em] text-xs text-groove-primary-light mb-4">We Invite You To Celebrate</p>
        <h1 className="font-groove-display italic text-5xl mb-2" style={{ fontWeight: 400 }}>
          {groomNickname} <span className="not-italic text-groove-primary-light">&amp;</span> {brideNickname}
        </h1>

        {!loaded ? (
          <div className="mt-8 w-40 mx-auto">
            <p className="font-groove-label text-sm text-groove-bg/70 mb-2 tabular-nums">{progress}%</p>
            <div className="h-px bg-groove-line-dark overflow-hidden">
              <div className="h-full bg-groove-primary-light transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-3 animate-fadeIn">
            <p className="font-groove-body italic text-sm text-groove-bg/80">{eventDateLabel}</p>
            <p className="font-groove-body text-sm text-groove-bg/60 mt-4">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="font-groove-display text-xl" style={{ fontWeight: 700 }}>
              {guestName || "Tamu Undangan"}
            </p>
            <p className="font-groove-label text-[10px] text-groove-bg/50 tracking-wide">
              *Mohon maaf apabila ada kesalahan penulisan nama/gelar
            </p>
            <button
              onClick={handleOpen}
              className="mt-4 w-full py-3.5 rounded-full bg-groove-primary text-groove-bg font-groove-label text-xs tracking-widest uppercase hover:opacity-90 transition"
            >
              Buka Undangan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
