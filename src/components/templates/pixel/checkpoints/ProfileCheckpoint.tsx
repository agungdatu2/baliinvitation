"use client";

import { useEffect, useState } from "react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import { playSelect } from "../sfx";
import CheckpointModal from "../CheckpointModal";

const TRIGGER_RADIUS = 220;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface Zone {
  x: number;
  width: number;
}

// Checkpoint "Character Select" — dua figure (groom/bride) berjajar, muncul
// stat-bar mengambang saat avatar dekat, klik figure untuk modal profil penuh.
export default function ProfileCheckpoint({
  zone,
  avatarX,
  data,
  onModalOpenChange,
}: {
  zone: Zone;
  avatarX: number;
  data: InvitationData;
  onModalOpenChange: (open: boolean) => void;
}) {
  const t = getDict(data.language);
  const half = zone.width / 2;
  const groomX = zone.x + half / 2;
  const brideX = zone.x + half + half / 2;
  const [openWho, setOpenWho] = useState<"groom" | "bride" | null>(null);

  useEffect(() => {
    onModalOpenChange(openWho !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openWho]);

  const groomActive = Math.abs(avatarX - groomX) < TRIGGER_RADIUS;
  const brideActive = Math.abs(avatarX - brideX) < TRIGGER_RADIUS;

  return (
    <div className="absolute bottom-16" style={{ left: zone.x, width: zone.width }}>
      <Figure
        x={groomX - zone.x}
        active={groomActive}
        label={t.pixelPlayer1}
        name={data.groomNickname}
        color="#3b8ef2"
        onClick={() => {
          playSelect();
          setOpenWho("groom");
        }}
      />
      <Figure
        x={brideX - zone.x}
        active={brideActive}
        label={t.pixelPlayer2}
        name={data.brideNickname}
        color="#e4364a"
        onClick={() => {
          playSelect();
          setOpenWho("bride");
        }}
      />

      {openWho && (
        <CheckpointModal title={openWho === "groom" ? t.theGroom : t.theBride} onClose={() => setOpenWho(null)}>
          <div className="text-center">
            <div className="w-full max-w-[220px] aspect-[4/5] overflow-hidden pixel-border mx-auto mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  (openWho === "groom" ? data.groomPhoto : data.bridePhoto) ||
                  `https://picsum.photos/seed/pixel-${openWho}/480/600`
                }
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-pixel-body text-2xl mb-2">
              {openWho === "groom" ? data.groomFullName : data.brideFullName}
            </h3>
            <p className="font-pixel-display text-[8px] uppercase tracking-widest text-pixel-ink/60 mb-1">
              {openWho === "groom" ? t.sonOf : t.daughterOf}
            </p>
            <p className="font-pixel-body text-base text-pixel-ink/80 mb-4">
              {openWho === "groom" ? data.groomParents : data.brideParents}
            </p>
            {(openWho === "groom" ? data.groomInstagram : data.brideInstagram) && (
              <a
                href={`https://instagram.com/${(openWho === "groom" ? data.groomInstagram : data.brideInstagram)!.replace("@", "")}`}
                target="_blank"
                className="inline-flex items-center gap-2 font-pixel-display text-[9px] uppercase tracking-wide bg-pixel-bg pixel-border px-4 py-2"
              >
                <InstagramIcon className="h-3.5 w-3.5" /> {openWho === "groom" ? data.groomNickname : data.brideNickname}
              </a>
            )}
          </div>
        </CheckpointModal>
      )}
    </div>
  );
}

function Figure({
  x,
  active,
  label,
  name,
  color,
  onClick,
}: {
  x: number;
  active: boolean;
  label: string;
  name: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-0 flex flex-col items-center"
      style={{ left: x - 24 }}
    >
      {active && (
        <div className="mb-2 pixel-border bg-pixel-panel px-2 py-1 whitespace-nowrap">
          <p className="font-pixel-display text-[7px] text-pixel-yellow uppercase">{label}</p>
          <div className="w-16 h-1.5 bg-pixel-bg mt-1 pixel-border">
            <div className="h-full" style={{ width: "100%", backgroundColor: color }} />
          </div>
        </div>
      )}
      <div className="w-12 h-16 pixel-border" style={{ backgroundColor: color }} />
      <p className="font-pixel-display text-[7px] text-pixel-ink/70 uppercase mt-1">{name}</p>
    </button>
  );
}
