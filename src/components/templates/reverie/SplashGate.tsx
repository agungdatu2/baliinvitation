"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { getDict, Lang } from "@/lib/i18n/lume";

interface Props {
  groomNickname: string;
  brideNickname: string;
  eventDateLabel: string;
  guestName?: string;
  backgroundImage?: string; // foto background gate (Invitation.reverieGateImage) — placeholder kalau kosong
  lang?: Lang;
  onOpen: () => void;
}

const EXIT_DURATION_MS = 600;
const DEFAULT_BACKGROUND = "https://picsum.photos/seed/reverie-gate/900/1600";

// Gate "Dear, [nama tamu]" + tombol buka. Dulu fullscreen fixed overlay
// terpisah; sekarang dirender DI DALAM kolom scrollable (lihat
// ReverieTemplate) supaya panel foto sticky sudah kelihatan sejak tahap ini
// juga, bukan cuma setelah tombol "Let's Open" ditekan. LoadingScreen (tahap
// sebelum ini) dipindah ke ReverieTemplate karena dia tetap harus fullscreen,
// bukan bagian dari kolom split.
export default function SplashGate({
  groomNickname,
  brideNickname,
  eventDateLabel,
  guestName,
  backgroundImage,
  lang,
  onOpen,
}: Props) {
  const t = getDict(lang);
  const [closing, setClosing] = useState(false);

  const handleOpen = () => {
    setClosing(true);
    setTimeout(onOpen, EXIT_DURATION_MS);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-between text-center px-6 py-16 text-groove-bg transition-all duration-500 ease-in animate-fadeIn ${
        closing ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backgroundImage || DEFAULT_BACKGROUND}
        alt=""
        className="absolute inset-0 h-full w-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-groove-stone/35" />

      <div className="relative z-10 px-4 max-w-sm w-full">
        <p className="font-groove-label uppercase tracking-[0.3em] text-xs text-groove-bg/60 mb-4">
          {t.theWeddingOf}
        </p>
        <h1 className="font-reverie-display italic text-5xl mb-2" style={{ fontWeight: 300 }}>
          {groomNickname} <span className="not-italic text-groove-bg/60">&amp;</span> {brideNickname}
        </h1>
        <p className="font-groove-body text-sm text-groove-bg/80">{eventDateLabel}</p>
      </div>

      <div className="relative z-10 px-4 max-w-sm w-full space-y-3">
        <p className="font-groove-body text-sm text-groove-bg/70">{t.dear}</p>
        <p className="font-reverie-display text-xl" style={{ fontWeight: 500 }}>
          {guestName || t.defaultGuestName}
        </p>
        <p className="font-groove-label text-[10px] text-groove-bg/50 tracking-wide">{t.misspellingApology}</p>
        <button
          onClick={handleOpen}
          className="mt-4 w-4/5 mx-auto py-3.5 rounded-full bg-white text-black font-groove-label text-xs tracking-widest uppercase hover:opacity-90 transition inline-flex items-center justify-center gap-2"
        >
          <Mail size={14} strokeWidth={2} />
          {t.letsOpen}
        </button>
      </div>
    </div>
  );
}
