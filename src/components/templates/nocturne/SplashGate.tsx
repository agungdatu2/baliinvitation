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
const DEFAULT_BACKGROUND = "https://picsum.photos/seed/nocturne-gate/1600/1000";

// Gate "Dear, [nama tamu]" — fullscreen fixed overlay (sama seperti Muse,
// karena Nocturne bukan layout split kolom) sampai tombol "Let's Open" ditekan.
// Layout SENGAJA meniru referensi desain client persis (lihat screenshot di
// percakapan): blok judul rata KIRI di area atas (eyebrow -> nama pasangan
// raksasa dipisah "–" bukan "&" -> tanggal rata kanan di bawahnya), lalu blok
// "Dear/nama tamu/tombol" TERPUSAT di area bawah — asimetris, bukan semua
// center seperti SplashGate Muse/Reverie. Tipografi tetap pakai voice Nocturne
// sendiri (font-nocturne-display / Bodoni Moda), bukan font di referensi.
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
      className={`fixed inset-0 z-[9000] overflow-hidden text-groove-bg transition-all duration-500 ease-in animate-fadeIn ${
        closing ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backgroundImage || DEFAULT_BACKGROUND}
        alt=""
        className="absolute inset-0 h-full w-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-groove-stone/55 via-groove-stone/15 to-groove-stone/60 -z-10" />

      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-16 pt-14 md:pt-20 pb-14 md:pb-16">
        {/* Blok judul — rata kiri */}
        <div className="max-w-3xl">
          <p className="font-groove-body text-sm md:text-base text-groove-bg/85">{t.theWeddingOf}</p>
          <h1 className="mt-1 md:mt-2 font-nocturne-display italic text-5xl sm:text-6xl md:text-8xl leading-[0.95]">
            {groomNickname} <span className="text-groove-bg/70">–</span> {brideNickname}
          </h1>
          <p className="mt-4 md:mt-6 font-groove-label text-xs md:text-sm uppercase tracking-[0.15em] text-groove-bg/90 text-right">
            {eventDateLabel}
          </p>
        </div>

        {/* Blok tamu — terpusat */}
        <div className="mx-auto max-w-sm w-full text-center space-y-2">
          <p className="font-nocturne-display italic text-base text-groove-bg/85">{t.dear}</p>
          <p className="font-nocturne-display text-2xl md:text-3xl">{guestName || t.defaultGuestName}</p>
          <p className="font-groove-label text-[11px] text-groove-bg/60 tracking-wide pt-1">{t.misspellingApology}</p>
          <button
            onClick={handleOpen}
            className="mt-4 px-9 py-3.5 rounded-full bg-groove-stone/60 backdrop-blur-sm border border-groove-bg/15 font-groove-label text-sm tracking-wide text-groove-bg hover:bg-groove-stone/75 transition"
          >
            {t.letsOpen}
          </button>
        </div>
      </div>
    </div>
  );
}
