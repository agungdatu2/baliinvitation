"use client";

import { useState } from "react";
import { getDict, Lang } from "@/lib/i18n/lume";
import { playBlip, setSfxMuted } from "./sfx";
import type { Zone } from "./GameWorld";

const ZONE_LABEL_KEY: Record<string, keyof ReturnType<typeof getDict>> = {
  hero: "navHome",
  doa: "prayerLabel",
  profile: "navProfile",
  countdown: "saveTheDate",
  loveStory: "navLoveStory",
  venue: "navWeddingEvent",
  liveStreaming: "liveStreamingTitle",
  gift: "navWeddingGift",
  gallery: "navGallery",
  dressCode: "dresscode",
  rsvp: "navRsvp",
  closing: "thankYou",
};

// Burger "Quick Info" — daftar zona untuk teleport avatar (loncat langsung ke
// checkpoint terkait, tanpa perlu jalan manual), plus toggle BGM/SFX.
export default function NavMenu({
  lang,
  zones,
  hasMusic,
  musicPlaying,
  onToggleMusic,
  onTeleport,
}: {
  lang?: Lang;
  zones: Zone[];
  hasMusic: boolean;
  musicPlaying: boolean;
  onToggleMusic: () => void;
  onTeleport: (zoneKey: string) => void;
}) {
  const t = getDict(lang);
  const [open, setOpen] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);

  const toggleSfx = () => {
    const next = !sfxOn;
    setSfxOn(next);
    setSfxMuted(!next);
    if (next) playBlip();
  };

  return (
    <>
      <button
        onClick={() => {
          playBlip();
          setOpen((v) => !v);
        }}
        className="fixed top-4 right-4 z-50 pixel-border bg-pixel-panel text-pixel-ink font-pixel-display text-[9px] uppercase tracking-widest px-3 py-2"
      >
        {open ? t.close : `☰ ${t.pixelQuickInfo}`}
      </button>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 z-40 h-full w-full sm:w-[340px] bg-pixel-bg border-l-4 border-pixel-line shadow-2xl transition-transform duration-300 ease-out flex flex-col gap-1 p-6 pt-20 overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <p className="font-pixel-display text-[10px] text-pixel-yellow uppercase tracking-widest mb-3">
          {t.pixelQuickInfo}
        </p>
        {zones.map((z) => (
          <button
            key={z.key}
            onClick={() => {
              playBlip();
              onTeleport(z.key);
              setOpen(false);
            }}
            className="text-left font-pixel-body text-lg text-pixel-ink hover:text-pixel-yellow transition-colors py-1"
          >
            <span className="text-pixel-red">&gt;</span> {t[ZONE_LABEL_KEY[z.key] ?? "navHome"]}
          </button>
        ))}

        {hasMusic && (
          <button
            onClick={() => {
              playBlip();
              onToggleMusic();
            }}
            className="mt-4 pixel-border bg-pixel-panel text-pixel-ink font-pixel-display text-[9px] uppercase tracking-widest px-3 py-2.5"
          >
            {musicPlaying ? t.pixelBgmOn : t.pixelBgmOff}
          </button>
        )}
        <button
          onClick={toggleSfx}
          className="mt-2 pixel-border bg-pixel-panel text-pixel-ink font-pixel-display text-[9px] uppercase tracking-widest px-3 py-2.5"
        >
          {sfxOn ? t.pixelSfxOn : t.pixelSfxOff}
        </button>
      </div>
    </>
  );
}
