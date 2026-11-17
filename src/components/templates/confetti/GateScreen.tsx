"use client";

import { motion } from "motion/react";
import { InvitationData } from "@/types/invitation";
import { getDict, birthdayTitle, parseAge } from "@/lib/i18n/confetti";
import { AgeNumber, ConfettiField } from "./Decor";

// Cover / gate: layar penuh krem dengan konfeti, foto anak dalam bingkai bulat
// bertepi putus-putus, nama + usia, nama tamu, dan tombol buka undangan.
export default function GateScreen({
  data,
  guestName,
  onOpen,
}: {
  data: InvitationData;
  guestName?: string;
  onOpen: () => void;
}) {
  const t = getDict(data.language);
  const age = parseAge(data.eventTitle);
  const photo = data.coverImage || data.galleryImages?.[0];

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-y-auto bg-confetti-cream px-6 py-10 text-center text-confetti-ink"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <ConfettiField />

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="relative font-groove-label text-xs uppercase tracking-[0.3em] text-confetti-ink/60"
      >
        {t.invitationLabel}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative mt-6"
      >
        <div className="rounded-full border-[3px] border-dashed border-confetti-pink p-2.5">
          <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-white bg-confetti-pink/30 shadow-lg sm:h-52 sm:w-52">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={data.hostName ?? ""} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {age !== null && <AgeNumber age={age} className="text-8xl" />}
              </div>
            )}
          </div>
        </div>
        {age !== null && photo && (
          <span className="absolute -bottom-3 -right-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-confetti-yellow shadow-md">
            <span className="font-confetti-display text-3xl font-bold text-confetti-ink">{age}</span>
          </span>
        )}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative mt-8 max-w-md font-confetti-display text-4xl font-bold leading-tight sm:text-5xl"
      >
        {data.hostName}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.8 }}
        className="relative mt-2 font-confetti-display text-xl text-confetti-gold"
      >
        {birthdayTitle(data.language, age)}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="relative mt-8"
      >
        <p className="font-groove-label text-xs uppercase tracking-[0.25em] text-confetti-ink/60">{t.dear}</p>
        <p className="mt-1 font-confetti-display text-2xl font-semibold">{guestName || t.defaultGuestName}</p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-6 rounded-full bg-confetti-ink px-8 py-3 font-groove-label text-sm font-medium tracking-wide text-confetti-cream shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          {t.openInvitation}
        </button>
      </motion.div>
    </motion.div>
  );
}
