"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import BlurText from "./BlurText";

// whileInView (bukan initial+animate sekali di mount) supaya animasi terpicu lagi
// tiap kali elemen ini masuk/keluar viewport — konsisten dengan Reveal & BlurText.
const fadeUp = {
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  whileInView: { filter: "blur(0px)", opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.4 },
};

export default function HeroGreeting({ data }: { data: InvitationData }) {
  const eventDateLabel = new Date(data.eventDate).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <section className="relative h-[100svh] overflow-hidden flex flex-col items-center justify-center text-center px-4 text-groove-bg">
      {/* Overlay flat (bukan gradient), sama seperti section lain — cuma supaya teks tetap terbaca */}
      <div className="absolute inset-0 bg-groove-stone/35" />

      <div className="relative z-10">
        <motion.p {...fadeUp} transition={{ duration: 0.6 }} className="font-groove-display text-sm md:text-base text-groove-bg/80 mb-3">
          The Wedding of
        </motion.p>

        <BlurText
          text={`${data.groomNickname} ${data.brideNickname}`}
          className="font-groove-display text-groove-bg leading-[0.95] text-5xl md:text-7xl lg:text-[5.5rem] max-w-3xl mx-auto justify-center tracking-tight"
          delay={100}
        />

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="font-groove-display text-xs md:text-sm text-groove-bg/70 tracking-widest mt-3"
        >
          {eventDateLabel}
        </motion.p>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 text-sm md:text-base text-groove-bg/85 max-w-md mx-auto font-groove-body font-light leading-relaxed whitespace-pre-line"
        >
          {data.greeting ||
            data.quote ||
            "Dengan penuh syukur, kami mengundang Anda untuk merayakan hari bahagia kami."}
        </motion.p>

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 1.2 }} className="flex items-center justify-center gap-6 mt-10">
          <a
            href="#events"
            className="text-sm font-medium font-groove-label text-groove-bg/90 flex items-center gap-1.5 hover:text-groove-primary-light transition-colors"
          >
            Lihat Acara <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#gallery"
            className="text-sm font-medium font-groove-label text-groove-bg/90 flex items-center gap-1.5 hover:text-groove-primary-light transition-colors"
          >
            Lihat Galeri <Play className="h-3.5 w-3.5 fill-current" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
