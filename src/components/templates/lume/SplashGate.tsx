"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Mail } from "lucide-react";
import LoadingScreen from "./LoadingScreen";

interface Props {
  groomNickname: string;
  brideNickname: string;
  eventDateLabel: string;
  guestName?: string;
  images?: string[];
  onOpen: () => void;
}

const EXIT_DURATION_MS = 600;

// Tahap 1: LoadingScreen (fullscreen takeover, kata bergantian + counter 0-100).
// Tahap 2 (setelah loading selesai): gate video-hero dengan nama tamu personal +
// tombol buka, di atas video yang fixed di belakang seluruh halaman
// (lihat FixedVideoBackground/LumeTemplate).
export default function SplashGate({ groomNickname, brideNickname, eventDateLabel, guestName, images, onOpen }: Props) {
  const [showLoading, setShowLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  const handleOpen = () => {
    setClosing(true);
    setTimeout(onOpen, EXIT_DURATION_MS);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && (
          <LoadingScreen
            label="Undangan Pernikahan"
            words={[groomNickname, "&", brideNickname]}
            images={images}
            onComplete={() => setShowLoading(false)}
          />
        )}
      </AnimatePresence>

      {!showLoading && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-between text-center px-6 py-16 md:py-20 text-groove-bg transition-all duration-500 ease-in animate-fadeIn ${
            closing ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        >
          <div className="absolute inset-0 bg-groove-stone/35" />

          <div className="relative z-10 px-8 md:px-14 max-w-sm w-full">
            <p className="font-groove-label uppercase tracking-[0.3em] text-xs text-groove-bg/60 mb-4">
              The Wedding of
            </p>
            <h1 className="font-groove-display italic text-5xl mb-2" style={{ fontWeight: 400 }}>
              {groomNickname} <span className="not-italic text-groove-bg/60">&amp;</span> {brideNickname}
            </h1>
            <p className="font-groove-body text-sm text-groove-bg/80">{eventDateLabel}</p>
          </div>

          <div className="relative z-10 px-8 md:px-14 max-w-sm w-full space-y-3">
            <p className="font-groove-body text-sm text-groove-bg/70">Dear,</p>
            <p className="font-groove-display text-xl" style={{ fontWeight: 700 }}>
              {guestName || "Tamu Undangan"}
            </p>
            <p className="font-groove-label text-[10px] text-groove-bg/50 tracking-wide">
              We apologize if there is any misspelling of name or title
            </p>
            <button
              onClick={handleOpen}
              className="mt-4 w-full py-3.5 rounded-full bg-groove-primary text-groove-bg font-groove-label text-xs tracking-widest uppercase hover:opacity-90 transition inline-flex items-center justify-center gap-2"
            >
              <Mail size={14} strokeWidth={2} />
              Let&apos;s Open
            </button>
          </div>
        </div>
      )}
    </>
  );
}
