"use client";

import { motion } from "motion/react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/confetti";
import { ConfettiField, Wave } from "./Decor";

// Penutup: ucapan terima kasih + tanda tangan orang tua. Isi field "Kutipan" di admin
// dipakai sebagai tanda tangan (mis. "Adelia & Aditya") — belum ada field khusus.
export default function ClosingFooter({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  return (
    <div>
      <Wave from="#eaf5fd" fill="#eaf8f1" />
      <footer className="relative overflow-hidden bg-[#eaf8f1] px-6 pb-12 pt-16 text-center text-confetti-ink md:pt-24">
        <ConfettiField />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9 }}
          className="relative"
        >
          <h2 className="font-confetti-display text-4xl font-bold md:text-5xl">{t.thankYou}</h2>
          <p className="mx-auto mt-4 max-w-md font-groove-body text-base leading-relaxed text-confetti-ink/80">{t.closingText}</p>
          {data.quote && (
            <div className="mt-8">
              <p className="font-groove-label text-xs uppercase tracking-[0.25em] text-confetti-ink/50">{t.withLove}</p>
              <p className="mt-1 font-confetti-display text-2xl font-semibold">{data.quote}</p>
            </div>
          )}
        </motion.div>

        <div className="relative mt-14 flex flex-col items-center gap-1 text-confetti-ink/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.webp" alt="BaliInvitation" className="h-7 w-auto opacity-70" />
          <p className="font-groove-label text-[0.65rem] uppercase tracking-widest">baliinvitation.com</p>
        </div>
      </footer>
    </div>
  );
}
