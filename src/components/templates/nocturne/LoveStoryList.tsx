"use client";

import { motion } from "motion/react";
import { InvitationData } from "@/types/invitation";

// Section daftar kisah cinta — tampil sesudah LoveStorySection (banner foto
// full-screen "Our Love Story"). Berbeda dari section2 lain sebelumnya:
// ini konten NORMAL (bukan sticky/tinggi-berlebih), persis pola referensi
// (groovepublic.com/claire) — daftar cerita mengalir biasa di atas latar
// hitam solid, bukan section penuh layar sendiri-sendiri.
//
// marginTop negatif -100svh + z-50 tetap dipakai (walau section ini TIDAK
// sticky) supaya menutup celah scroll "mati" ~1 layar yang muncul persis
// setelah LoveStorySection (section sebelumnya, pola wrapper-tinggi+sticky)
// melepas sticky-nya — lihat komentar sama di GroomSection.tsx. Karena
// section ini normal flow (bukan sticky), bg-black statis di sini AMAN
// (tidak ada fase "meluncur naik pra-sticky" yang perlu diwaspadai).
export default function LoveStoryList({ data }: { data: InvitationData }) {
  if (!data.loveStory?.length) return null;

  return (
    <div className="relative z-50 -mt-[100svh] bg-black">
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
