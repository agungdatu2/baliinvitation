"use client";

import { getDict, Lang } from "@/lib/i18n/lume";
import { playBlip } from "../sfx";

interface Zone {
  x: number;
  width: number;
}

// Checkpoint "Spectator Mode" — papan tanda kecil, klik langsung buka link live.
export default function LiveStreamingSign({
  zone,
  url,
  note,
  lang,
}: {
  zone: Zone;
  url?: string;
  note?: string;
  lang?: Lang;
}) {
  if (!url) return null;
  const t = getDict(lang);

  return (
    <div className="absolute bottom-16 flex flex-col items-center" style={{ left: zone.x, width: zone.width }}>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={() => playBlip()}
        className="pixel-border bg-pixel-green text-pixel-bg font-pixel-display text-[9px] uppercase tracking-widest px-4 py-3 text-center max-w-[180px]"
        title={note}
      >
        {t.watchLive}
      </a>
      <div className="w-1.5 h-16 bg-pixel-line-light" />
    </div>
  );
}
