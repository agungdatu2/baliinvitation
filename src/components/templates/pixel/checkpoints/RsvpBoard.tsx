"use client";

import { useEffect, useState } from "react";
import { getDict, Lang } from "@/lib/i18n/lume";
import { WishItem } from "@/types/invitation";
import { playBlip, playSelect, playSuccess } from "../sfx";
import CheckpointModal from "../CheckpointModal";

interface Zone {
  x: number;
  width: number;
}

interface RsvpBoardProps {
  zone: Zone;
  invitationId: string;
  guestName?: string;
  guestId?: string;
  lang?: Lang;
  initialWishes?: WishItem[];
  onModalOpenChange: (open: boolean) => void;
}

// Checkpoint "Quest: Confirm Attendance" — papan quest, klik membuka modal
// form RSVP dengan progress bar bertahap + toast "achievement" saat submit sukses.
export default function RsvpBoard({
  zone,
  invitationId,
  guestName,
  guestId,
  lang,
  initialWishes,
  onModalOpenChange,
}: RsvpBoardProps) {
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
        className="flex flex-col items-center gap-1"
      >
        <div className="pixel-border bg-pixel-panel text-pixel-ink px-2 py-1 mb-1">
          <p className="font-pixel-display text-[7px] uppercase tracking-wide whitespace-nowrap">
            {t.attendanceLabel}
          </p>
        </div>
        <div className="w-24 h-20 pixel-border bg-pixel-panel flex items-center justify-center">
          <span className="font-pixel-display text-lg text-pixel-yellow">?</span>
        </div>
        <p className="font-pixel-display text-[7px] text-pixel-ink/80 uppercase max-w-[100px] text-center">
          {t.pixelQuestRsvp}
        </p>
      </button>

      {open && <RsvpForm invitationId={invitationId} guestName={guestName} guestId={guestId} lang={lang} initialWishes={initialWishes} onClose={() => setOpen(false)} />}
    </div>
  );
}

function RsvpForm({
  invitationId,
  guestName,
  guestId,
  lang,
  initialWishes,
  onClose,
}: {
  invitationId: string;
  guestName?: string;
  guestId?: string;
  lang?: Lang;
  initialWishes?: WishItem[];
  onClose: () => void;
}) {
  const t = getDict(lang);
  const ATTEND_OPTIONS = [
    { value: "hadir", label: t.attendYes },
    { value: "tidak_hadir", label: t.attendNo },
  ];
  const [form, setForm] = useState({ guestName: guestName ?? "", attendance: "hadir", guestCount: 1, message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [xpStep, setXpStep] = useState<0 | 1 | 2 | 3>(0);
  const [touchedAttendance, setTouchedAttendance] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    if (!showAchievement) return;
    const id = setTimeout(() => setShowAchievement(false), 3500);
    return () => clearTimeout(id);
  }, [showAchievement]);

  const chooseAttendance = (value: string) => {
    playBlip();
    setForm((f) => ({ ...f, attendance: value }));
    setTouchedAttendance(true);
    setXpStep((s) => (s < 2 ? 2 : s));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, guestId, ...form }),
      });
      setSent(true);
      setXpStep(3);
      playSuccess();
      setShowAchievement(true);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full pixel-border bg-pixel-bg px-3 py-2 font-pixel-body text-base text-pixel-ink placeholder:text-pixel-ink/40 focus:outline-none";
  const filledBlocks = Math.round((xpStep / 3) * 6);

  return (
    <CheckpointModal title={t.pixelQuestRsvp} onClose={onClose}>
      <div className="flex gap-1 mb-5">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`h-3 flex-1 pixel-border ${i < filledBlocks ? "bg-pixel-yellow" : "bg-pixel-bg"}`} />
        ))}
      </div>

      {sent ? (
        <div className="pixel-border bg-pixel-bg p-4">
          <p className="font-pixel-display text-xs text-pixel-green uppercase tracking-widest mb-2">
            {t.pixelLevelComplete}
          </p>
          <p className="font-pixel-body text-base text-pixel-ink/85">{t.rsvpSuccess}</p>
        </div>
      ) : (
        <form onSubmit={submit} onFocus={() => setXpStep((s) => (s < 1 ? 1 : s))} className="space-y-4 text-left">
          <div>
            <label className="font-pixel-display block text-[8px] uppercase tracking-widest text-pixel-ink/70 mb-1.5">
              {t.nameLabel}
            </label>
            <input
              required
              placeholder={t.namePlaceholder}
              className={fieldClass}
              value={form.guestName}
              onChange={(e) => setForm({ ...form, guestName: e.target.value })}
            />
          </div>

          <div>
            <label className="font-pixel-display block text-[8px] uppercase tracking-widest text-pixel-ink/70 mb-1.5">
              {t.attendanceLabel}
            </label>
            <div className="flex gap-2">
              {ATTEND_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => chooseAttendance(opt.value)}
                  className={`flex-1 py-2 pixel-border text-[8px] font-pixel-display tracking-wide uppercase ${
                    touchedAttendance && form.attendance === opt.value ? "bg-pixel-green text-pixel-bg" : "bg-pixel-bg text-pixel-ink/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-pixel-display block text-[8px] uppercase tracking-widest text-pixel-ink/70 mb-1.5">
              {t.wishesLabel}
            </label>
            <textarea
              className={fieldClass}
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2.5 pixel-border bg-pixel-red text-pixel-ink font-pixel-display text-[9px] tracking-widest uppercase disabled:opacity-50"
          >
            {loading ? t.sending : t.send}
          </button>
        </form>
      )}

      {showAchievement && (
        <div className="mt-4 pixel-border bg-pixel-panel px-4 py-3">
          <p className="font-pixel-display text-[8px] text-pixel-yellow uppercase tracking-widest mb-1">
            ★ {t.pixelAchievementUnlocked}
          </p>
          <p className="font-pixel-body text-sm text-pixel-ink/85">{t.pixelRsvpConfirmed}</p>
        </div>
      )}
    </CheckpointModal>
  );
}
