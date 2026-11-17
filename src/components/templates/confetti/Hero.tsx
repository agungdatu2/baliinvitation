"use client";

import { motion } from "motion/react";
import { InvitationData } from "@/types/invitation";
import { getDict, birthdayTitle, parseAge } from "@/lib/i18n/confetti";
import { AgeNumber, ConfettiField } from "./Decor";
import { formatEventDate } from "./format";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
});

export default function Hero({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const age = parseAge(data.eventTitle);
  const photo = data.galleryImages?.[0] || data.coverImage;
  const dateLabel = data.events?.[0]?.date
    ? formatEventDate(data.events[0].date, t.dateLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-confetti-cream px-6 py-24 text-center text-confetti-ink">
      <ConfettiField />

      <motion.div {...fade(0)} className="relative">
        {age !== null && <AgeNumber age={age} className="text-[9rem] sm:text-[12rem]" />}
      </motion.div>

      <motion.h1 {...fade(0.1)} className="relative -mt-2 font-confetti-display text-4xl font-bold leading-tight sm:text-6xl">
        {data.hostName}
      </motion.h1>
      <motion.p {...fade(0.2)} className="relative mt-2 font-confetti-display text-xl text-confetti-gold sm:text-2xl">
        {birthdayTitle(data.language, age)}
      </motion.p>

      {photo && (
        <motion.div {...fade(0.3)} className="relative mt-10">
          <div className="absolute -inset-3 rotate-3 rounded-t-[999px] rounded-b-3xl bg-confetti-lavender/60" />
          <div className="relative h-80 w-60 overflow-hidden rounded-t-[999px] rounded-b-3xl border-4 border-white shadow-xl sm:h-[26rem] sm:w-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={data.hostName ?? ""} className="h-full w-full object-cover" />
          </div>
        </motion.div>
      )}

      <motion.p {...fade(0.4)} className="relative mt-10 max-w-md font-groove-body text-base leading-relaxed text-confetti-ink/80">
        {data.greeting || t.defaultGreeting}
      </motion.p>
      {dateLabel && (
        <motion.p {...fade(0.5)} className="relative mt-4 font-confetti-display text-lg font-medium">
          {dateLabel}
        </motion.p>
      )}
    </section>
  );
}
