"use client";

import { getDict, Lang } from "@/lib/i18n/lume";
import type { Zone } from "../GameWorld";

const TRIGGER_RADIUS = 260;

// Checkpoint "Doa" — bubble dialog RPG muncul otomatis saat avatar mendekat,
// hilang lagi saat menjauh (re-arm, bukan modal supaya tidak perlu ditutup manual).
export default function TempleCheckpoint({ zone, avatarX, lang }: { zone: Zone; avatarX: number; lang?: Lang }) {
  const t = getDict(lang);
  const center = zone.x + zone.width / 2;
  const active = Math.abs(avatarX - center) < TRIGGER_RADIUS;

  return (
    <div className="absolute bottom-16" style={{ left: zone.x, width: zone.width }}>
      <div className="relative flex flex-col items-center" style={{ marginLeft: zone.width / 2 - 60 }}>
        {active && (
          <div className="absolute bottom-[92px] w-64 -translate-x-1/2 left-1/2 pixel-border bg-pixel-panel p-3 animate-fadeIn">
            <p className="font-pixel-display text-[8px] text-pixel-yellow uppercase tracking-widest mb-1.5">
              {t.prayerLabel}
            </p>
            <p className="font-pixel-body text-sm text-pixel-ink/90 leading-relaxed">{t.defaultPrayerQuote}</p>
          </div>
        )}
        {/* Temple — bangunan pixel sederhana (kotak + atap segitiga) */}
        <div className="w-24 h-20 bg-pixel-panel pixel-border relative">
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: "50px solid transparent",
              borderRight: "50px solid transparent",
              borderBottom: "24px solid #4a4a6a",
            }}
          />
          <div className="absolute inset-x-3 bottom-0 top-6 bg-pixel-bg" />
        </div>
      </div>
    </div>
  );
}
