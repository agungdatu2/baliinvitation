"use client";

import { motion } from "motion/react";
import { Flower2 } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import BlurText from "./BlurText";

// whileInView (bukan initial+animate sekali di mount) supaya animasi terpicu lagi
// tiap kali elemen ini masuk/keluar viewport — konsisten dengan Reveal & BlurText.
const fadeUp = {
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  whileInView: { filter: "blur(0px)", opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.4 },
};

export default function HeroGreeting({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const eventDateLabel = new Date(data.eventDate).toLocaleDateString(t.dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative h-[100lvh] overflow-hidden flex flex-col items-center justify-center text-center px-4 text-groove-bg">
      {/* Overlay flat (bukan gradient), sama seperti section lain — cuma supaya teks tetap terbaca */}
      <div className="absolute inset-0 bg-groove-stone/35" />

      <div className="relative z-10">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="flex justify-center mb-4">
          <Flower2 className="h-7 w-7 text-groove-bg/80" strokeWidth={1.25} />
        </motion.div>

        <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="font-groove-label text-xs md:text-sm uppercase tracking-[0.35em] text-groove-bg/80 mb-3">
          {t.heroInviteLabel}
        </motion.p>

        <BlurText
          text={`${data.groomNickname} & ${data.brideNickname}`}
          className="font-reverie-display text-groove-bg leading-[0.95] text-[36px] max-w-3xl mx-auto justify-center tracking-tight"
          delay={100}
        />

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="font-groove-label text-xs md:text-sm uppercase tracking-[0.35em] text-groove-bg/70 mt-8"
        >
          {eventDateLabel}
        </motion.p>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 text-sm md:text-base text-groove-bg/85 max-w-md mx-auto font-groove-body font-light leading-relaxed whitespace-pre-line"
        >
          {data.greeting || t.defaultGreeting}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-groove-bg/70"
      >
        <span className="font-groove-label text-[10px] uppercase tracking-[0.35em]">{t.scroll}</span>
        <motion.div
          className="w-px h-9 bg-groove-bg/60 origin-top"
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
