"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { InvitationData } from "@/types/invitation";

const IMAGE_COUNT = 5;
// Foto berganti otomatis (timer), lepas dari posisi scroll. Tiap foto
// zoom-out terus-menerus selama jatah tampilnya, lalu crossfade ke foto
// berikutnya yang mulai zoom lagi. Kecepatan disamakan dengan referensi
// (slide_duration 100ms + transition_duration 100ms ≈ 200ms/foto), lalu
// dilambatkan sedikit karena dirasa terlalu cepat.
const PHOTO_INTERVAL_MS = 320;
const CROSSFADE_MS = 220;
const IMAGE_SCALE_START = 1.25;

const DEFAULT_IMAGES = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `https://picsum.photos/seed/nocturne-journey-${i}/1600/1200`
);

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;

// Section "Love Story" (chapter title) — banner foto full-screen, TAPI
// NON-STICKY (beda dari Groom/Bride) supaya langsung "menyatu" alirannya
// dengan LoveStoryList tepat di bawahnya, bukan nge-hold layar sendiri dulu.
// Reveal pakai whileInView sekali lewat (fade + zoom halus), BUKAN lagi
// discroll-link ke scrollYProgress — ini sekaligus menghindari kelas bug yang
// sama berulang di Groom/Bride (konten section sebelumnya "menembus" lewat
// backdrop yang masih separuh transparan selama reveal lambat berbasis
// scroll). Foto sendiri sudah terang & jelas (tanpa overlay gelap) sejak
// commit sebelumnya — reveal di sini cuma soal kapan BANNER INI muncul,
// bukan soal gelap/terangnya.
export default function LoveStorySection({ data }: { data: InvitationData }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const photoOnly = (data.galleryImages ?? []).filter((src) => !VIDEO_EXT_RE.test(src));
  const images = photoOnly.length
    ? Array.from({ length: IMAGE_COUNT }, (_, i) => photoOnly[i % photoOnly.length])
    : DEFAULT_IMAGES;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, PHOTO_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    // marginTop negatif -100svh SENGAJA — mengkompensasi BrideSection (outer
    // wrapper tinggi + sticky di dalam) yang melepas sticky-nya SATU LAYAR
    // PENUH sebelum wrapper-nya sendiri benar-benar berakhir. Section ini
    // sendiri TIDAK sticky, tapi tetap section PERTAMA sesudah rantai sticky
    // Groom/Bride, jadi tetap butuh kompensasi ini — lihat komentar sama di
    // GroomSection.tsx/BrideSection.tsx.
    //
    // Margin ini dipasang LANGSUNG di banner 100svh ini (BUKAN lewat spacer
    // hitam terpisah seperti versi sebelumnya) — ternyata spacer itu tidak
    // perlu sama sekali: margin negatif cuma GESER posisi banner ke atas
    // persis ke titik di mana BrideSection menghilang (bukan "memotong"
    // tingginya), jadi banner ini otomatis mengisi penuh celah itu dengan
    // kontennya sendiri. Spacer sebelumnya cuma bikin layar hitam kosong
    // nongol dulu sebelum foto "Our Love Story" muncul.
    <motion.section
      initial={{ opacity: 0, scale: 1.08 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      className="relative z-40 -mt-[100svh] h-[100svh] w-full overflow-hidden bg-black"
    >
      <AnimatePresence>
        <motion.img
          key={activeIndex}
          src={images[activeIndex]}
          alt=""
          initial={{ opacity: 0, scale: IMAGE_SCALE_START }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: CROSSFADE_MS / 1000, ease: "linear" },
            scale: { duration: PHOTO_INTERVAL_MS / 1000, ease: "linear" },
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center gap-3 md:gap-4"
        >
          <h2 className="font-nocturne-display italic text-2xl sm:text-3xl md:text-5xl text-groove-bg text-center">
            Our Love Story
          </h2>
          <span className="hidden sm:flex items-center gap-1.5 text-groove-bg/60">
            <span className="flex gap-1">
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
            </span>
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}
