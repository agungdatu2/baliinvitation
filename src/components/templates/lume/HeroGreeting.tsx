"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import BlurText from "./BlurText";

const fadeUp = {
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
};

export default function HeroGreeting({ data }: { data: InvitationData }) {
  const eventDateLabel = new Date(data.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const eventNames = (data.events ?? []).map((e) => e.name).filter(Boolean);

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-between text-center px-4 pt-28 pb-10 text-groove-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-groove-stone/10 via-transparent to-groove-stone/60" />

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6 }}
        className="relative z-10 groove-glass rounded-full p-1 flex items-center gap-3"
      >
        <span className="bg-groove-bg text-groove-stone rounded-full px-3 py-1 text-xs font-semibold font-groove-label uppercase tracking-wider">
          Undangan
        </span>
        <span className="text-sm text-groove-bg/90 pr-3 font-groove-label">{eventDateLabel}</span>
      </motion.div>

      <div className="relative z-10">
        <BlurText
          text={`${data.groomNickname} & ${data.brideNickname}`}
          className="font-groove-display italic text-groove-bg leading-[0.95] text-6xl md:text-7xl lg:text-[5.5rem] max-w-3xl mx-auto justify-center tracking-tight"
          delay={100}
        />

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-4 text-sm md:text-base text-groove-bg/85 max-w-md mx-auto font-groove-body font-light leading-relaxed whitespace-pre-line"
        >
          {data.greeting || "Dengan penuh syukur, kami mengundang Anda untuk merayakan hari bahagia kami."}
        </motion.p>

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 1.1 }} className="flex items-center justify-center gap-6 mt-8">
          <a
            href="#events"
            className="groove-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-groove-bg font-groove-label flex items-center gap-1.5"
          >
            Lihat Acara <ArrowUpRight className="h-5 w-5" />
          </a>
          <a href="#gallery" className="text-groove-bg/90 text-sm font-medium font-groove-label flex items-center gap-1.5">
            Lihat Galeri <Play className="h-4 w-4 fill-current" />
          </a>
        </motion.div>
      </div>

      {eventNames.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <span className="groove-glass rounded-full px-3.5 py-1 text-xs font-medium text-groove-bg font-groove-label uppercase tracking-wider">
            Rangkaian Acara
          </span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {eventNames.map((name, i) => (
              <span key={i} className="text-lg md:text-xl font-groove-display italic text-groove-bg tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      ) : (
        <div />
      )}
    </section>
  );
}
