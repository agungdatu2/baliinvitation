"use client";

import { useEffect, useState } from "react";
import { DressCodeItem } from "@/types/invitation";
import { getDict, Lang } from "@/lib/i18n/lume";
import { playSelect } from "../sfx";
import CheckpointModal from "../CheckpointModal";

interface Zone {
  x: number;
  width: number;
}

// Checkpoint "Dress Code" — hanger pixel, klik untuk modal palet warna.
export default function DressCodeHanger({
  zone,
  items,
  lang,
  onModalOpenChange,
}: {
  zone: Zone;
  items: DressCodeItem[];
  lang?: Lang;
  onModalOpenChange: (open: boolean) => void;
}) {
  if (!items?.length) return null;
  const t = getDict(lang);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onModalOpenChange(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="absolute bottom-16 flex flex-col items-center" style={{ left: zone.x, width: zone.width }}>
      <button
        onClick={() => {
          playSelect();
          setOpen(true);
        }}
        className="flex flex-col items-center gap-2"
      >
        <div className="w-1 h-10 bg-pixel-line-light" />
        <div className="flex gap-1">
          {items.slice(0, 4).map((it, i) => (
            <div key={i} className="w-6 h-10 pixel-border" style={{ backgroundColor: it.hex }} />
          ))}
        </div>
        <p className="font-pixel-display text-[7px] text-pixel-ink/80 uppercase mt-1">{t.dresscode}</p>
      </button>

      {open && (
        <CheckpointModal title={t.dresscode} onClose={() => setOpen(false)}>
          <p className="font-pixel-body text-base text-pixel-ink/80 mb-4">{t.dresscodeNote}</p>
          <div className="grid grid-cols-3 gap-2">
            {items.map((it, i) => (
              <div key={i} className="text-center">
                <div className="aspect-square pixel-border" style={{ backgroundColor: it.hex }} />
                <p className="font-pixel-display text-[7px] text-pixel-ink/70 uppercase mt-1">{it.label}</p>
              </div>
            ))}
          </div>
        </CheckpointModal>
      )}
    </div>
  );
}
