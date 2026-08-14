"use client";

import { useState } from "react";
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
const DEFAULT_BACKGROUND = "https://picsum.photos/seed/muse-gate/1600/1000";

// Gate "Dear, [nama tamu]" — TRUE fullscreen overlay (beda dari Reverie yang
// dirender di dalam kolom 30%): foto/latar menutupi seluruh viewport termasuk
// kolom foto sticky di baliknya, sampai lingkaran "Open" ditekan. Layout &
// tipografi meniru referensi: eyebrow italic kecil -> nama pasangan besar ->
// jeda -> "Dear"/nama tamu -> tombol lingkaran.
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
      className={`fixed inset-0 z-[9000] flex flex-col items-center justify-center text-center px-6 text-groove-bg transition-all duration-500 ease-in animate-fadeIn ${
        closing ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backgroundImage || DEFAULT_BACKGROUND}
        alt=""
        className="absolute inset-0 h-full w-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-black/40 -z-10" />

      <div className="relative z-10 max-w-lg w-full px-4">
        <p className="font-reverie-display italic text-base md:text-lg text-groove-bg/80" style={{ fontWeight: 400 }}>
          {t.theWeddingOf}
        </p>
        <h1
          className="mt-3 font-groove-display uppercase text-3xl md:text-5xl tracking-[0.04em]"
          style={{ fontWeight: 600 }}
        >
          {groomNickname} <span className="normal-case text-groove-bg/70">&amp;</span> {brideNickname}
        </h1>
        <p className="mt-3 font-groove-body text-sm text-groove-bg/70">{eventDateLabel}</p>
      </div>

      <div className="relative z-10 mt-16 md:mt-20 max-w-sm w-full px-4 space-y-2">
        <p className="font-reverie-display italic text-base text-groove-bg/80" style={{ fontWeight: 400 }}>
          {t.dear}
        </p>
        <p className="font-groove-display text-xl md:text-2xl" style={{ fontWeight: 500 }}>
          {guestName || t.defaultGuestName}
        </p>
        <p className="font-groove-label text-[11px] text-groove-bg/55 tracking-wide pt-1">{t.misspellingApology}</p>
      </div>

      <button
        onClick={handleOpen}
        className="relative z-10 mt-12 w-24 h-24 md:w-28 md:h-28 rounded-full border border-groove-bg/70 flex items-center justify-center font-groove-label text-xs tracking-widest uppercase hover:bg-groove-bg/10 transition"
      >
        {t.openShort}
      </button>
    </div>
  );
}
