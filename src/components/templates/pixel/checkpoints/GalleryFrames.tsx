"use client";

import { useEffect, useState } from "react";
import { getDict, Lang } from "@/lib/i18n/lume";
import { playBlip } from "../sfx";

interface Zone {
  x: number;
  width: number;
}

// Checkpoint "Screenshots" — pigura foto berjajar, klik untuk lightbox
// (prev/next di antar foto), bukan proximity (supaya tamu sengaja klik).
export default function GalleryFrames({
  zone,
  itemWidth,
  images,
  lang,
  onModalOpenChange,
}: {
  zone: Zone;
  itemWidth: number;
  images: string[];
  lang?: Lang;
  onModalOpenChange: (open: boolean) => void;
}) {
  if (!images?.length) return null;
  const t = getDict(lang);
  const shown = images.slice(0, 10);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    onModalOpenChange(index !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const isVideo = (src: string) => /\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(src);

  return (
    <div className="absolute bottom-16" style={{ left: zone.x, width: zone.width }}>
      <p className="absolute -top-10 font-pixel-display text-[9px] text-pixel-yellow uppercase tracking-widest">
        {t.pixelScreenshots}
      </p>
      {shown.map((src, i) => (
        <button
          key={i}
          onClick={() => {
            playBlip();
            setIndex(i);
          }}
          className="absolute bottom-0 w-24 h-28 pixel-border bg-pixel-panel overflow-hidden"
          style={{ left: itemWidth * i + (itemWidth - 96) / 2 }}
        >
          {isVideo(src) ? (
            <video src={src} className="w-full h-full object-cover" muted />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={src} alt={`gallery-${i}`} className="w-full h-full object-cover" />
          )}
        </button>
      ))}

      {index !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center animate-fadeIn"
          onClick={() => setIndex(null)}
        >
          <button
            onClick={() => setIndex(null)}
            className="absolute top-4 right-4 text-pixel-ink text-2xl font-pixel-display"
          >
            &times;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playBlip();
              setIndex((i) => (i! - 1 + shown.length) % shown.length);
            }}
            className="absolute left-4 text-pixel-ink text-2xl px-2 font-pixel-display"
          >
            &#8249;
          </button>
          <div className="relative w-full h-full max-w-xl max-h-[80vh] mx-10" onClick={(e) => e.stopPropagation()}>
            {isVideo(shown[index]) ? (
              <video src={shown[index]} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={shown[index]} alt="" className="w-full h-full object-contain" />
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playBlip();
              setIndex((i) => (i! + 1) % shown.length);
            }}
            className="absolute right-4 text-pixel-ink text-2xl px-2 font-pixel-display"
          >
            &#8250;
          </button>
          <p className="absolute bottom-4 text-pixel-ink/70 text-xs font-pixel-display">
            {index + 1} / {shown.length}
          </p>
        </div>
      )}
    </div>
  );
}
