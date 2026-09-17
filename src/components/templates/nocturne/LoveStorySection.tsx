"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { InvitationData } from "@/types/invitation";

const IMAGE_COUNT = 5;
// Tinggi container lebih dari 100vh — extra 100vh dipakai buat reveal masuk,
// sisanya cuma "menahan" tampilan sticky-nya sampai user selesai scroll ke
// section berikutnya — pola sama seperti Groom/BrideSection (BUKAN pola
// Verses lagi, karena foto di sini sudah tidak ngikutin posisi scroll).
const SECTION_VH = 200;
const REVEAL_END = 0.85;
// Foto berganti otomatis (timer), LEPAS dari posisi scroll — bukan ngikutin
// slide seperti sebelumnya. Tiap foto zoom-out terus-menerus selama jatah
// tampilnya, lalu crossfade ke foto berikutnya yang mulai zoom lagi.
// Dicek langsung dari referensi (groovepublic.com/claire, section "A Journey
// in Love") — slideshow-nya pakai slide_duration 100ms + transition_duration
// 100ms (~200ms total per foto), jauh lebih cepat dari percobaan pertama
// (3500ms). Disamakan di sini.
const PHOTO_INTERVAL_MS = 200;
const CROSSFADE_MS = 150;
const IMAGE_SCALE_START = 1.25;

const DEFAULT_IMAGES = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `https://picsum.photos/seed/nocturne-journey-${i}/1600/1200`
);

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;

// Section "Love Story" (chapter title) — struktur luar sama dengan
// Groom/BrideSection (outer tall wrapper + inner sticky viewport, reveal
// sekali di awal lalu ditahan), TAPI foto latarnya sekarang loop otomatis
// pakai timer (setInterval), bukan digerakkan scroll — supaya terus
// berganti & zoom-out selama section ini di layar, tidak peduli user diam
// atau lagi scroll pelan/cepat.
// Backdrop/konten tetap HARUS scroll-reactive (opacity: reveal) untuk
// tahap masuknya — kalau tidak, section ini menutupi BrideSection sebelum
// waktunya saat masih di fase "meluncur naik" pra-sticky (bug yang sama
// persis dengan yang sudah diperbaiki di Groom/Bride).
export default function LoveStorySection({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Reveal masuk (judul + backdrop) — lokal ke container ini sendiri, jadi
  // responsif sejak scroll pertama, tanpa jeda.
  const reveal = useTransform(scrollYProgress, [0, REVEAL_END], [0, 1]);

  return (
    // marginTop negatif -100svh SENGAJA — mengkompensasi BrideSection (outer
    // wrapper tinggi + sticky di dalam) yang melepas stiky-nya SATU LAYAR
    // PENUH sebelum wrapper-nya sendiri benar-benar berakhir. Lihat komentar
    // yang sama di GroomSection.tsx/BrideSection.tsx.
    <div ref={containerRef} className="relative z-40 -mt-[100svh]" style={{ height: `${SECTION_VH}vh` }}>
      <section className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <motion.div style={{ opacity: reveal }} className="absolute inset-0 bg-black">
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
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>

        <motion.div
          style={{ opacity: reveal }}
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
        >
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
        </motion.div>
      </section>
    </div>
  );
}
