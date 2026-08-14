"use client";

import { motion } from "motion/react";
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

// Layout hero terinspirasi referensi: eyebrow "the wedding of" italic kecil,
// nama pasangan besar (bold, tidak italic), jeda vertikal lega, lalu tanggal
// acara dua baris (hari & tanggal lengkap) dengan bobot yang sama besarnya,
// ditutup kalimat pembuka/kutipan client di bawahnya. Background masih pakai
// FixedVideoBackground global (lihat MuseTemplate) — pilihan video/foto/
// slideshow khusus section ini menyusul terpisah.
export default function HeroGreeting({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const weekdayLabel = new Date(data.eventDate).toLocaleDateString(t.dateLocale, { weekday: "long" });
  const dayMonthYearLabel = new Date(data.eventDate)
    .toLocaleDateString(t.dateLocale, { day: "numeric", month: "long", year: "numeric" })
    .toUpperCase();

  return (
    <section className="relative h-[100lvh] overflow-hidden flex flex-col items-center justify-center text-center px-6 text-groove-bg">
      {/* Overlay flat (bukan gradient), sama seperti section lain — cuma supaya teks tetap terbaca */}
      <div className="absolute inset-0 bg-groove-stone/35" />

      <div className="relative z-10 max-w-lg">
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="font-muse-loading italic text-base md:text-lg text-groove-bg/80"
        >
          {t.theWeddingOf}
        </motion.p>

        <BlurText
          text={`${data.groomNickname} & ${data.brideNickname}`}
          className="mt-3 font-muse-loading font-semibold uppercase leading-[0.95] text-3xl md:text-5xl tracking-[0.04em]"
          delay={100}
        />

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 md:mt-20 font-muse-loading font-semibold uppercase leading-tight text-2xl md:text-3xl"
        >
          <p>{weekdayLabel},</p>
          <p>{dayMonthYearLabel}</p>
        </motion.div>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 text-sm md:text-base text-groove-bg/85 max-w-md mx-auto font-groove-body font-light leading-relaxed whitespace-pre-line"
        >
          {data.greeting || t.defaultGreeting}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-groove-bg/70"
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
