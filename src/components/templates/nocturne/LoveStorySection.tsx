"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { InvitationData } from "@/types/invitation";

const IMAGE_COUNT = 5;
// Tinggi banner — persis seperti referensi (groovepublic.com/claire, section
// "A Journey in Love"): strip landscape pendek full-bleed lebar, BUKAN section
// penuh layar seperti Groom/Bride. Diukur langsung dari reference (~46% tinggi
// viewport), dibulatkan jadi 45svh.
const BANNER_HEIGHT = "45svh";
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

// Section "Love Story" (chapter title) — banner landscape pendek full-bleed
// lebar (BUKAN full-screen sticky lagi seperti versi sebelumnya), persis pola
// referensi: konten NORMAL flow dengan fade-in sekali lewat (whileInView),
// foto latar loop otomatis pakai timer (setInterval) independen dari scroll.
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
    // GroomSection.tsx/BrideSection.tsx. LoveStoryList (sesudah ini) sudah
    // tidak butuh kompensasi lagi karena sudah dipindah ke sini.
    //
    // BEDA dari sebelumnya: dulu section ini sendiri tinggi (100vh, sticky)
    // jadi otomatis "menutupi" dead-zone itu. Sekarang section ini pendek
    // (banner landscape), jadi dead-zone-nya butuh SPACER HITAM SOLID
    // terpisah (satu layar penuh) sebelum banner compact-nya muncul — kalau
    // tidak, banner pendek ini akan tumpang-tindih dengan foto BrideSection
    // yang masih sticky selama dead-zone tersebut.
    <div className="relative z-40 -mt-[100svh] bg-black">
      <div aria-hidden="true" style={{ height: "100svh" }} />

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full overflow-hidden"
        style={{ height: BANNER_HEIGHT }}
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
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
          <div className="flex items-center gap-3 md:gap-4">
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
          </div>
        </div>
      </motion.section>
    </div>
  );
}
