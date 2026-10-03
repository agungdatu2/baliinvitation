"use client";

import { motion } from "motion/react";
import { InvitationData } from "@/types/invitation";

// Section daftar kisah cinta — tampil LANGSUNG sesudah LoveStorySection
// (banner foto full-screen "Our Love Story", sekarang NON-STICKY) supaya
// keduanya terasa "menyatu" sebagai satu alur, bukan section terpisah yang
// nge-hold layar sendiri. Konten NORMAL flow (bukan sticky/tinggi-berlebih),
// daftar cerita mengalir biasa di atas latar hitam solid, tiap item fade-in
// sendiri-sendiri waktu di-scroll masuk.
//
// TIDAK pakai -mt-[100svh] lagi di sini — kompensasi dead-zone BrideSection
// sekarang sudah ditangani di DALAM LoveStorySection sendiri (spacer hitam
// solid), karena LoveStorySection sudah non-sticky jadi tidak ada dead-zone
// KEDUA yang perlu ditutup lagi di sini.
export default function LoveStoryList({ data }: { data: InvitationData }) {
  if (!data.loveStory?.length) return null;

  return (
    <div className="relative z-50 bg-black">
      <div className="mx-auto max-w-2xl px-6 py-24 md:max-w-3xl md:px-16 md:py-32">
        <div className="space-y-20 md:space-y-28">
          {data.loveStory.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <h3 className="font-nocturne-display text-3xl leading-tight text-groove-bg/90 md:text-5xl">
                {String(i + 1).padStart(2, "0")}
                <br />
                <span className="text-groove-bg/70">/ {item.title}</span>
              </h3>
              <p className="mt-6 whitespace-pre-line font-groove-body text-sm leading-relaxed text-groove-bg/70 md:mt-8 md:text-base">
                {item.story}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
