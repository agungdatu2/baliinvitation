"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { BankAccountItem } from "@/types/invitation";
import { getDict, Lang } from "@/lib/i18n/lume";
import { playSelect, playSuccess } from "../sfx";
import CheckpointModal from "../CheckpointModal";

interface Zone {
  x: number;
  width: number;
}

// Checkpoint "Bonus Level: Gift" — treasure chest, klik untuk modal daftar rekening.
export default function GiftChest({
  zone,
  accounts,
  lang,
  onModalOpenChange,
}: {
  zone: Zone;
  accounts: BankAccountItem[];
  lang?: Lang;
  onModalOpenChange: (open: boolean) => void;
}) {
  if (!accounts?.length) return null;
  const t = getDict(lang);
  const [open, setOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    onModalOpenChange(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const copy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    playSuccess();
    setTimeout(() => setCopiedIndex(null), 1400);
  };

  return (
    <div className="absolute bottom-16 flex flex-col items-center" style={{ left: zone.x, width: zone.width }}>
      <button
        onClick={() => {
          playSelect();
          setOpen(true);
        }}
        className="flex flex-col items-center gap-1"
      >
        <div className="pixel-border bg-pixel-panel text-pixel-ink px-2 py-1 mb-1">
          <p className="font-pixel-display text-[7px] uppercase tracking-wide whitespace-nowrap">
            {t.copy} {t.weddingGiftHeading}
          </p>
        </div>
        <div className="w-16 h-12 pixel-border bg-pixel-yellow relative">
          <div className="absolute inset-x-0 top-0 h-3 bg-pixel-panel" />
        </div>
        <p className="font-pixel-display text-[7px] text-pixel-ink/80 uppercase">{t.pixelBonusLevel}</p>
      </button>

      {open && (
        <CheckpointModal title={t.pixelBonusLevel} onClose={() => setOpen(false)}>
          <p className="font-pixel-body text-base text-pixel-ink/80 leading-relaxed mb-4">
            {t.weddingGiftDescription}
          </p>
          <div className="space-y-3">
            {accounts.map((acc, i) => (
              <div key={i} className="pixel-border bg-pixel-bg p-4">
                <p className="font-pixel-display text-[8px] uppercase tracking-[0.2em] text-pixel-ink/70 mb-2">
                  {acc.bank}
                </p>
                <p className="font-pixel-body text-xl tracking-widest mb-2 text-pixel-yellow">{acc.accountNumber}</p>
                <div className="flex items-center justify-between">
                  <p className="font-pixel-body text-sm text-pixel-ink/85">{acc.accountName}</p>
                  <button
                    onClick={() => copy(acc.accountNumber, i)}
                    className="font-pixel-display inline-flex items-center gap-1.5 text-[7px] uppercase tracking-wide bg-pixel-panel pixel-border px-3 py-2"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check className="h-3 w-3" /> {t.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> {t.copy}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CheckpointModal>
      )}
    </div>
  );
}
