"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { getDict, Lang } from "@/lib/i18n/grand-opening";

const EXIT_DURATION_MS = 600;
const GOLD_GRADIENT = "linear-gradient(135deg, #e8cd8a 0%, #c9a45c 45%, #8a6d2f 100%)";
const LOGO_SIZE_CLASS: Record<string, string> = {
  small: "w-16 h-16",
  medium: "w-24 h-24",
  large: "w-36 h-36",
};

interface Props {
  eventTitle?: string;
  hostName?: string;
  hostLogo?: string;
  hostLogoSize?: string;
  guestName?: string;
  lang?: Lang;
  onOpen: () => void;
}

export default function GateScreen({ eventTitle, hostName, hostLogo, hostLogoSize, guestName, lang, onOpen }: Props) {
  const t = getDict(lang);
  const [closing, setClosing] = useState(false);

  const handleOpen = () => {
    setClosing(true);
    setTimeout(onOpen, EXIT_DURATION_MS);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 py-16 transition-all duration-500 ease-in animate-fadeIn ${
        closing ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 max-w-sm w-full">
        {hostLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hostLogo}
            alt={hostName ?? ""}
            className={`mx-auto mb-6 ${LOGO_SIZE_CLASS[hostLogoSize ?? "medium"]} object-contain`}
          />
        ) : (
          <div className="mx-auto mb-6 w-16 h-16 rounded-full border border-groove-primary-light/50 flex items-center justify-center">
            <span className="font-groove-display text-2xl text-groove-primary-light">
              {(hostName ?? "?").charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <p className="font-groove-label uppercase tracking-[0.3em] text-xs text-groove-bg/60 mb-3">
          {t.invitationLabel}
        </p>
        <h1
          className="font-groove-display uppercase text-4xl sm:text-5xl leading-tight mb-2"
          style={{
            fontWeight: 700,
            backgroundImage: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
        >
          {eventTitle || t.invitationLabel}
        </h1>
        {hostName && (
          <p className="font-groove-body text-sm text-groove-bg/80 tracking-wide">{hostName}</p>
        )}

        <div className="w-12 h-px bg-groove-primary-light/40 mx-auto my-8" />

        <div className="space-y-2.5">
          <p className="font-groove-body text-sm text-groove-bg/70">{t.dear}</p>
          <p className="font-groove-display text-xl text-groove-bg" style={{ fontWeight: 700 }}>
            {guestName || t.defaultGuestName}
          </p>
          <p className="font-groove-label text-[10px] text-groove-bg/45 tracking-wide">{t.misspellingApology}</p>
        </div>

        <button
          onClick={handleOpen}
          className="mt-8 w-full py-3.5 rounded-full text-groove-ink font-groove-label text-xs tracking-widest uppercase hover:opacity-90 transition inline-flex items-center justify-center gap-2"
          style={{ backgroundImage: GOLD_GRADIENT, fontWeight: 700 }}
        >
          <Mail size={14} strokeWidth={2} />
          {t.openInvitation}
        </button>
      </div>
    </div>
  );
}
