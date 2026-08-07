"use client";

import { useEffect, useState } from "react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import { playSelect } from "../sfx";
import CheckpointModal from "../CheckpointModal";

const TRIGGER_RADIUS = 130;

interface Zone {
  x: number;
  width: number;
}

const HEART_CELLS: [number, number][] = [
  [1, 1], [2, 1], [5, 1], [6, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
  [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
  [2, 5], [3, 5], [4, 5], [5, 5],
  [3, 6], [4, 6],
];

// Checkpoint "Love Story" — satu hati collectible per entri cerita, ter-
// "kumpul" otomatis (sekali, tidak respawn) saat avatar mendekat, membuka
// modal singkat isi cerita.
export default function LoveStoryTrack({
  zone,
  itemWidth,
  avatarX,
  data,
  onModalOpenChange,
}: {
  zone: Zone;
  itemWidth: number;
  avatarX: number;
  data: InvitationData;
  onModalOpenChange: (open: boolean) => void;
}) {
  const t = getDict(data.language);
  const items = data.loveStory ?? [];
  const [collected, setCollected] = useState<Set<number>>(new Set());
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    onModalOpenChange(openIndex !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  useEffect(() => {
    items.forEach((_, i) => {
      const heartX = zone.x + itemWidth * i + itemWidth / 2;
      if (Math.abs(avatarX - heartX) < TRIGGER_RADIUS && !collected.has(i)) {
        playSelect();
        setCollected((prev) => new Set(prev).add(i));
        setOpenIndex(i);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarX]);

  return (
    <div className="absolute bottom-16" style={{ left: zone.x, width: zone.width }}>
      {/* Kafe dekoratif kecil di titik pertama — flavor scenery, non-interaktif */}
      {items.length > 0 && (
        <div className="absolute bottom-0 flex flex-col items-center" style={{ left: itemWidth / 2 - 90 }}>
          <div className="w-16 h-14 bg-pixel-panel pixel-border relative">
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "36px solid transparent",
                borderRight: "36px solid transparent",
                borderBottom: "14px solid #e4364a",
              }}
            />
            <div className="absolute inset-x-3 bottom-0 top-6 bg-pixel-sky-light" />
          </div>
          <p className="font-pixel-display text-[6px] text-pixel-ink/70 uppercase mt-1">CAFE</p>
        </div>
      )}

      {items.map((_, i) => {
        const isCollected = collected.has(i);
        return (
          <svg
            key={i}
            viewBox="0 0 8 8"
            className={`pixel-img absolute bottom-4 w-8 h-8 transition-opacity duration-300 ${
              isCollected ? "opacity-25" : "opacity-100 animate-pulse"
            }`}
            style={{ left: itemWidth * i + itemWidth / 2 - 16 }}
          >
            {HEART_CELLS.map(([x, y], j) => (
              <rect key={j} x={x} y={y} width={1} height={1} fill="#e4364a" />
            ))}
          </svg>
        );
      })}

      {openIndex !== null && items[openIndex] && (
        <CheckpointModal title={`Lv.${openIndex + 1} — ${items[openIndex].title}`} onClose={() => setOpenIndex(null)}>
          <p className="font-pixel-body text-base text-pixel-ink/85 leading-relaxed whitespace-pre-line">
            {items[openIndex].story}
          </p>
          <p className="font-pixel-display text-[8px] text-pixel-green uppercase tracking-widest mt-4">
            {t.pixelQuestLog} +1
          </p>
        </CheckpointModal>
      )}
    </div>
  );
}
