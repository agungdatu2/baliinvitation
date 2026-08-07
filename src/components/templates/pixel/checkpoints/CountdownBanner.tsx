"use client";

import { useEffect, useState } from "react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const TRIGGER_RADIUS = 300;

interface Zone {
  x: number;
  width: number;
}

function getTimeParts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

// Checkpoint "Countdown" — banner naik dari tanah saat avatar mendekat,
// angka countdown ditampilkan langsung di dunia (bukan modal).
export default function CountdownBanner({ zone, avatarX, data }: { zone: Zone; avatarX: number; data: InvitationData }) {
  const t = getDict(data.language);
  const center = zone.x + zone.width / 2;
  const active = Math.abs(avatarX - center) < TRIGGER_RADIUS;
  const target = new Date(data.eventDate);
  const [parts, setParts] = useState(() => getTimeParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(getTimeParts(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.eventDate]);

  return (
    <div className="absolute bottom-16 flex flex-col items-center" style={{ left: zone.x, width: zone.width }}>
      <div
        className={`pixel-border-thick bg-pixel-panel px-5 py-4 transition-all duration-500 ${
          active ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4"
        }`}
      >
        <p className="font-pixel-display text-[9px] text-pixel-yellow uppercase tracking-widest text-center mb-3">
          {t.saveTheDateHeading}
        </p>
        <div className="flex gap-3">
          {[
            [t.days, parts.d],
            [t.hours, parts.h],
            [t.minutes, parts.m],
            [t.seconds, parts.s],
          ].map(([label, value]) => (
            <div key={label as string} className="text-center pixel-border bg-pixel-bg px-2 py-1.5">
              <div className="font-pixel-display text-sm tabular-nums text-pixel-yellow">
                {String(value).padStart(2, "0")}
              </div>
              <div className="font-pixel-display text-[6px] uppercase tracking-widest text-pixel-ink/60 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Tiang bendera */}
      <div className="w-1.5 h-16 bg-pixel-line-light" />
    </div>
  );
}
